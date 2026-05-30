import asyncHandler from "express-async-handler";
import Billing from "../models/Billing.js";
import Report from "../models/Report.js";

// @desc    Get all bills (with lazy generation of missing bills)
// @route   GET /api/billing
// @access  Private
export const getAllBills = asyncHandler(async (req, res) => {
  // 1. Fetch all reports populated with patients
  const reports = await Report.find().populate("patient");
  
  // 2. Filter only active reports (patient exists and is not deleted)
  const activeReports = reports.filter(
    (r) => r.patient && r.patient.isDeleted !== true
  );

  // 3. For any active report that doesn't have a bill, generate one lazily
  for (const report of activeReports) {
    const billExists = await Billing.findOne({ report: report._id });
    if (!billExists) {
      const totalAmount = report.tests.reduce(
        (sum, test) => sum + (Number(test.price) || 0),
        0
      );

      await Billing.create({
        patient: report.patient._id,
        report: report._id,
        totalAmount,
        balanceDue: totalAmount,
        status: "Unpaid",
        paymentMode: "None",
      });
    }
  }

  // 4. Fetch all bills populated with patient and report
  const bills = await Billing.find()
    .populate("patient")
    .populate("report")
    .sort({ createdAt: -1 });

  // Filter bills to exclude those with deleted patients
  const activeBills = bills.filter(
    (b) => b.patient && b.patient.isDeleted !== true
  );

  res.json(activeBills);
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
  const bills = await Billing.find().populate("patient");

  // Filter out bills with deleted patients
  const activeBills = bills.filter(
    (b) => b.patient && b.patient.isDeleted !== true
  );

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
