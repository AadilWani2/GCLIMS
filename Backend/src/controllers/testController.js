import asyncHandler from "express-async-handler";
import Test from "../models/Test.js";

// @desc    Get all tests
// @route   GET /api/tests
// @access  Private
export const getTests = asyncHandler(async (req, res) => {
  const tests = await Test.find({}).sort({ testName: 1 });
  res.json(tests);
});

// @desc    Update test price
// @route   PUT /api/tests/:id
// @access  Private
export const updateTestPrice = asyncHandler(async (req, res) => {
  const { price } = req.body;
  const test = await Test.findById(req.params.id);

  if (!test) {
    res.status(404);
    throw new Error("Test not found");
  }

  test.price = Number(price) || 0;
  await test.save();

  res.json(test);
});
