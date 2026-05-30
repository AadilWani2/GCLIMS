import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const DashboardLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f6f8fb] flex overflow-hidden font-inter relative select-none">
      {/* Minimal ambient background mesh glows */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-teal-500/[0.03] blur-[130px] animate-glow-1 pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-[20%] w-[30vw] h-[30vw] rounded-full bg-sky-500/[0.03] blur-[120px] pointer-events-none z-0"></div>

      {/* Modern Left Sidebar (Desktop only) */}
      <div className="hidden lg:flex shrink-0 z-20">
        <Sidebar />
      </div>

      {/* Mobile Drawer Sidebar Overlay (Slide out menu) */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/45 backdrop-blur-xs z-50 lg:hidden flex transition-all duration-300"
          onClick={() => setMobileSidebarOpen(false)}
        >
          <div 
            className="w-[260px] h-screen bg-white shadow-2xl animate-in slide-in-from-left duration-250 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar onClose={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-screen z-10 overflow-hidden">
        {/* Navbar */}
        <Navbar onToggleSidebar={() => setMobileSidebarOpen(true)} />

        {/* Workspace scrollable section */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-[1500px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;