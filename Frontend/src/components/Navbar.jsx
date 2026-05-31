import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaSearch, FaBars } from "react-icons/fa";

const Navbar = ({ onToggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/");
  };

  const userEmail = userInfo?.user?.email;
  const userDisplayName = userInfo?.user?.name;
  const userPicture = userInfo?.user?.picture;

  const userInitial = userEmail 
    ? userEmail.charAt(0).toUpperCase() 
    : userDisplayName 
      ? userDisplayName.charAt(0).toUpperCase() 
      : "U";
  
  const userName = userEmail || userDisplayName || "Clinical Staff";

  return (
    <div className="bg-white border-b border-slate-200/80 px-4 lg:px-8 py-3.5 flex justify-between items-center sticky top-0 z-40 font-inter">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger menu */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden text-slate-500 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-50 border border-slate-200/50 cursor-pointer flex items-center justify-center shrink-0"
          title="Open Menu"
        >
          <FaBars className="text-[11px]" />
        </button>

        <div>
          <h2 className="font-extrabold text-sm lg:text-base tracking-tight text-slate-800 font-outfit">
            Gousia Diagnostics
          </h2>
          <p className="text-[8px] lg:text-[9px] text-slate-400 font-bold tracking-widest uppercase">Diagnostic LIMS Workspace</p>
        </div>
      </div>

      <div className="flex items-center gap-5">
        {/* Real-time search panel */}
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search catalog profiles..."
            className="border border-slate-250 rounded-xl px-4 py-2 pl-9 w-64 outline-none text-xs transition focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-700 font-medium"
          />
          <FaSearch className="absolute left-3 top-3 text-slate-400 text-xs" />
        </div>

        {/* User profile capsule */}
        <div className="flex items-center gap-3 border-l border-slate-150 pl-5">
          {userPicture ? (
            <img
              src={userPicture}
              alt={userName}
              className="w-8 h-8 rounded-lg object-cover border border-slate-100 shadow-sm"
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {userInitial}
            </div>
          )}
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-slate-700 leading-tight">{userName}</p>
            <p className="text-[8px] font-extrabold text-slate-400 uppercase tracking-widest mt-0.5">Authorized Lab Staff</p>
          </div>

          <button
            onClick={logoutHandler}
            className="ml-2 bg-slate-50 text-slate-500 hover:bg-rose-50 hover:text-rose-600 p-2 rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer border border-slate-200/50"
            title="Log Out Session"
          >
            <FaSignOutAlt className="text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;