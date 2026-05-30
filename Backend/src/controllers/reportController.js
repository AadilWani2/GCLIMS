import asyncHandler from "express-async-handler";

import Report from "../models/Report.js";
import Billing from "../models/Billing.js";

export const getAllReports =
  asyncHandler(async (req, res) => {
    const reports = await Report.find({})
      .populate("patient")
      .sort({ createdAt: -1 });

    // Filter out reports whose patient has been deleted
    const active = reports.filter(
      (r) => r.patient && !r.patient.isDeleted
    );

    res.json(active);
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