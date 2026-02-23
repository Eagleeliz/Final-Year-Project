import Navbar from "../components/Navbar";
import FAQ from "./Home/FAQ";
import HeroSection from "./Home/HeroSection";
import Services from "./Home/Services";


const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white text-gray-800">
      
      <Navbar />
  <HeroSection/>
  <Services/>
  <FAQ/>
      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-100 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} MamaCare AI. All rights reserved.
     
 </footer>
    </div>
  );
};

export default Home;