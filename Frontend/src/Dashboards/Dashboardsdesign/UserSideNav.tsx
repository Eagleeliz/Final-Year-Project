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
  // MamaCare Colors
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
      <div className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={onNavItemClick}
            className={({ isActive }) => `
              flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 group
              ${isActive 
                ? 'bg-[#ffffff10] text-white' 
                : 'text-gray-400 hover:text-white hover:bg-[#ffffff05]'}
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  size={22} 
                  className="mr-4 transition-colors" 
                  style={{ color: isActive ? aqua : 'inherit' }} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className={`text-sm tracking-wide ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {item.name}
                </span>
                {isActive && (
                   <div 
                     className="ml-auto w-1.5 h-1.5 rounded-full" 
                     style={{ backgroundColor: aqua }}
                   />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Logout Section */}
      <div className="mt-auto pt-6 border-t border-white/10">
        <button 
          className="flex items-center w-full px-4 py-3 text-gray-500 hover:text-rose-400 transition-colors group"
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