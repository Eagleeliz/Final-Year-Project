import { useState, useRef } from "react";
import { Outlet } from "react-router-dom";
import { X } from "lucide-react";
import Navbar from "../../components/Navbar";

interface BaseLayoutProps {
  SideNav: React.ComponentType<{ onNavItemClick?: () => void }>;
}

const BaseLayout = ({ SideNav }: BaseLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navbarRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-100">

      {/* Top Navbar */}
      <div ref={navbarRef} className="z-50 bg-white shrink-0">
        <Navbar
          hideThemeToggle={true}
          onMenuClick={() => setSidebarOpen(true)}
        />
      </div>

      <div className="flex flex-1 overflow-hidden relative" style={{ alignItems: "stretch" }}>

        {/* Desktop Sidebar */}
        <aside
          className="hidden lg:flex flex-col w-80 shrink-0"
          style={{ backgroundColor: "#002e33", alignSelf: "stretch" }}
        >
          <SideNav />
        </aside>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed left-0 right-0 bottom-0 bg-black/40 z-30 lg:hidden"
              style={{ top: navbarRef.current?.offsetHeight ?? 72 }}
              onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar panel */}
            <aside
              className="fixed left-0 bottom-0 z-40 shadow-xl lg:hidden flex flex-col overflow-hidden"
              style={{
                top: navbarRef.current?.offsetHeight ?? 72,
                width: "60%",
                maxWidth: "220px",
                backgroundColor: "#002e33",
                margin: 0,
                padding: 0,
                border: "none",
              }}
            >
              {/* Close button */}
              <div
                className="flex justify-end shrink-0 w-full"
                style={{ backgroundColor: "#002e33" }}
              >
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-3"
                  style={{ backgroundColor: "#002e33" }}
                >
                  <X size={20} className="text-white" />
                </button>
              </div>

              {/* SideNav wrapper */}
              <div
                className="flex-1 overflow-y-auto w-full"
                style={{ backgroundColor: "#002e33" }}
              >
                <SideNav onNavItemClick={() => setSidebarOpen(false)} />
              </div>
            </aside>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto w-full bg-gray-50">
          <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-full">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};

export default BaseLayout;