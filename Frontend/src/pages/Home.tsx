import { useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import FAQPage from "./Home/FAQPage";
import HeroSection from "./Home/HeroSection";
import HowItWorksPage from "./Home/HowItWorksPage";
import WhyChooseUsSection from "./Home/WhyChooseUs";
import { motion, useInView } from "framer-motion";

const FadeInSection = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.9, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
};

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white text-gray-800">

      <Navbar />

      <FadeInSection>
        <HeroSection />
      </FadeInSection>

      <FadeInSection delay={0.1}>
        <HowItWorksPage />
      </FadeInSection>

      <FadeInSection delay={0.1}>
        <WhyChooseUsSection />
      </FadeInSection>

      <FadeInSection delay={0.1}>
        <FAQPage />
      </FadeInSection>

      {/* ================= FOOTER ================= */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-gray-100 py-6 text-center text-sm text-gray-500"
      >
        © {new Date().getFullYear()} BabyCentre AI. All rights reserved.
      </motion.footer>

    </div>
  );
};

export default Home;