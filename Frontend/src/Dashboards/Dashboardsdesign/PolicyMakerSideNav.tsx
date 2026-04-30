import {
  LayoutDashboard,
  Map,
  AlertTriangle,
  LogOut,
  FileText,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useDispatch } from "react-redux";
import { clearCredentials } from "../../Features/Auth/AuthSlice";

interface NavProps {
  onNavItemClick?: () => void;
}

const MySwal = withReactContent(Swal);
const midnightTeal = "#002e33";

const PolicyMakerSideNav = ({ onNavItemClick }: NavProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const navItems = [
    { name: "Overview", path: "/policymaker", icon: LayoutDashboard },
    { name: "National Summary", path: "/policymaker/national-summary", icon: Map },
    { name: "Risk Overview & Trends", path: "/policymaker/risk-trends", icon: AlertTriangle },
    { name: "Print Report", path: "/policymaker/report", icon: FileText },
  ];

  const handleLogout = () => {
    MySwal.fire({
      title: "Are you sure you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: midnightTeal,
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Log out",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(clearCredentials());
        MySwal.fire({
          icon: "success",
          title: "Logged out",
          text: "You have been successfully logged out.",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => navigate("/"));
      }
    });
  };

  return (
    <nav
      className="flex flex-col h-full px-3 pt-4 overflow-y-auto"
      style={{ backgroundColor: midnightTeal, color: "#ffffff" }}
    >
      {/* Brand */}
      <div className="px-4 pt-2">
        <p className="text-xs font-black uppercase tracking-widest text-white/40">
          Policy Maker
        </p>
      </div>

      {/* Nav Items */}
      <div className="flex-1 space-y-3 pt-6">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === "/policymaker"}
            onClick={onNavItemClick}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-all text-white ${isActive ? "font-semibold" : ""}`
            }
          >
            <item.icon size={22} className="mr-3" />
            <span className="text-base">{item.name}</span>
          </NavLink>
        ))}
      </div>

      {/* Logout */}
      <div className="mt-auto pt-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-white transition"
        >
          <LogOut size={22} className="mr-3" />
          <span className="text-base font-medium">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default PolicyMakerSideNav;