import dotenv from "dotenv";

import connectDB from "./config/db.js";

import Test from "./models/Test.js";

import tests from "./data/tests.js";

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Test.deleteMany();

    await Test.insertMany(tests);

    console.log(
      "Tests Imported"
    );

    process.exit();
  } catch (error) {
    console.log(error);

    process.exit(1);
  }
};

importData();