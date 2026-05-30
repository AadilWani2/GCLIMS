import mongoose from "mongoose";

const parameterSchema =
  new mongoose.Schema({
    parameterName: {
      type: String,
      required: true,
    },

    unit: {
      type: String,
      default: "",
    },

    normalRangeMale: {
      type: String,
      default: "",
    },

    normalRangeFemale: {
      type: String,
      default: "",
    },

    normalRangeChild: {
      type: String,
      default: "",
    },
  });

const testSchema = new mongoose.Schema(
  {
    testName: {
      type: String,
      required: true,
      unique: true,
    },

    category: {
      type: String,
      required: true,
    },

    specimen: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      default: 0,
    },

    parameters: [
      parameterSchema,
    ],
  },
  {
    timestamps: true,
  }
);

const Test = mongoose.model(
  "Test",
  testSchema
);

export default Test;