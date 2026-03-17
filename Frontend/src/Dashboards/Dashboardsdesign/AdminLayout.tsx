import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import AdminSideNav from "./AdminSideNav";
import Navbar from "../../components/Navbar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-100">

      {/* Top Navbar */}
      <div className="z-50 border-b border-gray-200 bg-white">
        <Navbar />
      </div>

      <div className="flex flex-1 overflow-hidden relative">

        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-[#002e33] border-r border-white/10 shrink-0">
          <AdminSideNav />
        </aside>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="fixed top-0 left-0 w-3/4 max-w-xs h-full bg-[#002e33] z-50 shadow-xl lg:hidden">
              <div className="flex justify-end p-4">
                <button onClick={() => setSidebarOpen(false)}>
                  <X size={24} className="text-white" />
                </button>
              </div>
              <AdminSideNav onNavItemClick={() => setSidebarOpen(false)} />
            </aside>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto w-full bg-gray-50">
          <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-full">
            <Outlet />
          </div>
        </main>

        {/* Mobile Toggle Button */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden fixed bottom-6 right-6 bg-[#002e33] text-white p-4 rounded-full shadow-lg z-30"
          >
            <Menu size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminLayout;