import {
  LayoutDashboard,
  Users,
  Baby,
  ShieldAlert,
  Activity,
  Lightbulb,
  BookOpen,
  Hospital,
  BarChart3,
  LogOut,
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

const AdminSideNav = ({ onNavItemClick }: NavProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const navItems = [
    { name: "Overview", path: "/admin", icon: LayoutDashboard },
    { name: "All Users", path: "/admin/users", icon: Users },
    { name: "Pregnancies", path: "/admin/pregnancies", icon: Baby },
    { name: "Emergency Alerts", path: "/admin/emergencies", icon: ShieldAlert },
    { name: "Health Check-ins", path: "/admin/checkins", icon: Activity },
    { name: "Health Tips", path: "/admin/health-tips", icon: Lightbulb },
    { name: "Guidance", path: "/admin/guidance", icon: BookOpen },
    { name: "Facilities", path: "/admin/facilities", icon: Hospital },
    { name: "Analytics", path: "/admin/analytics", icon: BarChart3 },
  ];

  const handleLogout = () => {
    MySwal.fire({
      title: "Are you sure you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
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
        }).then(() => {
          navigate("/");
        });
      }
    });
  };

  return (
    <nav className="flex flex-col h-full py-6 px-3 text-white overflow-y-auto">

      {/* Logo / Brand */}
      <div className="px-4 mb-6">
        <p className="text-xs font-black uppercase tracking-widest text-white/40">
          Admin Panel
        </p>
       
      </div>

      {/* Navigation Items */}
      <div className="flex-1 space-y-3">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === "/admin"}
            onClick={onNavItemClick}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-all
               text-white !text-white
               ${isActive
                 ? "bg-white/10 font-semibold !text-white"
                 : "hover:bg-white/5 !text-white"}`
            }
          >
            <item.icon
              size={20}
              className="mr-3"
              style={
                item.name === "Emergency Alerts"
                  ? { color: "#f4b8a0" }
                  : {}
              }
            />
            <span className="text-sm">{item.name}</span>
          </NavLink>
        ))}
      </div>

      {/* Logout */}
      <div className="mt-auto pt-6 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-white hover:text-rose-400 transition"
        >
          <LogOut size={20} className="mr-3" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>

    </nav>
  );
};

export default AdminSideNav;