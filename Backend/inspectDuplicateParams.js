import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import Test from "./src/models/Test.js";

dotenv.config();

const inspect = async () => {
  await connectDB();

  const tests = await Test.find({});
  console.log(`Total tests in database: ${tests.length}`);

  // Group tests by their serialized parameter names
  const paramGroups = {};

  tests.forEach(test => {
    // Sort parameter names to compare lists
    const paramNames = test.parameters.map(p => p.parameterName).sort().join("||");
    const key = `${test.category.toLowerCase()}::${paramNames}`;

    if (!paramGroups[key]) {
      paramGroups[key] = [];
    }
    paramGroups[key].push(test);
  });

  console.log("\nGroups of tests with identical parameter sets:");
  let count = 0;
  for (const key in paramGroups) {
    const list = paramGroups[key];
    if (list.length > 1) {
      count++;
      console.log(`\nGroup ${count} (Category: ${list[0].category}):`);
      console.log(`Parameters: [${list[0].parameters.map(p => p.parameterName).join(", ")}]`);
      console.log(`Matching Tests:`);
      list.forEach(t => {
        console.log(` - ${t.testName} (₹${t.price})`);
      });
    }
  }

  process.exit();
};

inspect();
