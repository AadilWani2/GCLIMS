import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  FaSearch,
  FaFlask,
  FaEye,
  FaFilter,
  FaSync,
  FaChevronDown,
  FaMicroscope
} from "react-icons/fa";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const getStatusStyle = (status) => {
  if (status === "Completed")
    return { bg: "bg-emerald-50 text-emerald-600 border-emerald-100", dot: "bg-emerald-500" };
  return { bg: "bg-amber-50 text-amber-600 border-amber-100", dot: "bg-amber-500" };
};

const getInitials = (name = "") =>
  name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

const AVATAR_PALETTES = [
  "bg-teal-50 text-teal-700 border-teal-100",
  "bg-blue-50 text-blue-700 border-blue-100",
  "bg-indigo-50 text-indigo-700 border-indigo-100",
  "bg-sky-50 text-sky-700 border-sky-100",
  "bg-slate-50 text-slate-700 border-slate-100"
];

const avatarGradient = (name = "") => {
  const idx = name.charCodeAt(0) % AVATAR_PALETTES.length;
  return AVATAR_PALETTES[idx];
};

// ─── Group reports by patient ─────────────────────────────────────────────────
const groupByPatient = (reports) => {
  const map = new Map();
  reports.forEach((r) => {
    const pid = r.patient?._id;
    if (!pid) return;
    if (!map.has(pid)) {
      map.set(pid, { patient: r.patient, reports: [] });
    }
    map.get(pid).reports.push(r);
  });
  return Array.from(map.values());
};

// ─── Component ────────────────────────────────────────────────────────────────
const ReportsHistoryPage = () => {
  const navigate = useNavigate();
  const [allReports, setAllReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedPatient, setExpandedPatient] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await api.get("/reports/all", config);
      setAllReports(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // ── Filter reports by status then group ───────────────────────────────────
  const filtered = useMemo(() => {
    let list = allReports;
    if (statusFilter !== "All") {
      list = list.filter((r) => r.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.patient?.name?.toLowerCase().includes(q) ||
          r.patient?.phone?.includes(q)
      );
    }
    return list;
  }, [allReports, search, statusFilter]);

  const grouped = useMemo(() => groupByPatient(filtered), [filtered]);

  const totalCompleted = allReports.filter((r) => r.status === "Completed").length;
  const totalPending = allReports.filter((r) => r.status !== "Completed").length;
  const uniquePatients = new Set(allReports.map((r) => r.patient?._id)).size;

  // ── Toggle expand ─────────────────────────────────────────────────────────
  const toggleExpand = (pid) =>
    setExpandedPatient((prev) => (prev === pid ? null : pid));

  return (
    <div className="space-y-6 font-inter pb-12">
      {/* ── Page header ───────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-6 border border-slate-150 shadow-sm">
        <div>
          <h1 className="text-xl md:text-2xl font-black font-outfit tracking-tight text-slate-800">
            Diagnostic Archives & History
          </h1>
          <p className="text-slate-450 text-xs font-semibold mt-1.5 uppercase tracking-wider flex items-center gap-1.5">
            <FaMicroscope className="text-teal-600 text-[10px]" />
            Access past visits, monitor patient files, and check clinical verification logs
          </p>

          {/* Stat pills */}
          <div className="flex flex-wrap gap-4 mt-6">
            {[
              { label: "Total Reports", value: allReports.length, accentClass: "border-t-2 border-t-slate-500" },
              { label: "Registered Patients", value: uniquePatients, accentClass: "border-t-2 border-t-teal-500" },
              { label: "Certified", value: totalCompleted, accentClass: "border-t-2 border-t-emerald-500" },
              { label: "In Progress", value: totalPending, accentClass: "border-t-2 border-t-amber-500" },
            ].map((s) => (
              <div
                key={s.label}
                className={`bg-slate-50 border border-slate-150 rounded-xl px-5 py-3 text-center min-w-[130px] flex flex-col items-center justify-center shadow-inner ${s.accentClass}`}
              >
                <span className="text-xl font-extrabold font-outfit tracking-tight leading-none text-slate-800">{s.value}</span>
                <span className="text-[9px] text-slate-450 font-bold uppercase tracking-wider mt-2">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Controls bar ──────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            id="reports-search"
            type="text"
            placeholder="Search patient file by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-1.5 pl-9 outline-none text-xs transition focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 bg-slate-50/50 hover:bg-slate-50 focus:bg-white font-semibold text-slate-700"
          />
          <FaSearch className="absolute left-3 top-2.5 text-slate-400 text-xs" />
        </div>

        {/* Filters and Refresh */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1.5 text-[9px]">
            <FaFilter className="text-[9px]" /> Filter:
          </span>
          {["All", "Completed", "Pending"].map((s) => (
            <button
              key={s}
              id={`filter-${s.toLowerCase()}`}
              onClick={() => setStatusFilter(s)}
              className={`px-3.5 py-1.5 rounded-xl font-bold uppercase tracking-wider text-[10px] border transition cursor-pointer ${
                statusFilter === s
                  ? s === "Completed"
                    ? "bg-emerald-550 border-emerald-600 text-white shadow-sm"
                    : s === "Pending"
                    ? "bg-amber-600 border-amber-600 text-white shadow-sm"
                    : "bg-slate-800 border-slate-850 text-white shadow-sm"
                  : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              }`}
            >
              {s}
            </button>
          ))}

          <button
            id="refresh-reports"
            onClick={fetchAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 transition font-bold text-xs shadow-sm ml-2 cursor-pointer"
          >
            <FaSync className="text-[9px]" /> Refresh Ledger
          </button>
        </div>
      </div>

      {/* ── Loading ────────────────────────────────────────────────────────── */}
      {loading && (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-3 border-slate-200 border-t-teal-600 rounded-full animate-spin inline-block"></div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-3">Re-indexing archive files...</p>
        </div>
      )}

      {/* ── Empty state ────────────────────────────────────────────────────── */}
      {!loading && grouped.length === 0 && (
        <div className="text-center py-16 px-4 bg-white rounded-2xl border border-slate-150 shadow-sm">
          <div className="text-4xl mb-3">🔬</div>
          <p className="text-slate-600 font-bold text-sm">No Diagnostic Parameters</p>
          <p className="text-slate-400 text-xs mt-1">
            {search ? "No reports match your active search terms." : "No patient diagnostic records have been entered yet."}
          </p>
        </div>
      )}

      {/* ── Patient cards ─────────────────────────────────────────────────── */}
      <div className="space-y-4">
        {!loading && grouped.map(({ patient, reports }) => {
          const pid = patient._id;
          const isOpen = expandedPatient === pid;
          const stStyles = avatarGradient(patient.name);
          const completedCount = reports.filter((r) => r.status === "Completed").length;
          const latestDate = reports[0]?.createdAt;

          return (
            <div
              key={pid}
              id={`patient-${pid}`}
              className="bg-white rounded-2xl border border-slate-150 shadow-sm overflow-hidden transition duration-150"
            >
              {/* ── Card header row ─────────────────────────────────────────── */}
              <div
                onClick={() => toggleExpand(pid)}
                className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 cursor-pointer transition-colors ${
                  isOpen ? "bg-slate-50/50 border-b border-slate-150" : "hover:bg-slate-50/30"
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-sm shadow-inner border ${stStyles}`}>
                    {getInitials(patient.name)}
                  </div>

                  {/* Info */}
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-800 text-sm md:text-base leading-snug">
                      {patient.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-400 text-[9px] md:text-[10px] font-bold uppercase tracking-wider">
                      <span className="flex items-center gap-1 font-mono text-slate-500">
                        📱 {patient.phone}
                      </span>
                      <span className="flex items-center gap-1 border-l border-slate-200 pl-4 text-slate-500">
                        👤 {patient.age} Yrs · {patient.gender}
                      </span>
                      <span className="flex items-center gap-1 border-l border-slate-200 pl-4 font-mono text-slate-400">
                        📅 Registered: {formatDate(latestDate)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-3.5 self-end md:self-center">
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100/50 text-[9px] font-black uppercase tracking-wider rounded-md">
                    {completedCount} of {reports.length} Certified
                  </span>
                  
                  <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 border border-blue-100/50 text-[9px] font-black uppercase tracking-wider rounded-md">
                    {reports.length} Visit{reports.length !== 1 ? "s" : ""}
                  </span>

                  {/* Expand chevron */}
                  <div className={`w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 text-xs transition-transform duration-150 ${
                    isOpen ? "rotate-180" : ""
                  }`}>
                    <FaChevronDown className="text-[9px]" />
                  </div>
                </div>
              </div>

              {/* ── Expanded report list ─────────────────────────────────────── */}
              {isOpen && (
                <div className="p-5 bg-slate-50/20 border-t border-slate-150/40">
                  <div className="space-y-3">
                    {reports.map((report, idx) => {
                      const st = getStatusStyle(report.status);
                      const testCount = report.tests?.length || 0;
                      const testNames = report.tests
                        ?.map((t) => (typeof t === "string" ? t : t.testName || t.name || "Test"))
                        .slice(0, 3)
                        .join(", ");
                      const moreCount = testCount > 3 ? `+${testCount - 3} more` : "";

                      return (
                        <div
                          key={report._id}
                          id={`report-${report._id}`}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-150 hover:shadow-sm transition duration-150"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Report number badge */}
                            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center font-extrabold text-[11px] shadow-sm font-outfit">
                              #{idx + 1}
                            </div>

                            {/* Report details */}
                            <div className="min-w-0">
                              <h4 className="font-bold text-slate-800 text-xs md:text-sm flex items-center gap-1.5 truncate">
                                <FaFlask className="text-teal-600 flex-shrink-0" /> {testNames || "No Tests Recorded"}{moreCount ? `, ${moreCount}` : ""}
                              </h4>
                              <div className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 flex flex-wrap gap-x-4 gap-y-0.5">
                                <span className="font-mono">{formatDate(report.createdAt)}</span>
                                {report.referredBy && <span className="border-l border-slate-200 pl-4 text-slate-400">Ref: {report.referredBy}</span>}
                                <span className="border-l border-slate-200 pl-4 font-mono text-teal-600">LAB ID: {report._id.toString().slice(-6).toUpperCase()}</span>
                              </div>
                            </div>
                          </div>

                          {/* View Report */}
                          <div className="flex items-center gap-3 justify-between sm:justify-end text-xs">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${st.bg}`}>
                              <span className={`w-1 h-1 rounded-full ${st.dot}`} />
                              {report.status || "Pending"}
                            </span>

                            <button
                              id={`view-report-${report._id}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/reports/${patient._id}`);
                              }}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition text-xs font-bold shadow-sm cursor-pointer border border-teal-600"
                            >
                              <FaEye /> Open Diagnostic Report
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReportsHistoryPage;
