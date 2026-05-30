import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  createEntry,
  getPatients,
  deletePatient,
} from "../controllers/patientController.js";

const router = express.Router();

router.post(
  "/",
  protect,
  createEntry
);

router.get(
  "/",
  protect,
  getPatients
);

router.put(
  "/:id/delete",
  protect,
  deletePatient
);

export default router;