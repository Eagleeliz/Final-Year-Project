import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Install with: npm install lucide-react

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Midnight Teal Theme Colors
  const midnightTeal = "#002e33";
  const aquaText = "#86d9e1";

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="relative bg-white shadow-sm border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo / Brand Name */}
        <h1 className="text-2xl font-bold" style={{ color: midnightTeal }}>
          MamaCare AI
        </h1>

        {/* Desktop Links (Hidden on mobile) */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
          <Link to="/" className="hover:text-[#002e33] transition-colors">Home</Link>
          <Link to="/about" className="hover:text-[#002e33] transition-colors">About</Link>
          <Link to="/howitworks" className="hover:text-[#002e33] transition-colors">How It Works</Link>
          <Link to="/ai-public" className="hover:text-[#002e33] transition-colors">AI Assistant</Link>
          <Link to="/contact" className="hover:text-[#002e33] transition-colors">Contact</Link>
        </div>

        {/* Desktop Buttons (Hidden on mobile) */}
        <div className="hidden md:flex gap-3">
          <Link
            to="/login"
            className="px-5 py-2 text-sm font-bold rounded-full border-2 transition-all"
            style={{ borderColor: midnightTeal, color: midnightTeal }}
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-5 py-2 text-sm font-bold rounded-full transition-all shadow-md"
            style={{ backgroundColor: midnightTeal, color: aquaText }}
          >
            Register
          </Link>
        </div>

        {/* Mobile Menu Button (Visible only on mobile) */}
        <button 
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-lg"
          style={{ color: midnightTeal }}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-gray-100 md:hidden flex flex-col p-6 gap-4 shadow-xl">
          <Link to="/" onClick={toggleMenu} className="text-lg font-medium text-gray-700">Home</Link>
          <Link to="/about" onClick={toggleMenu} className="text-lg font-medium text-gray-700">About</Link>
          <Link to="/how-it-works" onClick={toggleMenu} className="text-lg font-medium text-gray-700">How It Works</Link>
          <Link to="/ai-public" onClick={toggleMenu} className="text-lg font-medium text-gray-700">AI Assistant</Link>
          <Link to="/contact" onClick={toggleMenu} className="text-lg font-medium text-gray-700">Contact</Link>
          
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
      )}
    </nav>
  );
};

export default Navbar;