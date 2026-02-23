
import { Shield, Heart, Zap, Users, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const About = () => {
  // Brand Colors
  const midnightTeal = "#002e33";
  const aquaText = "#86d9e1";

  const values = [
    { icon: <Shield size={24} />, title: "Secure Care", desc: "Data privacy is our foundation. We protect your health records like they are our own." },
    { icon: <Heart size={24} />, title: "Empathetic AI", desc: "Technology that understands the emotional and physical journey of motherhood." },
    { icon: <Zap size={24} />, title: "Real-time Action", desc: "Instant detection of danger signs to ensure you never walk alone in an emergency." },
    { icon: <Users size={24} />, title: "Community Focused", desc: "Designed specifically for the unique needs of mothers across Kenya." },
  ];

  return (
    <div className="bg-white">
        <Navbar/>
      {/* 1. Hero Section - Impactful & Visual */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <img 
          src="https://imgs.search.brave.com/oYftOev-FRZJm7spULkx9Ht8dSdZQ-FkAvN5xUytDPY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNzEv/ODE2LzI2OC9zbWFs/bC9sb3ZpbmctbW90/aGVyLWh1Z3MtYS1s/aXR0bGUtYmFieS1h/dC1ob21lLXByZXR0/eS13b21hbi1ob2xk/aW5nLWN1ZGRsaW5n/LW5ld2Jvcm4tY2hp/bGQtaW4taGVyLWFy/bXMtbGF1Z2hpbmct/d2l0aC1oaW0taGFw/cHktZmFtaWx5LXNt/aWxpbmctdG9nZXRo/ZXItYWZyaWNhbi1t/b20tY2Fycnlpbmct/a2lzc2luZy1zbWFs/bC1pbmZhbnQtb24t/aGFuZHMtcGhvdG8u/anBn" 
          alt="Mother and child"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.3]"
        />
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
            Our Mission is <br />
            <span style={{ color: aquaText }}>Safe Motherhood.</span>
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
            We are bridging the gap between advanced AI technology and maternal healthcare 
            to ensure every mother in Kenya has a guided path to a healthy delivery.
          </p>
        </div>
      </section>

      {/* 2. Our Story Section - Text & Image Split */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="relative">
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl">
              <img 
                src="https://imgs.search.brave.com/9V7Ni14RLeE0TOLTcZRmTx8wNnpOrMG8vJN1NmbhfJQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9hbWJ1/bGFuY2UtdWstbW90/b3J3YXktcmVzcG9u/ZGluZy10by1lbWVy/Z2VuY3ktYnJpdGlz/aC0zNzIxNjA4NDEu/anBn" 
                alt="Health worker in Kenya"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-teal-900/10 mix-blend-multiply"></div>
            </div>
            {/* Decorative shape behind image */}
            <div 
              className="absolute -bottom-6 -left-6 w-32 h-32 rounded-3xl -z-10 opacity-20"
              style={{ backgroundColor: midnightTeal }}
            ></div>
          </div>

          <div>
            <h2 className="text-4xl font-black mb-8 leading-tight" style={{ color: midnightTeal }}>
              Built for Mothers, <br /> Guided by Science.
            </h2>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              In Kenya, access to immediate maternal guidance can often be a challenge. 
              We created this platform to serve as a 24/7 digital companion that 
              combines clinical expertise with artificial intelligence.
            </p>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Our system doesn't just track weeks; it monitors safety. By identifying 
              early danger signs and providing trimester-specific education, we empower 
              mothers to make informed decisions for themselves and their babies.
            </p>
            
            <div className="flex items-center gap-4 p-6 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: midnightTeal }}>
                <Shield size={24} />
              </div>
              <div>
                <p className="font-bold" style={{ color: midnightTeal }}>Verified Health Content</p>
                <p className="text-sm text-gray-500">All guidance follows WHO and Kenyan health standards.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Values Section - Grid */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4" style={{ color: midnightTeal }}>Why Trust Us?</h2>
            <div className="h-1.5 w-20 bg-teal-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors group-hover:bg-teal-500 group-hover:text-white"
                  style={{ backgroundColor: '#f0fdfa', color: midnightTeal }}
                >
                  {v.icon}
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: midnightTeal }}>{v.title}</h3>
                <p className="text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Contact/Action Section */}
      <section className="py-24 text-center px-6">
        <div 
          className="max-w-4xl mx-auto p-12 md:p-20 rounded-[3rem] shadow-2xl relative overflow-hidden"
          style={{ backgroundColor: midnightTeal }}
        >
          {/* Subtle Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-[100px] rounded-full"></div>
          
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 relative z-10">
            Join thousands of mothers <br /> on a safer journey.
          </h2>
          <p className="text-lg mb-10 relative z-10" style={{ color: aquaText }}>
            Get started today and experience the future of maternal care.
          </p>
          <div className="mt-20 flex justify-center">
          <Link 
            to="/register" 
            className="group px-12 py-4 rounded-full font-bold text-xl transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-3"
            style={{ 
              backgroundColor: aquaText, 
              color: midnightTeal,
              boxShadow: `0 10px 25px -5px rgba(134, 217, 225, 0.4)` 
            }}
          >
            Create Account Today
            <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        </div>
      </section>
    </div>
  );
};

export default About;