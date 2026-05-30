import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaFlask,
  FaFileMedical,
  FaMoneyBill,
  FaTimes
} from "react-icons/fa";

const navItems = [
  { to: "/dashboard", icon: <FaHome />, label: "Dashboard" },
  { to: "/lab-entry", icon: <FaFlask />, label: "Laboratory Entry" },
  { to: "/reports", icon: <FaFileMedical />, label: "Reports Log" },
  { to: "/billing", icon: <FaMoneyBill />, label: "Billing Ledger" },
];

const Sidebar = ({ onClose }) => {
  return (
    <div className="w-[260px] h-screen bg-white border-r border-slate-200/80 flex flex-col p-6 relative shrink-0 font-inter">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-1 py-2 mb-8">
        <div className="flex items-center gap-3">
          <div className="relative group shrink-0">
            <img
              src="/logo.jpg"
              alt="Gousia Clinical Laboratory Logo"
              className="w-10 h-10 rounded-xl object-cover border border-slate-150 shadow-sm transition-all duration-300"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></span>
          </div>
          <div className="min-w-0">
            <h1 className="text-slate-800 font-outfit text-base font-extrabold tracking-tight leading-none">
              GC<span className="text-teal-600 font-black">LIMS</span>
            </h1>
            <p className="text-slate-400 text-[8px] font-bold tracking-wider uppercase mt-1 leading-none">
              Clinical Laboratory
            </p>
          </div>
        </div>

        {/* Mobile close toggle */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-50 transition shrink-0 cursor-pointer border border-slate-100"
            title="Close Menu"
          >
            <FaTimes className="text-xs" />
          </button>
        )}
      </div>

      {/* Connection Capsule Badge */}
      <div className="mb-6 py-2 px-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider truncate">System Online</span>
        </div>
        <span className="text-[8px] font-extrabold bg-teal-50 text-teal-600 border border-teal-100/50 px-1.5 py-0.5 rounded-md">V2.4</span>
      </div>

      {/* Nav Menu */}
      <div className="flex flex-col gap-1.5 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            id={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold transition-all duration-200 group select-none ${
                isActive
                  ? "bg-teal-50/70 text-teal-700 border-l-4 border-teal-600 pl-3 shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`
            }
          >
            <span className="text-base shrink-0 transition-transform duration-250 group-hover:scale-105">
              {item.icon}
            </span>
            <span className="tracking-wide">{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest text-center pt-4 border-t border-slate-100">
        Gousia Diagnostics
      </div>
    </div>
  );
};

export default Sidebar;