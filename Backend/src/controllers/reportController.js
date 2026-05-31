import asyncHandler from "express-async-handler";

import Report from "../models/Report.js";
import Billing from "../models/Billing.js";
import Patient from "../models/Patient.js";

export const getAllReports =
  asyncHandler(async (req, res) => {
    // 1. Fetch active patient IDs
    const activePatients = await Patient.find({ isDeleted: { $ne: true } }, { _id: 1 });
    const activePatientIds = activePatients.map((p) => p._id);

    // 2. Fetch only reports of active patients directly using the index
    const activeReports = await Report.find({ patient: { $in: activePatientIds } })
      .populate("patient")
      .sort({ createdAt: -1 });

    res.json(activeReports);
  });

export const getPatientReports =
  asyncHandler(async (req, res) => {
    const reports =
      await Report.find({
        patient: req.params.patientId,
      })
        .populate("patient")
        .sort({
          createdAt: -1,
        });

    res.json(reports);
  });

export const updateReportResults =
  asyncHandler(async (req, res) => {
    const report =
      await Report.findById(
        req.params.reportId
      );

    if (!report) {
      res.status(404);

      throw new Error(
        "Report not found"
      );
    }

    report.tests = req.body.tests;

    report.status = "Completed";

    await report.save();

    // Recalculate and update associated Billing ledger record
    const totalAmount = req.body.tests.reduce(
      (sum, test) => sum + (Number(test.price) || 0),
      0
    );

    let billing = await Billing.findOne({ report: report._id });
    if (billing) {
      billing.totalAmount = totalAmount;
      const calculatedBalance = totalAmount - (billing.discount || 0) - (billing.amountPaid || 0);
      billing.balanceDue = calculatedBalance < 0 ? 0 : calculatedBalance;

      if (billing.balanceDue === 0) {
        billing.status = "Paid";
      } else if (billing.amountPaid > 0) {
        billing.status = "Partially Paid";
      } else {
        billing.status = "Unpaid";
      }

      await billing.save();
    } else {
      await Billing.create({
        patient: report.patient,
        report: report._id,
        totalAmount,
        balanceDue: totalAmount,
        status: "Unpaid",
        paymentMode: "None",
      });
    }

    res.json(report);
  });