import { 
  LayoutDashboard, 
  Activity, 
  Sparkles, 
  BellRing, 
  Baby, 
  BookOpen, 
  UserCircle, 
  LogOut 
} from "lucide-react";
import { NavLink } from "react-router-dom";

interface NavProps {
  onNavItemClick?: () => void;
}

const UserSideNav = ({ onNavItemClick }: NavProps) => {
  const aqua = "#86d9e1";

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Health Monitoring', path: '/health-monitoring', icon: Activity },
    { name: 'Pregnancy Journey', path: '/journey', icon: Sparkles },
    { name: 'Clinic Reminders', path: '/reminders', icon: BellRing },
    { name: 'Child Development', path: '/child-dev', icon: Baby },
    { name: 'Health Education', path: '/education', icon: BookOpen },
    { name: 'Profile', path: '/profile', icon: UserCircle },
  ];

  return (
    <nav className="flex flex-col h-full py-6">
      {/* Nav Links Section */}
      <div className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={onNavItemClick}
            className={({ isActive }) =>
              `flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 group
               ${isActive 
                 ? 'bg-[#ffffff10] text-white font-bold' 
                 : 'text-white hover:bg-[#ffffff05] font-medium'}`
            }
          >
            {/* Icon */}
            <item.icon 
              size={22} 
              className="mr-4 transition-colors"
              style={{ color: 'inherit' }} 
              strokeWidth={2}
            />

            {/* Link Text */}
            <span className="text-sm tracking-wide">{item.name}</span>

            {/* Optional Active Indicator */}
            {/* This can stay outside if you want a small dot */}
          </NavLink>
        ))}
      </div>

      {/* Logout Section */}
      <div className="mt-auto pt-6 border-t border-white/10">
        <button 
          className="flex items-center w-full px-4 py-3 text-white hover:text-rose-400 transition-colors group"
          onClick={() => {/* Add your logout logic here */}}
        >
          <LogOut size={20} className="mr-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-semibold italic">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default UserSideNav;