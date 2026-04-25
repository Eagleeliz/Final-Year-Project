import { motion } from "framer-motion";
import { useTheme } from "../../features/ThemeContext";

const WhyChooseUsSection = () => {
  const { theme } = useTheme?.() || { theme: "light" };
  const isDark = theme === "dark";
  
  const textColor = isDark ? "#f3f4f6" : "#002e33";
  const mutedColor = isDark ? "#9ca3af" : "#4a7a7e";
  const bgSection = isDark ? "#0f172a" : "#f7fdfd";
  const bgCard = isDark ? "#1f2937" : "#ffffff";
  const borderColor = isDark ? "#374151" : "#d4eef1";
  const accentTeal = isDark ? "#86d9e1" : "#00a0b0";
  const quoteColor = isDark ? "#b0dde2" : "#b0dde2";

  const featureCards = [
    {
      title: "AI-Powered Safety",
      desc: "Our AI detects danger signs early and sends instant alerts to keep you and your baby safe.",
      gradient: "linear-gradient(135deg, #002e33 0%, #00a0b0 100%)",
    },
    {
      title: "Personalized Care",
      desc: "Get a pregnancy plan tailored to your health history, trimester, and individual needs.",
      gradient: "linear-gradient(135deg, #00a0b0 0%, #00c6d4 100%)",
    },
    {
      title: "Kenya-Wide Coverage",
      desc: "We support mothers across all 47 counties with localized health resources and guidance.",
      gradient: "linear-gradient(135deg, #005f6b 0%, #002e33 100%)",
    },
  ];

  const testimonials = [
    {
      quote: "MamaCare gave me peace of mind throughout my pregnancy. The AI support was always there when I needed it.",
      name: "Jane Mwangi",
    },
    {
      quote: "Tracking my symptoms and getting instant advice made such a difference. Highly recommend to every mother!",
      name: "Grace Gracie",
    },
    {
      quote: "I loved the weekly milestone updates, and when an emergency came up, I was able to get help quickly and easily.",
      name: "Winnie Njeri",
    },
  ];

  return (
    <section
      className="py-20 px-6 overflow-x-hidden"
      style={{ background: bgSection }}
    >
      <div className="max-w-5xl mx-auto">

        {/* Why Choose Us Header */}
        <motion.h2
          initial={{ y: -30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false, amount: 0.3 }}
          className="text-5xl font-extrabold text-center mb-4"
          style={{ color: textColor }}
        >
          Why Choose Us
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: false, amount: 0.3 }}
          className="text-lg text-center max-w-2xl mx-auto mb-5"
          style={{ color: mutedColor }}
        >
          Discover the features that make MamaCare the top choice for your pregnancy journey.
        </motion.p>

        <div
          className="w-16 h-[3px] mx-auto mb-12 rounded-full"
          style={{ background: accentTeal, opacity: 0.5 }}
        />

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {featureCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.4, delay: i * 0.2 }}
              viewport={{ once: false, amount: 0.3 }}
              className="rounded-2xl overflow-hidden border cursor-pointer transition-all duration-300 hover:shadow-xl"
              style={{
                borderColor: borderColor,
                boxShadow: "0 2px 8px rgba(0,160,176,0.06)",
              }}
            >
              <div className="h-[5px]" style={{ background: card.gradient }} />
              <div className="p-7" style={{ background: bgCard }}>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold mb-4"
                  style={{ background: card.gradient }}
                >
                  {i + 1}
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ color: textColor }}>
                  {card.title}
                </h3>
                <p className="text-base leading-relaxed" style={{ color: mutedColor }}>
                  {card.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials Header */}
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false, amount: 0.3 }}
          className="text-4xl font-extrabold text-center mb-3"
          style={{ color: textColor }}
        >
          What People Say About Us
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: false, amount: 0.3 }}
          className="text-base text-center mb-10"
          style={{ color: mutedColor }}
        >
          Real stories from real mothers — see what makes our service stand out.
        </motion.p>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.4, delay: i * 0.2 }}
              viewport={{ once: false, amount: 0.3 }}
              className="rounded-2xl p-7 flex flex-col justify-between border cursor-pointer transition-all duration-300 hover:shadow-xl"
              style={{
                background: bgCard,
                borderColor: borderColor,
              }}
            >
              <span
                className="text-4xl font-black leading-none mb-2 block"
                style={{ color: quoteColor }}
              >
                "
              </span>
              <p className="text-base leading-relaxed italic mb-6" style={{ color: mutedColor }}>
                {t.quote}
              </p>
              <p className="text-right font-semibold" style={{ color: accentTeal }}>
                — {t.name}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUsSection;