// Clinical dictionary of real-world parameters, units, and normal ranges.
// Supports gender-aware (Male, Female) and age-aware (Child) boundaries.

const dictionary = {
  cbc: [
    { parameterName: "Hemoglobin", unit: "g/dL", normalRangeMale: "13.0-17.0", normalRangeFemale: "12.0-15.0", normalRangeChild: "11.0-14.0" },
    { parameterName: "Total Leukocyte Count (TLC)", unit: "/cmm", normalRangeMale: "4000-11000", normalRangeFemale: "4000-11000", normalRangeChild: "5000-13000" },
    { parameterName: "Platelet Count", unit: "Lakhs/cmm", normalRangeMale: "1.50-4.50", normalRangeFemale: "1.50-4.50", normalRangeChild: "1.50-4.50" },
    { parameterName: "Red Blood Cell Count (RBC)", unit: "million/cmm", normalRangeMale: "4.5-5.5", normalRangeFemale: "3.8-4.8", normalRangeChild: "4.0-5.2" },
    { parameterName: "Packed Cell Volume (PCV)", unit: "%", normalRangeMale: "40-50", normalRangeFemale: "36-46", normalRangeChild: "32-42" },
    { parameterName: "Mean Corpuscular Volume (MCV)", unit: "fL", normalRangeMale: "80-100", normalRangeFemale: "80-100", normalRangeChild: "75-90" },
    { parameterName: "Mean Corpuscular Hemoglobin (MCH)", unit: "pg", normalRangeMale: "27-32", normalRangeFemale: "27-32", normalRangeChild: "25-31" },
    { parameterName: "Mean Corpuscular Hemoglobin Conc (MCHC)", unit: "g/dL", normalRangeMale: "32-36", normalRangeFemale: "32-36", normalRangeChild: "32-36" },
    { parameterName: "Neutrophils", unit: "%", normalRangeMale: "40-80", normalRangeFemale: "40-80", normalRangeChild: "30-60" },
    { parameterName: "Lymphocytes", unit: "%", normalRangeMale: "20-40", normalRangeFemale: "20-40", normalRangeChild: "40-70" },
    { parameterName: "Eosinophils", unit: "%", normalRangeMale: "1-6", normalRangeFemale: "1-6", normalRangeChild: "1-6" },
    { parameterName: "Monocytes", unit: "%", normalRangeMale: "2-10", normalRangeFemale: "2-10", normalRangeChild: "2-10" },
    { parameterName: "Basophils", unit: "%", normalRangeMale: "0-2", normalRangeFemale: "0-2", normalRangeChild: "0-2" }
  ],
  esr: [
    { parameterName: "Erythrocyte Sedimentation Rate (ESR)", unit: "mm/1st hr", normalRangeMale: "0-15", normalRangeFemale: "0-20", normalRangeChild: "0-15" }
  ],
  lft: [
    { parameterName: "Bilirubin Total", unit: "mg/dL", normalRangeMale: "0.2-1.2", normalRangeFemale: "0.2-1.2" },
    { parameterName: "Bilirubin Direct", unit: "mg/dL", normalRangeMale: "0.0-0.3", normalRangeFemale: "0.0-0.3" },
    { parameterName: "Bilirubin Indirect", unit: "mg/dL", normalRangeMale: "0.2-0.8", normalRangeFemale: "0.2-0.8" },
    { parameterName: "SGOT (AST)", unit: "U/L", normalRangeMale: "5-40", normalRangeFemale: "5-35" },
    { parameterName: "SGPT (ALT)", unit: "U/L", normalRangeMale: "5-45", normalRangeFemale: "5-35" },
    { parameterName: "Alkaline Phosphatase (ALP)", unit: "U/L", normalRangeMale: "30-120", normalRangeFemale: "30-120" },
    { parameterName: "Total Protein", unit: "g/dL", normalRangeMale: "6.0-8.3", normalRangeFemale: "6.0-8.3" },
    { parameterName: "Albumin", unit: "g/dL", normalRangeMale: "3.5-5.0", normalRangeFemale: "3.5-5.0" },
    { parameterName: "Globulin", unit: "g/dL", normalRangeMale: "2.0-3.5", normalRangeFemale: "2.0-3.5" },
    { parameterName: "A/G Ratio", unit: "ratio", normalRangeMale: "1.0-2.1", normalRangeFemale: "1.0-2.1" }
  ],
  kft: [
    { parameterName: "Urea", unit: "mg/dL", normalRangeMale: "15-45", normalRangeFemale: "15-45" },
    { parameterName: "Creatinine", unit: "mg/dL", normalRangeMale: "0.7-1.3", normalRangeFemale: "0.6-1.1" },
    { parameterName: "Uric Acid", unit: "mg/dL", normalRangeMale: "3.5-7.2", normalRangeFemale: "2.6-6.0" },
    { parameterName: "BUN (Blood Urea Nitrogen)", unit: "mg/dL", normalRangeMale: "7-20", normalRangeFemale: "7-20" }
  ],
  lipid: [
    { parameterName: "Total Cholesterol", unit: "mg/dL", normalRangeMale: "125-200", normalRangeFemale: "125-200" },
    { parameterName: "Triglycerides", unit: "mg/dL", normalRangeMale: "40-150", normalRangeFemale: "40-150" },
    { parameterName: "HDL Cholesterol", unit: "mg/dL", normalRangeMale: "40-60", normalRangeFemale: "50-60" },
    { parameterName: "LDL Cholesterol", unit: "mg/dL", normalRangeMale: "50-100", normalRangeFemale: "50-100" },
    { parameterName: "VLDL Cholesterol", unit: "mg/dL", normalRangeMale: "5-40", normalRangeFemale: "5-40" }
  ],
  thyroid: [
    { parameterName: "Total Triiodothyronine (T3)", unit: "ng/dL", normalRangeMale: "80-200", normalRangeFemale: "80-200" },
    { parameterName: "Total Thyroxine (T4)", unit: "µg/dL", normalRangeMale: "5.1-14.1", normalRangeFemale: "5.1-14.1" },
    { parameterName: "Thyroid Stimulating Hormone (TSH)", unit: "µIU/mL", normalRangeMale: "0.4-4.5", normalRangeFemale: "0.4-4.5" }
  ],
  urine: [
    { parameterName: "Color", unit: "", normalRangeMale: "Pale Yellow", normalRangeFemale: "Pale Yellow" },
    { parameterName: "Transparency", unit: "", normalRangeMale: "Clear", normalRangeFemale: "Clear" },
    { parameterName: "Specific Gravity", unit: "", normalRangeMale: "1.005-1.030", normalRangeFemale: "1.005-1.030" },
    { parameterName: "pH", unit: "", normalRangeMale: "4.5-8.0", normalRangeFemale: "4.5-8.0" },
    { parameterName: "Glucose", unit: "", normalRangeMale: "Nil", normalRangeFemale: "Nil" },
    { parameterName: "Protein", unit: "", normalRangeMale: "Nil", normalRangeFemale: "Nil" },
    { parameterName: "Ketones", unit: "", normalRangeMale: "Nil", normalRangeFemale: "Nil" },
    { parameterName: "Bilirubin", unit: "", normalRangeMale: "Nil", normalRangeFemale: "Nil" },
    { parameterName: "Pus Cells", unit: "/hpf", normalRangeMale: "0-5", normalRangeFemale: "0-5" },
    { parameterName: "Epithelial Cells", unit: "/hpf", normalRangeMale: "0-10", normalRangeFemale: "0-10" },
    { parameterName: "RBCs", unit: "/hpf", normalRangeMale: "0-2", normalRangeFemale: "0-2" },
    { parameterName: "Crystals", unit: "", normalRangeMale: "Nil", normalRangeFemale: "Nil" },
    { parameterName: "Casts", unit: "", normalRangeMale: "Nil", normalRangeFemale: "Nil" },
    { parameterName: "Bacteria", unit: "", normalRangeMale: "Nil", normalRangeFemale: "Nil" }
  ],
  semen: [
    { parameterName: "Volume", unit: "mL", normalRangeMale: "1.5-5.0", normalRangeFemale: "" },
    { parameterName: "Liquefaction Time", unit: "minutes", normalRangeMale: "15-30", normalRangeFemale: "" },
    { parameterName: "Sperm Concentration", unit: "million/mL", normalRangeMale: ">=15", normalRangeFemale: "" },
    { parameterName: "Total Sperm Motility", unit: "%", normalRangeMale: ">=40", normalRangeFemale: "" },
    { parameterName: "Rapid Progressive Motility", unit: "%", normalRangeMale: ">=32", normalRangeFemale: "" },
    { parameterName: "Normal Morphology", unit: "%", normalRangeMale: ">=4", normalRangeFemale: "" },
    { parameterName: "Pus Cells", unit: "/hpf", normalRangeMale: "0-5", normalRangeFemale: "" }
  ],
  stool: [
    { parameterName: "Color", unit: "", normalRangeMale: "Brown", normalRangeFemale: "Brown" },
    { parameterName: "Consistency", unit: "", normalRangeMale: "Soft, formed", normalRangeFemale: "Soft, formed" },
    { parameterName: "Mucus", unit: "", normalRangeMale: "Absent", normalRangeFemale: "Absent" },
    { parameterName: "Blood", unit: "", normalRangeMale: "Absent", normalRangeFemale: "Absent" },
    { parameterName: "Pus Cells", unit: "/hpf", normalRangeMale: "Nil", normalRangeFemale: "Nil" },
    { parameterName: "RBCs", unit: "/hpf", normalRangeMale: "Nil", normalRangeFemale: "Nil" },
    { parameterName: "Ova / Cysts", unit: "", normalRangeMale: "Not Seen", normalRangeFemale: "Not Seen" }
  ],
  widal: [
    { parameterName: "Widal TO", unit: "titer", normalRangeMale: "< 1:80", normalRangeFemale: "< 1:80" },
    { parameterName: "Widal TH", unit: "titer", normalRangeMale: "< 1:80", normalRangeFemale: "< 1:80" },
    { parameterName: "Widal AO", unit: "titer", normalRangeMale: "< 1:80", normalRangeFemale: "< 1:80" },
    { parameterName: "Widal AH", unit: "titer", normalRangeMale: "< 1:80", normalRangeFemale: "< 1:80" }
  ],
  electrolytes: [
    { parameterName: "Sodium (Na)", unit: "mEq/L", normalRangeMale: "135-145", normalRangeFemale: "135-145" },
    { parameterName: "Potassium (K)", unit: "mEq/L", normalRangeMale: "3.5-5.2", normalRangeFemale: "3.5-5.2" },
    { parameterName: "Chloride (Cl)", unit: "mEq/L", normalRangeMale: "96-106", normalRangeFemale: "96-106" },
    { parameterName: "Bicarbonate (HCO3)", unit: "mEq/L", normalRangeMale: "22-29", normalRangeFemale: "22-29" }
  ],
  pt: [
    { parameterName: "Prothrombin Time (PT)", unit: "seconds", normalRangeMale: "11-15", normalRangeFemale: "11-15" },
    { parameterName: "Control Time", unit: "seconds", normalRangeMale: "11-15", normalRangeFemale: "11-15" },
    { parameterName: "INR", unit: "ratio", normalRangeMale: "0.8-1.2", normalRangeFemale: "0.8-1.2" }
  ],
  aptt: [
    { parameterName: "Activated Partial Thromboplastin Time (APTT)", unit: "seconds", normalRangeMale: "25-35", normalRangeFemale: "25-35" },
    { parameterName: "Control Time", unit: "seconds", normalRangeMale: "25-35", normalRangeFemale: "25-35" }
  ],
  bleeding: [
    { parameterName: "Bleeding Time", unit: "minutes", normalRangeMale: "1-5", normalRangeFemale: "1-5" }
  ],
  clotting: [
    { parameterName: "Clotting Time", unit: "minutes", normalRangeMale: "3-9", normalRangeFemale: "3-9" }
  ],
  culture: [
    { parameterName: "Specimen Received", unit: "text", normalRangeMale: "Specified", normalRangeFemale: "Specified" },
    { parameterName: "Incubation Period", unit: "text", normalRangeMale: "48 Hours", normalRangeFemale: "48 Hours" },
    { parameterName: "Organism Isolated", unit: "text", normalRangeMale: "No growth after 48 hours of aerobic incubation", normalRangeFemale: "No growth after 48 hours of aerobic incubation" },
    { parameterName: "Antibiotic Sensitivity Report", unit: "text", normalRangeMale: "Nil", normalRangeFemale: "Nil" }
  ],
  histopathology: [
    { parameterName: "Clinical History", unit: "text", normalRangeMale: "Specified", normalRangeFemale: "Specified" },
    { parameterName: "Gross Examination", unit: "text", normalRangeMale: "Descriptive", normalRangeFemale: "Descriptive" },
    { parameterName: "Microscopic Examination", unit: "text", normalRangeMale: "Descriptive", normalRangeFemale: "Descriptive" },
    { parameterName: "Impression / Diagnosis", unit: "text", normalRangeMale: "Descriptive", normalRangeFemale: "Descriptive" }
  ],
  stain: [
    { parameterName: "Stain Result Report", unit: "text", normalRangeMale: "Negative / Descriptive", normalRangeFemale: "Negative / Descriptive" }
  ],
  cbc3part: [
    { parameterName: "Hemoglobin", unit: "g/dL", normalRangeMale: "13.0-17.0", normalRangeFemale: "12.0-15.0", normalRangeChild: "11.0-14.0" },
    { parameterName: "Total Leukocyte Count (TLC)", unit: "/cmm", normalRangeMale: "4000-11000", normalRangeFemale: "4000-11000", normalRangeChild: "5000-13000" },
    { parameterName: "Platelet Count", unit: "Lakhs/cmm", normalRangeMale: "1.50-4.50", normalRangeFemale: "1.50-4.50", normalRangeChild: "1.50-4.50" },
    { parameterName: "Red Blood Cell Count (RBC)", unit: "million/cmm", normalRangeMale: "4.5-5.5", normalRangeFemale: "3.8-4.8", normalRangeChild: "4.0-5.2" },
    { parameterName: "Packed Cell Volume (PCV)", unit: "%", normalRangeMale: "40-50", normalRangeFemale: "36-46", normalRangeChild: "32-42" },
    { parameterName: "Mean Corpuscular Volume (MCV)", unit: "fL", normalRangeMale: "80-100", normalRangeFemale: "80-100", normalRangeChild: "75-90" },
    { parameterName: "Mean Corpuscular Hemoglobin (MCH)", unit: "pg", normalRangeMale: "27-32", normalRangeFemale: "27-32", normalRangeChild: "25-31" },
    { parameterName: "Mean Corpuscular Hemoglobin Conc (MCHC)", unit: "g/dL", normalRangeMale: "32-36", normalRangeFemale: "32-36", normalRangeChild: "32-36" },
    { parameterName: "Red Cell Distribution Width (RDW-CV)", unit: "%", normalRangeMale: "11.5-14.5", normalRangeFemale: "11.5-14.5", normalRangeChild: "11.5-14.5" },
    { parameterName: "Granulocytes (GRA%)", unit: "%", normalRangeMale: "50.0-70.0", normalRangeFemale: "50.0-70.0", normalRangeChild: "30.0-60.0" },
    { parameterName: "Granulocytes (GRA#)", unit: "/cmm", normalRangeMale: "2000-7000", normalRangeFemale: "2000-7000", normalRangeChild: "2000-7000" },
    { parameterName: "Lymphocytes (LYM%)", unit: "%", normalRangeMale: "20.0-40.0", normalRangeFemale: "20.0-40.0", normalRangeChild: "40.0-70.0" },
    { parameterName: "Lymphocytes (LYM#)", unit: "/cmm", normalRangeMale: "1000-4000", normalRangeFemale: "1000-4000", normalRangeChild: "1500-8000" },
    { parameterName: "Mid Cells (MID%)", unit: "%", normalRangeMale: "2.0-10.0", normalRangeFemale: "2.0-10.0", normalRangeChild: "2.0-10.0" },
    { parameterName: "Mid Cells (MID#)", unit: "/cmm", normalRangeMale: "100-1000", normalRangeFemale: "100-1000", normalRangeChild: "100-1000" },
    { parameterName: "Mean Platelet Volume (MPV)", unit: "fL", normalRangeMale: "7.5-11.5", normalRangeFemale: "7.5-11.5", normalRangeChild: "7.5-11.5" }
  ],
  cbc5part: [
    { parameterName: "Hemoglobin", unit: "g/dL", normalRangeMale: "13.0-17.0", normalRangeFemale: "12.0-15.0", normalRangeChild: "11.0-14.0" },
    { parameterName: "Total Leukocyte Count (TLC)", unit: "/cmm", normalRangeMale: "4000-11000", normalRangeFemale: "4000-11000", normalRangeChild: "5000-13000" },
    { parameterName: "Platelet Count", unit: "Lakhs/cmm", normalRangeMale: "1.50-4.50", normalRangeFemale: "1.50-4.50", normalRangeChild: "1.50-4.50" },
    { parameterName: "Red Blood Cell Count (RBC)", unit: "million/cmm", normalRangeMale: "4.5-5.5", normalRangeFemale: "3.8-4.8", normalRangeChild: "4.0-5.2" },
    { parameterName: "Packed Cell Volume (PCV)", unit: "%", normalRangeMale: "40-50", normalRangeFemale: "36-46", normalRangeChild: "32-42" },
    { parameterName: "Mean Corpuscular Volume (MCV)", unit: "fL", normalRangeMale: "80-100", normalRangeFemale: "80-100", normalRangeChild: "75-90" },
    { parameterName: "Mean Corpuscular Hemoglobin (MCH)", unit: "pg", normalRangeMale: "27-32", normalRangeFemale: "27-32", normalRangeChild: "25-31" },
    { parameterName: "Mean Corpuscular Hemoglobin Conc (MCHC)", unit: "g/dL", normalRangeMale: "32-36", normalRangeFemale: "32-36", normalRangeChild: "32-36" },
    { parameterName: "Red Cell Distribution Width (RDW-CV)", unit: "%", normalRangeMale: "11.5-14.5", normalRangeFemale: "11.5-14.5", normalRangeChild: "11.5-14.5" },
    { parameterName: "Neutrophils (NEUT%)", unit: "%", normalRangeMale: "40.0-80.0", normalRangeFemale: "40.0-80.0", normalRangeChild: "30.0-60.0" },
    { parameterName: "Neutrophils (NEUT#)", unit: "/cmm", normalRangeMale: "2000-7000", normalRangeFemale: "2000-7000", normalRangeChild: "2000-7000" },
    { parameterName: "Lymphocytes (LYM%)", unit: "%", normalRangeMale: "20.0-40.0", normalRangeFemale: "20.0-40.0", normalRangeChild: "40.0-70.0" },
    { parameterName: "Lymphocytes (LYM#)", unit: "/cmm", normalRangeMale: "1000-4000", normalRangeFemale: "1000-4000", normalRangeChild: "1500-8000" },
    { parameterName: "Monocytes (MONO%)", unit: "%", normalRangeMale: "2.0-10.0", normalRangeFemale: "2.0-10.0", normalRangeChild: "2.0-10.0" },
    { parameterName: "Monocytes (MONO#)", unit: "/cmm", normalRangeMale: "100-800", normalRangeFemale: "100-800", normalRangeChild: "100-800" },
    { parameterName: "Eosinophils (EOS%)", unit: "%", normalRangeMale: "1.0-6.0", normalRangeFemale: "1.0-6.0", normalRangeChild: "1.0-6.0" },
    { parameterName: "Eosinophils (EOS#)", unit: "/cmm", normalRangeMale: "20-500", normalRangeFemale: "20-500", normalRangeChild: "20-500" },
    { parameterName: "Basophils (BASO%)", unit: "%", normalRangeMale: "0.0-2.0", normalRangeFemale: "0.0-2.0", normalRangeChild: "0.0-2.0" },
    { parameterName: "Basophils (BASO#)", unit: "/cmm", normalRangeMale: "0-100", normalRangeFemale: "0-100", normalRangeChild: "0-100" },
    { parameterName: "Mean Platelet Volume (MPV)", unit: "fL", normalRangeMale: "7.5-11.5", normalRangeFemale: "7.5-11.5", normalRangeChild: "7.5-11.5" }
  ],
  coagulogram: [
    { parameterName: "Prothrombin Time (PT)", unit: "seconds", normalRangeMale: "11.0-15.0", normalRangeFemale: "11.0-15.0" },
    { parameterName: "Control Time (PT Control)", unit: "seconds", normalRangeMale: "11.0-15.0", normalRangeFemale: "11.0-15.0" },
    { parameterName: "INR (International Normalized Ratio)", unit: "ratio", normalRangeMale: "0.8-1.2", normalRangeFemale: "0.8-1.2" },
    { parameterName: "Activated Partial Thromboplastin Time (APTT)", unit: "seconds", normalRangeMale: "25.0-35.0", normalRangeFemale: "25.0-35.0" },
    { parameterName: "Control Time (APTT Control)", unit: "seconds", normalRangeMale: "25.0-35.0", normalRangeFemale: "25.0-35.0" },
    { parameterName: "Bleeding Time (BT)", unit: "minutes", normalRangeMale: "1.0-5.0", normalRangeFemale: "1.0-5.0" },
    { parameterName: "Clotting Time (CT)", unit: "minutes", normalRangeMale: "3.0-9.0", normalRangeFemale: "3.0-9.0" },
    { parameterName: "Thrombin Time (TT)", unit: "seconds", normalRangeMale: "14.0-19.0", normalRangeFemale: "14.0-19.0" },
    { parameterName: "Fibrinogen", unit: "mg/dL", normalRangeMale: "200-400", normalRangeFemale: "200-400" }
  ],
  bloodgroup_rh: [
    { parameterName: "Blood Group (ABO)", unit: "", normalRangeMale: "A/B/AB/O", normalRangeFemale: "A/B/AB/O" },
    { parameterName: "Rh Factor (Rh Typing)", unit: "", normalRangeMale: "Positive/Negative", normalRangeFemale: "Positive/Negative" }
  ],
  bt_ct: [
    { parameterName: "Bleeding Time (BT)", unit: "minutes", normalRangeMale: "1.0-5.0", normalRangeFemale: "1.0-5.0" },
    { parameterName: "Clotting Time (CT)", unit: "minutes", normalRangeMale: "3.0-9.0", normalRangeFemale: "3.0-9.0" }
  ],
  dengue_profile: [
    { parameterName: "Dengue NS1 Antigen", unit: "index", normalRangeMale: "Negative (< 0.9)", normalRangeFemale: "Negative (< 0.9)" },
    { parameterName: "Dengue IgG Antibody", unit: "index", normalRangeMale: "Negative (< 0.9)", normalRangeFemale: "Negative (< 0.9)" },
    { parameterName: "Dengue IgM Antibody", unit: "index", normalRangeMale: "Negative (< 0.9)", normalRangeFemale: "Negative (< 0.9)" }
  ],
  viral_markers: [
    { parameterName: "HIV I & II Antibodies", unit: "index", normalRangeMale: "Non-Reactive (Index < 0.9)", normalRangeFemale: "Non-Reactive (Index < 0.9)" },
    { parameterName: "HBsAg (Hepatitis B Surface Ag)", unit: "index", normalRangeMale: "Non-Reactive (Index < 0.9)", normalRangeFemale: "Non-Reactive (Index < 0.9)" },
    { parameterName: "HCV Antibody (Hepatitis C)", unit: "index", normalRangeMale: "Non-Reactive (Index < 0.9)", normalRangeFemale: "Non-Reactive (Index < 0.9)" }
  ],
  rheumatoid_panel: [
    { parameterName: "Rheumatoid Factor (RA Factor)", unit: "IU/mL", normalRangeMale: "0.0-20.0", normalRangeFemale: "0.0-20.0" },
    { parameterName: "C-Reactive Protein (CRP)", unit: "mg/L", normalRangeMale: "0.0-6.0", normalRangeFemale: "0.0-6.0" },
    { parameterName: "Antistreptolysin O (ASO)", unit: "IU/mL", normalRangeMale: "0.0-200.0", normalRangeFemale: "0.0-200.0" },
    { parameterName: "Uric Acid", unit: "mg/dL", normalRangeMale: "3.5-7.2", normalRangeFemale: "2.6-6.0" }
  ]
};

// Map individual specialized single analytes by exact name / patterns
const singleAnalytes = {
  // Biochemistry
  "blood sugar fasting": { parameterName: "BLOOD SUGAR (F)", unit: "mg/dL", normalRangeMale: "Fasting: 70 - 110", normalRangeFemale: "Fasting: 70 - 110" },
  "fasting blood glucose": { parameterName: "BLOOD SUGAR (F)", unit: "mg/dL", normalRangeMale: "Fasting: 70 - 110", normalRangeFemale: "Fasting: 70 - 110" },
  "blood sugar pp": { parameterName: "BLOOD SUGAR (PP)", unit: "mg/dL", normalRangeMale: "PP: 70 - 140", normalRangeFemale: "PP: 70 - 140" },
  "post prandial": { parameterName: "BLOOD SUGAR (PP)", unit: "mg/dL", normalRangeMale: "PP: 70 - 140", normalRangeFemale: "PP: 70 - 140" },
  "random blood sugar": { parameterName: "BLOOD SUGAR (R)", unit: "mg/dL", normalRangeMale: "Random: 70 - 140", normalRangeFemale: "Random: 70 - 140" },
  "urea": { parameterName: "Serum Urea", unit: "mg/dL", normalRangeMale: "15-45", normalRangeFemale: "15-45" },
  "creatinine": { parameterName: "Serum Creatinine", unit: "mg/dL", normalRangeMale: "0.7-1.3", normalRangeFemale: "0.6-1.1" },
  "uric acid": { parameterName: "Serum Uric Acid", unit: "mg/dL", normalRangeMale: "3.5-7.2", normalRangeFemale: "2.6-6.0" },
  "calcium": { parameterName: "Serum Calcium", unit: "mg/dL", normalRangeMale: "8.5-10.5", normalRangeFemale: "8.5-10.5" },
  "phosphorus": { parameterName: "Serum Phosphorus", unit: "mg/dL", normalRangeMale: "2.5-4.5", normalRangeFemale: "2.5-4.5" },
  "amylase": { parameterName: "Serum Amylase", unit: "U/L", normalRangeMale: "25-125", normalRangeFemale: "25-125" },
  "lipase": { parameterName: "Serum Lipase", unit: "U/L", normalRangeMale: "10-140", normalRangeFemale: "10-140" },
  "bilirubin total": { parameterName: "Serum Bilirubin Total", unit: "mg/dL", normalRangeMale: "0.2-1.2", normalRangeFemale: "0.2-1.2" },
  "bilirubin direct": { parameterName: "Serum Bilirubin Direct", unit: "mg/dL", normalRangeMale: "0.0-0.3", normalRangeFemale: "0.0-0.3" },
  "albumin": { parameterName: "Serum Albumin", unit: "g/dL", normalRangeMale: "3.5-5.0", normalRangeFemale: "3.5-5.0" },
  "alkaline phosphatase": { parameterName: "Alkaline Phosphatase (ALP)", unit: "U/L", normalRangeMale: "30-120", normalRangeFemale: "30-120" },
  "globulin": { parameterName: "Serum Globulin", unit: "g/dL", normalRangeMale: "2.0-3.5", normalRangeFemale: "2.0-3.5" },
  "ldh": { parameterName: "Serum LDH", unit: "U/L", normalRangeMale: "140-280", normalRangeFemale: "140-280" },
  "magnesium": { parameterName: "Serum Magnesium", unit: "mg/dL", normalRangeMale: "1.7-2.2", normalRangeFemale: "1.7-2.2" },
  "microalbumin": { parameterName: "Microalbumin (Urine)", unit: "mg/L", normalRangeMale: "0-20", normalRangeFemale: "0-20" },
  "ferritin": { parameterName: "Serum Ferritin", unit: "ng/mL", normalRangeMale: "30-400", normalRangeFemale: "15-150" },
  "serum iron": { parameterName: "Serum Iron", unit: "µg/dL", normalRangeMale: "65-175", normalRangeFemale: "50-170" },
  "tibc": { parameterName: "Total Iron Binding Capacity", unit: "µg/dL", normalRangeMale: "250-450", normalRangeFemale: "250-450" },
  "sodium": { parameterName: "Serum Sodium (Na)", unit: "mEq/L", normalRangeMale: "135-145", normalRangeFemale: "135-145" },
  "potassium": { parameterName: "Serum Potassium (K)", unit: "mEq/L", normalRangeMale: "3.5-5.2", normalRangeFemale: "3.5-5.2" },
  "chloride": { parameterName: "Serum Chloride (Cl)", unit: "mEq/L", normalRangeMale: "96-106", normalRangeFemale: "96-106" },
  "bicarbonate": { parameterName: "Serum Bicarbonate (HCO3)", unit: "mEq/L", normalRangeMale: "22-29", normalRangeFemale: "22-29" },
  "cpk": { parameterName: "Creatine Kinase (CPK)", unit: "U/L", normalRangeMale: "39-308", normalRangeFemale: "26-192" },

  // Hormones
  "tsh": { parameterName: "Thyroid Stimulating Hormone (TSH)", unit: "µIU/mL", normalRangeMale: "0.4-4.5", normalRangeFemale: "0.4-4.5" },
  "t3": { parameterName: "Total Triiodothyronine (T3)", unit: "ng/dL", normalRangeMale: "80-200", normalRangeFemale: "80-200" },
  "t4": { parameterName: "Total Thyroxine (T4)", unit: "µg/dL", normalRangeMale: "5.1-14.1", normalRangeFemale: "5.1-14.1" },
  "ft3": { parameterName: "Free T3 (FT3)", unit: "pg/mL", normalRangeMale: "2.0-4.4", normalRangeFemale: "2.0-4.4" },
  "ft4": { parameterName: "Free T4 (FT4)", unit: "ng/dL", normalRangeMale: "0.8-1.8", normalRangeFemale: "0.8-1.8" },
  "beta hcg": { parameterName: "Beta HCG (Quantitative)", unit: "mIU/mL", normalRangeMale: "< 5.0", normalRangeFemale: "< 5.0" },
  "lh": { parameterName: "Luteinizing Hormone (LH)", unit: "mIU/mL", normalRangeMale: "1.7-8.6", normalRangeFemale: "2.4-12.6" },
  "fsh": { parameterName: "Follicle Stimulating Hormone (FSH)", unit: "mIU/mL", normalRangeMale: "1.5-12.4", normalRangeFemale: "3.5-12.5" },
  "prolactin": { parameterName: "Serum Prolactin", unit: "ng/mL", normalRangeMale: "4.0-15.2", normalRangeFemale: "4.8-23.3" },
  "progesterone": { parameterName: "Serum Progesterone", unit: "ng/mL", normalRangeMale: "0.1-0.8", normalRangeFemale: "0.2-1.5" },
  "estrogen": { parameterName: "Serum Estrogen", unit: "pg/mL", normalRangeMale: "10-50", normalRangeFemale: "15-350" },
  "cortisol": { parameterName: "Serum Cortisol (Morning)", unit: "µg/dL", normalRangeMale: "6.0-23.0", normalRangeFemale: "6.0-23.0" },
  "insulin": { parameterName: "Serum Insulin (Fasting)", unit: "µIU/mL", normalRangeMale: "2.6-24.9", normalRangeFemale: "2.6-24.9" },
  "testosterone": { parameterName: "Total Testosterone", unit: "ng/dL", normalRangeMale: "240-950", normalRangeFemale: "8-60" },
  "amh": { parameterName: "Anti-Mullerian Hormone (AMH)", unit: "ng/mL", normalRangeMale: "0.7-19.0", normalRangeFemale: "0.9-9.5" },
  "growth hormone": { parameterName: "Growth Hormone", unit: "ng/mL", normalRangeMale: "0.0-3.0", normalRangeFemale: "0.0-8.0" },
  "acth": { parameterName: "Adrenocorticotropic Hormone (ACTH)", unit: "pg/mL", normalRangeMale: "7.2-63.3", normalRangeFemale: "7.2-63.3" },
  "dheas": { parameterName: "DHEA-Sulfate", unit: "µg/dL", normalRangeMale: "80-560", normalRangeFemale: "35-430" },
  "pth": { parameterName: "Parathyroid Hormone (PTH)", unit: "pg/mL", normalRangeMale: "15-65", normalRangeFemale: "15-65" },

  // Vitamins
  "vitamin d": { parameterName: "25-Hydroxy Vitamin D", unit: "ng/mL", normalRangeMale: "30-100", normalRangeFemale: "30-100" },
  "vitamin b12": { parameterName: "Vitamin B12", unit: "pg/mL", normalRangeMale: "200-900", normalRangeFemale: "200-900" },
  "folic acid": { parameterName: "Folic Acid", unit: "ng/mL", normalRangeMale: "3.1-17.5", normalRangeFemale: "3.1-17.5" },
  "vitamin a": { parameterName: "Vitamin A", unit: "µg/dL", normalRangeMale: "30-80", normalRangeFemale: "30-80" },
  "vitamin b6": { parameterName: "Vitamin B6", unit: "µg/L", normalRangeMale: "5-30", normalRangeFemale: "5-30" },
  "vitamin c": { parameterName: "Vitamin C", unit: "mg/dL", normalRangeMale: "0.4-1.5", normalRangeFemale: "0.4-1.5" },
  "vitamin e": { parameterName: "Vitamin E", unit: "mg/L", normalRangeMale: "5.5-17.0", normalRangeFemale: "5.5-17.0" },
  "vitamin k": { parameterName: "Vitamin K1", unit: "ng/mL", normalRangeMale: "0.1-2.2", normalRangeFemale: "0.1-2.2" },

  // Serology & Immunology
  "crp": { parameterName: "C-Reactive Protein (CRP)", unit: "mg/L", normalRangeMale: "0.0-6.0", normalRangeFemale: "0.0-6.0" },
  "ra factor": { parameterName: "Rheumatoid Factor (RA)", unit: "IU/mL", normalRangeMale: "0.0-20.0", normalRangeFemale: "0.0-20.0" },
  "aso": { parameterName: "Antistreptolysin O (ASO)", unit: "IU/mL", normalRangeMale: "0.0-200.0", normalRangeFemale: "0.0-200.0" },
  "vdrl": { parameterName: "VDRL Screening", unit: "titer", normalRangeMale: "Non-Reactive", normalRangeFemale: "Non-Reactive" },
  "hiv": { parameterName: "HIV I & II Antibodies", unit: "index", normalRangeMale: "Non-Reactive (Index < 0.9)", normalRangeFemale: "Non-Reactive (Index < 0.9)" },
  "hbsag": { parameterName: "HBsAg (Hepatitis B Surface Ag)", unit: "index", normalRangeMale: "Non-Reactive (Index < 0.9)", normalRangeFemale: "Non-Reactive (Index < 0.9)" },
  "hcv": { parameterName: "HCV Antibody (Hepatitis C)", unit: "index", normalRangeMale: "Non-Reactive (Index < 0.9)", normalRangeFemale: "Non-Reactive (Index < 0.9)" },
  "dengue ns1": { parameterName: "Dengue NS1 Antigen", unit: "index", normalRangeMale: "Negative", normalRangeFemale: "Negative" },
  "ana": { parameterName: "Antinuclear Antibodies (ANA)", unit: "titer", normalRangeMale: "Negative (< 1:40)", normalRangeFemale: "Negative (< 1:40)" },
  "anti-dsdna": { parameterName: "Anti-dsDNA Antibody", unit: "IU/mL", normalRangeMale: "0-25", normalRangeFemale: "0-25" },
  "anti ccp": { parameterName: "Anti-Cyclic Citrullinated Peptide", unit: "U/mL", normalRangeMale: "0.0-17.0", normalRangeFemale: "0.0-17.0" },
  "hla b27": { parameterName: "HLA B27 Antigen", unit: "result", normalRangeMale: "Negative", normalRangeFemale: "Negative" },

  // Tumor Markers
  "psa": { parameterName: "Total Prostate Specific Antigen (PSA)", unit: "ng/mL", normalRangeMale: "0.0-4.0", normalRangeFemale: "N/A" },
  "ca-125": { parameterName: "Cancer Antigen 125 (CA-125)", unit: "U/mL", normalRangeMale: "0.0-35.0", normalRangeFemale: "0.0-35.0" },
  "ca 19-9": { parameterName: "Cancer Antigen 19-9 (CA 19-9)", unit: "U/mL", normalRangeMale: "0.0-37.0", normalRangeFemale: "0.0-37.0" },
  "ca 15-3": { parameterName: "Cancer Antigen 15-3 (CA 15-3)", unit: "U/mL", normalRangeMale: "0.0-30.0", normalRangeFemale: "0.0-30.0" },
  "cea": { parameterName: "Carcinoembryonic Antigen (CEA)", unit: "ng/mL", normalRangeMale: "0.0-5.0", normalRangeFemale: "0.0-5.0" },
  "afp": { parameterName: "Alpha-Fetoprotein (AFP)", unit: "ng/mL", normalRangeMale: "0.0-8.5", normalRangeFemale: "0.0-8.5" },

  // Coagulation
  "d-dimer": { parameterName: "D-Dimer", unit: "ng/mL", normalRangeMale: "0-500", normalRangeFemale: "0-500" },
  "fibrinogen": { parameterName: "Fibrinogen", unit: "mg/dL", normalRangeMale: "200-400", normalRangeFemale: "200-400" },

  // Clinical Pathology / Urine
  "urine ketone": { parameterName: "Urine Ketone bodies", unit: "", normalRangeMale: "Nil", normalRangeFemale: "Nil" },
  "urine protein": { parameterName: "Urine Protein", unit: "", normalRangeMale: "Nil", normalRangeFemale: "Nil" },
  "urine sugar": { parameterName: "Urine Sugar (Glucose)", unit: "", normalRangeMale: "Nil", normalRangeFemale: "Nil" },
  "pregnancy test": { parameterName: "Urine Pregnancy Test (HCG)", unit: "", normalRangeMale: "Negative", normalRangeFemale: "Negative" },
  "occult blood": { parameterName: "Stool Occult Blood", unit: "", normalRangeMale: "Negative", normalRangeFemale: "Negative" }
};

// Generates dynamic real-world parameters based on testName and category
export const getClinicalParameters = (testName, category) => {
  const cleanName = testName.trim().toLowerCase();
  const cleanCat = (category || "").trim().toLowerCase();

  // 1. Panel Matches via cleanName matching key profiles
  if (cleanName.includes("blood group & rh") || cleanName.includes("blood group and rh") || cleanName.includes("abo & rh") || cleanName.includes("abo and rh")) {
    return dictionary.bloodgroup_rh;
  }
  if (cleanName.includes("bleeding time & clotting time") || cleanName.includes("bleeding time and clotting time") || cleanName.includes("bt/ct") || cleanName.includes("bt & ct") || cleanName.includes("bt and ct")) {
    return dictionary.bt_ct;
  }
  if (cleanName.includes("dengue profile") || cleanName.includes("dengue panel")) {
    return dictionary.dengue_profile;
  }
  if (cleanName.includes("viral marker") || cleanName.includes("tri-dot") || cleanName.includes("tridot")) {
    return dictionary.viral_markers;
  }
  if (cleanName.includes("rheumatoid panel") || cleanName.includes("rheumatoid factor panel") || cleanName.includes("arthritis profile")) {
    return dictionary.rheumatoid_panel;
  }
  if (cleanName.includes("coagulogram") || cleanName.includes("coagulation profile") || cleanName.includes("coagulation panel")) {
    return dictionary.coagulogram;
  }
  if ((cleanName.includes("cbc") || cleanName.includes("blood count")) && (cleanName.includes("3-part") || cleanName.includes("3 part") || cleanName.includes("3pot") || cleanName.includes("3 pot"))) {
    return dictionary.cbc3part;
  }
  if ((cleanName.includes("cbc") || cleanName.includes("blood count")) && (cleanName.includes("5-part") || cleanName.includes("5 part") || cleanName.includes("5pot") || cleanName.includes("5 pot"))) {
    return dictionary.cbc5part;
  }
  if (cleanName === "cbc" || cleanName.includes("complete blood count") || cleanName.startsWith("cbc ")) {
    return dictionary.cbc;
  }
  if (cleanName === "esr" || cleanName.includes("erythrocyte sedimentation rate") || cleanName.startsWith("esr ")) {
    return dictionary.esr;
  }
  if (cleanName === "lft" || cleanName.includes("liver function") || cleanName.startsWith("lft ")) {
    return dictionary.lft;
  }
  if (cleanName === "kft" || cleanName === "rft" || cleanName.includes("kidney function") || cleanName.includes("renal function") || cleanName.startsWith("kft ")) {
    return dictionary.kft;
  }
  if (cleanName.includes("lipid profile")) {
    return dictionary.lipid;
  }
  if (cleanName.includes("thyroid profile") || cleanName === "tft" || cleanName.includes("thyroid function")) {
    return dictionary.thyroid;
  }
  if (cleanName.includes("urine routine") || cleanName.includes("urinalysis")) {
    return dictionary.urine;
  }
  if (cleanName.includes("semen analysis") || cleanName.includes("seminal fluid")) {
    return dictionary.semen;
  }
  if (cleanName.includes("stool routine") || cleanName.includes("stool analysis")) {
    return dictionary.stool;
  }
  if (cleanName.includes("widal")) {
    return dictionary.widal;
  }
  if (cleanName.includes("electrolyte profile") || cleanName.includes("serum electrolytes")) {
    return dictionary.electrolytes;
  }
  if (cleanName === "pt/inr" || cleanName === "pt" || cleanName.includes("prothrombin time")) {
    return dictionary.pt;
  }
  if (cleanName.includes("aptt")) {
    return dictionary.aptt;
  }
  if (cleanName === "bleeding time" || cleanName.includes("bleeding time profile")) {
    return dictionary.bleeding;
  }
  if (cleanName === "clotting time" || cleanName.includes("clotting time profile")) {
    return dictionary.clotting;
  }
  if (cleanName.includes("culture") || cleanName.includes("sensitivity")) {
    return dictionary.culture;
  }
  if (cleanName.includes("biopsy") || cleanName.includes("histopathology") || cleanName.includes("pap smear") || cleanName.includes("fnac") || cleanName.includes("cytology")) {
    return dictionary.histopathology;
  }
  if (cleanName.includes("stain") || cleanName.includes("mount")) {
    return dictionary.stain;
  }

  // 2. Individual Specialized Single Analyte Matching using Word Boundaries
  // Sort the keys by length descending to match longer specific keys (e.g. "microalbumin") before shorter ones (e.g. "albumin")
  const sortedKeys = Object.keys(singleAnalytes).sort((a, b) => b.length - a.length);

  for (const key of sortedKeys) {
    // Escape regex characters just in case
    const escapedKey = key.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    
    // We use a regex with word boundaries \b for robust exact word matching.
    // E.g., preventing "analysis" matching "ana", "microalbumin" matching "albumin", or "FT3" matching "T3".
    const regex = new RegExp(`\\b${escapedKey}\\b`, "i");
    if (regex.test(cleanName)) {
      return [singleAnalytes[key]];
    }
  }

  // 3. Smart Fallback: Map the test name as a single parameter itself instead of "Parameter 1" or duplicated CBC lists
  let defaultUnit = "";
  let defaultMale = "";
  let defaultFemale = "";

  if (cleanCat === "biochemistry" || cleanCat === "vitamins") {
    defaultUnit = "mg/dL";
    defaultMale = "70-140";
    defaultFemale = "70-140";
  } else if (cleanCat === "hormones" || cleanCat === "tumor markers") {
    defaultUnit = "µIU/mL";
    defaultMale = "0.5-5.0";
    defaultFemale = "0.5-5.0";
  } else if (cleanCat === "serology" || cleanCat === "immunology") {
    defaultUnit = "index";
    defaultMale = "Negative";
    defaultFemale = "Negative";
  } else if (cleanCat === "coagulation") {
    defaultUnit = "seconds";
    defaultMale = "10-15";
    defaultFemale = "10-15";
  }

  return [
    {
      parameterName: testName,
      unit: defaultUnit,
      normalRangeMale: defaultMale,
      normalRangeFemale: defaultFemale
    }
  ];
};
export default getClinicalParameters;
