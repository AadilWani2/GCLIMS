import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { FaUsers, FaFileMedical, FaClock, FaCheckCircle, FaChevronRight, FaSync, FaMicroscope } from "react-icons/fa";

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
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

const avatarStyles = (name = "") => {
  const idx = (name.charCodeAt(0) || 0) % AVATAR_PALETTES.length;
  return AVATAR_PALETTES[idx];
};

// ── Component ─────────────────────────────────────────────────────────────────
const DashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo?.token) {
        navigate("/");
        return;
      }
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await api.get("/dashboard", config);
      setStats(data);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to load dashboard. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);

  // ── Stat cards config ─────────────────────────────────────────────────────
  const statCards = stats ? [
    {
      label: "Total Registered Patients",
      value: stats.totalPatients ?? 0,
      icon: <FaUsers className="text-teal-600" />,
      accentClass: "border-t-2 border-t-teal-500",
      iconBg: "bg-teal-50/60"
    },
    {
      label: "Diagnostic Reports Logged",
      value: stats.totalReports ?? 0,
      icon: <FaFileMedical className="text-sky-600" />,
      accentClass: "border-t-2 border-t-sky-500",
      iconBg: "bg-sky-50/60"
    },
    {
      label: "Pending Verification",
      value: stats.pendingReports ?? 0,
      icon: <FaClock className="text-amber-600" />,
      accentClass: "border-t-2 border-t-amber-500",
      iconBg: "bg-amber-50/60"
    },
    {
      label: "Certified Diagnoses",
      value: stats.completedReports ?? 0,
      icon: <FaCheckCircle className="text-emerald-600" />,
      accentClass: "border-t-2 border-t-emerald-500",
      iconBg: "bg-emerald-50/60"
    },
  ] : [];

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-10 h-10 border-3 border-slate-200 border-t-teal-600 rounded-full animate-spin"></div>
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Synchronizing LIMS ledger database...</p>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="max-w-lg mx-auto mt-16 text-center p-8 bg-white rounded-3xl border border-rose-100 shadow-lg shadow-rose-500/5">
        <div className="text-4xl mb-4">🔬</div>
        <h2 className="text-rose-600 text-base font-bold font-outfit mb-2">
          Dashboard Connection Failed
        </h2>
        <p className="text-slate-500 text-xs mb-6 leading-relaxed">
          {error}
        </p>
        <button
          onClick={fetchDashboard}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white transition-all font-bold text-xs cursor-pointer shadow-sm shadow-teal-900/10"
        >
          <FaSync className="text-xs" /> Retry Synchronization
        </button>
      </div>
    );
  }

  const recentReports = stats?.recentReports ?? [];

  return (
    <div className="space-y-6 font-inter">

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black font-outfit text-slate-800 tracking-tight">
            Dashboard Analytics
          </h1>
          <p className="text-slate-400 text-[10px] font-bold mt-1 uppercase tracking-widest flex items-center gap-1.5">
            <FaMicroscope className="text-teal-600 text-[10px]" />
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <button
          id="dashboard-refresh"
          onClick={fetchDashboard}
          className="inline-flex items-center gap-2 px-3.5 py-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 transition text-xs font-bold shadow-sm cursor-pointer"
        >
          <FaSync className="text-xs" /> Refresh Ledger
        </button>
      </div>

      {/* ── Stat cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`bg-white rounded-2xl p-5 border border-slate-150 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${card.accentClass}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                  {card.label}
                </p>
                <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight leading-none">
                  {card.value}
                </h3>
              </div>
              <div className={`w-8 h-8 rounded-xl ${card.iconBg} flex items-center justify-center text-sm shadow-inner`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Completion bar ───────────────────────────────────────────────── */}
      {stats && (stats.totalReports ?? 0) > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-slate-150 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-slate-700 text-xs uppercase tracking-wider font-outfit">Report Verification Ratio</span>
            <span className="font-extrabold text-teal-600 text-xs tracking-wide">
              {Math.round(((stats.completedReports ?? 0) / (stats.totalReports ?? 1)) * 100)}% Verified
            </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-teal-600 transition-all duration-1000 ease-out"
              style={{
                width: `${Math.round(((stats.completedReports ?? 0) / (stats.totalReports ?? 1)) * 100)}%`,
              }}
            />
          </div>
          <div className="flex justify-between mt-2.5 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
            <span>
              🧪 {stats.completedReports ?? 0} Certified Reports
            </span>
            <span>
              ⏳ {stats.pendingReports ?? 0} In Progress
            </span>
          </div>
        </div>
      )}

      {/* ── Recent reports table ─────────────────────────────────────────── */}
      <div className="bg-transparent sm:bg-white sm:rounded-2xl sm:border sm:border-slate-150 sm:shadow-sm sm:overflow-hidden">
        {/* Table header */}
        <div className="flex items-center justify-between px-6 py-5 border border-slate-150 sm:border-none sm:border-b border-b-slate-150 bg-slate-50/20 bg-white rounded-2xl sm:rounded-none shadow-sm sm:shadow-none mb-4 sm:mb-0">
          <h2 className="text-xs font-bold font-outfit text-slate-850 uppercase tracking-wider">
            Recent Patient Diagnostics
          </h2>
          <button
            id="view-all-reports"
            onClick={() => navigate("/reports")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white transition text-xs font-bold shadow-sm cursor-pointer"
          >
            Open Logs Archive <FaChevronRight className="text-[9px]" />
          </button>
        </div>

        {recentReports.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-2xl border border-slate-150 sm:border-none">
            <div className="text-4xl mb-4">🔬</div>
            <p className="text-slate-600 font-bold text-sm">No Active Patient Diagnostics Found</p>
            <p className="text-slate-400 text-xs mt-1">
              Create a new patient log to record laboratory Diagnostic Parameters.
            </p>
            <button
              onClick={() => navigate("/lab-entry")}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white transition font-semibold text-xs cursor-pointer shadow-sm"
            >
              + Register Patient Entry
            </button>
          </div>
        ) : (
          <>
            {/* MOBILE ONLY CARD LIST (No horizontal side-scrolling, beautiful vertical stacks) */}
            <div className="block sm:hidden space-y-4 py-2">
              {recentReports.map((report, idx) => {
                const patient = report?.patient;
                if (!patient) return null;

                const name = patient?.name ?? "Unknown";
                const phone = patient?.phone ?? "—";
                const testCount = report?.tests?.length ?? 0;
                const isCompleted = report?.status === "Completed";
                const st = avatarStyles(name);

                return (
                  <div key={report._id ?? idx} className="bg-white rounded-2xl border border-slate-150 p-5 space-y-4 shadow-sm hover:shadow-md transition duration-150">
                    {/* Profile & Status Row */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8.5 h-8.5 rounded-lg flex-shrink-0 flex items-center justify-center font-bold text-xs shadow-inner border ${st}`}>
                          {getInitials(name)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-700 text-sm leading-snug">{name}</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                            {patient?.age ?? "?"} Years · {patient?.gender ?? "—"}
                          </div>
                        </div>
                      </div>
                      
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border ${
                        isCompleted
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : "bg-amber-50 text-amber-600 border-amber-100"
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${isCompleted ? "bg-emerald-500" : "bg-amber-500"}`} />
                        {report?.status ?? "Pending"}
                      </span>
                    </div>

                    {/* Metadata Grid Container */}
                    <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-500 font-semibold bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider mb-0.5">Contact</span>
                        <span className="font-mono text-slate-600">{phone}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider mb-0.5">Diagnostic Tests</span>
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[9.5px] font-bold tracking-wide uppercase border border-slate-150">
                          {testCount} Parameter Set{testCount !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    {/* Action & Date Row */}
                    <div className="flex items-center justify-between gap-4 pt-1">
                      <span className="text-[9.5px] text-slate-400 font-bold font-mono">
                        {formatDate(report?.createdAt)}
                      </span>
                      
                      <button
                        id={`view-patient-mobile-${patient._id}`}
                        onClick={() => navigate(`/reports/${patient._id}`)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white transition-all font-bold text-xs cursor-pointer shadow-sm flex-1 justify-center"
                      >
                        📂 Open Report <FaChevronRight className="text-[8px]" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* DESKTOP TABLE ONLY (Hidden on mobile screens, responsive layouts) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    {["Patient Profile", "Contact Phone", "Diagnostic Tests", "Clinical Status", "Date Registered", "Action"].map((h) => (
                      <th key={h} className="px-6 py-3.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-150">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentReports.map((report, idx) => {
                    const patient = report?.patient;
                    if (!patient) return null;

                    const name = patient?.name ?? "Unknown";
                    const phone = patient?.phone ?? "—";
                    const testCount = report?.tests?.length ?? 0;
                    const isCompleted = report?.status === "Completed";
                    const st = avatarStyles(name);

                    return (
                      <tr
                        key={report._id ?? idx}
                        className="hover:bg-slate-50/30 transition duration-150 text-xs text-slate-600"
                      >
                        {/* Patient */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8.5 h-8.5 rounded-lg flex-shrink-0 flex items-center justify-center font-bold text-xs shadow-inner border ${st}`}>
                              {getInitials(name)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-700 text-sm leading-snug">{name}</div>
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                                {patient?.age ?? "?"} Years · {patient?.gender ?? "—"}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Phone */}
                        <td className="px-6 py-4 text-xs font-semibold text-slate-500 font-mono">
                          {phone}
                        </td>

                        {/* Tests count */}
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold tracking-wide uppercase border border-slate-150">
                            {testCount} Parameter Set{testCount !== 1 ? "s" : ""}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border ${
                            isCompleted
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : "bg-amber-50 text-amber-600 border-amber-100"
                          }`}>
                            <span className={`w-1 h-1 rounded-full ${isCompleted ? "bg-emerald-500" : "bg-amber-500"}`} />
                            {report?.status ?? "Pending"}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 text-xs text-slate-400 font-semibold font-mono">
                          {formatDate(report?.createdAt)}
                        </td>

                        {/* View button */}
                        <td className="px-6 py-4">
                          <button
                            id={`view-patient-${patient._id}`}
                            onClick={() => navigate(`/reports/${patient._id}`)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:bg-teal-600 hover:text-white hover:border-teal-600 transition-all font-bold text-xs cursor-pointer shadow-sm"
                          >
                            📂 Open Diagnostic Report <FaChevronRight className="text-[8px]" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;