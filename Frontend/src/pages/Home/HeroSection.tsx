import { Link } from "react-router-dom";
import { Users, Bot, FileText } from "lucide-react";

const HeroSection = () => {
  const bgDark = "#002e33";
  const midnightTeal = "#002e33";
  const aquaText = "#86d9e1";

  return (
    <div className="w-full flex flex-col">
      
      {/* Trust Bar - Always dark background */}
      <div style={{ backgroundColor: bgDark }} className="py-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          <div className="text-white text-xl font-semibold text-center md:text-left">
            BabyCentre is your <br /> parenting partner.
          </div>
          
          {/* Stat Card 1 */}
          <div className="bg-white/20 p-4 rounded-xl flex items-center gap-4">
            <Users className="text-white w-8 h-8" />
            <div>
              <p style={{ color: "#ffffff" }} className="font-bold text-lg">10,000+</p>
              <p style={{ color: "#d1d5db" }} className="text-xs uppercase">Mothers Joined</p>
            </div>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-white/20 p-4 rounded-xl flex items-center gap-4">
            <Bot className="text-white w-8 h-8" />
            <div>
              <p style={{ color: "#ffffff" }} className="font-bold text-lg">24/7</p>
              <p style={{ color: "#d1d5db" }} className="text-xs uppercase">AI Health Support</p>
            </div>
          </div>

          {/* Stat Card 3 */}
          <div className="bg-white/20 p-4 rounded-xl flex items-center gap-4">
            <FileText className="text-white w-8 h-8" />
            <div>
              <p style={{ color: "#ffffff" }} className="font-bold text-lg">500+</p>
              <p style={{ color: "#d1d5db" }} className="text-xs uppercase">Expert Articles</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Visual Hero */}
      <div className="relative w-full">
        {/* Image */}
        <img 
          src="https://images.unsplash.com/photo-1568043625493-2b0633c7c491?q=80&w=2000" 
          className="w-full h-[400px] md:h-[600px] object-cover"
          alt="Motherhood"
        />

        {/* CTA Card — below image on mobile, overlaid on desktop */}
        <div className="md:absolute md:inset-0 md:flex md:items-center md:justify-start md:max-w-7xl md:mx-auto md:px-6">
          <div className="bg-white/95 backdrop-blur-sm p-6 md:rounded-4xl shadow-2xl max-w-md border border-gray-100">
            <h1 className="text-4xl font-black leading-tight mb-3" style={{ color: midnightTeal }}>
              A Secure Path to <br />
              <span className="text-teal-500">Safe Motherhood.</span>
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Experience a smarter way to track your baby's growth. From the first kick to the final push, 
              get AI-powered health insights tailored for the modern Kenyan mother.
            </p>
            <Link to="/login">
              <button 
                className="w-full py-4 rounded-full font-bold text-xl transition-transform hover:scale-105"
                style={{ backgroundColor: midnightTeal, color: aquaText }}
              >
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default HeroSection;