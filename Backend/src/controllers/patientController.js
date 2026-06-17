import asyncHandler from "express-async-handler";

import Patient from "../models/Patient.js";
import Report from "../models/Report.js";
import Billing from "../models/Billing.js";

export const createEntry =
  asyncHandler(async (req, res) => {
    const {
      name,
      phone,
      age,
      gender,
      address,
      referredBy,
      tests,
    } = req.body;

    let patient = await Patient.findOne({
      phone,
      isDeleted: { $ne: true },
    });

    if (!patient) {
      patient = await Patient.create({
        name,
        phone,
        age,
        gender,
        address,
      });
    }

    const report = await Report.create({
      patient: patient._id,
      tests,
      referredBy,
    });

    const totalAmount = tests.reduce(
      (sum, test) => sum + (Number(test.price) || 0),
      0
    );

    await Billing.create({
      patient: patient._id,
      report: report._id,
      totalAmount,
      balanceDue: totalAmount,
      status: "Unpaid",
      paymentMode: "None",
    });

    res.status(201).json({
      patient,
      report,
    });
  });

export const getPatients =
  asyncHandler(async (req, res) => {
    const patients =
      await Patient.find({
        isDeleted: { $ne: true },
      })
        .sort({
          createdAt: -1,
        })
        .lean();

    res.json(patients);
  });

export const deletePatient =
  asyncHandler(async (req, res) => {
    const patient =
      await Patient.findById(
        req.params.id
      );

    if (!patient) {
      res.status(404);

      throw new Error(
        "Patient not found"
      );
    }

    patient.isDeleted = true;

    await patient.save();

    res.json({
      message:
        "Patient deleted successfully",
    });
  });