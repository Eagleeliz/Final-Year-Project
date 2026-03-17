import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { guidanceApi, type PregnancyGuidance } from "../../Features/Apis/GuidanceAPI";
import { pregnancyApi } from "../../Features/Apis/PregnancyAPI";
import {
  Sparkles, BookOpen, Lightbulb, ExternalLink,
  ChevronLeft, ChevronRight, Calendar, Baby, RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

// ─── Types ────────────────────────────────────────────────────

interface Pregnancy {
  id: number;
  lmpDate: string;
  eddDate: string;
  currentTrimester: 1 | 2 | 3;
  isActive: boolean;
  outcome: string;
  pregnancyNumber?: number;
}

// ─── Helpers ──────────────────────────────────────────────────

const calculateCurrentWeek = (lmpDate: string): number => {
  const diffDays = Math.floor(
    (new Date().getTime() - new Date(lmpDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  return Math.min(Math.max(Math.floor(diffDays / 7) + 1, 1), 40);
};

const getTrimesterLabel = (week: number): {
  label: string; num: 1 | 2 | 3; color: string; bg: string;
} => {
  if (week <= 12) return { label: "First Trimester",  num: 1, color: "#86d9e1", bg: "rgba(134,217,225,0.15)" };
  if (week <= 26) return { label: "Second Trimester", num: 2, color: "#a8d5a2", bg: "rgba(168,213,162,0.15)" };
  return            { label: "Third Trimester",  num: 3, color: "#f4b8a0", bg: "rgba(244,184,160,0.15)" };
};

const getDaysToEDD = (eddDate: string): number =>
  Math.max(
    Math.ceil((new Date(eddDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
    0
  );

const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString("en-KE", {
    day: "numeric", month: "long", year: "numeric",
  });

// ─── WeekProgressBar ──────────────────────────────────────────

const WeekProgressBar: React.FC<{ currentWeek: number }> = ({ currentWeek }) => {
  const percentage = Math.round((currentWeek / 40) * 100);
  const { color } = getTrimesterLabel(currentWeek);
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold uppercase tracking-widest text-white/50">
          Pregnancy Progress
        </span>
        <span className="text-xs font-bold" style={{ color }}>
          {percentage}% complete
        </span>
      </div>
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-white/30">Week 1</span>
        <span className="text-xs text-white/30">Week 40</span>
      </div>
    </div>
  );
};

// ─── GuidanceCard ─────────────────────────────────────────────

interface GuidanceCardProps {
  guidance: PregnancyGuidance;
  isCurrentWeek: boolean;
}

const GuidanceCard: React.FC<GuidanceCardProps> = ({ guidance, isCurrentWeek }) => {
  const tips = guidance.tips.split(",").map((t) => t.trim()).filter(Boolean);

  return (
    <div
      className="rounded-3xl border overflow-hidden transition-all duration-300"
      style={{
        background: isCurrentWeek
          ? "linear-gradient(135deg, rgba(134,217,225,0.08) 0%, rgba(0,46,51,0.4) 100%)"
          : "rgba(255,255,255,0.03)",
        borderColor: isCurrentWeek
          ? "rgba(134,217,225,0.4)"
          : "rgba(255,255,255,0.08)",
      }}
    >
      {/* Card header */}
      <div
        className="px-6 py-4 flex items-center"
        style={{
          background: isCurrentWeek ? "rgba(134,217,225,0.1)" : "rgba(255,255,255,0.03)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center gap-3">
          {/* Week number badge */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0"
            style={{
              background: isCurrentWeek ? "#86d9e1" : "rgba(255,255,255,0.08)",
              color: isCurrentWeek ? "#002e33" : "rgba(255,255,255,0.5)",
            }}
          >
            {guidance.weekNumber}
          </div>

          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest font-bold flex items-center gap-2">
              Week {guidance.weekNumber}
              {isCurrentWeek && (
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-black"
                  style={{ background: "#86d9e1", color: "#002e33" }}
                >
                  Current
                </span>
              )}
            </p>
            <h3 className="text-white font-bold text-base">{guidance.title}</h3>
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="px-6 py-5 space-y-4">
        {/* Summary */}
        <div className="flex gap-3">
          <BookOpen size={16} className="mt-0.5 shrink-0" style={{ color: "#86d9e1" }} />
          <p className="text-white/70 text-sm leading-relaxed">{guidance.summary}</p>
        </div>

        {/* Tips — comma-separated in DB, shown as bullet list */}
        <div
          className="rounded-2xl p-4"
          style={{
            background: "rgba(134,217,225,0.06)",
            border: "1px solid rgba(134,217,225,0.12)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={14} style={{ color: "#86d9e1" }} />
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "#86d9e1" }}
            >
              Tips for this week
            </span>
          </div>
          <ul className="space-y-1.5">
            {tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                <span
                  className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: "#86d9e1" }}
                />
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Source + external link */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-white/30">Source: {guidance.source}</span>
   {guidance.link && (
  <a                                                          
    href={guidance.link}                                      
    target="_blank"                                          
    rel="noopener noreferrer"                                 
    className="flex items-center gap-1 text-xs font-bold" 
    style={{ color: "#86d9e1" }}                             
  >                                                          
    Read more <ExternalLink size={11} />
  </a>
)}
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────

const PregnancyJourney: React.FC = () => {
  const { user } = useSelector((state: any) => state.auth);

  const [activePregnancy, setActivePregnancy]   = useState<Pregnancy | null>(null);
  const [allGuidance, setAllGuidance]           = useState<PregnancyGuidance[]>([]);
  const [currentGuidance, setCurrentGuidance]   = useState<PregnancyGuidance | null>(null);
  const [selectedWeek, setSelectedWeek]         = useState<number>(1);
  const [loadingPregnancy, setLoadingPregnancy] = useState(true);
  const [loadingGuidance, setLoadingGuidance]   = useState(true);
  const [viewMode, setViewMode]                 = useState<"current" | "browse">("current");

  const currentWeek = activePregnancy ? calculateCurrentWeek(activePregnancy.lmpDate) : 1;
  const trimester   = getTrimesterLabel(currentWeek);
  const daysToEDD   = activePregnancy ? getDaysToEDD(activePregnancy.eddDate) : 0;

  // Effect 1 — fetch active pregnancy from GET /api/pregnancies/active/:userId
  useEffect(() => {
    const run = async () => {
      const userId = Number(localStorage.getItem("userId"));
      if (!userId) { setLoadingPregnancy(false); return; }
      try {
        const res = await pregnancyApi.getActive(userId);
        const p: Pregnancy = res?.data ?? res;
        if (p?.isActive) {
          setActivePregnancy(p);
          setSelectedWeek(calculateCurrentWeek(p.lmpDate));
        }
      } catch (err: any) {
        if (err?.response?.status !== 404) {
          toast.error("Could not load pregnancy data.");
        }
      } finally {
        setLoadingPregnancy(false);
      }
    };
    run();
  }, []);

  // Effect 2 — fetch all 40 weeks of guidance upfront
  useEffect(() => {
    const run = async () => {
      try {
        const data = await guidanceApi.getAll();
        setAllGuidance(data);
      } catch {
        toast.error("Failed to load pregnancy guidance.");
      } finally {
        setLoadingGuidance(false);
      }
    };
    run();
  }, []);

  // Effect 3 — pin current week card once both loads are done
  useEffect(() => {
    if (!activePregnancy || allGuidance.length === 0) return;
    const week = calculateCurrentWeek(activePregnancy.lmpDate);
    const found = allGuidance.find((g) => g.weekNumber === week);
    if (found) setCurrentGuidance(found);
  }, [activePregnancy, allGuidance]);

  const handleWeekChange = async (week: number) => {
    setSelectedWeek(week);
    try {
      const data = await guidanceApi.getByWeek(week);
      setCurrentGuidance(data);
    } catch {
      const found = allGuidance.find((g) => g.weekNumber === week);
      if (found) setCurrentGuidance(found);
    }
  };

  const handleRefresh = async () => {
    const userId = Number(localStorage.getItem("userId"));
    if (!userId) return;
    try {
      const res = await pregnancyApi.getActive(userId);
      const p: Pregnancy = res?.data ?? res;
      if (p?.isActive) {
        setActivePregnancy(p);
        toast.success("Pregnancy data refreshed");
      }
    } catch {
      toast.error("Could not refresh.");
    }
  };

  // ── Loading screen
  if (loadingPregnancy || loadingGuidance) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#001e22" }}
      >
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#86d9e1] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#86d9e1]/60 text-sm">Loading your journey...</p>
        </div>
      </div>
    );
  }

  // ── No active pregnancy screen
  if (!activePregnancy) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-8"
        style={{ background: "#001e22" }}
      >
        <div className="text-center max-w-md w-full">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
            style={{
              background: "rgba(134,217,225,0.1)",
              border: "1px solid rgba(134,217,225,0.2)",
            }}
          >
            <Baby size={36} style={{ color: "#86d9e1" }} />
          </div>
          <h2 className="text-2xl font-black text-white mb-3">No Active Pregnancy</h2>
          <p className="text-white/50 mb-6 leading-relaxed">
            You haven't registered a pregnancy yet. Start your journey by adding your details.
          </p>
          <button
            className="px-8 py-3 rounded-2xl font-bold"
            style={{ background: "#86d9e1", color: "#002e33" }}
            onClick={() => toast("Navigate to add pregnancy form")}
          >
            Register Pregnancy
          </button>

          {allGuidance.length > 0 && (
            <div className="mt-8 pt-8 border-t border-white/10 text-left">
              <p className="text-white/30 text-sm mb-4 text-center">
                Or browse weekly guidance below
              </p>
              <div className="space-y-4">
                {allGuidance.slice(0, 3).map((g) => (
                  <GuidanceCard
                    key={g.id}
                    guidance={g}
                    isCurrentWeek={false}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Explicitly typed to avoid TS inferring string literals into the union
  const displayedGuidance: PregnancyGuidance | undefined =
    viewMode === "current"
      ? (currentGuidance ?? allGuidance.find((g) => g.weekNumber === currentWeek))
      : allGuidance.find((g) => g.weekNumber === selectedWeek);

  return (
    <div
      className="min-h-screen font-sans"
      style={{ background: "#001e22", color: "white" }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-10">

        {/* Header */}
        <header className="mb-8 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Sparkles size={20} style={{ color: "#86d9e1" }} />
              <span className="text-xs font-bold uppercase tracking-widest text-white/40">
                Pregnancy Journey
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white">
              Hello, {user?.firstName || "Mama"} 👋
            </h1>
            <p className="text-white/40 mt-1">
              Your week-by-week companion through motherhood.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:opacity-70 mt-1 shrink-0"
            style={{ background: "rgba(134,217,225,0.1)", color: "#86d9e1" }}
            title="Refresh pregnancy data"
          >
            <RefreshCw size={15} />
          </button>
        </header>

        {/* Overview card */}
        <div
          className="rounded-3xl p-6 mb-8"
          style={{
            background: "rgba(134,217,225,0.06)",
            border: "1px solid rgba(134,217,225,0.2)",
          }}
        >
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <span
              className="text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full"
              style={{
                background: trimester.bg,
                color: trimester.color,
                border: `1px solid ${trimester.color}40`,
              }}
            >
              {trimester.label}
            </span>
            <div className="flex items-center gap-2 text-white/40 text-sm">
              <Calendar size={14} />
              <span>EDD: {formatDate(activePregnancy.eddDate)}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <p className="text-4xl font-black" style={{ color: "#86d9e1" }}>
                {currentWeek}
              </p>
              <p className="text-xs text-white/40 uppercase tracking-widest mt-1">
                Current Week
              </p>
            </div>
            <div className="text-center border-x border-white/10">
              <p className="text-4xl font-black text-white">{daysToEDD}</p>
              <p className="text-xs text-white/40 uppercase tracking-widest mt-1">
                Days to EDD
              </p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-white">{trimester.num}</p>
              <p className="text-xs text-white/40 uppercase tracking-widest mt-1">
                Trimester
              </p>
            </div>
          </div>

          <WeekProgressBar currentWeek={currentWeek} />

          <p className="text-xs text-white/30 text-center">
            LMP: {formatDate(activePregnancy.lmpDate)}
            {activePregnancy.pregnancyNumber != null && (
              <span className="ml-3 opacity-50">
                · Pregnancy #{activePregnancy.pregnancyNumber}
              </span>
            )}
          </p>
        </div>

        {/* Mode tabs */}
        <div
          className="flex gap-2 p-1 rounded-2xl mb-6"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          <button
            onClick={() => { setViewMode("current"); setSelectedWeek(currentWeek); }}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{
              background: viewMode === "current" ? "#86d9e1" : "transparent",
              color: viewMode === "current" ? "#002e33" : "rgba(255,255,255,0.4)",
            }}
          >
            This Week (Week {currentWeek})
          </button>
          <button
            onClick={() => setViewMode("browse")}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{
              background: viewMode === "browse" ? "#86d9e1" : "transparent",
              color: viewMode === "browse" ? "#002e33" : "rgba(255,255,255,0.4)",
            }}
          >
            Browse All Weeks
          </button>
        </div>

        {/* Browse controls */}
        {viewMode === "browse" && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => handleWeekChange(Math.max(selectedWeek - 1, 1))}
                disabled={selectedWeek <= 1}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
                style={{ background: "rgba(134,217,225,0.1)", color: "#86d9e1" }}
              >
                <ChevronLeft size={18} />
              </button>
              <span className="font-bold text-white">Week {selectedWeek}</span>
              <button
                onClick={() => handleWeekChange(Math.min(selectedWeek + 1, 40))}
                disabled={selectedWeek >= 40}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
                style={{ background: "rgba(134,217,225,0.1)", color: "#86d9e1" }}
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="grid grid-cols-8 md:grid-cols-10 gap-1.5">
              {Array.from({ length: 40 }, (_, i) => i + 1).map((w) => {
                const t = getTrimesterLabel(w);
                const isSelected = w === selectedWeek;
                const isCurrent  = w === currentWeek;
                return (
                  <button
                    key={w}
                    onClick={() => handleWeekChange(w)}
                    className="aspect-square rounded-lg text-xs font-bold transition-all hover:opacity-80"
                    style={{
                      background: isSelected
                        ? "#86d9e1"
                        : isCurrent
                        ? "rgba(134,217,225,0.25)"
                        : t.bg,
                      color: isSelected
                        ? "#002e33"
                        : isCurrent
                        ? "#86d9e1"
                        : "rgba(255,255,255,0.4)",
                      border:
                        isCurrent && !isSelected
                          ? "1px solid rgba(134,217,225,0.4)"
                          : "none",
                    }}
                  >
                    {w}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-4 mt-3 justify-center">
              {[
                { label: "T1 (1–12)",  color: "#86d9e1" },
                { label: "T2 (13–26)", color: "#a8d5a2" },
                { label: "T3 (27–40)", color: "#f4b8a0" },
              ].map((t) => (
                <div key={t.label} className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-sm"
                    style={{ background: t.color + "60" }}
                  />
                  <span className="text-xs text-white/40">{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Guidance card */}
        {displayedGuidance !== undefined ? (
          <GuidanceCard
            guidance={displayedGuidance}
            isCurrentWeek={displayedGuidance.weekNumber === currentWeek}
          />
        ) : (
          <div className="text-center py-16 text-white/30">
            No guidance available for this week.
          </div>
        )}

        {/* Browse: full list of all other weeks */}
        {viewMode === "browse" && allGuidance.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xs font-black uppercase tracking-widest text-white/30 mb-4">
              All Weeks
            </h2>
            <div className="space-y-4">
              {allGuidance
                .filter((g) => g.weekNumber !== selectedWeek)
                .map((g) => (
                  <div
                    key={g.id}
                    className="cursor-pointer"
                    onClick={() => handleWeekChange(g.weekNumber)}
                  >
                    <GuidanceCard
                      guidance={g}
                      isCurrentWeek={g.weekNumber === currentWeek}
                    />
                  </div>
                ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PregnancyJourney;