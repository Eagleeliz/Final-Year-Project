import React, { useRef, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import Navbar from '../components/Navbar';
import emailjs from '@emailjs/browser';
import toast, { Toaster } from 'react-hot-toast';

const Contact = () => {
  const midnightTeal = "#002e33";
  const aquaText = "#86d9e1";

  const formRef = useRef<HTMLFormElement>(null);
  const [isSending, setIsSending] = useState(false);

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

 const inputStyle = `
  w-full p-4 rounded-2xl bg-white 
  border border-gray-300 
  text-black 
  placeholder:text-gray-400 
  focus:border-[#002e33] 
  focus:ring-2 focus:ring-[#002e33]/10 
  transition-all outline-none
`;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsSending(true);
    try {
      await emailjs.sendForm(
        'service_1fe74p7',
        'template_li66k6e',  
        formRef.current,
        '3cojSBbQUTk9Pae77'    
      );
      toast.success("Message sent! We'll get back to you!", {
        duration: 5000,
        style: {
          borderRadius: '16px',
          background: midnightTeal,
          color: aquaText,
          fontWeight: 'bold',
        },
      });
      formRef.current.reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.', {
        style: {
          borderRadius: '16px',
          background: '#1e293b',
          color: '#fff',
        },
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Toaster position="top-right" />
      <Navbar />

      {/* Hero Header */}
      <section className="py-6 md:py-10 text-center bg-gray-50">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="max-w-3xl mx-auto px-6"
        >
          <h1 className="text-3xl md:text-6xl font-black mb-4 md:mb-6" style={{ color: midnightTeal }}>
            We're Here to <span style={{ color: "#14b8a6" }}>Listen.</span>
          </h1>
          <p className="text-gray-600 text-base md:text-xl">
            Have questions about your pregnancy journey or our AI assistant?
            Our team is ready to support you.
          </p>
        </motion.div>
      </section>

      <section className="py-16 md:py-20 max-w-7xl mx-auto px-4 md:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

          {/* Contact Information Side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: midnightTeal }}>
                Contact Information
              </h2>
              <p className="text-gray-500 text-base md:text-lg">
                Reach out to us through any of these channels. We typically respond within 24 hours.
              </p>
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-4 md:gap-6">
                <div className="p-3 md:p-4 rounded-2xl bg-teal-50 shrink-0" style={{ color: midnightTeal }}>
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Email Us</p>
                  <p className="text-base md:text-xl font-semibold text-gray-800 break-all">
                    support@babycentre.co.ke
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 md:gap-6">
                <div className="p-3 md:p-4 rounded-2xl bg-teal-50 shrink-0" style={{ color: midnightTeal }}>
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Call or WhatsApp</p>
                  <p className="text-base md:text-xl font-semibold text-gray-800">+254 705 135 5344</p>
                </div>
              </div>

              <div className="flex items-center gap-4 md:gap-6">
                <div className="p-3 md:p-4 rounded-2xl bg-teal-50 shrink-0" style={{ color: midnightTeal }}>
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Office</p>
                  <p className="text-base md:text-xl font-semibold text-gray-800">Nyahururu, Kenya</p>
                </div>
              </div>
            </div>

            <div
              className="p-6 md:p-8 rounded-[2rem] text-white"
              style={{ backgroundColor: midnightTeal }}
            >
              <MessageSquare className="mb-4" size={28} style={{ color: aquaText }} />
              <h3 className="text-lg md:text-xl font-bold mb-2">Emergency Help?</h3>
              <p className="opacity-80 text-sm md:text-base">
                If you are experiencing danger signs, please use the{" "}
                <b>Emergency Alert</b> button in your dashboard for immediate clinical guidance.
              </p>
            </div>
          </motion.div>

          {/* Contact Form Side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-6 md:p-10 rounded-[2rem] shadow-2xl border border-gray-100"
          >
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">

              <div className="space-y-2">
                <label className="font-bold ml-1 text-sm md:text-base" style={{ color: midnightTeal }}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="enter your full name"
                  className={inputStyle}
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold ml-1 text-sm md:text-base" style={{ color: midnightTeal }}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="yourname@gmail.com"
                  className={inputStyle}
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold ml-1 text-sm md:text-base" style={{ color: midnightTeal }}>
                  How can we help?
                </label>
                <textarea
                  rows={5}
                  name="message"
                  required
                  placeholder="Tell us about your concern or question..."
                  className={inputStyle + " resize-none"}
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-transform hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50"
                style={{ backgroundColor: midnightTeal, color: aquaText }}
              >
                {isSending ? (
                  <span className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full border-2 border-[#86d9e1] border-t-transparent animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <>
                    <Send size={18} />
                    Send Message
                  </>
                )}
              </button>

            </form>
          </motion.div>

        </div>
      </section>
    </div>
  );
};

export default Contact;