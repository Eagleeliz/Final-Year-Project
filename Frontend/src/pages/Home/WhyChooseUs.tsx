const WhyChooseUsSection = () => {
  const midnightTeal = "#002e33";

  return (
    <section
      className="w-full overflow-hidden px-12 py-16"
      style={{ background: "linear-gradient(135deg, #f0fbfc 0%, #e8f8f9 50%, #f7fdfd 100%)" }}
    >
      <div
        className="grid gap-12 max-w-[1200px] mx-auto items-start"
        style={{ gridTemplateColumns: "1.2fr 0.8fr" }}
      >

        {/* ── LEFT ── */}
        <div className="flex flex-col gap-5">

          {/* Eyebrow */}
          <span
            className="inline-block text-[15px] font-bold tracking-[2px] uppercase px-4 py-1.5 rounded-full w-fit"
            style={{ background: "#e0f7f9", color: "#007a87" }}
          >
            Why Choose Us
          </span>

          {/* Title — unchanged */}
          <h2
            className="leading-tight"
            style={{ color: midnightTeal, fontFamily: "serif", fontSize: "clamp(32px, 3.5vw, 50px)" }}
          >
            Built for every{" "}
            <em className="not-italic" style={{ color: "#00a0b0" }}>Kenyan mother</em>,
            <br />backed by real care.
          </h2>

          {/* Subtitle */}
          <p className="text-[19px] leading-relaxed" style={{ color: "#4a7a7e" }}>
            MamaCare isn't just an app — it's a trusted companion combining technology and
            compassion to keep you and your baby safe throughout every stage.
          </p>

          {/* Big dark card */}
          <div
            className="rounded-[20px] p-7 relative overflow-hidden"
            style={{ background: midnightTeal }}
          >
            <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full" style={{ background: "rgba(134,217,225,0.08)" }} />
            <div className="absolute bottom-5 right-2 w-24 h-24 rounded-full" style={{ background: "rgba(134,217,225,0.05)" }} />

            <div className="relative z-10">
              <div
                className="w-[46px] h-[46px] rounded-[12px] flex items-center justify-center mb-4"
                style={{ background: "rgba(134,217,225,0.15)", border: "1px solid rgba(134,217,225,0.2)" }}
              >
                <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" fill="none" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" stroke="#86d9e1">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>

              <p className="text-[13px] font-bold tracking-[2px] uppercase mb-2" style={{ color: "#86d9e1" }}>
                AI-Powered Safety
              </p>
              <h3 className="text-[22px] font-bold leading-snug mb-3" style={{ color: "#fff", fontFamily: "serif" }}>
                Real-time danger sign detection — before it's too late.
              </h3>
              <p className="text-[16px] leading-relaxed" style={{ color: "rgba(134,217,225,0.8)" }}>
                Our AI monitors your weekly symptom logs and flags warning signs like preeclampsia,
                gestational diabetes, and preterm labor — alerting you and your care team instantly.
              </p>

              <div
                className="flex gap-8 mt-5 pt-4"
                style={{ borderTop: "1px solid rgba(134,217,225,0.18)" }}
              >
                <div>
                  <p className="text-[34px] font-bold leading-none" style={{ color: "#86d9e1", fontFamily: "serif" }}>355</p>
                  <p className="text-[14px] mt-1 leading-snug" style={{ color: "rgba(255,255,255,0.45)" }}>
                    maternal deaths per<br />100k live births in Kenya
                  </p>
                </div>
                <div>
                  <p className="text-[34px] font-bold leading-none" style={{ color: "#86d9e1", fontFamily: "serif" }}>80%</p>
                  <p className="text-[14px] mt-1 leading-snug" style={{ color: "rgba(255,255,255,0.45)" }}>
                    of these deaths are<br />preventable with early care
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Two small cards */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                iconBg: "bg-[#d4f4f7]",
                icon: (
                  <svg viewBox="0 0 24 24" className="w-[20px] h-[20px]" fill="none" strokeWidth={1.65} strokeLinecap="round" strokeLinejoin="round" stroke="#007a87">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                ),
                title: "Personalized for you",
                body: "Guidance tailored to your trimester, health history, and risk profile.",
              },
              {
                iconBg: "bg-[#fde8f0]",
                icon: (
                  <svg viewBox="0 0 24 24" className="w-[20px] h-[20px]" fill="none" strokeWidth={1.65} strokeLinecap="round" strokeLinejoin="round" stroke="#c0426e">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                ),
                title: "Continuous monitoring",
                body: "From first antenatal visit to early childhood — no gaps, no missed signs.",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-white border border-[#c8eef1] rounded-2xl p-5 flex flex-col gap-3 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className={`w-[38px] h-[38px] rounded-[10px] ${card.iconBg}`}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  {card.icon}
                </div>
                <p className="text-[17px] font-bold" style={{ color: midnightTeal }}>{card.title}</p>
                <p className="text-[15px] leading-relaxed" style={{ color: "#5a8a8e" }}>{card.body}</p>
              </div>
            ))}
          </div>

          {/* Mini stat cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { num: "24/7", title: "Always available",    body: "AI answers any time, day or night.",    bg: midnightTeal },
              { num: "47",   title: "Counties covered",    body: "Across all of Kenya — urban and rural.", bg: "#003840" },
              { num: "Free", title: "No cost to mothers",  body: "Safe motherhood for everyone.",          bg: midnightTeal },
            ].map((card, i) => (
              <div
                key={i}
                className="rounded-[14px] p-4 flex flex-col gap-1.5 transition-all duration-200 hover:brightness-110"
                style={{ background: card.bg }}
              >
                <p className="text-[30px] font-bold leading-none" style={{ color: "#86d9e1", fontFamily: "serif" }}>{card.num}</p>
                <p className="text-[15px] font-bold" style={{ color: "#fff" }}>{card.title}</p>
                <p className="text-[14px] leading-relaxed" style={{ color: "rgba(134,217,225,0.7)" }}>{card.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: single image ── */}
        <div className="hidden lg:flex flex-col gap-4 sticky top-8">

          {/* Main image */}
          <div className="relative rounded-[22px] overflow-hidden" style={{ height: "420px" }}>
            <img
              src="https://images.pexels.com/photos/3662849/pexels-photo-3662849.jpeg?auto=compress&cs=tinysrgb&w=700"
              alt="Pregnant woman"
              className="w-full h-full object-cover object-top"
            />
            <div
              className="absolute bottom-4 left-3 right-3 rounded-[14px] px-4 py-3 flex items-center gap-3"
              style={{ background: "rgba(0,46,51,0.92)" }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: "#86d9e1", animation: "pulse 2s infinite" }}
              />
              <div>
                <p className="text-[16px] font-semibold" style={{ color: "#fff" }}>10,000+ mothers</p>
                <p className="text-[14px]" style={{ color: "rgba(134,217,225,0.75)" }}>actively using MamaCare</p>
              </div>
            </div>
          </div>

          {/* Stats below image */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[14px] p-4 flex flex-col gap-1" style={{ background: "#e0f7f9" }}>
              <p className="text-[28px] font-bold leading-none" style={{ color: midnightTeal, fontFamily: "serif" }}>500+</p>
              <p className="text-[14px] font-semibold" style={{ color: "#007a87" }}>Expert articles</p>
              <p className="text-[13px]" style={{ color: "#4a7a7e" }}>Reviewed by doctors</p>
            </div>
            <div className="rounded-[14px] p-4 flex flex-col gap-1" style={{ background: "#e0f7f9" }}>
              <p className="text-[28px] font-bold leading-none" style={{ color: midnightTeal, fontFamily: "serif" }}>47</p>
              <p className="text-[14px] font-semibold" style={{ color: "#007a87" }}>Counties reached</p>
              <p className="text-[13px]" style={{ color: "#4a7a7e" }}>Urban and rural Kenya</p>
            </div>
          </div>

        </div>

      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.35; }
        }
      `}</style>

    </section>
  );
};

export default WhyChooseUsSection;