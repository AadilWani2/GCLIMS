import asyncHandler from "express-async-handler";

import Patient from "../models/Patient.js";
import Report from "../models/Report.js";

export const getDashboardStats =
  asyncHandler(async (req, res) => {
    // Get IDs of all active (non-deleted) patients
    const activePatients = await Patient.find(
      { isDeleted: false },
      { _id: 1 }
    );
    const activePatientIds = activePatients.map((p) => p._id);

    const totalPatients = activePatients.length;

    const totalReports = await Report.countDocuments({
      patient: { $in: activePatientIds },
    });

    const pendingReports = await Report.countDocuments({
      patient: { $in: activePatientIds },
      status: "Pending",
    });

    const completedReports = await Report.countDocuments({
      patient: { $in: activePatientIds },
      status: "Completed",
    });

    const allRecent = await Report.find({
      patient: { $in: activePatientIds },
    })
      .populate("patient")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalPatients,
      totalReports,
      pendingReports,
      completedReports,
      recentReports: allRecent,
    });
  });