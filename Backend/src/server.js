import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";

import patientRoutes from "./routes/patientRoutes.js";

import reportRoutes from "./routes/reportRoutes.js";

import dashboardRoutes from "./routes/dashboardRoutes.js";

import testRoutes from "./routes/testRoutes.js";

import billingRoutes from "./routes/billingRoutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(helmet());

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("GCLIMS API Running");
});

app.use("/api/auth", authRoutes);

app.use("/api/patients", patientRoutes);

app.use("/api/reports", reportRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/tests", testRoutes);

app.use("/api/billing", billingRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server Running On Port ${PORT}`
  );
});