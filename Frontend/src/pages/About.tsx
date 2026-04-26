import React from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

const About: React.FC = () => {
  const midnightTeal = "#002e33";
  const aquaText = "#86d9e1";

  return (
    <>
      <Navbar />

      <section className="w-screen min-h-screen bg-white px-6 py-20 overflow-x-hidden">

        <h1
          className="text-4xl md:text-5xl font-bold text-center mb-4"
          style={{ color: midnightTeal }}
        >
          About BabyCentre
        </h1>

        <p className="text-lg md:text-xl text-center text-gray-600 max-w-3xl mx-auto mb-8">
          Empowering mothers across Kenya with AI-driven maternal care and guidance.
        </p>

        <hr className="w-24 mx-auto mb-12" style={{ borderColor: aquaText }} />

        {/* CARD 1 */}
        <div className="flex flex-col md:flex-row items-center bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-transform duration-300 hover:scale-105 mb-12 max-w-6xl mx-auto overflow-hidden border border-gray-100">

          <div className="md:w-1/2 p-6 md:p-10 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: midnightTeal }}>
              Welcome to BabyCentre
            </h2>

            <p className="text-gray-700 leading-relaxed">
              BabyCentre is your trusted digital companion throughout your pregnancy journey.
              From early symptoms to postnatal care, we provide real-time guidance, tracking,
              and support to ensure both mother and baby stay safe and healthy.
            </p>
          </div>

          <img
            src="https://i.pinimg.com/webp/1200x/75/c1/84/75c184e778eb6887ce20393b30f4e2f4.webp"
            alt="Mother and baby"
            className="w-full md:w-1/2 h-72 md:h-96 object-cover"
          />
        </div>

        {/* CARD 2 */}
        <div className="flex flex-col md:flex-row-reverse items-center bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-transform duration-300 hover:scale-105 mb-12 max-w-6xl mx-auto overflow-hidden border border-gray-100">

          <div className="md:w-1/2 p-6 md:p-10 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4" style={{ color: midnightTeal }}>
              Our Mission
            </h2>

            <p className="text-gray-700 leading-relaxed">
              To bridge the gap between healthcare and technology by providing
              accessible, intelligent maternal care solutions. We aim to ensure
              every mother receives timely support, education, and life-saving alerts.
            </p>
          </div>

          <img
            src="https://i.pinimg.com/736x/51/1e/41/511e419a8f9812affb0a585918a06222.jpg"
            alt="Healthcare support"
            className="w-full md:w-1/2 h-72 md:h-96 object-cover"
          />
        </div>

        {/* CARD 3 */}
        <div className="flex flex-col md:flex-row items-center bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-transform duration-300 hover:scale-105 mb-12 max-w-6xl mx-auto overflow-hidden border border-gray-100">

          <div className="md:w-1/2 p-6 md:p-10 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4" style={{ color: midnightTeal }}>
              Our Vision
            </h2>

            <p className="text-gray-700 leading-relaxed">
              To become Africa’s leading maternal health platform—where technology,
              compassion, and innovation come together to create safer pregnancies
              and healthier futures for families.
            </p>
          </div>

          <img
            src="https://i.pinimg.com/736x/0a/7a/11/0a7a11dbdf36b3ccdfa073d975f49615.jpg"
            alt="Future of healthcare"
            className="w-full md:w-1/2 h-72 md:h-96 object-cover"
          />
        </div>

      </section>
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-gray-100 py-6 text-center text-sm text-gray-500"
      >
        © {new Date().getFullYear()} BabyCentre AI. All rights reserved.
      </motion.footer>
    </>
  );
};

export default About;