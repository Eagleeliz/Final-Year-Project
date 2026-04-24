import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../Features/store";
import { clearCredentials } from "../Features/Auth/AuthSlice";
import { Menu, X, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const midnightTeal = "#002e33";
  const aquaText = "#86d9e1";

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    dispatch(clearCredentials());
    setDropdownOpen(false);
    setIsOpen(false);
    navigate("/login");
  };

  return (
    <nav className="relative bg-white shadow-sm border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Desktop Logo Section */}
        <h1 className="text-2xl font-bold" style={{ color: midnightTeal }}>
          MamaCare 
        </h1>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-base font-semibold">
          <Link to="/" className="transition-colors" style={{ color: midnightTeal }}>Home</Link>
          <Link to="/about" className="transition-colors" style={{ color: midnightTeal }}>About</Link>
          <Link to="/howitworks" className="transition-colors" style={{ color: midnightTeal }}>How It Works</Link>
          <Link to="/duedatecalculator" className="transition-colors" style={{ color: midnightTeal }}>DueDate Calculator</Link>
          <Link to="/contact" className="transition-colors" style={{ color: midnightTeal }}>Contact</Link>
        </div>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center gap-3 relative">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="px-5 py-2 text-sm font-bold rounded-full border-2"
                style={{ borderColor: midnightTeal, color: midnightTeal }}
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-5 py-2 text-sm font-bold rounded-full shadow-md"
                style={{ backgroundColor: midnightTeal, color: aquaText }}
              >
                Register
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-5 py-2 rounded-full shadow-md"
                style={{ backgroundColor: midnightTeal, color: aquaText }}
              >
                Hey {user?.firstName}
                <ChevronDown size={16} />
              </button>

              {/* Desktop Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">

                  <Link
                    to={
                      user?.userType === "admin"
                        ? "/admin"
                        : user?.userType === "policy_maker"
                        ? "/policymaker"
                        : "/dashboard"
                    }
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    My Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm font-semibold text-rose-500 hover:bg-gray-50"
                  >
                    Terminate Session
                  </button>

                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button - Only show when NOT logged in */}
        {!isAuthenticated && (
          <button 
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg flex items-center"
            style={{ color: midnightTeal }}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        )}
      </div>

      {/* Mobile Menu Container - Below navbar, not covering it */}
      {!isAuthenticated && isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={toggleMenu}
          />
          {/* Side drawer - below navbar */}
          <div className="absolute top-full left-0 w-72 h-screen bg-white md:hidden flex flex-col p-6 gap-4 shadow-xl z-50 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold" style={{ color: midnightTeal }}>
                Menu
              </h2>
              <button onClick={toggleMenu} className="p-1">
                <X size={24} style={{ color: midnightTeal }} />
              </button>
            </div>

            <Link to="/" onClick={toggleMenu} className="text-xl font-medium" style={{ color: midnightTeal }}>Home</Link>
            <Link to="/about" onClick={toggleMenu} className="text-xl font-medium" style={{ color: midnightTeal }}>About</Link>
            <Link to="/howitworks" onClick={toggleMenu} className="text-xl font-medium" style={{ color: midnightTeal }}>How It Works</Link>
            <Link to="/ai-public" onClick={toggleMenu} className="text-xl font-medium" style={{ color: midnightTeal }}>AI Assistant</Link>
            <Link to="/contact" onClick={toggleMenu} className="text-xl font-medium" style={{ color: midnightTeal }}>Contact</Link>

            <hr className="border-gray-100 my-2" />

            <div className="flex flex-col gap-3">
              <Link
                to="/login"
                onClick={toggleMenu}
                className="w-full py-3 text-center font-bold rounded-xl border-2"
                style={{ borderColor: midnightTeal, color: midnightTeal }}
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={toggleMenu}
                className="w-full py-3 text-center font-bold rounded-xl"
                style={{ backgroundColor: midnightTeal, color: aquaText }}
              >
                Register
              </Link>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;