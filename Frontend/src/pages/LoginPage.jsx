import { GoogleLogin } from "@react-oauth/google";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import api from "../services/api";
import { setCredentials } from "../features/auth/authSlice";
import { FaFlask, FaShieldAlt, FaAward, FaLock } from "react-icons/fa";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  const handleSuccess = async (credentialResponse) => {
    try {
      const { data } = await api.post("/auth/google", {
        credential: credentialResponse.credential,
      });

      dispatch(setCredentials(data));
      navigate("/dashboard");
    } catch (error) {
      alert("Login Failed");
    }
  };

  if (userInfo) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="relative min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8 font-inter overflow-hidden">
      {/* Subtle, soft background ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/[0.03] blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/[0.03] blur-[120px] pointer-events-none z-0"></div>

      <div className="max-w-5xl w-full bg-white rounded-[32px] shadow-xl shadow-slate-200/50 overflow-hidden grid md:grid-cols-2 min-h-[620px] border border-slate-200/60 z-10">
        {/* Left Side: Medical Branding Pane */}
        <div className="relative bg-gradient-to-br from-[#0F2043] via-[#09152e] to-[#050B18] p-10 md:p-12 flex flex-col justify-between text-white overflow-hidden">
          {/* Subtle sheen */}
          <div className="absolute inset-0 bg-white/[0.01] pointer-events-none"></div>

          {/* Top Brand Info */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="relative">
              <img
                src="/logo.jpg"
                alt="Gousia Clinical Laboratory Logo"
                className="w-10 h-10 rounded-xl object-cover border border-white/10 shadow-md shadow-teal-500/10"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#09152e]"></span>
            </div>
            <div>
              <h2 className="text-lg font-black font-outfit tracking-tight leading-none text-white">
                GC<span className="text-teal-400 font-extrabold">LIMS</span>
              </h2>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Gousia Diagnostics
              </p>
            </div>
          </div>

          {/* Middle Pitch & Value Props */}
          <div className="relative z-10 my-8 md:my-0">
            <h1 className="text-3xl md:text-4xl font-black font-outfit leading-tight mb-6 text-white tracking-tight">
              Clinical <br />
              <span className="bg-gradient-to-r from-teal-300 to-cyan-200 bg-clip-text text-transparent">Intelligence</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-350 mb-8 max-w-sm font-medium leading-relaxed">
              Welcome to the Gousia Diagnostics Clinical LIMS. Real-time patient entry, quick ledger tracking, and automated high-integrity clinical reporting.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl text-teal-400">
                  <FaFlask className="text-sm" />
                </div>
                <div>
                  <h4 className="text-xs md:text-sm font-bold font-outfit text-slate-200">Modern Specimen Ledger</h4>
                  <p className="text-[11px] text-slate-400">Real-time parameters and custom pricing overrides.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl text-teal-400">
                  <FaShieldAlt className="text-sm" />
                </div>
                <div>
                  <h4 className="text-xs md:text-sm font-bold font-outfit text-slate-200">Secure Report Vault</h4>
                  <p className="text-[11px] text-slate-400">Transparent technician signatures & high-resolution exports.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl text-teal-400">
                  <FaAward className="text-sm" />
                </div>
                <div>
                  <h4 className="text-xs md:text-sm font-bold font-outfit text-slate-200">Clinical Compliance</h4>
                  <p className="text-[11px] text-slate-400">Fully validated report templates and tracking logs.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer Info */}
          <div className="relative z-10 text-[9px] text-slate-500 font-bold uppercase tracking-wider">
            © 2026 Gousia Diagnostics. Clinical LIMS V2.4.
          </div>
        </div>

        {/* Right Side: Minimal Login Form */}
        <div className="p-10 md:p-16 flex flex-col justify-center bg-white">
          <div className="max-w-sm w-full mx-auto flex flex-col items-center">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-teal-600 mb-4">
                <FaLock className="text-lg" />
              </div>
              <h2 className="text-xl font-black font-outfit text-slate-800 tracking-tight">
                Staff Authentication
              </h2>
              <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                Authorized Lab Personnel Only
              </p>
            </div>

            {/* Login details card */}
            <div className="w-full bg-slate-50 border border-slate-100 p-4.5 rounded-2xl mb-8">
              <p className="text-xs text-slate-500 font-medium text-center leading-relaxed">
                Please sign in with your corporate Google credentials to access patient registries, billing logs, and laboratory reports.
              </p>
            </div>

            {/* Google Authentication Box */}
            <div className="w-full flex justify-center py-2">
              <div className="shadow-md hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden border border-slate-200/80">
                <GoogleLogin
                  onSuccess={handleSuccess}
                  onError={() => alert("Google Login Failed")}
                />
              </div>
            </div>

            {/* Safety details */}
            <div className="mt-8 text-center">
              <span className="text-[9px] text-slate-400 font-bold leading-relaxed block uppercase tracking-wide">
                🔐 Secured with SSL encryption
              </span>
              <span className="text-[8px] text-slate-450 font-medium leading-relaxed block mt-1.5">
                All login attempts and IP addresses are recorded inside auditing ledgers. Unauthorized access is strictly prohibited.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;