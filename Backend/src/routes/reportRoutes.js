import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  getAllReports,
  getPatientReports,
  updateReportResults,
} from "../controllers/reportController.js";

const router = express.Router();

// Must come BEFORE /:patientId to avoid "all" being treated as an ID
router.get(
  "/all",
  protect,
  getAllReports
);

router.get(
  "/:patientId",
  protect,
  getPatientReports
);

router.put(
  "/update/:reportId",
  protect,
  updateReportResults
);

export default router;