import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getAllBills,
  updateBill,
  getBillingStats,
} from "../controllers/billingController.js";

const router = express.Router();

router.get("/", protect, getAllBills);
router.get("/stats", protect, getBillingStats);
router.put("/:id", protect, updateBill);

export default router;
