import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { FaFlask, FaSearch, FaUserPlus, FaHistory, FaCheck, FaTimes, FaSlidersH, FaFileAlt } from "react-icons/fa";

const LabEntryPage = () => {
  const navigate = useNavigate();

  const [selectedTests, setSelectedTests] = useState([]);
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [visiblePatientsCount, setVisiblePatientsCount] = useState(30);

  useEffect(() => {
    setVisiblePatientsCount(30);
  }, [search]);

  const [availableTests, setAvailableTests] = useState([]);
  const [testSearch, setTestSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [priceSearch, setPriceSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    age: "",
    gender: "",
    address: "",
    referredBy: "",
  });

  const changeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleTest = (test) => {
    const exists = selectedTests.find((item) => item._id === test._id);

    if (exists) {
      setSelectedTests(selectedTests.filter((item) => item._id !== test._id));
    } else {
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

      setSelectedTests([
        ...selectedTests,
        {
          ...test,
          parameters: testParameters,
          results: testParameters.map((parameter) => ({
            parameterName: parameter.parameterName,
            value: "",
          })),
        },
      ]);
    }
  };

  const handleResultChange = (testId, parameterName, val) => {
    setSelectedTests((prevTests) =>
      prevTests.map((t) => {
        if (t._id !== testId) return t;
        return {
          ...t,
          results: t.results.map((r) => {
            if (r.parameterName !== parameterName) return r;
            return { ...r, value: val };
          }),
        };
      })
    );
  };

  const getNormalRange = (parameter) => {
    const ageVal = parseInt(formData.age, 10);
    if (!isNaN(ageVal) && ageVal < 12 && parameter.normalRangeChild) {
      return `${parameter.normalRangeChild} (Child)`;
    }
    if (formData.gender === "Female" && parameter.normalRangeFemale) {
      return `${parameter.normalRangeFemale} (Female)`;
    }
    if (parameter.normalRangeMale) {
      return `${parameter.normalRangeMale} (Male)`;
    }
    return "N/A";
  };

  const checkRangeStatus = (parameter, value) => {
    if (!value) return null;
    const match = String(value).match(/[0-9]*\.?[0-9]+/);
    if (!match) return null;
    const numValue = parseFloat(match[0]);
    if (isNaN(numValue)) return null;
    
    const rangeText = getNormalRange(parameter);
    const rangePart = rangeText.split("(")[0].trim();
    const rangeStr = rangePart.replace(/\s+/g, "");
    
    if (!rangeStr) return null;

    if (rangeStr.includes("-")) {
      const [minStr, maxStr] = rangeStr.split("-");
      const minVal = parseFloat(minStr);
      const maxVal = parseFloat(maxStr);
      
      if (!isNaN(minVal) && !isNaN(maxVal)) {
        if (numValue < minVal) {
          return { status: "Low", color: "border-amber-350 text-amber-700 bg-amber-50/60" };
        }
        if (numValue > maxVal) {
          return { status: "High", color: "border-rose-350 text-rose-700 bg-rose-50/60" };
        }
        return { status: "Normal", color: "border-emerald-350 text-emerald-700 bg-emerald-50/60" };
      }
    }

    if (rangeStr.includes("<=")) {
      const maxVal = parseFloat(rangeStr.replace("<=", ""));
      if (!isNaN(maxVal)) {
        return numValue > maxVal 
          ? { status: "High", color: "border-rose-350 text-rose-700 bg-rose-50/60" } 
          : { status: "Normal", color: "border-emerald-350 text-emerald-700 bg-emerald-50/60" };
      }
    } else if (rangeStr.includes("<")) {
      const maxVal = parseFloat(rangeStr.replace("<", ""));
      if (!isNaN(maxVal)) {
        return numValue > maxVal 
          ? { status: "High", color: "border-rose-350 text-rose-700 bg-rose-50/60" } 
          : { status: "Normal", color: "border-emerald-350 text-emerald-700 bg-emerald-50/60" };
      }
    }

    if (rangeStr.includes(">=")) {
      const minVal = parseFloat(rangeStr.replace(">=", ""));
      if (!isNaN(minVal)) {
        return numValue < minVal 
          ? { status: "Low", color: "border-amber-350 text-amber-700 bg-amber-50/60" } 
          : { status: "Normal", color: "border-emerald-350 text-emerald-700 bg-emerald-50/60" };
      }
    } else if (rangeStr.includes(">")) {
      const minVal = parseFloat(rangeStr.replace(">", ""));
      if (!isNaN(minVal)) {
        return numValue < minVal 
          ? { status: "Low", color: "border-amber-350 text-amber-700 bg-amber-50/60" } 
          : { status: "Normal", color: "border-emerald-350 text-emerald-700 bg-emerald-50/60" };
      }
    }

    return null;
  };

  const existingPatient = patients.find((p) => p.phone === formData.phone);

  const autofillPatient = () => {
    if (existingPatient) {
      setFormData({
        name: existingPatient.name,
        phone: existingPatient.phone,
        age: existingPatient.age,
        gender: existingPatient.gender,
        address: existingPatient.address || "",
        referredBy: formData.referredBy || "",
      });
    }
  };

  const fetchPatients = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await api.get("/patients", config);
      setPatients(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTests = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await api.get("/tests", config);
      setAvailableTests(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPatients();
    fetchTests();
  }, []);

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(search.toLowerCase()) ||
    patient.phone.includes(search)
  );

  const categories = [
    "All",
    ...new Set(availableTests.map((t) => t.category).filter(Boolean)),
  ];

  const filteredTests = availableTests.filter((test) => {
    const matchesSearch =
      test.testName.toLowerCase().includes(testSearch.toLowerCase()) ||
      (test.category && test.category.toLowerCase().includes(testSearch.toLowerCase()));

    const matchesCategory =
      selectedCategory === "All" ||
      test.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleKeyDown = (e) => {
    if ((e.target.tagName === "INPUT" || e.target.tagName === "SELECT") && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      const form = e.target.form;
      if (!form) return;
      
      const elements = Array.from(form.elements).filter(
        (el) =>
          (el.tagName === "INPUT" || el.tagName === "SELECT") &&
          !el.disabled &&
          el.type !== "submit" &&
          el.type !== "hidden"
      );
      
      const index = elements.indexOf(e.target);
      if (index === -1) return;
      
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextEl = elements[index + 1];
        if (nextEl) nextEl.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prevEl = elements[index - 1];
        if (prevEl) prevEl.focus();
      }
    }
  };

  const handleParameterKeyDown = (e) => {
    if (e.target.tagName === "INPUT" && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      
      const container = e.target.closest("tbody") || e.target.closest("table");
      if (!container) return;
      
      const inputs = Array.from(container.querySelectorAll("input[type='text']"));
      const index = inputs.indexOf(e.target);
      if (index === -1) return;
      
      if (e.key === "ArrowDown") {
        const nextInput = inputs[index + 1];
        if (nextInput) nextInput.focus();
      } else if (e.key === "ArrowUp") {
        const prevInput = inputs[index - 1];
        if (prevInput) prevInput.focus();
      }
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

      await api.post(
        "/patients",
        {
          ...formData,
          tests: selectedTests,
        },
        config
      );

      alert("Laboratory Entry Saved");

      setFormData({
        name: "",
        phone: "",
        age: "",
        gender: "",
        address: "",
        referredBy: "",
      });

      setSelectedTests([]);
      fetchPatients();
    } catch (error) {
      console.log(error);
    }
  };

  const deletePatientHandler = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient? All their reports will remain but the patient will be deleted from the registry. Continue?")) return;

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await api.put(`/patients/${id}/delete`, {}, config);
      alert("Patient Deleted");
      fetchPatients();
    } catch (error) {
      console.log(error);
      alert("Failed to delete patient");
    }
  };

  return (
    <div className="space-y-6 font-inter pb-12">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black font-outfit text-slate-800 tracking-tight">
            Patient Registry & Catalog
          </h1>
          <p className="text-slate-450 text-xs font-semibold mt-1 uppercase tracking-wider">
            Register patients, map tests, and record clinical diagnostic values
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => setShowPriceModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 transition text-xs font-bold shadow-sm cursor-pointer"
          >
            <FaSlidersH className="text-teal-600" /> Adjust Pricing Catalog
          </button>
          
          <button 
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white transition text-xs font-bold shadow-sm cursor-pointer"
          >
            <FaFlask /> View Analytics
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Patient Registration */}
        <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm">
          <div className="flex items-center gap-2 mb-5 border-b border-slate-100 pb-4">
            <div className="p-2.5 bg-slate-50 text-teal-600 rounded-xl shadow-inner border border-slate-100">
              <FaUserPlus className="text-base" />
            </div>
            <h2 className="text-xs font-bold font-outfit text-slate-800 uppercase tracking-wider">
              Patient Registration
            </h2>
          </div>

          <form onSubmit={submitHandler} onKeyDown={handleKeyDown} className="space-y-4">
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter patient full name..."
                value={formData.name}
                onChange={changeHandler}
                className="w-full border border-slate-200 rounded-xl px-4 py-2 outline-none text-xs font-semibold transition focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-800"
                required
              />
            </div>

            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Contact Phone
              </label>
              <input
                type="text"
                name="phone"
                placeholder="Enter 10-digit number..."
                value={formData.phone}
                onChange={changeHandler}
                className="w-full border border-slate-200 rounded-xl px-4 py-2 outline-none text-xs font-semibold transition focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-800 font-mono"
                required
              />
            </div>

            {existingPatient && (
              <button
                type="button"
                onClick={autofillPatient}
                className="w-full text-[9px] bg-teal-50 text-teal-700 hover:bg-teal-100 p-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition border border-teal-150 uppercase tracking-wider cursor-pointer"
              >
                ⚡ Returning Patient! Click to Autofill
              </button>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Age (Years)
                </label>
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  value={formData.age}
                  onChange={changeHandler}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2 outline-none text-xs font-semibold transition focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={changeHandler}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2 outline-none text-xs font-semibold transition focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-600"
                  required
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Address
              </label>
              <input
                type="text"
                name="address"
                placeholder="Enter address details..."
                value={formData.address}
                onChange={changeHandler}
                className="w-full border border-slate-200 rounded-xl px-4 py-2 outline-none text-xs font-semibold transition focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Referred By (Doctor / Clinic)
              </label>
              <input
                type="text"
                name="referredBy"
                placeholder="Self referral or clinical doctor..."
                value={formData.referredBy}
                onChange={changeHandler}
                className="w-full border border-slate-200 rounded-xl px-4 py-2 outline-none text-xs font-semibold transition focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-800"
              />
            </div>

            {selectedTests.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 mt-6 text-xs">
                <div className="flex justify-between items-center font-bold text-slate-500 uppercase tracking-wider">
                  <span>Selected Tests ({selectedTests.length}):</span>
                  <span className="text-teal-600 text-sm font-extrabold font-outfit">₹{selectedTests.reduce((sum, test) => sum + (test.price || 0), 0)}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-bold transition shadow-sm cursor-pointer text-xs font-outfit tracking-wider uppercase"
            >
              Register & Save Entry
            </button>
          </form>
        </div>

        {/* Right Columns: Test Catalog Selection & Details */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          {/* Test Selector Panel */}
          <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-sm">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 border-b border-slate-100 pb-4">
                <h2 className="text-xs font-bold font-outfit text-slate-800 uppercase tracking-wider">
                  Diagnostic Catalog Selection
                </h2>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search catalog parameters..."
                    value={testSearch}
                    onChange={(e) => setTestSearch(e.target.value)}
                    className="border border-slate-200 rounded-xl px-4 py-1.5 pl-9 w-64 outline-none text-xs transition focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 bg-slate-50/50 hover:bg-slate-50 focus:bg-white font-semibold text-slate-700"
                  />
                  <FaSearch className="absolute left-3 top-2.5 text-slate-400 text-xs" />
                </div>
              </div>

              {/* Category Filter Chips */}
              <div className="flex gap-2 overflow-x-auto pb-3 mb-5 border-b border-slate-100 max-w-full">
                {categories.map((category) => {
                  const isActive = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3.5 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition border cursor-pointer ${
                        isActive
                          ? "bg-teal-600 border-teal-600 text-white shadow-sm"
                          : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>

              {/* Scrollable grid container for 260+ tests */}
              <div className="max-h-[350px] overflow-y-auto pr-2 mb-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredTests.length > 0 ? (
                    filteredTests.map((test) => {
                      const isSelected = selectedTests.some((item) => item._id === test._id);
                      return (
                        <div
                          key={test._id}
                          onClick={() => toggleTest(test)}
                          className={`border rounded-2xl p-4 cursor-pointer transition duration-150 relative overflow-hidden flex flex-col justify-between min-h-[110px] ${
                            isSelected
                              ? "bg-teal-50 text-teal-800 border-teal-350 shadow-inner"
                              : "bg-white border-slate-200 hover:border-teal-400 hover:bg-teal-50/[0.02]"
                          }`}
                        >
                          <div>
                            <div className="flex justify-between items-start gap-2 mb-2">
                              <span
                                className={`text-[8px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                                  isSelected
                                    ? "bg-teal-600 text-white"
                                    : "bg-slate-50 text-slate-500 border border-slate-200"
                                }`}
                              >
                                {test.category || "General"}
                              </span>
                              
                              <span
                                className="text-xs font-black font-outfit text-teal-700"
                              >
                                ₹{test.price || 0}
                              </span>
                            </div>

                            <h3 className="font-bold text-slate-800 text-xs line-clamp-2 leading-snug">
                              <span>{test.testName}</span>
                            </h3>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between items-center text-[10px]">
                            <span className="font-bold flex items-center gap-1.5 text-slate-400">
                              🧪 {test.specimen || "Blood"}
                            </span>
                            
                            {isSelected && (
                              <span className="bg-teal-600 p-1 rounded-full text-white text-[8px] flex items-center justify-center font-bold">
                                <FaCheck />
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-3 text-center py-12 text-slate-400 text-xs font-semibold">
                      No matching diagnostic tests available in catalog.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Selected items tray */}
            {selectedTests.length > 0 && (
              <div className="mt-6 pt-5 border-t border-slate-150">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Selected Mapping Set
                </h3>

                <div className="flex flex-wrap gap-2.5">
                  {selectedTests.map((test) => (
                    <div
                      key={test._id}
                      className="bg-slate-50 border border-slate-200 pl-3.5 pr-1.5 py-1.5 rounded-xl flex items-center gap-2.5 text-xs shadow-inner"
                    >
                      <span className="text-slate-700 font-bold text-[11px] font-outfit">{test.testName}</span>
                      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2 py-0.5 shadow-sm">
                        <span className="text-slate-400 font-extrabold text-[9px]">₹</span>
                        <input
                          type="number"
                          value={test.price || 0}
                          onChange={(e) => {
                            const val = Number(e.target.value) || 0;
                            setSelectedTests(selectedTests.map(item => 
                              item._id === test._id ? { ...item, price: val } : item
                            ));
                          }}
                          className="w-12 border-none bg-transparent outline-none text-xs font-black text-teal-800 text-right"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleTest(test)}
                        className="text-rose-500 hover:bg-rose-100 hover:text-rose-700 p-1.5 rounded-full transition cursor-pointer"
                      >
                        <FaTimes className="text-[9px]" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* DYNAMIC PARAMETER DETAILS PANEL */}
          {selectedTests.length > 0 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 px-2">
                <span className="p-2 bg-slate-50 text-teal-600 rounded-xl border border-slate-100"><FaFileAlt className="text-base" /></span> 
                <h2 className="text-xs font-bold font-outfit text-slate-800 uppercase tracking-wider">
                  Diagnostic Parameters
                </h2>
              </div>

              {selectedTests.map((test) => (
                <div
                  key={test._id}
                  className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="text-sm font-bold font-outfit text-slate-800 leading-snug">
                        {test.testName}
                      </h3>
                      <span className="text-[8px] font-bold text-teal-700 bg-teal-50 border border-teal-100/50 px-2 py-0.5 rounded-md uppercase tracking-wider mt-1.5 inline-block">
                        {test.category || "General"}
                      </span>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">
                          Specimen
                        </p>
                        <p className="text-xs font-bold text-slate-700 flex items-center gap-1 justify-end">
                          🧪 {test.specimen || "Blood"}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">
                          Price Override
                        </p>
                        <div className="relative inline-flex items-center">
                          <span className="absolute left-2.5 text-slate-400 text-xs font-bold">₹</span>
                          <input
                            type="number"
                            value={test.price || 0}
                            onChange={(e) => {
                              const val = Number(e.target.value) || 0;
                              setSelectedTests(selectedTests.map(item => 
                                item._id === test._id ? { ...item, price: val } : item
                              ));
                            }}
                            className="w-24 border border-slate-200 rounded-xl pl-6 pr-3 py-1.5 text-xs font-black text-slate-800 text-right focus:outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 bg-slate-50/50 focus:bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {test.parameters && test.parameters.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl border border-slate-150 bg-white">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-slate-50/70 text-slate-400 text-[9px] font-bold uppercase tracking-wider border-b border-slate-150">
                            <th className="px-5 py-3 text-left w-1/3">Parameter</th>
                            <th className="px-5 py-3 text-left w-1/3">Result Value</th>
                            <th className="px-5 py-3 text-left w-1/6">Unit</th>
                            <th className="px-5 py-3 text-left w-1/6">Reference</th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100" onKeyDown={handleParameterKeyDown}>
                          {test.parameters.map((parameter, index) => {
                            const resultObj = test.results?.find(
                              (r) => r.parameterName === parameter.parameterName
                            );
                            const resultValue = resultObj ? resultObj.value : "";
                            const rangeStatus = checkRangeStatus(parameter, resultValue);
                            const borderClass = rangeStatus ? rangeStatus.color : "border-slate-200 focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 bg-slate-50/50 focus:bg-white text-slate-800";

                            return (
                              <tr key={index} className="hover:bg-slate-50/20 transition-colors text-xs text-slate-600">
                                <td className="px-5 py-3 font-bold text-slate-750">
                                  {parameter.parameterName}
                                </td>

                                <td className="px-5 py-3 flex items-center gap-2">
                                  <input
                                    type="text"
                                    placeholder="Value..."
                                    value={resultValue}
                                    onChange={(e) =>
                                      handleResultChange(test._id, parameter.parameterName, e.target.value)
                                    }
                                    className={`border px-3 py-1.5 rounded-xl w-full outline-none transition text-xs font-semibold ${borderClass}`}
                                  />
                                  {rangeStatus && (
                                    <span
                                      className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase border tracking-wider shrink-0 shadow-sm ${
                                        rangeStatus.status === "High"
                                          ? "bg-rose-50 text-rose-600 border-rose-200"
                                          : rangeStatus.status === "Low"
                                          ? "bg-amber-50 text-amber-600 border-amber-200"
                                          : "bg-emerald-50 text-emerald-600 border-emerald-200"
                                      }`}
                                    >
                                      {rangeStatus.status}
                                    </span>
                                  )}
                                </td>

                                <td className="px-5 py-3 font-mono text-[10px] text-slate-400 font-bold">
                                  {parameter.unit || "-"}
                                </td>

                                <td className="px-5 py-3 font-bold text-[10px] text-slate-500">
                                  {getNormalRange(parameter)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-slate-450 text-xs font-semibold">
                      No parameters configured for this diagnostic test.
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Registered Patients Ledger ── */}
      <div className="bg-white rounded-2xl border border-slate-150 shadow-sm overflow-hidden mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 border-b border-slate-150 bg-slate-50/20">
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-slate-50 text-teal-600 rounded-xl border border-slate-100 shadow-inner">
              <FaHistory className="text-sm" />
            </div>
            <h2 className="text-xs font-bold font-outfit text-slate-800 uppercase tracking-wider">
              Registered Patients Ledger
            </h2>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search registry by name/phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-slate-200 rounded-xl px-4 py-1.5 pl-9 w-72 outline-none text-xs transition focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 bg-slate-50/50 hover:bg-slate-50 focus:bg-white font-semibold text-slate-700"
            />
            <FaSearch className="absolute left-3.5 top-2.5 text-slate-400 text-xs" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/30">
                {["Patient Name", "Contact Phone", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-3.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-150">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.length > 0 ? (
                filteredPatients.slice(0, visiblePatientsCount).map((patient) => (
                  <tr key={patient._id} className="hover:bg-slate-50/30 transition duration-150">
                    <td className="px-6 py-4 text-xs font-bold text-slate-700">
                       {patient.name}
                    </td>

                    <td className="px-6 py-4 text-xs font-bold text-slate-500 font-mono">
                      {patient.phone}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/reports/${patient._id}`)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-50 hover:bg-teal-600 hover:text-white text-teal-700 transition font-bold text-xs cursor-pointer border border-slate-200 shadow-sm"
                        >
                          📂 Open Diagnostic Report
                        </button>
                        <button
                          onClick={() => deletePatientHandler(patient._id)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-50 hover:bg-rose-600 hover:text-white text-rose-700 transition font-bold text-xs cursor-pointer border border-slate-200 shadow-sm"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-10 text-slate-400 text-xs font-semibold bg-white">
                    No registered patient matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredPatients.length > visiblePatientsCount && (
          <div className="border-t border-slate-150 p-4 text-center bg-slate-50/20">
            <button
              type="button"
              onClick={() => setVisiblePatientsCount(prev => prev + 50)}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 transition text-xs font-bold shadow-sm cursor-pointer"
            >
              📥 Load More Patients
            </button>
          </div>
        )}
      </div>
      
      {/* ── MANAGE MASTER PRICES MODAL ── */}
      {showPriceModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-xl border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="bg-white border-b border-slate-150 px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-xs tracking-wide uppercase font-outfit flex items-center gap-2 text-slate-800">
                💵 Master Catalog Pricing Override
              </h3>
              <button
                onClick={() => setShowPriceModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer p-1 rounded-full hover:bg-slate-50 transition"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex flex-col gap-4 overflow-y-auto bg-slate-50/30">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search test catalog by name..."
                  value={priceSearch}
                  onChange={(e) => setPriceSearch(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2 pl-9 outline-none text-xs transition focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 bg-slate-50/50 hover:bg-slate-50 focus:bg-white font-semibold text-slate-700"
                />
                <FaSearch className="absolute left-3 top-3 text-slate-400 text-xs" />
              </div>

              <div className="flex flex-col gap-2.5 max-h-[48vh] overflow-y-auto pr-2 divide-y divide-slate-100 bg-white rounded-xl border border-slate-150 p-4 shadow-sm">
                {availableTests.filter(t => t.testName.toLowerCase().includes(priceSearch.toLowerCase())).map((test) => (
                  <div
                    key={test._id}
                    className="flex items-center justify-between py-3 bg-white transition-all"
                  >
                    <div className="flex-1 pr-6">
                      <p className="text-xs font-bold text-slate-800 leading-tight">{test.testName}</p>
                      <p className="text-[8px] font-bold text-[#0D9488] bg-teal-50 border border-teal-100/50 px-2 py-0.5 rounded-md uppercase tracking-wider mt-1 inline-block">🧪 {test.category || "General"}</p>
                    </div>
                    
                    <div className="flex items-center gap-1.5 relative shrink-0">
                      <span className="text-slate-400 font-black text-xs">₹</span>
                      <input
                        type="number"
                        defaultValue={test.price || 0}
                        onBlur={async (e) => {
                          const newPrice = Number(e.target.value) || 0;
                          if (newPrice === test.price) return;
                          
                          try {
                            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
                            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                            await api.put(`/tests/${test._id}`, { price: newPrice }, config);
                            
                            // Update local states
                            setAvailableTests(prev => prev.map(t => t._id === test._id ? { ...t, price: newPrice } : t));
                          } catch (err) {
                            console.error(err);
                            alert("Failed to update price.");
                          }
                        }}
                        className="w-20 border border-slate-200 rounded-xl px-3 py-1 outline-none text-xs font-black text-slate-800 text-right focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 bg-slate-50/55 focus:bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-150 flex justify-end bg-slate-50">
              <button
                onClick={() => setShowPriceModal(false)}
                className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-xl text-xs font-bold transition shadow cursor-pointer uppercase tracking-wider"
              >
                Close Catalog
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabEntryPage;