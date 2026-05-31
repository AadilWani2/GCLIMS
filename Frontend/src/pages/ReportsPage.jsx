import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import api from "../services/api";

import jsPDF from "jspdf";

import html2canvas from "html2canvas";

const CLINICAL_INTERPRETATION = {
  "Hemoglobin": {
    low: "Low hemoglobin indicates Anemia, which can cause fatigue, dizziness, and shortness of breath. Common causes include iron deficiency, vitamin B12 or folate deficiency, chronic diseases, or blood loss.",
    high: "High hemoglobin (Polycythemia) can result from chronic dehydration, low blood oxygen levels (e.g., from smoking, high altitude, COPD), or bone marrow overproduction."
  },
  "RBC Count": {
    low: "Low RBC suggests anemia, nutritional deficiencies (Iron, Vitamin B12, Folate), bleeding, or bone marrow disorders.",
    high: "High RBC can indicate chronic hypoxia, severe dehydration, smoking, congenital heart disease, or polycythemia vera."
  },
  "WBC Count": {
    low: "Low WBC (Leukopenia) indicates viral infections, autoimmune conditions, bone marrow disorders, or severe immunodeficiencies.",
    high: "High WBC (Leukocytosis) suggests active infection, chronic inflammation, leukemia, physical/emotional stress, or tissue injury."
  },
  "Platelet Count": {
    low: "Low Platelets (Thrombocytopenia) increases bleeding risk; caused by immune responses, viral infections, or nutrient deficiencies.",
    high: "High Platelets (Thrombocytosis) indicates acute inflammation, post-infection recovery, iron deficiency, or bone marrow overproduction."
  },
  "Urea": {
    low: "Low Urea can indicate malnutrition, low-protein diets, overhydration, or severe liver disease.",
    high: "High Urea (Azotemia) indicates kidney dysfunction, dehydration, high-protein intake, or heart failure."
  },
  "Creatinine": {
    low: "Low Creatinine is rare and typically associated with low muscle mass, muscle wasting, pregnancy, or advanced age.",
    high: "High Creatinine indicates impaired renal filtration, kidney injury, dehydration, or urinary tract obstruction."
  },
  "Uric Acid": {
    low: "Low Uric Acid is usually clinically insignificant but can be seen in Wilson's disease or low dietary protein.",
    high: "High Uric Acid (Hyperuricemia) can lead to Gout, joint pain, kidney stones, or renal dysfunction."
  },
  "Bilirubin Total": {
    low: "Low Bilirubin is clinically insignificant and typically not a medical concern.",
    high: "High Bilirubin (Hyperbilirubinemia) causes Jaundice, indicating liver injury, bile duct blockage, or hemolysis."
  },
  "SGOT (AST)": {
    low: "Low AST is generally normal and not a clinical concern.",
    high: "High SGOT (AST) indicates hepatocellular injury, such as hepatitis, fatty liver, liver cirrhosis, or muscle damage."
  },
  "SGPT (ALT)": {
    low: "Low ALT is normal and typically has no clinical significance.",
    high: "High SGPT (ALT) is a specific indicator of acute or chronic liver inflammation or damage (e.g., hepatitis, toxic drugs)."
  },
  "Alkaline Phosphatase": {
    low: "Low Alkaline Phosphatase can indicate malnutrition, hypothyroidism, or zinc/magnesium deficiencies.",
    high: "High Alkaline Phosphatase suggests biliary obstruction, bone disorders, vitamin D deficiency, or active bone growth."
  },
  "Cholesterol Total": {
    low: "Low Cholesterol can be linked to hyperthyroidism, malnutrition, celiac disease, or chronic liver disorders.",
    high: "High Cholesterol increases cardiovascular risk, leading to atherosclerosis and coronary heart disease."
  },
  "Triglycerides": {
    low: "Low Triglycerides can indicate malnutrition or malabsorption, though generally healthy in low normal range.",
    high: "High Triglycerides increase risk of pancreatitis, metabolic syndrome, and cardiovascular disease."
  },
  "HDL Cholesterol": {
    low: "Low HDL ('good' cholesterol) increases risk of cardiovascular disease; linked to sedentary lifestyle and smoking.",
    high: "High HDL ('good' cholesterol) is cardioprotective, helping clear other cholesterol from blood vessels."
  },
  "LDL Cholesterol": {
    low: "Low LDL is generally healthy but extremely low values can be linked to malnutrition or genetic factors.",
    high: "High LDL ('bad' cholesterol) forms arterial plaque, significantly increasing cardiovascular and stroke risks."
  },
  "Fasting Blood Sugar": {
    low: "Low FBS (Hypoglycemia) causes shakiness, confusion, and sweating; caused by excessive insulin, starvation, or liver disease.",
    high: "High FBS (Hyperglycemia) indicates pre-diabetes, Diabetes Mellitus, insulin resistance, or endocrine disorders."
  },
  "HbA1c": {
    low: "Low HbA1c can occur in severe anemia or red blood cell lifespan disorders.",
    high: "High HbA1c (Pre-diabetes >= 5.7%, Diabetes >= 6.5%) indicates chronic poor blood glucose control over past 3 months."
  },
  "TSH": {
    low: "Low TSH indicates Hyperthyroidism (overactive thyroid), causing weight loss, rapid heartbeat, and anxiety.",
    high: "High TSH indicates Hypothyroidism (underactive thyroid), causing fatigue, weight gain, depression, and cold sensitivity."
  }
};

const getClinicalInterpretation = (paramName, status) => {
  if (!status || status === "Normal") return null;
  const cleanName = paramName.toLowerCase();
  for (const [key, value] of Object.entries(CLINICAL_INTERPRETATION)) {
    if (cleanName.includes(key.toLowerCase())) {
      return status === "High" ? value.high : value.low;
    }
  }
  return null;
};

const ReportsPage = () => {
  const { patientId } = useParams();

  const [reports, setReports] =
    useState([]);

  const [editingReportId, setEditingReportId] =
    useState(null);

  const [printingIndex, setPrintingIndex] =
    useState(null);

  const [availableTests, setAvailableTests] = useState([]);
  const [showAddTestsModal, setShowAddTestsModal] = useState(false);
  const [selectedReportForAdding, setSelectedReportForAdding] = useState(null);
  const [addTestSearch, setAddTestSearch] = useState("");
  const [newSelectedTests, setNewSelectedTests] = useState([]);

  const reportRefs = [];

  const fetchReports = async () => {
    try {
      const userInfo = JSON.parse(
        localStorage.getItem("userInfo")
      );

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await api.get(
        `/reports/${patientId}`,
        config
      );

      setReports(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTests = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await api.get("/tests", config);
      setAvailableTests(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchReports();
    fetchTests();
  }, []);

  const appendSelectedTests = () => {
    if (newSelectedTests.length === 0) return;

    const updatedReports = reports.map((report) => {
      if (report._id !== selectedReportForAdding) return report;

      const preparedNewTests = newSelectedTests.map((test) => {
        const testParameters = test.parameters && test.parameters.length > 0
          ? test.parameters
          : [
              {
                parameterName: test.testName,
                unit: "",
                normalRangeMale: "",
                normalRangeFemale: "",
                normalRangeChild: "",
              }
            ];

        return {
          ...test,
          parameters: testParameters,
          results: testParameters.map((parameter) => ({
            parameterName: parameter.parameterName,
            value: "",
          })),
        };
      });

      return {
        ...report,
        tests: [...(report.tests || []), ...preparedNewTests],
      };
    });

    setReports(updatedReports);
    setShowAddTestsModal(false);
    setNewSelectedTests([]);
    setAddTestSearch("");
  };

  const updateResult = (
    reportIndex,
    testIndex,
    value,
    parameterName
  ) => {
    const updatedReports = [...reports];
    const currentTest = updatedReports[reportIndex].tests[testIndex];

    if (typeof currentTest === "string") {
      updatedReports[reportIndex].tests[testIndex] = {
        name: currentTest,
        result: value,
      };
    } else if (parameterName) {
      const updatedResults = currentTest.results?.map((r) => {
        if (r.parameterName !== parameterName) return r;
        return { ...r, value };
      }) || [];

      updatedReports[reportIndex].tests[testIndex] = {
        ...currentTest,
        results: updatedResults,
      };
    } else {
      updatedReports[reportIndex].tests[testIndex] = {
        ...currentTest,
        result: value,
      };
    }

    setReports(updatedReports);
  };

  const getNormalRange = (patient, parameter) => {
    const ageVal = parseInt(patient.age, 10);
    if (!isNaN(ageVal) && ageVal < 12 && parameter.normalRangeChild) {
      return `${parameter.normalRangeChild} (Child)`;
    }
    if (patient.gender === "Female" && parameter.normalRangeFemale) {
      return `${parameter.normalRangeFemale} (Female)`;
    }
    if (parameter.normalRangeMale) {
      return `${parameter.normalRangeMale} (Male)`;
    }
    return "N/A";
  };

  const checkRangeStatus = (patient, parameter, value) => {
    if (!value || isNaN(value)) return null;
    const numValue = parseFloat(value);
    
    const rangeText = getNormalRange(patient, parameter);
    const rangeStr = rangeText.split(" ")[0]; 
    
    if (!rangeStr || !rangeStr.includes("-")) return null;
    
    const [minStr, maxStr] = rangeStr.split("-");
    const minVal = parseFloat(minStr);
    const maxVal = parseFloat(maxStr);
    
    if (isNaN(minVal) || isNaN(maxVal)) return null;
    
    if (numValue < minVal) return "Low";
    if (numValue > maxVal) return "High";
    return "Normal";
  };

  const saveReport = async (
    reportId,
    tests
  ) => {
    try {
      const userInfo = JSON.parse(
        localStorage.getItem("userInfo")
      );

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await api.put(
        `/reports/update/${reportId}`,
        { tests },
        config
      );

      alert("Report Saved");

      fetchReports();
    } catch (error) {
      console.log(error);
    }
  };

  const generatePDF = (index) => {
    const report = reports[index];
    if (!report) return null;

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Premium Modern Clinical Color Palette
    const primaryColor = [15, 32, 67]; // Deep Navy `#0F2043`
    const accentColor = [13, 148, 136]; // Professional Teal `#0D9488`
    const darkGray = [71, 85, 105]; // Slate `#475569`
    const lightGray = [226, 232, 240]; // Light Slate `#E2E8F0`
    const textBlack = [30, 41, 59]; // Slate 800 `#1E293B`

    let currentPage = 1;

    const drawHeader = () => {
      // 1. Double accent bar at the very top (navy & teal)
      pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.rect(0, 0, pageWidth, 4, "F");
      pdf.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
      pdf.rect(0, 4, pageWidth, 1, "F");

      // 2. Real Brand Logo on the top left (enlarged to 26x26mm with 1.5mm padding top & bottom to never interfere with the green line)
      const logoImg = document.getElementById(`logo-img-${report._id}`);
      if (logoImg) {
        try {
          pdf.addImage(logoImg, "JPEG", 15, 6.5, 26, 26);
        } catch (e) {
          console.log("Error rendering logo image in PDF: ", e);
          pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
          pdf.circle(28, 19.5, 4.5, "F");
        }
      } else {
        pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.circle(28, 19.5, 4.5, "F");
      }

      // 3. Left Brand Title & Tagline (Shifted right to X=45 and centered vertically at Y=17.5 & Y=22.5)
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14.5);
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.text("GOUSIA CLINICAL LABORATORY", 45, 17.5);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(7.5);
      pdf.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
      pdf.text("ADVANCED DIAGNOSTIC & ACCURACY", 45, 22.5);

      // 4. Right Contact & License details (Asymmetrical modern layout, perfectly centered vertically next to logo)
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7.5);
      pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      pdf.text("Hajan, Bandipora, Srinagar", pageWidth - 15, 17.5, { align: "right" });
      pdf.text("Phone: +91 7006318084", pageWidth - 15, 21.5, { align: "right" });
      
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
      pdf.text("Regd No: PRO/CMO Bandipora-0100900072", pageWidth - 15, 25.5, { align: "right" });

      // 5. Sleek Thin Divider line under header (Shifted down to Y=34 to clear the logo)
      pdf.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
      pdf.setLineWidth(0.2);
      pdf.line(15, 34, pageWidth - 15, 34);
    };

    const drawPatientInfo = () => {
      // 6. Sleek Dashboard-style patient card with Left Teal Accent tab (Shifted down to Y=37, height=25)
      pdf.setFillColor(248, 250, 252); // Light slate `#F8FAFC`
      pdf.rect(15, 37, pageWidth - 30, 25, "F");

      pdf.setFillColor(accentColor[0], accentColor[1], accentColor[2]); // Teal accent tab
      pdf.rect(15, 37, 1.8, 25, "F");

      pdf.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
      pdf.setLineWidth(0.2);
      pdf.rect(15, 37, pageWidth - 30, 25);

      pdf.setFontSize(8.5);
      pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);

      // Column 1
      pdf.setFont("helvetica", "bold");
      pdf.text("Patient Name :", 20, 43);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.text(report.patient.name || "N/A", 44, 43);

      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      pdf.text("Age / Gender :", 20, 48.5);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(textBlack[0], textBlack[1], textBlack[2]);
      pdf.text(`${report.patient.age || "N/A"} Y / ${report.patient.gender || "N/A"}`, 44, 48.5);

      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      pdf.text("Referred By  :", 20, 54);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(textBlack[0], textBlack[1], textBlack[2]);
      pdf.text(report.patient.referredBy || "Self", 44, 54);

      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      pdf.text("Contact No   :", 20, 59.5);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(textBlack[0], textBlack[1], textBlack[2]);
      pdf.text(report.patient.phone || "N/A", 44, 59.5);

      // Column 2
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      pdf.text("Lab ID No   :", 110, 43);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.text(report._id ? report._id.toString().substring(18).toUpperCase() : "N/A", 132, 43);

      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      pdf.text("Registered  :", 110, 48.5);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(textBlack[0], textBlack[1], textBlack[2]);
      pdf.text(report.createdAt ? new Date(report.createdAt).toLocaleDateString() : "N/A", 132, 48.5);

      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      pdf.text("Reported    :", 110, 54);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(textBlack[0], textBlack[1], textBlack[2]);
      pdf.text(report.createdAt ? new Date(report.createdAt).toLocaleDateString() : "N/A", 132, 54);

      // Column 3 - Solid white card backed QR Code (Centered beautifully at Y=41)
      pdf.setFillColor(255, 255, 255);
      pdf.rect(pageWidth - 34, 41, 17, 17, "F");

      // Dynamic real QR Code image extraction from the DOM
      const qrImg = document.getElementById(`qr-code-${report._id}`);
      if (qrImg) {
        try {
          pdf.addImage(qrImg, "PNG", pageWidth - 34, 41, 17, 17);
        } catch (e) {
          console.log("Error inserting QR code image: ", e);
          pdf.setFillColor(0, 0, 0);
          pdf.rect(pageWidth - 33, 42, 3.5, 3.5, "F");
          pdf.rect(pageWidth - 22, 42, 3.5, 3.5, "F");
          pdf.rect(pageWidth - 33, 52, 3.5, 3.5, "F");
        }
      } else {
        // Fallback visual mock QR code
        pdf.setFillColor(0, 0, 0);
        pdf.rect(pageWidth - 33, 42, 3.5, 3.5, "F");
        pdf.rect(pageWidth - 22, 42, 3.5, 3.5, "F");
        pdf.rect(pageWidth - 33, 52, 3.5, 3.5, "F");
      }
    };

    const drawFooter = (pageNum) => {
      // Bottom disclaimer box matching the image exactly
      pdf.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
      pdf.setLineWidth(0.3);
      pdf.line(15, pageHeight - 27, pageWidth - 15, pageHeight - 27);
      pdf.line(15, 270, pageWidth - 15, 270); // Bottom boundary line

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7.2);
      pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      const disclaimer = "Required Tests are Conducted With the help of chemical and Analysers. The report should Only be Interpreted by medical Professionals, Who Understand reporting Units, reference range & limitation of technology. Results may vary from lab to lab and some parameters from time to time for the same patient. This report is not meant for medico legal purpose.";
      const lines = pdf.splitTextToSize(disclaimer, pageWidth - 30);
      pdf.text(lines, 15, pageHeight - 22);

      // Page numbers centered at the very bottom
      pdf.setFontSize(8);
      pdf.text(`Page ${pageNum}`, pageWidth / 2, pageHeight - 7, { align: "center" });
    };

    drawHeader();
    drawPatientInfo();
    drawFooter(currentPage);

    let y = 67; // Starting Y coordinate for reports content (shifted down to prevent overlaps)

    report.tests.forEach((test, testIdx) => {
      const isRich = typeof test !== "string" && (test.testName || test.parameters);
      
      let visibleParameters = [];
      if (isRich && test.parameters) {
        visibleParameters = test.parameters.filter(parameter => {
          const resultObj = test.results?.find(
            (r) => r.parameterName === parameter.parameterName
          );
          return resultObj && resultObj.value !== undefined && resultObj.value !== null && String(resultObj.value).trim() !== "";
        });
        
        // Skip rich test completely if all of its parameters are blank in PDF
        if (visibleParameters.length === 0) return;
      } else if (!isRich) {
        const resultValue = typeof test === "string" ? "" : (test.result || "");
        // Skip flat test completely if its result is blank in PDF
        if (String(resultValue).trim() === "") return;
      }

      const testHeight = !isRich ? 15 : 24 + visibleParameters.length * 8.5;

      if (y + testHeight > pageHeight - 32) {
        pdf.addPage();
        currentPage++;
        drawHeader();
        drawPatientInfo();
        drawFooter(currentPage);
        y = 67;
      }

      // 8. Draw Category Heading (e.g. BIOCHEMISTRY)
      const category = (test.category || "BIOCHEMISTRY").toUpperCase();
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
      pdf.text(category, pageWidth / 2, y + 4.5, { align: "center", charSpace: 1.5 });

      y += 6.5;

      // 9. Table column headers background block (Modern Balanced layout)
      pdf.setFillColor(241, 245, 249); 
      pdf.rect(15, y, pageWidth - 30, 7.5, "F");

      pdf.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
      pdf.setLineWidth(0.2);
      pdf.line(15, y, pageWidth - 15, y);
      pdf.line(15, y + 7.5, pageWidth - 15, y + 7.5);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8.5);
      pdf.setTextColor(71, 85, 105); 
      pdf.text("Test Name", 18, y + 5);
      pdf.text("Results", 115, y + 5, { align: "center" });
      pdf.text("Units", 145, y + 5, { align: "center" });
      pdf.text("Reference Interval", 175, y + 5, { align: "center" });

      y += 7.5;

      if (!isRich) {
        // Flat standard single input formatting
        const testName = typeof test === "string" ? test : (test.name || "Test");
        const resultValue = typeof test === "string" ? "" : (test.result || "");

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(9.5);
        pdf.setTextColor(textBlack[0], textBlack[1], textBlack[2]);
        pdf.text(testName.toUpperCase(), 18, y + 5);

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(9.5);
        pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.text(resultValue || "Pending", 115, y + 5, { align: "center" });

        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        pdf.text("-", 145, y + 5, { align: "center" });
        pdf.text("-", 175, y + 5, { align: "center" });

        // Bottom section divider line
        pdf.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
        pdf.setLineWidth(0.2);
        pdf.line(15, y + 8.5, pageWidth - 15, y + 8.5);
        y += 13;
      } else {
        // Rich nested multiple parameters test formatting with a modern left accent tab bar
        pdf.setFillColor(accentColor[0], accentColor[1], accentColor[2]); // Teal accent tab
        pdf.rect(15, y + 1, 1.5, 6, "F");

        pdf.setFillColor(248, 250, 252); // Faint gray bg bar
        pdf.rect(16.5, y + 1, pageWidth - 31.5, 6, "F");

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(9.5);
        pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.text(test.testName.toUpperCase(), 20, y + 5.2);

        y += 7.5;

        visibleParameters.forEach((parameter, paramIdx) => {
          const resultObj = test.results?.find(
            (r) => r.parameterName === parameter.parameterName
          );
          const resultValue = resultObj ? resultObj.value : "";
          const status = checkRangeStatus(report.patient, parameter, resultValue);

          // Paging boundary check inside multi-row parameters
          if (y > pageHeight - 32) {
            pdf.addPage();
            currentPage++;
            drawHeader();
            drawPatientInfo();
            drawFooter(currentPage);
            y = 67;

            // Reprint Header row inside new page with filled background bar style
            pdf.setFillColor(241, 245, 249);
            pdf.rect(15, y, pageWidth - 30, 7.5, "F");

            pdf.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
            pdf.setLineWidth(0.2);
            pdf.line(15, y, pageWidth - 15, y);
            pdf.line(15, y + 7.5, pageWidth - 15, y + 7.5);

            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(8.5);
            pdf.setTextColor(71, 85, 105);
            pdf.text("Test Name (cont.)", 18, y + 5);
            pdf.text("Results", 115, y + 5, { align: "center" });
            pdf.text("Units", 145, y + 5, { align: "center" });
            pdf.text("Reference Interval", 175, y + 5, { align: "center" });
            y += 7.5;
          }

          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(9);
          pdf.setTextColor(textBlack[0], textBlack[1], textBlack[2]);
          pdf.text(parameter.parameterName, 23, y + 4.8); // 5mm visual nested hierarchy

          // Highlight values if abnormal using standard compatible flags
          let observedStr = resultValue || "Pending";
          if (status === "High") {
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(220, 38, 38); // Premium red
            observedStr += "  (H)";
          } else if (status === "Low") {
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(217, 119, 6); // Premium orange/amber
            observedStr += "  (L)";
          } else {
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(30, 41, 59); // Charcoal normal bold
          }

          pdf.text(observedStr, 115, y + 4.8, { align: "center" });

          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
          pdf.text(parameter.unit || "-", 145, y + 4.8, { align: "center" });
          pdf.text(getNormalRange(report.patient, parameter), 175, y + 4.8, { align: "center" });

          // Draw faint row divider line
          pdf.setDrawColor(248, 250, 252);
          pdf.setLineWidth(0.1);
          pdf.line(15, y + 7, pageWidth - 15, y + 7);

          y += 7;
        });

        // Faint bottom section divider
        pdf.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
        pdf.setLineWidth(0.2);
        pdf.line(15, y + 1, pageWidth - 15, y + 1);

        y += 8;
      }
    });

    // Draw Clinical Reference Notes inside PDF
    const abnormalNotes = [];
    report.tests.forEach((test) => {
      if (typeof test !== "string" && test.parameters) {
        test.parameters.forEach((parameter) => {
          const resultObj = test.results?.find(
            (r) => r.parameterName === parameter.parameterName
          );
          const resultValue = resultObj ? resultObj.value : "";
          const status = checkRangeStatus(report.patient, parameter, resultValue);
          if (status && status !== "Normal") {
            const note = getClinicalInterpretation(parameter.parameterName, status);
            if (note) {
              abnormalNotes.push({
                parameter: parameter.parameterName,
                status,
                note
              });
            }
          }
        });
      }
    });

    if (abnormalNotes.length > 0) {
      if (y > pageHeight - 65) {
        pdf.addPage();
        currentPage++;
        drawHeader();
        drawPatientInfo();
        drawFooter(currentPage);
        y = 67;
      }

      pdf.setFillColor(254, 243, 199); // amber 100 bg
      pdf.rect(15, y, pageWidth - 30, 6, "F");
      
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(7.5);
      pdf.setTextColor(146, 64, 14); // amber 800
      pdf.text("CLINICAL INTERPRETATIONS & ABNORMAL VALUE REFERENCE", 18, y + 4.2);
      y += 7.5;

      abnormalNotes.forEach((item) => {
        const noteStr = `${item.parameter} (${item.status.toUpperCase()}): ${item.note}`;
        const lines = pdf.splitTextToSize(noteStr, pageWidth - 30);
        const noteHeight = lines.length * 4.2;

        if (y + noteHeight > pageHeight - 32) {
          pdf.addPage();
          currentPage++;
          drawHeader();
          drawPatientInfo();
          drawFooter(currentPage);
          y = 67;
        }

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(7.5);
        pdf.setTextColor(textBlack[0], textBlack[1], textBlack[2]);
        pdf.text(lines, 15, y + 3.2);

        y += noteHeight + 2;
      });

      y += 3;
    }

    // 10. End of Report and Signature safe boundary check
    if (y > pageHeight - 50) {
      pdf.addPage();
      currentPage++;
      drawHeader();
      drawPatientInfo();
      drawFooter(currentPage);
      y = 67;
    }

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8.5);
    pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    pdf.text("-----------------------------------  End of Report  -----------------------------------", pageWidth / 2, y + 6, { align: "center" });

    // 11. Modern Signature block
    y += 12;

    // Draw the real signature image in the PDF! (Pre-loaded from DOM to bypass async restrictions)
    const sigImg = document.getElementById(`sig-img-${report._id}`);
    if (sigImg) {
      try {
        pdf.addImage(sigImg, "PNG", pageWidth - 48, y, 26, 9.5);
      } catch (e) {
        console.log("Error rendering signature image in PDF: ", e);
        pdf.setFont("helvetica", "italic");
        pdf.setFontSize(9.5);
        pdf.setTextColor(75, 85, 99);
        pdf.text("Sign", pageWidth - 36, y + 8, { align: "center" });
      }
    } else {
      pdf.setFont("helvetica", "italic");
      pdf.setFontSize(9.5);
      pdf.setTextColor(75, 85, 99);
      pdf.text("Sign", pageWidth - 36, y + 8, { align: "center" });
    }

    pdf.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
    pdf.setLineWidth(0.3);
    pdf.line(pageWidth - 55, y + 10, pageWidth - 15, y + 10);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8.5);
    pdf.setTextColor(textBlack[0], textBlack[1], textBlack[2]);
    pdf.text("Lab Technician.", pageWidth - 35, y + 14, { align: "center" });

    return pdf;
  };

  const printReport = (index) => {
    const pdf = generatePDF(index);
    if (!pdf) return;

    const pdfBlob = pdf.output("blob");
    const blobURL = URL.createObjectURL(pdfBlob);

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.width = "0px";
    iframe.style.height = "0px";
    iframe.style.border = "none";
    iframe.src = pdf.output("bloburi"); // Safe loaded bloburi for direct window print

    document.body.appendChild(iframe);

    iframe.onload = () => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    };
  };

  const downloadPDF = (index, patientName) => {
    const pdf = generatePDF(index);
    if (!pdf) return;
    pdf.save(`${patientName.replace(/\s+/g, "_")}_Laboratory_Report.pdf`);
  };

  const shareWhatsApp = async (phone, patientId, patientName = "Valued Patient", index) => {
    const pdf = generatePDF(index);
    if (!pdf) {
      alert("Failed to generate PDF for sharing.");
      return;
    }

    const pdfBlob = pdf.output("blob");
    const fileName = `${patientName.replace(/\s+/g, "_")}_Laboratory_Report.pdf`;
    const pdfFile = new File([pdfBlob], fileName, { type: "application/pdf" });

    // Try using Web Share API if supported (native file attachments on mobile / modern desktop)
    if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
      try {
        await navigator.share({
          files: [pdfFile],
          title: `${patientName} Laboratory Report`,
          text: `Please find the clinical laboratory report for ${patientName} from Gousia Diagnostics.`,
        });
        return;
      } catch (err) {
        console.log("Web Share failed, falling back: ", err);
      }
    }

    // Fallback: WhatsApp Web link sharing
    const reportLink = `${window.location.origin}/reports/${patientId}`;
    const message = encodeURIComponent(
      `Hello ${patientName},\n\nYour clinical laboratory report from *Gousia Diagnostics* is ready.\n\nYou can view and download your complete PDF report directly by clicking the link below:\n👉 ${reportLink}\n\nThank you for choosing Gousia Diagnostics.\nAccurate Results, Better Health. 🔬`
    );

    window.open(
      `https://wa.me/91${phone}?text=${message}`,
      "_blank"
    );
  };

  return (
    <div className="space-y-10">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-report, .printable-report * {
            visibility: visible;
          }
          .printable-report {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .print-actions {
            display: none !important;
          }
        }
      ` }} />
      {reports.map(
        (report, reportIndex) => (
          <div
            key={report._id}
            ref={(el) =>
              (reportRefs[reportIndex] = el)
            }
            className={`bg-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl p-4 sm:p-6 md:p-10 max-w-5xl mx-auto border border-slate-100 overflow-hidden relative ${
              printingIndex === reportIndex ? "printable-report" : ""
            }`}
          >
            {/* Top Branding Header Ribbon */}
            <div className="w-full flex h-2 rounded-full overflow-hidden mb-8">
              <div className="w-2/3 bg-slate-900"></div>
              <div className="w-1/3 bg-teal-600"></div>
            </div>

            {/* HEADER */}
            <div className="border-b-2 border-double pb-6 mb-6 relative flex flex-col md:flex-row items-center justify-between gap-4 min-h-[140px] text-center md:text-left">
              {/* Logo on the far left (enlarged to w-36 h-36 for magnificent readability and impact) */}
              <div className="flex items-center justify-center md:justify-start shrink-0 pt-3">
                <img
                  id={`logo-img-${report._id}`}
                  src="/logo.jpg"
                  alt="Gousia Clinical Laboratory Logo"
                  className="w-24 h-24 md:w-36 md:h-36 object-cover rounded-full shadow-lg ring-4 ring-teal-500/10 border-4 border-white transition-all duration-300 ease-out shrink-0"
                  crossOrigin="anonymous"
                />
              </div>

              {/* Lab title and Address in center */}
              <div className="flex-1 px-4">
                <h1 className="text-xl md:text-3xl font-extrabold text-slate-900 tracking-wider uppercase leading-tight">
                  GOUSIA CLINICAL LABORATORY
                </h1>
                <p className="text-[10px] md:text-xs font-bold text-teal-600 mt-2 md:mt-2.5 uppercase tracking-[0.15em] md:tracking-[0.2em]">
                  ADVANCED DIAGNOSTIC & ACCURACY
                </p>
                <p className="text-[9px] md:text-[10.5px] font-semibold text-slate-500 mt-1.5 md:mt-2 uppercase tracking-widest">
                  Add-Hajan bandipora Contact-7006318084
                </p>
              </div>

              {/* Regd No on the far right */}
              <div className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center md:text-right self-center leading-normal">
                Regd No :- PRO/CMO Bandipora- 0100900072
              </div>
            </div>

            {/* PATIENT INFO BOX WITH CENTERED "REPORT" BADGE */}
            <div 
              className="relative p-6 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-teal-50/10 border border-slate-200/80 mt-8 mb-8 shadow-md shadow-slate-100/50 flex flex-col gap-4 overflow-hidden"
              style={{ borderLeft: "5px solid #0D9488" }}
            >
              {/* Centered "Report" badge resting exactly on the top border line */}
              <div className="absolute -top-3 left-8 bg-teal-50 text-teal-700 rounded-full px-4 py-0.5 text-[9.5px] font-black tracking-widest uppercase shadow-sm border border-teal-200">
                Patient Diagnostic File
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* Column 1 - Perfectly aligned values */}
                <div className="space-y-2.5 text-xs md:text-[13px] text-gray-855">
                  <div className="flex items-center">
                    <span className="font-bold text-slate-400 w-24 shrink-0 uppercase tracking-wider text-[10px] md:text-[11px]">Name:</span>
                    <span className="font-extrabold text-slate-900 text-sm">{report.patient.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold text-slate-400 w-24 shrink-0 uppercase tracking-wider text-[10px] md:text-[11px]">Age / Sex:</span>
                    <span className="font-semibold text-slate-800">{report.patient.age} Years | {report.patient.gender}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold text-slate-400 w-24 shrink-0 uppercase tracking-wider text-[10px] md:text-[11px]">Contact:</span>
                    <span className="font-mono font-medium text-slate-800">{report.patient.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold text-slate-400 w-24 shrink-0 uppercase tracking-wider text-[10px] md:text-[11px]">Physician:</span>
                    <span className="font-semibold text-teal-800 bg-teal-50/50 px-2.5 py-0.5 rounded-md border border-teal-100/50">{report.patient.referredBy || "Self"}</span>
                  </div>
                </div>

                {/* Column 2 - Perfectly aligned values */}
                <div className="space-y-2.5 text-xs md:text-[13px] text-gray-855">
                  <div className="flex items-center">
                    <span className="font-bold text-slate-400 w-24 md:w-28 shrink-0 uppercase tracking-wider text-[10px] md:text-[11px]">Lab ID No:</span>
                    <span className="font-mono font-extrabold text-teal-700 bg-teal-50/30 px-2 py-0.5 rounded border border-teal-100/40">#{report._id.toString().substring(18).toUpperCase()}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold text-slate-400 w-24 md:w-28 shrink-0 uppercase tracking-wider text-[10px] md:text-[11px]">Registered:</span>
                    <span className="font-semibold text-slate-850">{new Date(report.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold text-slate-400 w-24 md:w-28 shrink-0 uppercase tracking-wider text-[10px] md:text-[11px]">Reported:</span>
                    <span className="font-semibold text-slate-850">{new Date(report.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                  </div>
                </div>

                {/* Real Dynamic QR Code Column */}
                <div className="flex justify-center md:justify-end items-center pr-2">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="border border-teal-100 p-2.5 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
                      <img
                        id={`qr-code-${report._id}`}
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(window.location.origin + `/reports/${patientId}`)}`}
                        alt="Digital Report QR Code"
                        style={{ width: "112px", height: "112px" }}
                        crossOrigin="anonymous"
                      />
                    </div>
                    <span className="text-[10px] font-black text-teal-700 tracking-widest uppercase">Verify Security</span>
                  </div>
                </div>
              </div>
            </div>

            {/* REPORT TABLE */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-md shadow-slate-100 bg-white my-8">
              <table className="w-full border-collapse min-w-[650px]">
                <thead className="bg-slate-900 border-b border-slate-200 text-white text-[11px] font-extrabold uppercase tracking-widest">
                  <tr>
                    <th className="p-4.5 text-left w-1/3">
                      Test Investigation
                    </th>
                    <th className="p-4.5 text-center w-1/3">
                      Observed Value
                    </th>
                    <th className="p-4.5 text-center w-1/6">
                      Units
                    </th>
                    <th className="p-4.5 text-center w-1/6">
                      Normal Reference Interval
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {report.tests.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-12 text-center text-slate-400 text-sm italic bg-slate-50/50">
                        No diagnostic tests selected for this patient visit yet. Click "Edit Results" to add tests.
                      </td>
                    </tr>
                  )}
                  {report.tests.map((test, testIndex) => {
                    const isRich = typeof test !== "string" && (test.testName || test.parameters);
                    const isEditing = editingReportId === report._id;

                    // In view mode, omit entire test card if all parameters or results are blank
                    if (!isEditing) {
                      if (isRich) {
                        const hasValues = test.parameters?.some(parameter => {
                          const rObj = test.results?.find(r => r.parameterName === parameter.parameterName);
                          return rObj && rObj.value !== undefined && rObj.value !== null && String(rObj.value).trim() !== "";
                        });
                        if (!hasValues) return null;
                      } else {
                        const resultValue = typeof test === "string" ? "" : (test.result || "");
                        if (String(resultValue).trim() === "") return null;
                      }
                    }

                    if (!isRich) {
                      const testName = typeof test === "string" ? test : (test.name || "Test");
                      const resultValue = typeof test === "string" ? "" : (test.result || "");
                      
                      return (
                        <tr key={testIndex} className="border-b text-sm text-gray-700 hover:bg-slate-50/50 transition-colors duration-150">
                          <td className="p-4.5 font-bold text-slate-800">
                            {testName}
                          </td>
                          <td className="p-4.5 text-center">
                            {isEditing ? (
                              <input
                                type="text"
                                placeholder="Enter Result"
                                value={resultValue}
                                onChange={(e) =>
                                  updateResult(
                                    reportIndex,
                                    testIndex,
                                    e.target.value
                                  )
                                }
                                className="border border-slate-200 p-2 rounded-xl w-full outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-100 transition-all text-sm bg-white text-center"
                              />
                            ) : (
                              <span className="font-bold text-slate-900 text-sm text-center block">
                                {resultValue || <span className="text-slate-400 italic font-normal text-center">Pending</span>}
                              </span>
                            )}
                          </td>
                          <td className="p-4.5 text-center">
                            {isEditing ? (
                              <div className="flex items-center justify-center gap-1">
                                <span className="text-slate-400 font-bold text-xs">₹</span>
                                <input
                                  type="number"
                                  value={test.price || 0}
                                  onChange={(e) => {
                                    const val = Number(e.target.value) || 0;
                                    const updatedReports = [...reports];
                                    updatedReports[reportIndex].tests[testIndex] = {
                                      ...test,
                                      price: val
                                    };
                                    setReports(updatedReports);
                                  }}
                                  className="border border-slate-200 p-1.5 rounded-lg w-20 outline-none focus:border-teal-500 text-center font-bold text-xs bg-white text-slate-805 text-slate-800"
                                />
                              </div>
                            ) : (
                              <span className="text-xs font-bold text-slate-500">₹{test.price || 0}</span>
                            )}
                          </td>
                          <td className="p-4.5 text-xs font-semibold text-slate-400 text-center">
                            -
                          </td>
                        </tr>
                      );
                    }

                    // Rich format - multiple parameters
                    return (
                      <React.Fragment key={testIndex}>
                        {/* Test Group Header Row */}
                        <tr className="bg-gradient-to-r from-teal-50/60 via-teal-50/10 to-transparent border-l-4 border-teal-600 border-b border-slate-100/85">
                            <td colSpan="4" className="p-4 font-extrabold text-teal-950 text-base">
                              <div className="flex justify-between items-center w-full">
                                <span className="flex items-center gap-2.5">
                                  🧪 {test.testName}
                                  <span className="text-[9.5px] bg-teal-600 text-white px-3 py-0.5 rounded-full uppercase tracking-wider font-extrabold shadow-sm border border-teal-700">
                                    {test.specimen || "Blood"}
                                  </span>
                                </span>
                                {/* Price Edit Area */}
                                <div className="flex items-center gap-2 pr-4">
                                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Price:</span>
                                  {isEditing ? (
                                    <div className="flex items-center gap-1">
                                      <span className="text-slate-400 font-bold text-xs">₹</span>
                                      <input
                                        type="number"
                                        value={test.price || 0}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) => {
                                          const val = Number(e.target.value) || 0;
                                          const updatedReports = [...reports];
                                          updatedReports[reportIndex].tests[testIndex] = {
                                            ...test,
                                            price: val
                                          };
                                          setReports(updatedReports);
                                        }}
                                        className="w-20 border border-teal-200 p-1 rounded-lg outline-none focus:border-teal-500 text-xs bg-white text-center font-extrabold text-teal-950 shadow-sm"
                                      />
                                    </div>
                                  ) : (
                                    <span className="text-xs font-extrabold text-teal-950 bg-teal-50/60 px-2.5 py-0.5 rounded-lg border border-teal-100/60">
                                      ₹{test.price || 0}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                        </tr>

                        {test.parameters?.map((parameter, paramIdx) => {
                          const resultObj = test.results?.find(
                            (r) => r.parameterName === parameter.parameterName
                          );
                          const resultValue = resultObj ? resultObj.value : "";
                          
                          // In view-only mode, skip individual parameter row if it is blank
                          if (!isEditing && (resultValue === undefined || resultValue === null || String(resultValue).trim() === "")) {
                            return null;
                          }
                          
                          const status = checkRangeStatus(report.patient, parameter, resultValue);
                          
                          return (
                            <tr
                              key={`${testIndex}-${paramIdx}`}
                              className="border-b border-slate-100 hover:bg-slate-50/40 transition-colors duration-150 text-sm text-slate-700"
                            >
                              <td className="p-4 pl-8 font-medium text-slate-800">
                                {parameter.parameterName}
                              </td>

                              <td className="p-4 text-center">
                                {isEditing ? (
                                  <input
                                    type="text"
                                    placeholder="Enter result..."
                                    value={resultValue}
                                    onChange={(e) =>
                                      updateResult(
                                        reportIndex,
                                        testIndex,
                                        e.target.value,
                                        parameter.parameterName
                                      )
                                    }
                                    className="border border-slate-200 p-2 rounded-xl w-full outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-100 transition-all text-sm bg-white"
                                  />
                                ) : (
                                  <span className="block text-center">
                                    <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold rounded-full transition-transform duration-200 hover:scale-105 ${
                                      status === "High" 
                                        ? "bg-rose-50 border border-rose-200 text-rose-700 animate-pulse shadow-sm shadow-rose-100/50" 
                                        : status === "Low" 
                                        ? "bg-amber-50 border border-amber-200 text-amber-700 shadow-sm shadow-amber-100/50" 
                                        : "bg-slate-55 bg-teal-50/40 text-slate-800 border border-teal-100/50"
                                    }`}>
                                      {status === "High" && <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>}
                                      {status === "Low" && <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>}
                                      {status === "Normal" && <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>}
                                      {resultValue || <span className="text-slate-400 font-normal italic">Pending</span>}
                                      {status === "High" && " (H)"}
                                      {status === "Low" && " (L)"}
                                    </span>
                                  </span>
                                )}
                              </td>

                              <td className="p-4 text-center font-mono text-xs text-slate-500">
                                {parameter.unit || "-"}
                              </td>

                              <td className="p-4 text-center text-xs font-bold text-slate-600">
                                {getNormalRange(report.patient, parameter)}
                              </td>
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* If editing and wants to append more tests */}
            {editingReportId === report._id && (
              <div className="flex justify-center mt-6 mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedReportForAdding(report._id);
                    setShowAddTestsModal(true);
                  }}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5 shadow-md shadow-teal-600/10 transition-all duration-200"
                >
                  ➕ Add Tests to Report
                </button>
              </div>
            )}

            {/* CLINICAL CORRELATIONS & REFERENCE NOTES */}
            {(() => {
              const abnormalNotes = [];
              report.tests.forEach((test) => {
                if (typeof test !== "string" && test.parameters) {
                  test.parameters.forEach((parameter) => {
                    const resultObj = test.results?.find(
                      (r) => r.parameterName === parameter.parameterName
                    );
                    const resultValue = resultObj ? resultObj.value : "";
                    const status = checkRangeStatus(report.patient, parameter, resultValue);
                    if (status && status !== "Normal") {
                      const note = getClinicalInterpretation(parameter.parameterName, status);
                      if (note) {
                        abnormalNotes.push({
                          parameter: parameter.parameterName,
                          status,
                          note
                        });
                      }
                    }
                  });
                }
              });

              if (abnormalNotes.length === 0) return null;

              return (
                <div className="mt-8 border border-amber-200/80 bg-gradient-to-br from-amber-50/30 via-amber-50/10 to-transparent rounded-2xl p-6 shadow-sm shadow-amber-100/30">
                  <h4 className="text-xs font-extrabold text-amber-800 uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
                    💡 Clinical Interpretation & Abnormal Value Reference Notes
                  </h4>
                  <div className="space-y-3.5">
                    {abnormalNotes.map((item, idx) => (
                      <div key={idx} className="text-xs text-slate-700 leading-relaxed border-b border-dashed border-amber-100 last:border-b-0 pb-3 last:pb-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-slate-900">{item.parameter}</span>
                          <span className={`inline-block text-[8.5px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm ${
                            item.status === "High" ? "bg-rose-100 text-rose-850" : "bg-amber-100 text-amber-850"
                          }`}>
                            {item.status.toUpperCase()} VALUE
                          </span>
                        </div>
                        <p className="mt-1.5 text-slate-600 font-medium text-[12px]">{item.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* FOOTER */}
            <div className="mt-12 flex justify-between items-end border-t pt-6 border-slate-100">
              <div className="flex-1 max-w-xl text-[10px] text-slate-400 font-medium leading-relaxed">
                <p>Required Tests are Conducted With the help of chemical and Analysers. The report should Only be Interpreted by medical Professionals, Who Understand reporting Units, reference range & limitation of technology. Results may vary from lab to lab and some parameters from time to time for the same patient. This report is not meant for medico legal purpose.</p>
                <div className="text-[11px] font-extrabold text-slate-400 mt-4 text-center tracking-[0.25em] border-t pt-3 border-dashed border-slate-100 uppercase">
                  ****End of Report****
                </div>
              </div>
              
              <div className="text-right pl-10 shrink-0 relative flex flex-col items-end">
                {/* Real Signature Image preloaded inside mix-blend-multiply container for beautiful blending */}
                <div className="h-12 w-32 flex justify-end items-center mb-1 overflow-hidden relative mr-2">
                  <img
                    id={`sig-img-${report._id}`}
                    src="/signature.png"
                    alt="Lab Technician Signature"
                    className="max-h-full max-w-full object-contain filter contrast-125 mix-blend-multiply"
                    crossOrigin="anonymous"
                  />
                </div>
                <p className="font-extrabold text-slate-900 border-t pt-1.5 border-slate-200 text-sm tracking-wide w-40 text-center">Lab Technician.</p>
              </div>
            </div>

            {/* BUTTONS PANEL */}
            <div className="mt-8 flex flex-col sm:flex-row flex-wrap justify-end gap-3 print-actions border-t pt-6 border-slate-100">
              {editingReportId === report._id ? (
                <>
                  <button
                    onClick={() => {
                      saveReport(report._id, report.tests);
                      setEditingReportId(null);
                    }}
                    className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition font-semibold shadow-md shadow-blue-600/10 w-full sm:w-auto text-center"
                  >
                    Save Report
                  </button>
                  <button
                    onClick={() => setEditingReportId(null)}
                    className="bg-gray-100 text-gray-700 px-5 py-3 rounded-xl hover:bg-gray-200 transition font-semibold border border-slate-200 w-full sm:w-auto text-center"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setEditingReportId(report._id)}
                    className="bg-indigo-600 text-white px-5 py-3 rounded-xl hover:bg-indigo-700 transition font-semibold shadow-md shadow-indigo-600/10 w-full sm:w-auto text-center"
                  >
                    Edit Results
                  </button>

                  <button
                    onClick={() => printReport(reportIndex)}
                    className="bg-teal-600 text-white px-5 py-3 rounded-xl hover:bg-teal-700 transition font-semibold shadow-md shadow-teal-600/10 w-full sm:w-auto text-center"
                  >
                    Print
                  </button>

                  <button
                    onClick={() => shareWhatsApp(report.patient.phone, report.patient?._id, report.patient?.name, reportIndex)}
                    className="bg-emerald-500 text-white px-5 py-3 rounded-xl hover:bg-emerald-600 transition font-semibold shadow-md shadow-emerald-500/10 w-full sm:w-auto text-center"
                  >
                    WhatsApp
                  </button>

                  <button
                    onClick={() => downloadPDF(reportIndex, report.patient.name)}
                    className="bg-rose-500 text-white px-5 py-3 rounded-xl hover:bg-rose-600 transition font-semibold shadow-md shadow-rose-500/10 w-full sm:w-auto text-center"
                  >
                    Download PDF
                  </button>
                </>
              )}
            </div>
          </div>
        )
      )}

      {/* ── ADD TESTS MODAL ── */}
      {showAddTestsModal && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(15, 32, 67, 0.4)",
          backdropFilter: "blur(5px)",
          display: "flex", alignItems: "center",
          justifyContent: "center",
          zIndex: 999
        }}>
          <div style={{
            background: "#fff",
            borderRadius: "20px",
            width: "100%", maxWidth: "550px",
            border: "1.5px solid #cbd5e1",
            boxShadow: "0 15px 50px rgba(15,32,67,0.25)",
            overflow: "hidden",
            display: "flex", flexDirection: "column",
            maxHeight: "80vh"
          }}>
            {/* Modal Header */}
            <div style={{
              background: "linear-gradient(135deg, #0F2043, #0D9488)",
              padding: "16px 24px", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
              <h3 style={{ margin: 0, fontWeight: 700, fontSize: "16.5px" }}>
                🧪 Add Diagnostic Tests to Patient Report
              </h3>
              <button
                onClick={() => {
                  setShowAddTestsModal(false);
                  setNewSelectedTests([]);
                }}
                style={{
                  background: "transparent", border: "none", color: "#fff",
                  fontSize: "24px", cursor: "pointer", display: "flex", alignItems: "center"
                }}
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px", overflowY: "auto" }}>
              <input
                type="text"
                placeholder="Search tests catalog..."
                value={addTestSearch}
                onChange={(e) => setAddTestSearch(e.target.value)}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: "12px",
                  border: "1.5px solid #cbd5e1", outline: "none", fontSize: "14px"
                }}
              />

              {/* Selected List */}
              {newSelectedTests.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", background: "#f8fafc", padding: "10px", borderRadius: "12px", border: "1px dashed #cbd5e1" }}>
                  {newSelectedTests.map((t) => (
                    <span
                      key={t._id}
                      style={{
                        background: "#e0f2fe", color: "#0369a1", fontSize: "12px",
                        fontWeight: 700, padding: "4px 12px", borderRadius: "20px",
                        display: "flex", alignItems: "center", gap: "8px"
                      }}
                    >
                      <span>{t.testName}</span>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "2px", background: "#fff", border: "1px solid #bae6fd", borderRadius: "8px", padding: "2px 6px" }}>
                        <span style={{ color: "#0284c7", fontSize: "10px", fontWeight: "bold" }}>₹</span>
                        <input
                          type="number"
                          value={t.price || 0}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 0;
                            setNewSelectedTests(newSelectedTests.map(item => 
                              item._id === t._id ? { ...item, price: val } : item
                            ));
                          }}
                          style={{ width: "50px", border: "none", outline: "none", fontSize: "10px", fontWeight: "bold", textAlign: "right", color: "#0369a1", background: "transparent" }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setNewSelectedTests(newSelectedTests.filter(item => item._id !== t._id))}
                        style={{ border: "none", background: "transparent", color: "#0284c7", fontWeight: "bold", cursor: "pointer", fontSize: "14px" }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Selection Catalog List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "40vh", overflowY: "auto" }}>
                {availableTests.filter(t => t.testName.toLowerCase().includes(addTestSearch.toLowerCase())).map((test) => {
                  const isSelected = newSelectedTests.some(item => item._id === test._id);
                  return (
                    <div
                      key={test._id}
                      onClick={() => {
                        if (isSelected) {
                          setNewSelectedTests(newSelectedTests.filter(item => item._id !== test._id));
                        } else {
                          setNewSelectedTests([...newSelectedTests, test]);
                        }
                      }}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "10px 14px", borderRadius: "10px", border: "1px solid #e2e8f0",
                        background: isSelected ? "#f0fdf4" : "#fff",
                        borderColor: isSelected ? "#bbf7d0" : "#e2e8f0",
                        cursor: "pointer", transition: "all 0.15s"
                      }}
                    >
                      <div>
                        <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "#0F2043" }}>{test.testName}</p>
                        <p style={{ margin: "2px 0 0", fontSize: "10.5px", color: "#64748b" }}>🧪 {test.category || "General"} | ₹{test.price}</p>
                      </div>
                      <span style={{
                        fontSize: "11px", fontWeight: 700,
                        color: isSelected ? "#15803d" : "#64748b",
                        background: isSelected ? "#dcfce7" : "#f1f5f9",
                        padding: "3px 8px", borderRadius: "6px"
                      }}>
                        {isSelected ? "Selected ✓" : "Select"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: "16px 24px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end", gap: "10px", background: "#f8fafc" }}>
              <button
                onClick={() => {
                  setShowAddTestsModal(false);
                  setNewSelectedTests([]);
                }}
                style={{
                  background: "#fff", border: "1.5px solid #cbd5e1", color: "#475569",
                  padding: "8px 16px", borderRadius: "10px", fontSize: "13px", fontWeight: 600, cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button
                onClick={appendSelectedTests}
                disabled={newSelectedTests.length === 0}
                style={{
                  background: "linear-gradient(135deg, #0F2043, #0D9488)",
                  color: "#fff", border: "none", padding: "8px 20px", borderRadius: "10px",
                  fontSize: "13px", fontWeight: 700, cursor: "pointer",
                  opacity: newSelectedTests.length === 0 ? 0.6 : 1
                }}
              >
                Add Selected Tests ({newSelectedTests.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;