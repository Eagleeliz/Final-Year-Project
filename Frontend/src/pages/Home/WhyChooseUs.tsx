import { motion } from "framer-motion";
import { useTheme } from "../../Features/ThemeContext";

type FeatureCard = {
  title: string;
  desc: string;
  gradient: string;
};

type Testimonial = {
  quote: string;
  name: string;
};

const WhyChooseUsSection = () => {
  const { theme } = useTheme?.() || { theme: "light" };
  const isDark = theme === "dark";
  
  const textColor = isDark ? "#f3f4f6" : "#002e33";
  const mutedColor = isDark ? "#9ca3af" : "#4a7a7e";
  const bgSection = isDark ? "#0f172a" : "#f7fdfd";
  const bgCard = isDark ? "#1f2937" : "#ffffff";
  const borderColor = isDark ? "#374151" : "#d4eef1";
  const accentTeal = isDark ? "#86d9e1" : "#00a0b0";
  const quoteColor = "#b0dde2";

  const featureCards: FeatureCard[] = [
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

  const testimonials: Testimonial[] = [
    {
      quote: "BabyCentre gave me peace of mind throughout my pregnancy. The AI support was always there when I needed it.",
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
    <section className="py-24 px-6" style={{ background: bgSection }}>
      
      {/* Wider container */}
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.h2
          initial={{ y: -30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          className="text-5xl font-extrabold text-center mb-4"
          style={{ color: textColor }}
        >
          Why Choose Us
        </motion.h2>

        <p className="text-lg text-center max-w-2xl mx-auto mb-6" style={{ color: mutedColor }}>
          Discover the features that make BabyCentre the top choice for your pregnancy journey.
        </p>

        <div className="w-20 h-1 mx-auto mb-16 rounded-full" style={{ background: accentTeal }} />

        {/* FEATURE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {featureCards.map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="rounded-2xl border overflow-hidden hover:shadow-2xl transition-all duration-300 min-h-[320px]"
              style={{ borderColor }}
            >
              <div className="h-2" style={{ background: card.gradient }} />

              <div
                className="p-10 flex flex-col justify-between h-full"
                style={{ background: bgCard }}
              >
                <div>
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold mb-6"
                    style={{ background: card.gradient }}
                  >
                    {i + 1}
                  </div>

                  <h3 className="text-xl font-bold mb-4" style={{ color: textColor }}>
                    {card.title}
                  </h3>

                  <p className="text-base leading-relaxed" style={{ color: mutedColor }}>
                    {card.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* TESTIMONIALS */}
        <h2 className="text-4xl font-extrabold text-center mb-4" style={{ color: textColor }}>
          What People Say About Us
        </h2>

        <p className="text-base text-center mb-12" style={{ color: mutedColor }}>
          Real stories from real mothers — see what makes our service stand out.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="rounded-2xl p-10 border flex flex-col justify-between hover:shadow-2xl transition-all duration-300 min-h-[300px]"
              style={{
                background: bgCard,
                borderColor,
              }}
            >
              <span className="text-5xl font-black mb-3" style={{ color: quoteColor }}>
                "
              </span>

              <p className="text-base italic mb-8" style={{ color: mutedColor }}>
                {t.quote}
              </p>

              <p className="text-right font-semibold text-lg" style={{ color: accentTeal }}>
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