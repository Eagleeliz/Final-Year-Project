import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X, Bell, HeartPulse } from "lucide-react";
import UserSideNav from "./UserSideNav";

const UserLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // MamaCare Brand Colors
  const midnightTeal = "#002e33";
  const aquaText = "#86d9e1";

  return (
    <div className="min-h-screen flex bg-[#f4f7f7] font-sans">
      
      {/* 1. DESKTOP SIDEBAR */}
      <aside 
        style={{ backgroundColor: midnightTeal }}
        className="hidden lg:flex flex-col w-72 fixed inset-y-0 left-0 z-50 border-r border-white/10"
      >
        <div className="p-8">
          <h1 style={{ color: aquaText }} className="text-2xl font-black tracking-tight">
            MamaCare<span className="text-white">.</span>
          </h1>
        </div>
        <div className="flex-1 px-4">
          <UserSideNav />
        </div>
      </aside>

      {/* 2. MOBILE SIDEBAR DRAWER */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setSidebarOpen(false)} 
          />
          <aside 
            style={{ backgroundColor: midnightTeal }}
            className="fixed top-0 left-0 bottom-0 w-3/4 max-w-xs shadow-2xl transition-transform"
          >
            <div className="p-6 flex justify-between items-center border-b border-white/5">
              <span style={{ color: aquaText }} className="text-xl font-bold">MamaCare</span>
              <button onClick={() => setSidebarOpen(false)} style={{ color: aquaText }}>
                <X size={24} />
              </button>
            </div>
            <div className="p-4">
              <UserSideNav onNavItemClick={() => setSidebarOpen(false)} />
            </div>
          </aside>
        </div>
      )}

      {/* 3. MAIN CONTENT WRAPPER */}
      <div className="lg:pl-72 flex flex-col flex-1 w-full">
        
        {/* DASHBOARD TOP NAV */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button 
            className="lg:hidden p-2 text-teal-900" 
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-4 ml-auto">
            <button className="p-2 text-gray-400 hover:text-teal-600 relative">
               <Bell size={20} />
               <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-800 font-bold border border-teal-200">
              S
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1">
          <div className="py-8 px-4 sm:px-6 lg:px-10 max-w-6xl mx-auto">
            {/* The Dashboard widgets we created earlier will render here */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;