import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  FaSearch,
  FaFilter,
  FaMoneyBillWave,
  FaPrint,
  FaTimes,
  FaCheckCircle,
  FaSpinner,
  FaClipboardList,
  FaHandHoldingUsd,
  FaCalendarCheck,
  FaSync,
  FaCoins
} from "react-icons/fa";

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const AVATAR_PALETTES = [
  "bg-teal-50 text-teal-700 border-teal-100",
  "bg-blue-50 text-blue-700 border-blue-100",
  "bg-indigo-50 text-indigo-700 border-indigo-100",
  "bg-sky-50 text-sky-700 border-sky-100",
  "bg-slate-50 text-slate-700 border-slate-100"
];

const avatarGradient = (name = "") => {
  const idx = (name.charCodeAt(0) || 0) % AVATAR_PALETTES.length;
  return AVATAR_PALETTES[idx];
};

const BillingPage = () => {
  const navigate = useNavigate();

  // State
  const [bills, setBills] = useState([]);
  const [stats, setStats] = useState({
    totalBilled: 0,
    totalCollected: 0,
    totalPending: 0,
    todayRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showQRModal, setShowQRModal] = useState(false);

  // Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    discount: 0,
    amountPaid: 0,
    paymentMode: "None",
    notes: "",
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  // Print State
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Fetch Data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo?.token) {
        navigate("/");
        return;
      }
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };

      // Run parallel fetches
      const [billsRes, statsRes] = await Promise.all([
        api.get("/billing", config),
        api.get("/billing/stats", config),
      ]);

      setBills(billsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Failed to load billing records."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter bills
  const filteredBills = bills.filter((bill) => {
    const patientName = bill.patient?.name || "";
    const patientPhone = bill.patient?.phone || "";
    const matchesSearch =
      patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patientPhone.includes(searchTerm);

    const matchesStatus =
      statusFilter === "All" || bill.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Open Payment modal
  const openPaymentModal = (bill) => {
    setSelectedBill(bill);
    setPaymentForm({
      discount: bill.discount || 0,
      amountPaid: bill.amountPaid || 0,
      paymentMode: bill.paymentMode !== "None" ? bill.paymentMode : "Cash",
      notes: bill.notes || "",
    });
    setShowPaymentModal(true);
  };

  // Handle Payment Submit
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };

      await api.put(`/billing/${selectedBill._id}`, paymentForm, config);
      setShowPaymentModal(false);
      setSelectedBill(null);
      await fetchData(); // reload
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to record payment.");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle Print Action
  const triggerPrint = (bill) => {
    setSelectedInvoice(bill);
    // Wait for state to reflect in DOM print-area before calling window.print()
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <div className="font-inter">
      {/* CSS Styles for animations & printing */}
      <style>{`
        #print-area {
          display: none;
        }
        
        /* Print Styles */
        @media print {
          /* Hide all screen elements */
          body * {
            visibility: hidden;
          }
          
          /* Show only the print area */
          #print-area, #print-area * {
            visibility: visible;
          }
          
          #print-area {
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: #fff;
            color: #000;
            padding: 24px;
            font-size: 13px;
          }
          
          /* Hide print page numbers & margins */
          @page {
            size: auto;
            margin: 10mm;
          }
        }
      `}</style>

      {/* ── SCREEN VIEW (HIDDEN DURING PRINT VIA CSS) ── */}
      <div className="no-print space-y-6">
        {/* ── Page Header ─────────────────────────────────────────────── */}
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-black font-outfit text-slate-800 tracking-tight">
              Billing & Financial Ledger
            </h1>
            <p className="text-slate-500 text-xs font-semibold mt-1 uppercase tracking-wider">
              Monitor revenue collections, log dues balance, and print invoice receipts
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQRModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 transition text-xs font-bold shadow-sm cursor-pointer"
            >
              📱 UPI QR Code
            </button>
            <button
              onClick={fetchData}
              className="inline-flex items-center gap-2 px-3.5 py-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 transition text-xs font-bold shadow-sm cursor-pointer"
            >
              <FaSync className="text-xs" /> Sync Ledger
            </button>
          </div>
        </div>

        {/* ── Loading State ───────────────────────────────────────────── */}
        {loading && bills.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <div className="w-10 h-10 border-3 border-slate-200 border-t-teal-600 rounded-full animate-spin"></div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Analyzing financial ledger databases...</p>
          </div>
        ) : error ? (
          <div className="max-w-lg mx-auto mt-16 text-center p-8 bg-white rounded-3xl border border-rose-100 shadow-lg shadow-rose-500/5">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-rose-600 text-base font-bold font-outfit mb-2">Connection Failed</h3>
            <p className="text-slate-500 text-xs mb-6 leading-relaxed">{error}</p>
            <button
              onClick={fetchData}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white transition-all font-semibold text-xs cursor-pointer shadow-sm shadow-teal-900/10"
            >
              Retry Database Sync
            </button>
          </div>
        ) : (
          <>
            {/* ── Stats Widget Row ────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Stat 1: Total Billed */}
              <div className="bg-white rounded-2xl p-5 border border-slate-150 shadow-sm border-t-2 border-t-slate-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-2">Total Net Billed</p>
                    <h3 className="text-2xl font-extrabold font-outfit tracking-tight text-slate-800 font-mono">
                      ₹{stats.totalBilled.toLocaleString("en-IN")}
                    </h3>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shadow-inner">
                    <FaClipboardList className="text-sm" />
                  </div>
                </div>
              </div>

              {/* Stat 2: Total Collected */}
              <div className="bg-white rounded-2xl p-5 border border-slate-150 shadow-sm border-t-2 border-t-emerald-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-2">Revenue Collected</p>
                    <h3 className="text-2xl font-extrabold font-outfit tracking-tight text-slate-800 font-mono">
                      ₹{stats.totalCollected.toLocaleString("en-IN")}
                    </h3>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
                    <FaHandHoldingUsd className="text-sm" />
                  </div>
                </div>
              </div>

              {/* Stat 3: Outstanding Dues */}
              <div className="bg-white rounded-2xl p-5 border border-slate-150 shadow-sm border-t-2 border-t-amber-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-2">Outstanding Dues</p>
                    <h3 className="text-2xl font-extrabold font-outfit tracking-tight text-amber-700 font-mono">
                      ₹{stats.totalPending.toLocaleString("en-IN")}
                    </h3>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-inner">
                    <FaMoneyBillWave className="text-sm" />
                  </div>
                </div>
              </div>

              {/* Stat 4: Today's Revenue */}
              <div className="bg-white rounded-2xl p-5 border border-slate-150 shadow-sm border-t-2 border-t-teal-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-2">Today's Receipts</p>
                    <h3 className="text-2xl font-extrabold font-outfit tracking-tight text-slate-800 font-mono">
                      ₹{stats.todayRevenue.toLocaleString("en-IN")}
                    </h3>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shadow-inner">
                    <FaCalendarCheck className="text-sm" />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Search and Filter Controls ─────────────────────────────── */}
            <div className="bg-white border border-slate-150 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search ledger by patient name or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-1.5 pl-9 outline-none text-xs transition focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 bg-slate-50/50 hover:bg-slate-50 focus:bg-white font-semibold text-slate-700"
                />
                <FaSearch className="absolute left-3 top-2.5 text-slate-400 text-xs" />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-wider mr-2 flex items-center gap-1.5 text-[9px]">
                  <FaFilter className="text-[9px]" /> Filter:
                </span>
                {["All", "Paid", "Partially Paid", "Unpaid"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3.5 py-1.5 rounded-xl font-bold uppercase tracking-wider text-[10px] border transition cursor-pointer ${
                      statusFilter === status
                        ? "bg-slate-800 border-slate-850 text-white shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-750"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Billing Table Card ─────────────────────────────────────── */}
            <div className="bg-transparent sm:bg-white sm:rounded-2xl sm:border sm:border-slate-150 sm:shadow-sm sm:overflow-hidden">
              
              {/* MOBILE ONLY CARD STACK (Hidden on desktop viewports) */}
              <div className="block sm:hidden space-y-4 py-2">
                {filteredBills.length > 0 ? (
                  filteredBills.map((bill) => {
                    const initials = getInitials(bill.patient?.name);
                    const st = avatarGradient(bill.patient?.name);

                    // Status styles
                    const statusStyles = {
                      Paid: { bg: "bg-emerald-50 text-emerald-600 border-emerald-100" },
                      "Partially Paid": { bg: "bg-amber-50 text-amber-600 border-amber-100" },
                      Unpaid: { bg: "bg-rose-50 text-rose-600 border-rose-100" },
                    };
                    const currStatus = statusStyles[bill.status] || {
                      bg: "bg-slate-50 text-slate-500 border-slate-100",
                    };

                    return (
                      <div key={bill._id} className="bg-white rounded-2xl border border-slate-150 p-5 space-y-4 shadow-sm hover:shadow-md transition duration-150">
                        {/* Header: Avatar, Name, Phone & Status */}
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-8.5 h-8.5 rounded-lg flex-shrink-0 flex items-center justify-center font-bold text-xs shadow-inner border ${st}`}>
                              {initials}
                            </div>
                            <div>
                              <div className="font-bold text-slate-700 text-sm leading-snug">
                                {bill.patient?.name || "Unknown"}
                              </div>
                              <div className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider font-mono">
                                📱 {bill.patient?.phone || "—"}
                              </div>
                            </div>
                          </div>
                          
                          <span className={`inline-block text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border ${currStatus.bg}`}>
                            {bill.status}
                          </span>
                        </div>

                        {/* Breakdown Grid */}
                        <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-500 font-semibold bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider mb-0.5">Invoice Total</span>
                            <span className="font-black text-slate-800 text-sm font-mono">₹{bill.totalAmount}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider mb-0.5">Discount Given</span>
                            <span className="text-rose-500 font-bold font-mono">{bill.discount > 0 ? `-₹${bill.discount}` : "₹0"}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider mb-0.5">Amount Paid</span>
                            <span className="text-emerald-600 font-extrabold text-sm font-mono">₹{bill.amountPaid}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider mb-0.5">Balance Due</span>
                            <span className={`font-extrabold text-sm font-mono ${bill.balanceDue > 0 ? "text-amber-600" : "text-slate-800"}`}>
                              ₹{bill.balanceDue}
                            </span>
                          </div>
                        </div>

                        {/* Date and Payment Mode Row */}
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          <div className="flex items-center gap-1">
                            <span>📅 {formatDate(bill.createdAt)}</span>
                          </div>
                          <div>
                            <span className="inline-block font-bold text-[9px] text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded uppercase tracking-wider">
                              Method: {bill.paymentMode || "None"}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => openPaymentModal(bill)}
                            className={`flex-1 inline-flex items-center justify-center px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                              bill.status === "Paid"
                                ? "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                                : "bg-teal-600 hover:bg-teal-700 border-teal-600 text-white shadow-sm"
                            }`}
                          >
                            {bill.status === "Paid" ? "Adjust Account" : "Pay Now"}
                          </button>

                          <button
                            onClick={() => triggerPrint(bill)}
                            title="Print Invoice"
                            className="inline-flex items-center justify-center p-3.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition cursor-pointer text-xs shadow-sm"
                          >
                            <FaPrint />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-16 text-slate-400 font-semibold bg-white">
                    No billing ledgers found matching criteria.
                  </div>
                )}
              </div>

              {/* DESKTOP TABLE VIEW (Hidden on mobile) */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-150">
                      <th className="px-6 py-3.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Patient Details</th>
                      <th className="px-6 py-3.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Date Billed</th>
                      <th className="px-6 py-3.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-right">Invoice Total</th>
                      <th className="px-6 py-3.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-right">Discount</th>
                      <th className="px-6 py-3.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-right">Amount Paid</th>
                      <th className="px-6 py-3.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-right">Balance Due</th>
                      <th className="px-6 py-3.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center">Method</th>
                      <th className="px-6 py-3.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                      <th className="px-6 py-3.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredBills.length > 0 ? (
                      filteredBills.map((bill) => {
                        const initials = getInitials(bill.patient?.name);
                        const st = avatarGradient(bill.patient?.name);

                        // Status styles
                        const statusStyles = {
                          Paid: { bg: "bg-emerald-50 text-emerald-600 border-emerald-100" },
                          "Partially Paid": { bg: "bg-amber-50 text-amber-600 border-amber-100" },
                          Unpaid: { bg: "bg-rose-50 text-rose-600 border-rose-100" },
                        };
                        const currStatus = statusStyles[bill.status] || {
                          bg: "bg-slate-50 text-slate-500 border-slate-100",
                        };

                        return (
                          <tr
                            key={bill._id}
                            className="hover:bg-slate-50/30 transition duration-150 text-slate-600"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-8.5 h-8.5 rounded-lg flex-shrink-0 flex items-center justify-center font-bold text-xs shadow-inner border ${st}`}>
                                  {initials}
                                </div>
                                <div>
                                  <div className="font-bold text-slate-700 text-sm leading-snug">
                                    {bill.patient?.name || "Unknown"}
                                  </div>
                                  <div className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider font-mono">
                                    📱 {bill.patient?.phone || "—"}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-slate-500 font-bold font-mono">
                              {formatDate(bill.createdAt)}
                            </td>
                            <td className="px-6 py-4 font-black text-slate-800 text-right text-sm font-mono">
                              ₹{bill.totalAmount}
                            </td>
                            <td className="px-6 py-4 text-rose-500 text-right font-bold font-mono">
                              {bill.discount > 0 ? `-₹${bill.discount}` : "₹0"}
                            </td>
                            <td className="px-6 py-4 text-emerald-600 text-right font-extrabold text-sm font-mono">
                              ₹{bill.amountPaid}
                            </td>
                            <td className="px-6 py-4 font-extrabold text-right text-sm text-slate-700 font-mono">
                              <span className={bill.balanceDue > 0 ? "text-amber-600" : "text-slate-800"}>
                                ₹{bill.balanceDue}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="inline-block font-bold text-[9px] text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded uppercase tracking-wider">
                                {bill.paymentMode || "None"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={`inline-block text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border ${currStatus.bg}`}>
                                {bill.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => openPaymentModal(bill)}
                                  className={`inline-flex items-center justify-center px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border ${
                                    bill.status === "Paid"
                                      ? "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                                      : "bg-teal-600 hover:bg-teal-700 border-teal-600 text-white shadow-sm"
                                  }`}
                                >
                                  {bill.status === "Paid" ? "Adjust Account" : "Pay Now"}
                                </button>

                                <button
                                  onClick={() => triggerPrint(bill)}
                                  title="Print Invoice"
                                  className="inline-flex items-center justify-center p-2 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition cursor-pointer text-xs shadow-sm"
                                >
                                  <FaPrint />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="9"
                          className="text-center py-16 text-slate-400 font-semibold bg-white"
                        >
                          No billing ledgers found matching criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── RECORD PAYMENT MODAL ───────────────────────────────────────── */}
      {showPaymentModal && selectedBill && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-white border-b border-slate-150 px-6 py-4 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-xs tracking-wide uppercase font-outfit flex items-center gap-2 text-slate-800">
                <FaCoins className="text-teal-600" /> Account Ledger Entry
              </h3>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedBill(null);
                }}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer p-1.5 rounded-full hover:bg-slate-50 transition"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handlePaymentSubmit} className="p-6 space-y-4 bg-slate-50/30 overflow-y-auto flex-1">
              <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl shadow-inner text-xs">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Patient Account Details</p>
                <p className="text-sm font-bold text-slate-800 font-outfit">👤 {selectedBill.patient?.name}</p>
                <p className="text-[10px] text-slate-500 font-semibold mt-1">🧪 Billed Tests: {selectedBill.report?.tests?.length || 0}</p>
              </div>

              {/* Total Original Bill */}
              <div className="flex justify-between text-xs font-bold text-slate-500 border-b border-slate-100 pb-2">
                <span>Original Invoice Total:</span>
                <span className="text-slate-800 text-sm font-black font-outfit font-mono">₹{selectedBill.totalAmount}</span>
              </div>

              {/* Discount Input */}
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Apply Discount (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  max={selectedBill.totalAmount}
                  value={paymentForm.discount}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      discount: Math.min(
                        selectedBill.totalAmount,
                        Number(e.target.value) || 0
                      ),
                    })
                  }
                  className="w-full border border-slate-200 rounded-xl px-4 py-2 outline-none text-xs font-black text-slate-800 transition focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-right font-mono"
                />
              </div>

              {/* Cumulative Paid Input */}
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Cumulative Amount Paid (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  max={selectedBill.totalAmount - paymentForm.discount}
                  value={paymentForm.amountPaid}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      amountPaid: Math.min(
                        selectedBill.totalAmount - paymentForm.discount,
                        Number(e.target.value) || 0
                      ),
                    })
                  }
                  className="w-full border border-slate-200 rounded-xl px-4 py-2 outline-none text-xs font-black text-slate-800 transition focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-right font-mono"
                />
              </div>

              {/* Payment Mode Selector */}
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Payment Method
                </label>
                <select
                  value={paymentForm.paymentMode}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      paymentMode: e.target.value,
                    })
                  }
                  className="w-full border border-slate-200 rounded-xl px-4 py-2 outline-none text-xs font-bold text-slate-600 transition focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 bg-white"
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI / GPay / PhonePe</option>
                  <option value="Card">Debit/Credit Card</option>
                  <option value="Net Banking">Net Banking</option>
                </select>
              </div>

              {/* Dynamic QR Code Payment Block */}
              {paymentForm.paymentMode === "UPI" && (
                <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl flex flex-col items-center justify-center gap-3 animate-in fade-in slide-in-from-top-1 duration-200 shadow-inner">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">UPI Diagnostic Settlement</p>
                  <div className="border border-slate-200 p-2.5 bg-white rounded-xl shadow-sm max-w-[310px]">
                    <img
                      src="/upi_qr.jpg"
                      alt="Gousia Clinical Lab UPI QR Code"
                      className="w-72 h-72 object-contain rounded-lg"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-700">Account: wani Esrar</p>
                    <p className="text-[9px] font-mono text-teal-600 font-bold mt-0.5" >UPI ID: waniesrar2@okaxis</p>
                    <p className="text-[8px] text-slate-400 uppercase font-semibold mt-1">Scan to pay with any UPI app</p>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Transaction Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Paid in full via UPI"
                  value={paymentForm.notes}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      notes: e.target.value,
                    })
                  }
                  className="w-full border border-slate-200 rounded-xl px-4 py-2 outline-none text-xs text-slate-700 transition focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 bg-slate-50/50 hover:bg-slate-50 focus:bg-white"
                />
              </div>

              {/* Net calculations display */}
              <div className="bg-white border border-slate-150 p-4 rounded-xl space-y-2 text-xs shadow-inner">
                <div className="flex justify-between text-slate-500 font-bold">
                  <span>Net Billable (after discount):</span>
                  <span className="font-mono">₹{selectedBill.totalAmount - paymentForm.discount}</span>
                </div>
                <div className="flex justify-between text-slate-800 font-extrabold font-outfit border-t border-dashed border-slate-150 pt-2.5 text-sm">
                  <span>Outstanding Balance:</span>
                  <span className="text-amber-600 font-mono">
                    ₹{selectedBill.totalAmount - paymentForm.discount - paymentForm.amountPaid}
                  </span>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex gap-2 justify-end pt-2 border-t border-slate-150">
                <button
                  type="button"
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedBill(null);
                  }}
                  className="px-5 py-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-600 transition text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white transition text-xs font-bold shadow-sm cursor-pointer"
                >
                  {submitLoading ? (
                    <>
                      <FaSpinner className="animate-spin text-xs" /> Saving...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle /> Save Details
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── PRINT-ONLY INVOICE COMPONENT (HIDDEN BY DEFAULT ON SCREEN) ── */}
      {selectedInvoice && (
        <div id="print-area">
          {/* Invoice Header */}
          <div style={{ borderBottom: "2px solid #000", paddingBottom: "14px", marginBottom: "18px" }}>
            <h1 style={{ fontSize: "22px", fontWeight: 800, margin: 0, textAlign: "center" }}>
              GOUSIA CLINICAL LABORATORY
            </h1>
            <p style={{ fontStyle: "italic", fontSize: "12px", margin: "3px 0", textAlign: "center" }}>
              Precision & Care In Every Report
            </p>
            <p style={{ fontSize: "11px", margin: 0, textAlign: "center" }}>
              Opposite District Hospital, Anantnag, Jammu & Kashmir | Phone: +91-94190XXXXX
            </p>
          </div>

          {/* Invoice Metadata */}
          <h2 style={{ fontSize: "15px", fontWeight: 700, textTransform: "uppercase", textAlign: "center", margin: "0 0 16px" }}>
            RECEIPT / INVOICE
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
              marginBottom: "18px",
              fontSize: "12.5px",
            }}
          >
            <div>
              <p style={{ margin: "2px 0" }}>
                <strong>Patient Name:</strong> {selectedInvoice.patient?.name}
              </p>
              <p style={{ margin: "2px 0" }}>
                <strong>Age / Gender:</strong> {selectedInvoice.patient?.age} yrs /{" "}
                {selectedInvoice.patient?.gender}
              </p>
              <p style={{ margin: "2px 0" }}>
                <strong>Phone Number:</strong> {selectedInvoice.patient?.phone}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: "2px 0" }}>
                <strong>Invoice ID:</strong> GCL-
                {selectedInvoice._id.slice(-6).toUpperCase()}
              </p>
              <p style={{ margin: "2px 0" }}>
                <strong>Date Issued:</strong> {formatDate(selectedInvoice.createdAt)}
              </p>
              <p style={{ margin: "2px 0" }}>
                <strong>Referred By:</strong> {selectedInvoice.report?.referredBy || "Self / Open"}
              </p>
            </div>
          </div>

          {/* Itemized Tests Table */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "12px",
              marginBottom: "20px",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "1.5px solid #000", background: "#f8fafc" }}>
                <th style={{ padding: "6px", textAlign: "left", width: "10%" }}>S.No</th>
                <th style={{ padding: "6px", textAlign: "left", width: "50%" }}>Test Description</th>
                <th style={{ padding: "6px", textAlign: "left", width: "20%" }}>Category</th>
                <th style={{ padding: "6px", textAlign: "right", width: "20%" }}>Price (₹)</th>
              </tr>
            </thead>
            <tbody>
              {selectedInvoice.report?.tests?.map((test, index) => (
                <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "6px" }}>{index + 1}</td>
                  <td style={{ padding: "6px", fontWeight: 600 }}>{test.testName}</td>
                  <td style={{ padding: "6px" }}>{test.category || "General"}</td>
                  <td style={{ padding: "6px", textAlign: "right" }}>₹{test.price || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals Calculation */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              fontSize: "13px",
              marginBottom: "30px",
            }}
          >
            <div style={{ width: "280px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "4px 0",
                }}
              >
                <span>Original Invoice Total:</span>
                <span>₹{selectedInvoice.totalAmount}</span>
              </div>

              {selectedInvoice.discount > 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "4px 0",
                    color: "red",
                  }}
                >
                  <span>Lab Discount:</span>
                  <span>-₹{selectedInvoice.discount}</span>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "6px 0",
                  borderTop: "1.5px solid #000",
                  fontWeight: 700,
                }}
              >
                <span>Net Billed Amount:</span>
                <span>₹{selectedInvoice.totalAmount - selectedInvoice.discount}</span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "4px 0",
                  color: "#047857",
                  fontWeight: 600,
                }}
              >
                <span>Amount Paid:</span>
                <span>₹{selectedInvoice.amountPaid}</span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "6px 0",
                  borderTop: "1.5px solid #000",
                  fontWeight: 800,
                  fontSize: "14px",
                }}
              >
                <span>Outstanding Dues:</span>
                <span>₹{selectedInvoice.balanceDue}</span>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "12px",
              marginTop: "40px",
            }}
          >
            <div>
              <p style={{ margin: "2px 0" }}>
                <strong>Method:</strong> {selectedInvoice.paymentMode || "None"}
              </p>
              <p style={{ margin: "2px 0" }}>
                <strong>Status:</strong>{" "}
                <span style={{ fontWeight: 700, textTransform: "uppercase" }}>
                  {selectedInvoice.status}
                </span>
              </p>
            </div>
            <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <div style={{ height: "45px", width: "130px", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "4px" }}>
                <img
                  src="/signature.png"
                  alt="Authorized Signature"
                  style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", filter: "contrast(1.2)", mixBlendMode: "multiply" }}
                />
              </div>
              <p style={{ borderTop: "1px solid #000", width: "160px", display: "inline-block", margin: 0 }}></p>
              <p style={{ margin: "4px 0 0", fontWeight: 700 }}>Authorized Signatory</p>
            </div>
          </div>

          <div
            style={{
              marginTop: "60px",
              borderTop: "1px dashed #bbb",
              paddingTop: "12px",
              fontSize: "11px",
              textAlign: "center",
              color: "#666",
            }}
          >
            <p style={{ margin: 0 }}>
              * This is a computer-generated invoice and does not require a physical
              signature.
            </p>
            <p style={{ margin: "2px 0 0", fontWeight: 600 }}>
              Thank you for choosing Gousia Clinical Laboratory for your diagnostics!
            </p>
          </div>
        </div>
      )}

      {/* ── MASTER UPI QR CODE MODAL ── */}
      {showQRModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-white border-b border-slate-150 px-6 py-4 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-xs tracking-wide uppercase font-outfit flex items-center gap-2 text-slate-800">
                📱 Diagnostic UPI QR Settlement
              </h3>
              <button
                onClick={() => setShowQRModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer p-1 rounded-full hover:bg-slate-50 transition"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-8 flex flex-col items-center justify-center gap-6 bg-slate-50/30 overflow-y-auto flex-1">
              <div className="border border-slate-200 p-4 bg-white rounded-2xl shadow-sm">
                <img
                  src="/upi_qr.jpg"
                  alt="Gousia Clinical Lab UPI QR Code"
                  className="w-80 h-80 object-contain rounded-lg animate-in"
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-800">wani Esrar</p>
                <p className="text-xs font-mono text-teal-600 font-bold mt-1">UPI ID: waniesrar2@okaxis</p>
                <p className="text-[10px] text-slate-400 uppercase font-semibold mt-2">Scan to pay with any UPI app</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-150 flex justify-end bg-slate-50">
              <button
                onClick={() => setShowQRModal(false)}
                className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition shadow cursor-pointer uppercase tracking-wider"
              >
                Close QR Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingPage;
