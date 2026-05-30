import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    tests: [
      {
        type: mongoose.Schema.Types.Mixed,
      },
    ],

    referredBy: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model(
  "Report",
  reportSchema
);

export default Report;