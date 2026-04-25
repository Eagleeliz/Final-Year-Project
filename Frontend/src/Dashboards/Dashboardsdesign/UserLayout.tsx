import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import UserSideNav from "./UserSideNav";
import Navbar from "../../components/Navbar";

const UserLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-100">

      {/* Top Navbar */}
      <div className="z-50 bg-white shrink-0">
        <Navbar hideThemeToggle={true} />
      </div>

      <div
        className="flex flex-1 overflow-hidden relative"
        style={{ alignItems: "stretch" }}
      >

        {/* Desktop Sidebar */}
        <aside
          className="hidden lg:flex flex-col w-80 shrink-0 overflow-hidden"
          style={{ backgroundColor: "#002e33", alignSelf: "stretch" }}
        >
          <UserSideNav />
        </aside>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <aside
              className="fixed top-0 left-0 w-3/4 max-w-xs h-full z-50 shadow-xl lg:hidden"
              style={{ backgroundColor: "#002e33" }}
            >
              <div className="flex justify-end p-4">
                <button onClick={() => setSidebarOpen(false)}>
                  <X size={24} className="text-white" />
                </button>
              </div>
              <UserSideNav onNavItemClick={() => setSidebarOpen(false)} />
            </aside>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto w-full bg-gray-50">
          <div className="w-full">
            <Outlet />
          </div>
        </main>

        {/* Mobile Toggle Button */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden fixed top-20 right-6 bg-[#002e33] text-white p-4 rounded-full shadow-lg z-30"
          >
            <Menu size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default UserLayout;