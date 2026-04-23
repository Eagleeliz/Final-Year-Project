import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { guidanceApi, type PregnancyGuidance } from "../../Features/Apis/GuidanceAPI";
import { pregnancyApi } from "../../Features/Apis/PregnancyAPI";
import {
  Sparkles, BookOpen, Lightbulb, ExternalLink,
  ChevronLeft, ChevronRight, Calendar, Baby,
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
  if (week <= 13) return { label: "First Trimester", num: 1, color: "#7FD1E0", bg: "#E6F7F9" };
  if (week <= 26) return { label: "Second Trimester", num: 2, color: "#7FD1E0", bg: "#E6F7F9" };
  return { label: "Third Trimester", num: 3, color: "#7FD1E0", bg: "#E6F7F9" };
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
  const midnightTeal = "#0B3B3F";
  const aquaText = "#7FD1E0";
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-bold uppercase tracking-wider text-gray-400">
          Pregnancy Progress
        </span>
        <span className="text-sm font-bold" style={{ color: aquaText }}>
          {percentage}% complete
        </span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${percentage}%`, backgroundColor: aquaText }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-sm text-gray-400">Week 1</span>
        <span className="text-sm text-gray-400">Week 40</span>
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
  const midnightTeal = "#0B3B3F";
  const aquaText = "#7FD1E0";
  const aquaLight = "#E6F7F9";

  return (
    <div
      className="rounded-2xl border overflow-hidden transition-all duration-300 bg-white shadow-sm hover:shadow-md"
      style={{
        borderColor: isCurrentWeek ? aquaText : "#E5E7EB",
        borderWidth: isCurrentWeek ? "2px" : "1px",
      }}
    >
      {/* Card header */}
      <div
        className="px-6 py-4 flex items-center"
        style={{
          background: isCurrentWeek ? aquaLight : "#F8F9FA",
          borderBottom: "1px solid #E5E7EB",
        }}
      >
        <div className="flex items-center gap-3">
          {/* Week number badge */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-base shrink-0"
            style={{
              background: isCurrentWeek ? aquaText : "#F3F4F6",
              color: isCurrentWeek ? midnightTeal : "#6B7280",
            }}
          >
            {guidance.weekNumber}
          </div>

          <div>
            <p className="text-sm text-gray-400 uppercase tracking-wider font-bold flex items-center gap-2">
              Week {guidance.weekNumber}
              {isCurrentWeek && (
                <span
                  className="px-2 py-0.5 rounded-full text-sm font-black"
                  style={{ background: aquaText, color: midnightTeal }}
                >
                  Current
                </span>
              )}
            </p>
            <h3 className="font-bold text-lg" style={{ color: midnightTeal }}>
              {guidance.title}
            </h3>
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="px-6 py-5 space-y-4">
        {/* Summary */}
        <div className="flex gap-3">
          <BookOpen size={18} className="mt-0.5 shrink-0" style={{ color: aquaText }} />
          <p className="text-gray-600 text-base leading-relaxed">{guidance.summary}</p>
        </div>

        {/* Tips */}
        <div
          className="rounded-xl p-4"
          style={{
            background: aquaLight,
            border: `1px solid ${aquaText}40`,
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={16} style={{ color: aquaText }} />
            <span
              className="text-sm font-bold uppercase tracking-wider"
              style={{ color: midnightTeal }}
            >
              Tips for this week
            </span>
          </div>
          <ul className="space-y-1.5">
            {tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-base text-gray-600">
                <span
                  className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: aquaText }}
                />
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Source + external link */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-sm text-gray-400">Source: {guidance.source}</span>
          {guidance.link && (
            <a
              href={guidance.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm font-bold transition-opacity hover:opacity-70"
              style={{ color: aquaText }}
            >
              Read more <ExternalLink size={13} />
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

  const [activePregnancy, setActivePregnancy] = useState<Pregnancy | null>(null);
  const [allGuidance, setAllGuidance] = useState<PregnancyGuidance[]>([]);
  const [currentGuidance, setCurrentGuidance] = useState<PregnancyGuidance | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [loadingPregnancy, setLoadingPregnancy] = useState(true);
  const [loadingGuidance, setLoadingGuidance] = useState(true);
  const [viewMode, setViewMode] = useState<"current" | "browse">("current");

  const midnightTeal = "#0B3B3F";
  const aquaText = "#7FD1E0";
  const aquaLight = "#E6F7F9";
  const warmGray = "#F8F9FA";

  const currentWeek = activePregnancy ? calculateCurrentWeek(activePregnancy.lmpDate) : 1;
  const trimester = getTrimesterLabel(currentWeek);
  const daysToEDD = activePregnancy ? getDaysToEDD(activePregnancy.eddDate) : 0;

  // Effect 1 — fetch active pregnancy
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

  // Effect 2 — fetch all 40 weeks of guidance
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

  // Effect 3 — pin current week card
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

  // Loading screen
  if (loadingPregnancy || loadingGuidance) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: warmGray }}
      >
        <div className="text-center">
          <div 
            className="w-12 h-12 border-2 rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: aquaText, borderTopColor: "transparent" }}
          />
          <p className="text-gray-400 text-base">Loading your journey...</p>
        </div>
      </div>
    );
  }

  // No active pregnancy screen
  if (!activePregnancy) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-8"
        style={{ background: warmGray }}
      >
        <div className="text-center max-w-md w-full">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{
              background: aquaLight,
              border: `1px solid ${aquaText}`,
            }}
          >
            <Baby size={38} style={{ color: midnightTeal }} />
          </div>
          <h2 className="text-3xl font-bold mb-3" style={{ color: midnightTeal }}>
            No Active Pregnancy
          </h2>
          <p className="text-gray-500 text-base mb-6 leading-relaxed">
            You haven't registered a pregnancy yet. Start your journey by adding your details.
          </p>
          <button
            className="px-8 py-3 rounded-xl font-bold transition-all hover:shadow-md text-base"
            style={{ background: midnightTeal, color: aquaText }}
            onClick={() => toast("Navigate to add pregnancy form")}
          >
            Register Pregnancy
          </button>

          {allGuidance.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200 text-left">
              <p className="text-gray-400 text-base mb-4 text-center">
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

  const displayedGuidance: PregnancyGuidance | undefined =
    viewMode === "current"
      ? (currentGuidance ?? allGuidance.find((g) => g.weekNumber === currentWeek))
      : allGuidance.find((g) => g.weekNumber === selectedWeek);

  return (
    <div
      className="min-h-screen font-sans"
      style={{ background: warmGray }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-10">

        {/* Header */}
        <header className="mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Sparkles size={22} style={{ color: aquaText }} />
              <span className="text-sm font-bold uppercase tracking-wider text-gray-400">
                Pregnancy Journey
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: midnightTeal }}>
              Hello, {user?.firstName || "Mama"} 👋
            </h1>
            <p className="text-gray-400 text-base mt-1">
              Your week-by-week companion through motherhood.
            </p>
          </div>
        </header>

        {/* Overview card */}
        <div
          className="rounded-2xl p-6 mb-8 bg-white shadow-sm border"
          style={{ borderColor: "#E5E7EB" }}
        >
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <span
              className="text-sm font-bold uppercase tracking-wider px-3 py-1.5 rounded-full"
              style={{
                background: aquaLight,
                color: midnightTeal,
                border: `1px solid ${aquaText}`,
              }}
            >
              {trimester.label}
            </span>
            <div className="flex items-center gap-2 text-gray-400 text-base">
              <Calendar size={16} />
              <span>EDD: {formatDate(activePregnancy.eddDate)}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <p className="text-5xl font-bold" style={{ color: midnightTeal }}>
                {currentWeek}
              </p>
              <p className="text-sm text-gray-400 uppercase tracking-wider mt-1">
                Current Week
              </p>
            </div>
            <div className="text-center border-x border-gray-200">
              <p className="text-5xl font-bold" style={{ color: midnightTeal }}>
                {daysToEDD}
              </p>
              <p className="text-sm text-gray-400 uppercase tracking-wider mt-1">
                Days to EDD
              </p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold" style={{ color: midnightTeal }}>
                {trimester.num}
              </p>
              <p className="text-sm text-gray-400 uppercase tracking-wider mt-1">
                Trimester
              </p>
            </div>
          </div>

          <WeekProgressBar currentWeek={currentWeek} />

          <p className="text-sm text-gray-400 text-center">
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
          className="flex gap-2 p-1 rounded-xl mb-6 bg-white shadow-sm border"
          style={{ borderColor: "#E5E7EB" }}
        >
          <button
            onClick={() => { setViewMode("current"); setSelectedWeek(currentWeek); }}
            className="flex-1 py-2.5 rounded-lg text-base font-bold transition-all"
            style={{
              background: viewMode === "current" ? midnightTeal : "transparent",
              color: viewMode === "current" ? aquaText : "#6B7280",
            }}
          >
            This Week (Week {currentWeek})
          </button>
          <button
            onClick={() => setViewMode("browse")}
            className="flex-1 py-2.5 rounded-lg text-base font-bold transition-all"
            style={{
              background: viewMode === "browse" ? midnightTeal : "transparent",
              color: viewMode === "browse" ? aquaText : "#6B7280",
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
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 hover:opacity-70"
                style={{ background: aquaLight, color: midnightTeal }}
              >
                <ChevronLeft size={20} />
              </button>
              <span className="font-bold text-xl" style={{ color: midnightTeal }}>
                Week {selectedWeek}
              </span>
              <button
                onClick={() => handleWeekChange(Math.min(selectedWeek + 1, 40))}
                disabled={selectedWeek >= 40}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 hover:opacity-70"
                style={{ background: aquaLight, color: midnightTeal }}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="grid grid-cols-8 md:grid-cols-10 gap-1.5">
              {Array.from({ length: 40 }, (_, i) => i + 1).map((w) => {
                const t = getTrimesterLabel(w);
                const isSelected = w === selectedWeek;
                const isCurrent = w === currentWeek;
                return (
                  <button
                    key={w}
                    onClick={() => handleWeekChange(w)}
                    className="aspect-square rounded-lg text-sm font-bold transition-all hover:opacity-80"
                    style={{
                      background: isSelected
                        ? midnightTeal
                        : isCurrent
                        ? aquaLight
                        : "#F3F4F6",
                      color: isSelected
                        ? aquaText
                        : isCurrent
                        ? midnightTeal
                        : "#9CA3AF",
                      border: isCurrent && !isSelected
                        ? `1px solid ${aquaText}`
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
                { label: "T1 (1–12)", color: aquaText },
                { label: "T2 (13–26)", color: aquaText },
                { label: "T3 (27–40)", color: aquaText },
              ].map((t) => (
                <div key={t.label} className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-sm"
                    style={{ background: t.color }}
                  />
                  <span className="text-sm text-gray-400">{t.label}</span>
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
          <div className="text-center py-16 text-gray-400 text-base">
            No guidance available for this week.
          </div>
        )}

        {/* Browse: full list of all other weeks */}
        {viewMode === "browse" && allGuidance.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
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