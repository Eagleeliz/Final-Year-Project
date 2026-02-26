import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import UserSideNav from "./UserSideNav";
import Navbar from "../../components/Navbar"; // Import your main Navbar

const UserLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // MamaCare Brand Colors
  const midnightTeal = "#002e33";
  const aquaText = "#86d9e1";

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f7f7] font-sans">

      {/* TOP NAVBAR - Reuses global Navbar */}
      <Navbar />

      {/* MAIN CONTAINER WITH SIDEBAR AND CONTENT */}
      <div className="flex flex-1 pt-16 lg:pt-20"> {/* pt matches Navbar height */}

        {/* DESKTOP SIDEBAR - Fixed below navbar */}
        <aside 
          style={{ backgroundColor: midnightTeal }}
          className="hidden lg:flex flex-col w-72 fixed left-0 top-16 lg:top-20 bottom-0 z-50 border-r border-white/10"
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

        {/* MOBILE SIDEBAR DRAWER */}
        {sidebarOpen && (
          <>
            {/* Overlay */}
            <div 
              className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-md lg:hidden" 
              onClick={() => setSidebarOpen(false)} 
            />

            {/* Sidebar Panel */}
            <aside 
              style={{ backgroundColor: midnightTeal }}
              className="fixed top-0 left-0 z-[1001] w-3/4 max-w-xs h-full shadow-2xl lg:hidden transform transition-transform duration-300 border-r border-white/10 overflow-y-auto"
            >
              <button 
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 z-[1002] p-2 text-[#64748b] hover:text-[#f97316] transition-colors"
              >
                <X size={24} />
              </button>
              <UserSideNav onNavItemClick={() => setSidebarOpen(false)} />
            </aside>
          </>
        )}

        {/* MAIN CONTENT AREA - Offset for navbar and sidebar */}
        <main className="flex-1 lg:ml-72 w-full min-h-screen">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {/* Dashboard content renders here */}
            <Outlet />
          </div>
        </main>

        {/* MOBILE SIDEBAR TOGGLE BUTTON */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden fixed bottom-6 right-6 z-[999] p-4 bg-[#f97316] text-white rounded-full shadow-[0_0_20px_rgba(249,115,22,0.4)] border border-[#f97316]/50 active:scale-90 transition-all"
          >
            <Menu size={24} strokeWidth={3} />
          </button>
        )}

      </div>
    </div>
  );
};

export default UserLayout;