import {
  Activity,
  Sparkles,
  BellRing,
  Baby,
  BookOpen,
  UserCircle,
  LogOut,
  ShieldAlert,
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

const UserSideNav = ({ onNavItemClick }: NavProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const midnightTeal = "#002e33";

  const navItems = [
    { name: "Pregnancy Journey", path: "/dashboard/journey", icon: Sparkles },
    { name: "My Health Monitoring", path: "/dashboard/health-monitoring", icon: Activity },
    { name: "Clinic Reminders", path: "/dashboard/reminders", icon: BellRing },
    { name: "Child Development", path: "/dashboard/child-dev", icon: Baby },
    { name: "BabyCentreAI", path: "/dashboard/babycentre-ai", icon: BookOpen },
    { name: "Emergency", path: "/dashboard/emergency", icon: ShieldAlert },
    { name: "Profile", path: "/dashboard/profile", icon: UserCircle },
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
      className="flex flex-col px-2 pt-0 text-white overflow-hidden"
      style={{ backgroundColor: midnightTeal, height: "100%", minHeight: "100%" }}
    >
      {/* Brand Label */}
      <div className="px-6 pt-6">
        <p className="text-xs font-black uppercase tracking-widest text-white/40">
          My Dashboard
        </p>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 space-y-2 overflow-y-auto pt-6">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={onNavItemClick}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-all text-white !text-white ${
                isActive ? "font-semibold bg-white/10" : ""
              }`
            }
          >
            <item.icon size={22} className="mr-3" />
            <span className="text-base">{item.name}</span>
          </NavLink>
        ))}
      </div>

      {/* Logout */}
      <div className="mt-auto pt-4 border-t border-white/10 shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 rounded-lg text-white hover:bg-white/10 hover:text-rose-400 transition-all"
        >
          <LogOut size={22} className="mr-3" />
          <span className="text-base font-medium">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default UserSideNav;