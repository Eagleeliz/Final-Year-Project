import { useState } from "react";
import { useNavigate } from "react-router-dom";

const midnightTeal = "#002e33";
const black = "#000000";
const white = "#ffffff";

const faqs = [
  { q: "Is BabyCentre free to use?", a: "Yes — BabyCentre is completely free for all mothers across Kenya. We believe safe motherhood should never be a privilege. There are no hidden charges, subscriptions, or premium tiers." },
  { q: "How does the AI danger sign detection work?", a: "Each week, you log your symptoms through the app. Our AI analyzes your entries against clinical thresholds and your personal health history to detect early warning signs of conditions like preeclampsia, gestational diabetes, and preterm labor — alerting you and your care team instantly." },
  { q: "Which counties does BabyCentre cover?", a: "BabyCentre is available across all 47 counties in Kenya — from Nairobi and Mombasa to Turkana and Mandera. Our network spans both urban and rural regions." },
  { q: "Is my health data private and secure?", a: "Absolutely. Your data is encrypted end-to-end and stored securely. We never sell your information to third parties. You control who sees your health records at all times." },
  { q: "Can I use BabyCentre after delivery?", a: "Yes! BabyCentre supports you from your first antenatal visit through postnatal recovery and early childhood — tracking your baby's milestones, vaccination schedule, and your own postpartum health." },
  { q: "Do I need internet access to use BabyCentre?", a: "BabyCentre is optimized for low-bandwidth environments common in rural Kenya. Key features are also available offline and sync automatically when you reconnect." },
];

const FAQItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  const bgCard = "#ffffff";
  const textColor = midnightTeal;
  const mutedColor = "#4a4a4a";

  return (
    <div className="rounded-[18px] overflow-hidden transition-all duration-300" style={{ background: open ? midnightTeal : bgCard, border: open ? "none" : "1.5px solid #e5e5e5", boxShadow: open ? "0 8px 32px rgba(0,46,51,0.15)" : "0 1px 4px rgba(0,0,0,0.04)" }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-7 py-6 text-left gap-4">
        <span className="text-[19px] font-semibold leading-snug" style={{ color: open ? white : textColor }}>{q}</span>
        <span className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-300" style={{ background: open ? "rgba(255,255,255,0.18)" : "#f5f5f5", transform: open ? "rotate(45deg)" : "rotate(0deg)" }}>
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke={open ? white : black} strokeWidth={2.5} strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
        </span>
      </button>
      <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: open ? "300px" : "0px" }}>
        <p className="px-7 pb-7 text-[17px] leading-relaxed" style={{ color: open ? "rgba(255,255,255,0.88)" : mutedColor }}>{a}</p>
      </div>
    </div>
  );
};

const FAQPage = () => {
  const navigate = useNavigate();
  const textColor = "#1f2937";
  const bgSection = "#ffffff";
  const mutedColor = "#4a4a4a";

  return (
    <section className="w-full min-h-screen" style={{ background: `linear-gradient(160deg, #f5f5f5 0%, ${bgSection} 60%, #fafafa 100%)` }}>
      <div className="text-center px-6 pt-20 pb-12 max-w-[680px] mx-auto">
        <span className="inline-block text-[14px] font-bold tracking-[2px] uppercase px-5 py-2 rounded-full mb-5" style={{ background: "#f5f5f5", color: midnightTeal }}>FAQ</span>
        <h1 className="leading-tight mb-5" style={{ color: textColor, fontFamily: "Inter", fontSize: "clamp(38px, 5vw, 60px)" }}>Got questions? <em className="not-italic" style={{ color: black }}>We have answers.</em></h1>
        <p className="text-[20px] leading-relaxed" style={{ color: mutedColor }}>Everything you need to know about BabyCentre — clear, honest, and straight to the point.</p>
      </div>

      <div className="max-w-[760px] mx-auto px-6 pb-10 flex flex-col gap-4">
        {faqs.map((faq, i) => (<FAQItem key={i} q={faq.q} a={faq.a} />))}
      </div>

      <div className="max-w-[760px] mx-auto px-6 pb-8">
        <div className="rounded-[22px] p-8 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden" style={{ background: midnightTeal }}>
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
          <div className="absolute bottom-0 left-10 w-24 h-24 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
          <div className="w-14 h-14 rounded-[16px] flex-shrink-0 flex items-center justify-center relative z-10" style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}>
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke={white} strokeWidth={1.8} strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          </div>
          <div className="flex-1 relative z-10 text-center sm:text-left">
            <p className="text-[21px] font-bold mb-1" style={{ color: "#fff" }}>Still have questions?</p>
            <p className="text-[17px]" style={{ color: "rgba(255,255,255,0.75)" }}>Our care team is available 24/7. We're always happy to help.</p>
          </div>
          <button className="px-6 py-3 rounded-[12px] text-[17px] font-bold flex-shrink-0 relative z-10 transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5" style={{ background: white, color: midnightTeal }}>Chat with us</button>
        </div>
      </div>

      <div className="max-w-[760px] mx-auto px-6 pb-24">
        <button onClick={() => navigate("/register")} className="w-full flex items-center justify-center gap-3 py-6 rounded-[18px] text-[20px] font-bold transition-all duration-300 hover:-translate-y-1" style={{ background: "#333333", color: "#fff", boxShadow: "0 12px 40px rgba(0,0,0,0.45), 0 4px 12px rgba(0,0,0,0.2)" }}>
          <span>Get Started — It's Free</span>
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </button>
        <p className="text-center text-[15px] mt-3" style={{ color: "#5a5a5a" }}>Join 10,000+ mothers across Kenya — no credit card needed.</p>
      </div>
    </section>
  );
};

export default FAQPage;