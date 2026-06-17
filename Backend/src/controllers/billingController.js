import asyncHandler from "express-async-handler";
import Billing from "../models/Billing.js";
import Report from "../models/Report.js";
import Patient from "../models/Patient.js";

// @desc    Get all bills (with lazy generation of missing bills)
// @route   GET /api/billing
// @access  Private
export const getAllBills = asyncHandler(async (req, res) => {
  // 1. Fetch active patient IDs
  const activePatients = await Patient.find({ isDeleted: { $ne: true } }, { _id: 1 }).lean();
  const activePatientIds = activePatients.map((p) => p._id);

  // 2. Fetch all reports for active patients (projecting only patient ID and test prices)
  const activeReports = await Report.find({ patient: { $in: activePatientIds } })
    .select("patient tests.price")
    .lean();

  // 3. Find all existing Billing records for these active reports in a single query
  const activeReportIds = activeReports.map((r) => r._id);
  const existingBills = await Billing.find({ report: { $in: activeReportIds } }, { report: 1 }).lean();
  const existingReportIdsSet = new Set(existingBills.map((b) => b.report.toString()));

  // 4. Identify reports that lack a bill in memory using the fast Set
  const missingReports = activeReports.filter((r) => !existingReportIdsSet.has(r._id.toString()));

  // 5. Generate missing bills in a single bulk insertion command
  if (missingReports.length > 0) {
    const newBillsData = missingReports.map((report) => {
      const totalAmount = report.tests.reduce(
        (sum, test) => sum + (Number(test.price) || 0),
        0
      );
      return {
        patient: report.patient,
        report: report._id,
        totalAmount,
        balanceDue: totalAmount,
        status: "Unpaid",
        paymentMode: "None",
      };
    });
    await Billing.insertMany(newBillsData);
  }

  // 6. Fetch only the active bills populated with patient and report (projecting needed fields only)
  const bills = await Billing.find({ patient: { $in: activePatientIds } })
    .populate("patient", "name phone age gender")
    .populate({
      path: "report",
      select: "referredBy tests.testName tests.category tests.price tests.specimen"
    })
    .sort({ createdAt: -1 })
    .lean();

  res.json(bills);
});

// @desc    Update a billing record (record payment / discount)
// @route   PUT /api/billing/:id
// @access  Private
export const updateBill = asyncHandler(async (req, res) => {
  const { discount, amountPaid, paymentMode, notes } = req.body;

  const bill = await Billing.findById(req.params.id);

  if (!bill) {
    res.status(404);
    throw new Error("Billing record not found");
  }

  bill.discount = Number(discount) ?? 0;
  bill.amountPaid = Number(amountPaid) ?? 0;
  bill.paymentMode = paymentMode || "None";
  bill.notes = notes || "";

  // Recalculate balance due
  const calculatedBalance = bill.totalAmount - bill.discount - bill.amountPaid;
  bill.balanceDue = calculatedBalance < 0 ? 0 : calculatedBalance;

  // Determine status
  if (bill.balanceDue === 0) {
    bill.status = "Paid";
  } else if (bill.amountPaid > 0) {
    bill.status = "Partially Paid";
  } else {
    bill.status = "Unpaid";
  }

  await bill.save();

  const updatedBill = await Billing.findById(bill._id)
    .populate("patient")
    .populate("report");

  res.json(updatedBill);
});

// @desc    Get billing statistics
// @route   GET /api/billing/stats
// @access  Private
export const getBillingStats = asyncHandler(async (req, res) => {
  const activePatients = await Patient.find({ isDeleted: { $ne: true } }, { _id: 1 }).lean();
  const activePatientIds = activePatients.map((p) => p._id);

  const activeBills = await Billing.find({ patient: { $in: activePatientIds } }).lean();

  let totalBilled = 0;
  let totalCollected = 0;
  let totalPending = 0;
  let todayRevenue = 0;

  const todayStr = new Date().toDateString();

  activeBills.forEach((b) => {
    const netBilled = b.totalAmount - (b.discount || 0);
    totalBilled += netBilled;
    totalCollected += b.amountPaid || 0;
    totalPending += b.balanceDue || 0;

    // Check if payment was modified/collected today
    const updatedStr = new Date(b.updatedAt).toDateString();
    if (updatedStr === todayStr && b.amountPaid > 0) {
      // For statistics, if updated today, add to today's revenue.
      // In a real transactional ledger we would sum actual payments,
      // but in this model it's a simple, reliable approximation.
      todayRevenue += b.amountPaid || 0;
    }
  });

  res.json({
    totalBilled,
    totalCollected,
    totalPending,
    todayRevenue,
  });
});
