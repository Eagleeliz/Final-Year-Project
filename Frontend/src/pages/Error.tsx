import { Link } from "react-router-dom";
import { AlertCircle, Home } from "lucide-react";

function Error() {
  // Brand Colors
  const midnightTeal = "#002e33";
  const aquaText = "#86d9e1";

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gray-50 relative overflow-hidden">
      
      {/* Background Decorative Shapes */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-72 h-72 rounded-full opacity-5"
        style={{ backgroundColor: midnightTeal }}
      ></div>
      <div 
        className="absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full opacity-5"
        style={{ backgroundColor: midnightTeal }}
      ></div>

      {/* Main Error Card */}
      <div className="relative z-10 w-full max-w-lg bg-white p-10 md:p-16 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 text-center">
        
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-red-50">
            <AlertCircle size={48} className="text-red-500" />
          </div>
        </div>

        {/* 404 Header */}
        <h1 
          className="text-8xl font-black mb-2 tracking-tighter" 
          style={{ color: midnightTeal }}
        >
          404
        </h1>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Oops! Page Not Found
        </h2>

        <p className="text-gray-500 mb-10 text-lg leading-relaxed">
          The page you are looking for doesn't exist or has been moved. 
          Don't worry, we can help you get back on track.
        </p>

        {/* High-Visibility Button */}
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-full font-bold text-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-teal-900/10"
          style={{ 
            backgroundColor: midnightTeal, 
            color: aquaText 
          }}
        >
          <Home size={22} />
          Go Back Home
        </Link>

        {/* Support Link */}
        <p className="mt-8 text-sm text-gray-400">
          Need help? <Link to="/contact" className="underline hover:text-teal-600">Contact Support</Link>
        </p>
      </div>
    </div>
  );
}

export default Error;