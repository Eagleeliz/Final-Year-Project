import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import Navbar from '../components/Navbar';

const Contact = () => {
  const midnightTeal = "#002e33";
  const aquaText = "#86d9e1";

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  // Reusable input style to keep code clean
  const inputStyle = "w-full p-4 rounded-2xl bg-white border border-gray-300 focus:border-[#002e33] focus:ring-2 focus:ring-[#002e33]/10 transition-all outline-none placeholder:text-gray-400";

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* Hero Header */}
      <section className="py-20 text-center bg-gray-50">
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={fadeInUp}
          className="max-w-3xl mx-auto px-6"
        >
          <h1 className="text-4xl md:text-6xl font-black mb-6" style={{ color: midnightTeal }}>
            We're Here to <span style={{ color: "#14b8a6" }}>Listen.</span>
          </h1>
          <p className="text-gray-600 text-lg md:text-xl">
            Have questions about your pregnancy journey or our AI assistant? 
            Our team is ready to support you.
          </p>
        </motion.div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* 1. Contact Information Side */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <div>
              <h2 className="text-3xl font-bold mb-6" style={{ color: midnightTeal }}>Contact Information</h2>
              <p className="text-gray-500 text-lg mb-8">
                Reach out to us through any of these channels. We typically respond within 24 hours.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="p-4 rounded-2xl bg-teal-50" style={{ color: midnightTeal }}>
                  <Mail size={28} />
                </div>
                <div>
                  <p className="text-sm text-gray-400 uppercase font-bold tracking-widest">Email Us</p>
                  <p className="text-xl font-semibold text-gray-800">support@mamacare.co.ke</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="p-4 rounded-2xl bg-teal-50" style={{ color: midnightTeal }}>
                  <Phone size={28} />
                </div>
                <div>
                  <p className="text-sm text-gray-400 uppercase font-bold tracking-widest">Call or WhatsApp</p>
                  <p className="text-xl font-semibold text-gray-800">+254 700 000 000</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="p-4 rounded-2xl bg-teal-50" style={{ color: midnightTeal }}>
                  <MapPin size={28} />
                </div>
                <div>
                  <p className="text-sm text-gray-400 uppercase font-bold tracking-widest">Office</p>
                  <p className="text-xl font-semibold text-gray-800">Nairobi, Kenya</p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-[2rem] text-white mt-12" style={{ backgroundColor: midnightTeal }}>
               <MessageSquare className="mb-4" size={32} style={{ color: aquaText }} />
               <h3 className="text-xl font-bold mb-2">Emergency Help?</h3>
               <p className="opacity-80">If you are experiencing danger signs, please use the <b>Emergency Alert</b> button in your dashboard for immediate clinical guidance.</p>
            </div>
          </motion.div>

          {/* 2. Contact Form Side */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-gray-100"
          >
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-bold ml-1" style={{ color: midnightTeal }}>Full Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Mary Atieno" 
                    className={inputStyle} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-bold ml-1" style={{ color: midnightTeal }}>Phone Number</label>
                  <input 
                    type="text" 
                    placeholder="e.g. +254 712 345 678" 
                    className={inputStyle} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-bold ml-1" style={{ color: midnightTeal }}>Email Address</label>
                <input 
                  type="email" 
                  placeholder="yourname@domain.com" 
                  className={inputStyle} 
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold ml-1" style={{ color: midnightTeal }}>How can we help?</label>
                <textarea 
                  rows={4} 
                  placeholder="Tell us about your concern or question..." 
                  className={inputStyle + " resize-none"} 
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full py-4 rounded-full font-bold text-xl flex items-center justify-center gap-3 transition-transform hover:scale-[1.01] active:scale-[0.98]"
                style={{ backgroundColor: midnightTeal, color: aquaText }}
              >
                <Send size={20} />
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;