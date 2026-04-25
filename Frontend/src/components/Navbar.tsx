import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../Features/store";
import { clearCredentials } from "../Features/Auth/AuthSlice";
import { Menu, X, ChevronDown, House, Info, Calendar, Mail, LayoutDashboard, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../Features/ThemeContext";

const NAV_LINKS = [
  { name: "Home", to: "/", icon: House },
  { name: "About", to: "/about", icon: Info },
  { name: "DueDate", to: "/duedatecalculator", icon: Calendar },
  { name: "Contact", to: "/contact", icon: Mail },
];

const MID = "#002e33";
const TEAL = "#86d9e1";
const ACCENT = "#00a0b0";

interface NavbarProps {
  hideThemeToggle?: boolean;
}

const Navbar = ({ hideThemeToggle = false }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { user, isAuthenticated } = useSelector((s: RootState) => s.auth);

  const bg = isDark ? "#0a2a2e" : "#ffffff";
  const border = isDark ? "#1a4a50" : "#e5e7eb";
  const text = isDark ? "#ffffff" : MID;

  const handleLogout = () => {
    dispatch(clearCredentials());
    setDropdownOpen(false);
    setIsOpen(false);
    navigate("/login");
  };

  const dashPath =
    user?.userType === "admin" ? "/admin" :
    user?.userType === "policy_maker" ? "/policymaker" : "/dashboard/journey";

  return (
    <nav className="relative shadow-sm border-b z-50" style={{ backgroundColor: bg, borderColor: border }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-1">
          <img src="/src/assets/logo.png" alt="BabyCentre Logo" className="w-24 h-24 object-contain" />
          <span className="text-2xl font-bold" style={{ color: MID }}>
            Baby<span style={{ color: ACCENT }}>Centre</span>
          </span>
        </Link>

        {/* Desktop Links — centered */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-4">
          {NAV_LINKS.map((l) => {
            const Icon = l.icon;
            return (
              <Link key={l.name} to={l.to} className="flex items-center gap-2 px-3 py-1 rounded-lg text-base font-bold transition-all hover:bg-[#86d9e120]" style={{ color: text }}>
                <Icon size={18} />
                <span>{l.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          {!hideThemeToggle && <ThemeToggle />}
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="px-5 py-2 text-sm font-bold rounded-full border-2" style={{ borderColor: text, color: text }}>Login</Link>
              <Link to="/register" className="px-5 py-2 text-sm font-bold rounded-full shadow-md" style={{ backgroundColor: isDark ? TEAL : MID, color: isDark ? MID : TEAL }}>Register</Link>
            </>
          ) : (
            <div className="relative">
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 px-5 py-2 rounded-full shadow-md" style={{ backgroundColor: isDark ? TEAL : MID, color: isDark ? MID : TEAL }}>
                Hey {user?.firstName} <ChevronDown size={16} />
              </button>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-56 rounded-xl shadow-xl overflow-hidden border"
                    style={{ backgroundColor: bg, borderColor: border }}
                  >
                    <Link to={dashPath} onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold hover:bg-gray-100" style={{ color: text }}>
  <LayoutDashboard size={16} /> My Dashboard
</Link>
<button onClick={handleLogout} className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm font-semibold hover:bg-gray-100" style={{ color: MID }}>
  <LogOut size={16} /> Terminate Session
</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Hamburger */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2" style={{ color: text }}>
          <AnimatePresence mode="wait">
            <motion.div key={isOpen ? "x" : "menu"} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </motion.div>
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="md:hidden absolute top-full left-0 w-full shadow-xl border-t z-50 origin-top"
            style={{ backgroundColor: bg, borderColor: border }}
          >
            <div className="flex flex-col px-6 py-3 gap-0">
              {NAV_LINKS.map((l, i) => {
                const Icon = l.icon;
                return (
                <motion.div key={l.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                  <Link
                    to={l.to}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-3 py-3 text-base font-semibold border-b"
                    style={{ color: text, borderColor: border }}
                  >
                    <Icon size={18} />
                    {l.name}
                  </Link>
                </motion.div>
                );
              })}

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="flex gap-3 pt-3 pb-1">
                {!isAuthenticated ? (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)} className="flex-1 py-2 text-center text-sm font-bold rounded-xl border-2" style={{ borderColor: isDark ? TEAL : MID, color: isDark ? TEAL : MID }}>Login</Link>
                    <Link to="/register" onClick={() => setIsOpen(false)} className="flex-1 py-2 text-center text-sm font-bold rounded-xl" style={{ backgroundColor: isDark ? TEAL : MID, color: isDark ? MID : TEAL }}>Register</Link>
                  </>
                ) : (
                  <>
                    <Link to={dashPath} onClick={() => setIsOpen(false)} className="flex-1 py-2 text-center text-sm font-bold rounded-xl" style={{ backgroundColor: isDark ? TEAL : MID, color: isDark ? MID : TEAL }}>Dashboard</Link>
                    <button onClick={handleLogout} className="flex-1 py-2 text-sm font-bold rounded-xl border-2 border-red-400 text-red-400">Logout</button>
                  </>
                )}
              </motion.div>

              <div className="pb-2 flex justify-center">
                {!hideThemeToggle && <ThemeToggle />}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;