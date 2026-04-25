import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import PolicyMakerSideNav from "./PolicyMakerSideNav";
import Navbar from "../../components/Navbar";

const PolicyMakerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-100">

      <style>{`
        .policymaker-sidebar {
          background-color: #002e33 !important;
          color: white !important;
        }
        .policymaker-sidebar * {
          color: white !important;
        }
      `}</style>

      {/* Top Navbar */}
      <div className="z-50 bg-white shrink-0">
        <Navbar hideThemeToggle={true} />
      </div>

      <div className="flex flex-1 overflow-hidden relative" style={{ alignItems: "stretch", height: "calc(100vh - 96px)" }}>

        {/* Desktop Sidebar */}
        <aside className="policymaker-sidebar hidden lg:flex flex-col w-80 shrink-0" style={{ alignSelf: "stretch" }}>
          <PolicyMakerSideNav />
        </aside>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="policymaker-sidebar fixed top-0 left-0 w-3/4 max-w-xs h-full z-50 shadow-xl lg:hidden">
              <div className="flex justify-end p-4">
                <button onClick={() => setSidebarOpen(false)}>
                  <X size={24} />
                </button>
              </div>
              <PolicyMakerSideNav onNavItemClick={() => setSidebarOpen(false)} />
            </aside>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto w-full bg-gray-50">
          <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-full">
            <Outlet />
          </div>
        </main>

        {/* Mobile Toggle */}
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

export default PolicyMakerLayout;