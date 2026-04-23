const steps = [
  {
    num: "1",
    bg: "bg-[#d4f4f7]",
    iconBg: "bg-[#00a0b02e]",
    label: "Create your profile",
    desc: "Enter your pregnancy details and health history to get started.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[26px] h-[26px]" fill="none" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" stroke="#007a87">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="19" y1="8" x2="19" y2="14" />
        <line x1="16" y1="11" x2="22" y2="11" />
      </svg>
    ),
  },
  {
    num: "2",
    bg: "bg-[#fde8f0]",
    iconBg: "bg-[#c0426e26]",
    label: "Track your pregnancy",
    desc: "Weekly symptom logs, fetal milestones & trimester guidance.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[26px] h-[26px]" fill="none" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" stroke="#c0426e">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    num: "3",
    bg: "bg-[#d6f0e6]",
    iconBg: "bg-[#0f6e5626]",
    label: "Get AI support",
    desc: "Ask questions anytime — get instant, reliable health advice.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[26px] h-[26px]" fill="none" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" stroke="#0f6e56">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    num: "4",
    bg: "bg-[#fff1d6]",
    iconBg: "bg-[#ba751726]",
    label: "Receive alerts",
    desc: "Danger sign detection triggers instant emergency notifications.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[26px] h-[26px]" fill="none" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" stroke="#ba7517">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
  {
    num: "5",
    bg: "bg-[#e8e4fb]",
    iconBg: "bg-[#534ab726]",
    label: "Monitor your child",
    desc: "Track early childhood milestones from birth onwards.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[26px] h-[26px]" fill="none" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" stroke="#534ab7">
        <path d="M9 12l2 2 4-4" />
        <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z" />
      </svg>
    ),
  },
];

const featureCards = [
  {
    accent: "from-[#86d9e1] to-[#00b4c6]",
    iconBg: "bg-[#e8f9fb]",
    title: "Predictive analytics",
    body: "Our system identifies high-risk pregnancies early so healthcare providers can intervene before complications escalate.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" fill="none" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" stroke="#007a87">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    accent: "from-[#f4a7c3] to-[#e06fa0]",
    iconBg: "bg-[#fde8f0]",
    title: "24/7 AI assistant",
    body: "Ask anything about your symptoms, diet, or baby's development — get safe, personalized answers instantly.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" fill="none" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" stroke="#c0426e">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    accent: "from-[#5dca8e] to-[#2ea86a]",
    iconBg: "bg-[#d6f0e6]",
    title: "Regional health insights",
    body: "Policymakers and providers access real-time dashboards showing trends and risks across Kenya's regions.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" fill="none" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" stroke="#0f6e56">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10A15.3 15.3 0 0 1 8 12a15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    accent: "from-[#f5c842] to-[#e09b10]",
    iconBg: "bg-[#fff1d6]",
    title: "Works on any device",
    body: "Fully responsive — accessible from any phone or computer, even in low-connectivity areas.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" fill="none" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" stroke="#ba7517">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
  },
];

const HowItWorksSection = () => {
  const midnightTeal = "#002e33";

  return (
    <section className="w-full bg-[#f7fdfd] py-12 px-6 overflow-hidden">

      {/* Header */}
      <div className="text-center mb-11 max-w-2xl mx-auto">
        <span
          className="inline-block text-xs font-bold tracking-[2px] uppercase px-4 py-1.5 rounded-full mb-4"
          style={{ background: "#e0f7f9", color: "#007a87" }}
        >
          How It Works
        </span>
        <h2
          className="leading-tight mb-4"
          style={{ color: midnightTeal, fontFamily: "serif", fontSize: "clamp(40px, 5.5vw, 64px)" }}
        >
          Your journey,{" "}
          <em className="not-italic" style={{ color: "#00a0b0" }}>every step</em>{" "}
          of the way
        </h2>
        <p className="text-[20px] leading-relaxed" style={{ color: "#4a7a7e" }}>
          MamaCare walks with you from your first trimester through early childhood — with AI-powered support, real-time alerts, and personalized guidance.
        </p>
      </div>

      {/* Journey Timeline */}
      <div className="relative flex flex-col md:flex-row items-start justify-center max-w-5xl mx-auto mb-12 gap-7 md:gap-0">

        {/* Gradient connector — desktop */}
        <div
          className="hidden md:block absolute top-16 left-[10%] right-[10%] h-[6px] rounded-full z-0"
          style={{
            background: "linear-gradient(90deg, #00e5f5 0%, #00c6d4 35%, #00a0b0 65%, #005f6b 100%)",
            boxShadow: "0 2px 12px rgba(0,180,200,0.35)",
          }}
        />

        {/* Gradient connector — mobile */}
        <div
          className="md:hidden absolute left-[44px] top-0 bottom-0 w-[6px] rounded-full z-0"
          style={{
            background: "linear-gradient(180deg, #00e5f5 0%, #00c6d4 35%, #00a0b0 65%, #005f6b 100%)",
            boxShadow: "2px 0 12px rgba(0,180,200,0.35)",
          }}
        />

        {steps.map((step, i) => (
          <div
            key={i}
            className="flex-1 flex md:flex-col flex-row md:items-center items-start relative z-10 px-2 gap-4 md:gap-0"
            style={{ animation: `fadeUp 0.5s ease ${0.05 + i * 0.08}s both` }}
          >
            {/* Circle */}
            <div
              className={`relative flex items-center justify-center rounded-full flex-shrink-0
                          w-[88px] h-[88px] md:w-[128px] md:h-[128px]
                          mb-0 md:mb-[18px]
                          transition-transform duration-300 hover:scale-105 cursor-default
                          ${step.bg}`}
            >
              <div className={`w-[54px] h-[54px] rounded-[14px] flex items-center justify-center ${step.iconBg}`}>
                {step.icon}
              </div>
              <span
                className="absolute bottom-[5px] right-[5px] w-7 h-7 rounded-full text-[12px] font-bold flex items-center justify-center border-2 border-white"
                style={{ background: midnightTeal, color: "#86d9e1" }}
              >
                {step.num}
              </span>
            </div>

            {/* Text */}
            <div className="md:text-center text-left">
              <p className="text-[16px] font-bold mb-1.5 leading-snug" style={{ color: midnightTeal }}>
                {step.label}
              </p>
              <p className="text-[15px] leading-relaxed" style={{ color: "#5a8a8e" }}>
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[18px] max-w-5xl mx-auto">
        {featureCards.map((card, i) => (
          <div
            key={i}
            className="bg-white border border-[#c8eef1] rounded-2xl p-6 relative overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className={`absolute top-0 left-0 right-0 h-[5px] rounded-t-2xl bg-gradient-to-r ${card.accent}`} />
            <div className={`w-[42px] h-[42px] rounded-[11px] flex items-center justify-center mb-3.5 ${card.iconBg}`}>
              {card.icon}
            </div>
            <p className="text-[20px] font-bold mb-2" style={{ color: midnightTeal }}>
              {card.title}
            </p>
            <p className="text-[17px] leading-relaxed" style={{ color: "#5a8a8e" }}>
              {card.body}
            </p>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </section>
  );
};

export default HowItWorksSection;