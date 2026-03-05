import {
  LayoutDashboard,
  Activity,
  Sparkles,
  BellRing,
  Baby,
  BookOpen,
  UserCircle,
  LogOut,
} from "lucide-react";
import { NavLink } from "react-router-dom";

interface NavProps {
  onNavItemClick?: () => void;
}

const UserSideNav = ({ onNavItemClick }: NavProps) => {

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "My Health Monitoring", path: "/dashboard/health-monitoring", icon: Activity },
    { name: "Pregnancy Journey", path: "/dashboard/journey", icon: Sparkles },
    { name: "Clinic Reminders", path: "/dashboard/reminders", icon: BellRing },
    { name: "Child Development", path: "/dashboard/child-dev", icon: Baby },
    { name: "Health Education", path: "/dashboard/education", icon: BookOpen },
    { name: "Profile", path: "/dashboard/profile", icon: UserCircle },
  ];

  return (
    <nav className="flex flex-col h-full py-6 px-3 text-white">

      {/* Navigation Links */}
      <div className="flex-1 space-y-3">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={onNavItemClick}
              className={({ isActive }) =>
  `flex items-center px-4 py-3 rounded-lg transition-all
   text-white !text-white
   ${isActive
     ? "bg-white/10 font-semibold !text-white"
     : "hover:bg-white/5 !text-white"}`
}
          >
            <item.icon size={20} className="mr-3" />
            <span className="text-sm">{item.name}</span>
          </NavLink>
        ))}
      </div>

      {/* Logout Section */}
      <div className="mt-auto pt-6 border-t border-white/10">
        <button className="flex items-center w-full px-4 py-3 text-white hover:text-rose-400 transition">
          <LogOut size={20} className="mr-3" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>

    </nav>
  );
};

export default UserSideNav;