const tests = [
  {
    testName: "CBC",
    category: "Hematology",
    specimen: "Whole Blood",
    price: 300,
    parameters: [
      {
        parameterName: "Hemoglobin",
        unit: "g/dL",
        normalRangeMale: "13-17",
        normalRangeFemale: "12-15",
        normalRangeChild: "11-14",
      },
      {
        parameterName: "WBC",
        unit: "/cmm",
        normalRangeMale: "4000-11000",
        normalRangeFemale: "4000-11000",
        normalRangeChild: "5000-13000",
      },
      {
        parameterName: "Platelets",
        unit: "Lakhs/cmm",
        normalRangeMale: "1.5-4.5",
        normalRangeFemale: "1.5-4.5",
        normalRangeChild: "1.5-4.5",
      },
    ],
  },
  {
    testName: "LFT",
    category: "Biochemistry",
    specimen: "Serum",
    price: 800,
    parameters: [
      {
        parameterName: "Bilirubin Total",
        unit: "mg/dL",
        normalRangeMale: "0.2-1.2",
        normalRangeFemale: "0.2-1.2",
      },
      {
        parameterName: "SGOT",
        unit: "U/L",
        normalRangeMale: "5-40",
        normalRangeFemale: "5-35",
      },
      {
        parameterName: "SGPT",
        unit: "U/L",
        normalRangeMale: "5-45",
        normalRangeFemale: "5-35",
      },
    ],
  },
  {
    testName: "KFT",
    category: "Biochemistry",
    specimen: "Serum",
    price: 700,
    parameters: [
      {
        parameterName: "Urea",
        unit: "mg/dL",
        normalRangeMale: "15-45",
        normalRangeFemale: "15-45",
      },
      {
        parameterName: "Creatinine",
        unit: "mg/dL",
        normalRangeMale: "0.7-1.3",
        normalRangeFemale: "0.6-1.1",
      },
    ],
  },
  {
    testName: "Blood Sugar Fasting",
    category: "Biochemistry",
    specimen: "Plasma",
    price: 100,
    parameters: [
      {
        parameterName: "Fasting Blood Glucose",
        unit: "mg/dL",
        normalRangeMale: "70-100",
        normalRangeFemale: "70-100",
      },
    ],
  },
  {
    testName: "Blood Sugar PP",
    category: "Biochemistry",
    specimen: "Plasma",
    price: 100,
    parameters: [
      {
        parameterName: "Post Prandial Blood Glucose",
        unit: "mg/dL",
        normalRangeMale: "70-140",
        normalRangeFemale: "70-140",
      },
    ],
  },
  {
    testName: "HbA1c",
    category: "Biochemistry",
    specimen: "Whole Blood",
    price: 450,
    parameters: [
      {
        parameterName: "Glycated Hemoglobin (HbA1c)",
        unit: "%",
        normalRangeMale: "4.0-5.6",
        normalRangeFemale: "4.0-5.6",
      },
      {
        parameterName: "Estimated Average Glucose (eAG)",
        unit: "mg/dL",
        normalRangeMale: "70-126",
        normalRangeFemale: "70-126",
      },
    ],
  },
  {
    testName: "TSH",
    category: "Hormone",
    specimen: "Serum",
    price: 350,
    parameters: [
      {
        parameterName: "Thyroid Stimulating Hormone (TSH)",
        unit: "µIU/mL",
        normalRangeMale: "0.4-4.5",
        normalRangeFemale: "0.4-4.5",
      },
    ],
  },
  {
    testName: "Thyroid Profile",
    category: "Hormone",
    specimen: "Serum",
    price: 750,
    parameters: [
      {
        parameterName: "Total Triiodothyronine (T3)",
        unit: "ng/dL",
        normalRangeMale: "80-200",
        normalRangeFemale: "80-200",
      },
      {
        parameterName: "Total Thyroxine (T4)",
        unit: "µg/dL",
        normalRangeMale: "5.1-14.1",
        normalRangeFemale: "5.1-14.1",
      },
      {
        parameterName: "Thyroid Stimulating Hormone (TSH)",
        unit: "µIU/mL",
        normalRangeMale: "0.4-4.5",
        normalRangeFemale: "0.4-4.5",
      },
    ],
  },
  {
    testName: "Lipid Profile",
    category: "Biochemistry",
    specimen: "Serum",
    price: 900,
    parameters: [
      {
        parameterName: "Total Cholesterol",
        unit: "mg/dL",
        normalRangeMale: "125-200",
        normalRangeFemale: "125-200",
      },
      {
        parameterName: "Triglycerides",
        unit: "mg/dL",
        normalRangeMale: "40-150",
        normalRangeFemale: "40-150",
      },
      {
        parameterName: "HDL Cholesterol",
        unit: "mg/dL",
        normalRangeMale: "40-60",
        normalRangeFemale: "50-60",
      },
      {
        parameterName: "LDL Cholesterol",
        unit: "mg/dL",
        normalRangeMale: "50-100",
        normalRangeFemale: "50-100",
      },
      {
        parameterName: "VLDL Cholesterol",
        unit: "mg/dL",
        normalRangeMale: "5-40",
        normalRangeFemale: "5-40",
      },
    ],
  },
  {
    testName: "Urine Routine",
    category: "Clinical Pathology",
    specimen: "Urine",
    price: 200,
    parameters: [
      {
        parameterName: "pH",
        unit: "",
        normalRangeMale: "4.5-8.0",
        normalRangeFemale: "4.5-8.0",
      },
      {
        parameterName: "Specific Gravity",
        unit: "",
        normalRangeMale: "1.005-1.030",
        normalRangeFemale: "1.005-1.030",
      },
      {
        parameterName: "Pus Cells",
        unit: "/hpf",
        normalRangeMale: "0-5",
        normalRangeFemale: "0-5",
      },
      {
        parameterName: "Epithelial Cells",
        unit: "/hpf",
        normalRangeMale: "0-10",
        normalRangeFemale: "0-10",
      },
    ],
  },
];

export default tests;