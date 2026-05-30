import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getTests, updateTestPrice } from "../controllers/testController.js";

const router = express.Router();

router.get("/", protect, getTests);
router.put("/:id", protect, updateTestPrice);

export default router;
