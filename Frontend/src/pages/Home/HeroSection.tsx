import { Link } from "react-router-dom";
const HeroSection = () => {
  const midnightTeal = "#002e33";
  const aquaText = "#86d9e1";

  return (
    <div className="w-full flex flex-col">
      
      {/* 1. Trust Bar (The "Stats" section from the top of your image) */}
      <div style={{ backgroundColor: midnightTeal }} className="py-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          <div className="text-white text-xl font-semibold text-center md:text-left">
            MamaCare is your <br /> parenting partner.
          </div>
          
          {/* Stat Card 1 */}
          <div className="bg-[#ffffff10] p-4 rounded-xl flex items-center gap-4 border border-[#ffffff10]">
            <div className="text-teal-400 text-3xl">👥</div>
            <div>
              <p className="text-white font-bold text-lg">10,000+</p>
              <p className="text-gray-400 text-xs uppercase">Mothers Joined</p>
            </div>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-[#ffffff10] p-4 rounded-xl flex items-center gap-4 border border-[#ffffff10]">
            <div className="text-teal-400 text-3xl">🤖</div>
            <div>
              <p className="text-white font-bold text-lg">24/7</p>
              <p className="text-gray-400 text-xs uppercase">AI Health Support</p>
            </div>
          </div>

          {/* Stat Card 3 */}
          <div className="bg-[#ffffff10] p-4 rounded-xl flex items-center gap-4 border border-[#ffffff10]">
            <div className="text-teal-400 text-3xl">📖</div>
            <div>
              <p className="text-white font-bold text-lg">500+</p>
              <p className="text-gray-400 text-xs uppercase">Expert Articles</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Visual Hero (The carousel style) */}
      <div className="relative w-full h-[600px] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1568043625493-2b0633c7c491?q=80&w=2000" 
          className="w-full h-full object-cover"
          alt="Motherhood"
        />
        
        {/* Floating CTA Card */}
        <div className="absolute inset-0 flex items-center justify-center md:justify-start max-w-7xl mx-auto px-6">
          <div className="bg-white/95 backdrop-blur-sm p-10 rounded-3xl shadow-2xl max-w-md border border-gray-100">
            <h1 className="text-5xl font-black leading-tight mb-6" style={{ color: midnightTeal }}>
              A Secure Path to <br />
              <span className="text-teal-500">Safe Motherhood.</span>
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Experience a smarter way to track your baby’s growth. From the first kick to the final push, 
            get AI-powered health insights tailored for the modern Kenyan mother.
            </p>
            <Link to ="/login">
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