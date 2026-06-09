import xlsx from "xlsx";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Test from "./models/Test.js";
import { getClinicalParameters } from "./data/clinicalDictionary.js";

dotenv.config();

connectDB();

const importTests = async () => {
  try {
    console.log("Wiping existing tests...");
    await Test.deleteMany();

    // 1. Read the newly parameterized tests (flat parameter rows)
    const workbookParam = xlsx.readFile("balanced_lab_tests_260_parameterized.xlsx");
    const worksheetParam = workbookParam.Sheets[workbookParam.SheetNames[0]];
    const rawData = xlsx.utils.sheet_to_json(worksheetParam);

    // 2. Read the original tests to merge prices
    let priceMap = {};
    try {
      const workbookPrice = xlsx.readFile("balanced_lab_tests_260.xlsx");
      const worksheetPrice = workbookPrice.Sheets[workbookPrice.SheetNames[0]];
      const rowsPrice = xlsx.utils.sheet_to_json(worksheetPrice);
      rowsPrice.forEach((row) => {
        if (row.testName) {
          priceMap[row.testName.trim().toLowerCase()] = row.price;
        }
      });
    } catch (e) {
      console.log("Could not read balanced_lab_tests_260.xlsx for prices. Using standard default prices instead.");
    }

    const groupedTests = {};

    // 3. Identify all unique raw test names to detect redundant variations
    const allUniqueNames = Array.from(
      new Set(rawData.map((row) => (row.testName ? String(row.testName).trim() : "")))
    ).filter(Boolean);

    const baseProfiles = new Set([
      "lipid profile",
      "thyroid profile",
      "coagulation profile",
      "electrolyte profile",
      "ena profile",
      "profile",
    ]);

    const suffixes = [" advanced", " screening", " profile", " screening profile"];

    // 4. Pathology Grouping Engine (Case-insensitive & clean formatting)
    rawData.forEach((row) => {
      const testName = row.testName ? String(row.testName).trim() : "";
      if (!testName) return;

      const key = testName.toLowerCase();

      // Check if this test name is a redundant variation of a base test
      let isRedundant = false;
      for (const suffix of suffixes) {
        if (key.endsWith(suffix)) {
          const base = testName.substring(0, testName.length - suffix.length).trim();
          const baseLower = base.toLowerCase();

          if (baseProfiles.has(key)) {
            continue; // Keep actual base profiles
          }

          // If the base test exists in the catalog, this suffix variant is redundant
          if (allUniqueNames.some((name) => name.trim().toLowerCase() === baseLower)) {
            isRedundant = true;
            break;
          }
        }
      }

      if (isRedundant) {
        return; // Skip importing this redundant duplicate
      }

      if (!groupedTests[key]) {
        // Retrieve original price or default to 150
        const price = priceMap[key] || 150;
        const category = row.category ? String(row.category).trim() : "General";

        // Fetch highly accurate clinical parameters using our clinical dictionary mapping
        const clinicalParams = getClinicalParameters(testName, category);

        let displayName = testName;
        if (key === "coagulation profile") {
          displayName = "Coagulation Profile / Coagulogram";
        }

        groupedTests[key] = {
          testName: displayName,
          category: category,
          specimen: row.specimen ? String(row.specimen).trim() : "Blood",
          price: price,
          parameters: clinicalParams,
        };
      }
    });

    const tests = Object.values(groupedTests);

    // Ensure CBC 3-Part and CBC 5-Part are present
    const cbc3PartExists = tests.some(t => t.testName.toLowerCase().includes("3-part") || t.testName.toLowerCase().includes("3 part") || t.testName.toLowerCase().includes("3pot") || t.testName.toLowerCase().includes("3 pot"));
    if (!cbc3PartExists) {
      tests.push({
        testName: "CBC 3-Part",
        category: "Hematology",
        specimen: "Whole Blood",
        price: 350,
        parameters: getClinicalParameters("CBC 3-Part", "Hematology")
      });
    }

    const cbc5PartExists = tests.some(t => t.testName.toLowerCase().includes("5-part") || t.testName.toLowerCase().includes("5 part") || t.testName.toLowerCase().includes("5pot") || t.testName.toLowerCase().includes("5 pot"));
    if (!cbc5PartExists) {
      tests.push({
        testName: "CBC 5-Part",
        category: "Hematology",
        specimen: "Whole Blood",
        price: 450,
        parameters: getClinicalParameters("CBC 5-Part", "Hematology")
      });
    }

    // Ensure Blood Group & Rh Typing (ABO & Rh) is present
    const bloodGroupRhExists = tests.some(t => t.testName.toLowerCase().includes("blood group & rh") || t.testName.toLowerCase().includes("blood group and rh"));
    if (!bloodGroupRhExists) {
      tests.push({
        testName: "Blood Group & Rh Typing (ABO & Rh)",
        category: "Hematology",
        specimen: "Whole Blood",
        price: 150,
        parameters: getClinicalParameters("Blood Group & Rh Typing (ABO & Rh)", "Hematology")
      });
    }

    // Ensure Bleeding Time & Clotting Time (BT/CT) is present
    const btCtExists = tests.some(t => t.testName.toLowerCase().includes("bt/ct") || t.testName.toLowerCase().includes("bleeding time & clotting time") || t.testName.toLowerCase().includes("bleeding time and clotting time"));
    if (!btCtExists) {
      tests.push({
        testName: "Bleeding Time & Clotting Time (BT/CT)",
        category: "Hematology",
        specimen: "Whole Blood",
        price: 150,
        parameters: getClinicalParameters("Bleeding Time & Clotting Time (BT/CT)", "Hematology")
      });
    }

    // Ensure Dengue Profile is present
    const dengueProfileExists = tests.some(t => t.testName.toLowerCase() === "dengue profile");
    if (!dengueProfileExists) {
      tests.push({
        testName: "Dengue Profile",
        category: "Serology",
        specimen: "Serum",
        price: 800,
        parameters: getClinicalParameters("Dengue Profile", "Serology")
      });
    }

    // Ensure Viral Marker Profile (Tri-Dot) is present
    const viralMarkersExists = tests.some(t => t.testName.toLowerCase().includes("viral marker") || t.testName.toLowerCase().includes("tri-dot") || t.testName.toLowerCase().includes("tridot"));
    if (!viralMarkersExists) {
      tests.push({
        testName: "Viral Marker Profile (Tri-Dot)",
        category: "Serology",
        specimen: "Serum",
        price: 750,
        parameters: getClinicalParameters("Viral Marker Profile (Tri-Dot)", "Serology")
      });
    }

    // Ensure Rheumatoid Panel is present
    const rheumatoidPanelExists = tests.some(t => t.testName.toLowerCase().includes("rheumatoid panel") || t.testName.toLowerCase().includes("arthritis profile"));
    if (!rheumatoidPanelExists) {
      tests.push({
        testName: "Rheumatoid Panel",
        category: "Immunology",
        specimen: "Serum",
        price: 900,
        parameters: getClinicalParameters("Rheumatoid Panel", "Immunology")
      });
    }

    console.log(`Inserting ${tests.length} real-world medical-grade tests into MongoDB...`);
    await Test.insertMany(tests);

    console.log(
      `Successfully imported ${tests.length} tests with complete clinical parameters and bounds!`
    );

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

importTests();