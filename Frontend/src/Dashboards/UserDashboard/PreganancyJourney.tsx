import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { guidanceApi, type PregnancyGuidance } from "../../Features/Apis/GuidanceAPI";
import { pregnancyApi } from "../../Features/Apis/PregnancyAPI";
import {
  Sparkles, BookOpen, Lightbulb, ExternalLink,
  ChevronLeft, ChevronRight, Calendar, Baby,
  HeartCrack, AlertTriangle, CheckCircle2, X, ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";

// ── Types ──────────────────────────────────────────────────────
interface Pregnancy {
  id: number; lmpDate: string; eddDate: string;
  currentTrimester: 1|2|3; isActive: boolean;
  outcome: string; pregnancyNumber?: number;
}
type EndReason = "delivered" | "miscarriage" | "terminated";
interface EndJourneyState { reason: EndReason|null; notes: string; step: "select"|"confirm"; }

// ── Helpers ────────────────────────────────────────────────────
const weeksFrom = (lmp: string) =>
  Math.min(Math.max(Math.floor((Date.now() - new Date(lmp).getTime()) / 604800000) + 1, 1), 40);

const trimesterOf = (w: number) =>
  w <= 13 ? { label: "First Trimester", num: 1 as const }
  : w <= 26 ? { label: "Second Trimester", num: 2 as const }
  : { label: "Third Trimester", num: 3 as const };

const daysTo = (edd: string) =>
  Math.max(Math.ceil((new Date(edd).getTime() - Date.now()) / 86400000), 0);

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" });

// ── Constants ──────────────────────────────────────────────────
const T = "#7FD1E0", TL = "#E6F7F9", M = "#0B3B3F";

const REASONS: Record<EndReason, {
  label: string; icon: React.ReactNode; color: string; bg: string; border: string;
  placeholder: string; outcome: string; message: (n: string) => string;
}> = {
  delivered: {
    label: "Baby Delivered", icon: <Baby size={22} />,
    color: M, bg: TL, border: T,
    placeholder: "Share something about your birth experience — the date, where it happened, how you felt...",
    outcome: "delivered",
    message: (n) => `Congratulations, ${n}! 🎉 What a journey you've been on. Welcoming your little one into the world is one of life's most profound moments. Your strength and love carried you here — now a beautiful new chapter begins.`,
  },
  miscarriage: {
    label: "Pregnancy Loss", icon: <HeartCrack size={22} />,
    color: "#7C3F3F", bg: "#FDF2F2", border: "#F0AAAA",
    placeholder: "You don't have to say much. Write what's on your heart, or simply leave this for yourself...",
    outcome: "miscarriage",
    message: (n) => `We are so deeply sorry for your loss, ${n}. What you are feeling is valid — grief, silence, confusion, all of it. You are not alone. Your journey and your love for your baby mattered. Please be gentle with yourself. Whenever you are ready, you can begin a new journey.`,
  },
  terminated: {
    label: "Pregnancy Terminated", icon: <AlertTriangle size={22} />,
    color: "#5A4A1E", bg: "#FDFAF0", border: "#E6C96A",
    placeholder: "This is your private space. Write whatever feels right — there is no judgment here...",
    outcome: "terminated",
    message: (n) => `${n}, whatever brought you to this decision, it was yours to make — and that takes courage. You are not alone in this, and your wellbeing matters deeply. Be kind to yourself in the days ahead. Whenever you are ready, you can begin a new journey here.`,
  },
};

// ── WeekProgressBar ────────────────────────────────────────────
const WeekProgressBar = ({ currentWeek }: { currentWeek: number }) => (
  <div className="mb-6">
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm font-bold uppercase tracking-wider text-gray-400">Pregnancy Progress</span>
      <span className="text-sm font-bold" style={{ color: T }}>{Math.round((currentWeek/40)*100)}% complete</span>
    </div>
    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700"
        style={{ width: `${(currentWeek/40)*100}%`, backgroundColor: T }} />
    </div>
    <div className="flex justify-between mt-1">
      <span className="text-sm text-gray-400">Week 1</span>
      <span className="text-sm text-gray-400">Week 40</span>
    </div>
  </div>
);

// ── GuidanceCard ───────────────────────────────────────────────
const GuidanceCard = ({ guidance, isCurrentWeek }: { guidance: PregnancyGuidance; isCurrentWeek: boolean }) => {
  const tips = guidance.tips.split(",").map(t => t.trim()).filter(Boolean);
  return (
    <div className="rounded-2xl border overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300"
      style={{ borderColor: isCurrentWeek ? T : "#E5E7EB", borderWidth: isCurrentWeek ? "2px" : "1px" }}>
      <div className="px-6 py-4 flex items-center"
        style={{ background: isCurrentWeek ? TL : "#F8F9FA", borderBottom: "1px solid #E5E7EB" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-base shrink-0"
            style={{ background: isCurrentWeek ? T : "#F3F4F6", color: isCurrentWeek ? M : "#6B7280" }}>
            {guidance.weekNumber}
          </div>
          <div>
            <p className="text-sm text-gray-400 uppercase tracking-wider font-bold flex items-center gap-2">
              Week {guidance.weekNumber}
              {isCurrentWeek && (
                <span className="px-2 py-0.5 rounded-full text-sm font-black" style={{ background: T, color: M }}>
                  Current
                </span>
              )}
            </p>
            <h3 className="font-bold text-lg" style={{ color: M }}>{guidance.title}</h3>
          </div>
        </div>
      </div>
      <div className="px-6 py-5 space-y-4">
        <div className="flex gap-3">
          <BookOpen size={18} className="mt-0.5 shrink-0" style={{ color: T }} />
          <p className="text-gray-600 text-base leading-relaxed">{guidance.summary}</p>
        </div>
        <div className="rounded-xl p-4" style={{ background: TL, border: `1px solid ${T}40` }}>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={16} style={{ color: T }} />
            <span className="text-sm font-bold uppercase tracking-wider" style={{ color: M }}>
              Tips for this week
            </span>
          </div>
          <ul className="space-y-1.5">
            {tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-base text-gray-600">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: T }} />
                {tip}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-sm text-gray-400">Source: {guidance.source}</span>
          {guidance.link && (
            <a href={guidance.link} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm font-bold transition-opacity hover:opacity-70"
              style={{ color: T }}>
              Read more <ExternalLink size={13} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// ── EndJourneyModal ────────────────────────────────────────────
const EndJourneyModal = ({ isOpen, onClose, onConfirm, firstName, submitting }: {
  isOpen: boolean; onClose: () => void;
  onConfirm: (r: EndReason, n: string) => Promise<void>;
  firstName: string; submitting: boolean;
}) => {
  const [state, setState] = useState<EndJourneyState>({ reason: null, notes: "", step: "select" });

  useEffect(() => { if (isOpen) setState({ reason: null, notes: "", step: "select" }); }, [isOpen]);

  if (!isOpen) return null;
  const cfg = state.reason ? REASONS[state.reason] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(11,59,63,0.55)", backdropFilter: "blur(4px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl"
        style={{ border: "1.5px solid #E5E7EB" }}>

        {/* Header */}
        <div className="px-7 py-5 flex items-center justify-between" style={{ background: M }}>
          <div>
            <h2 className="text-xl font-black tracking-tight" style={{ color: T }}>End Pregnancy Journey</h2>
            <p className="text-xs mt-0.5 font-medium" style={{ color: "rgba(127,209,224,0.6)" }}>
              This action will close your active pregnancy record
            </p>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:opacity-70"
            style={{ background: "rgba(127,209,224,0.15)", color: T }}>
            <X size={18} />
          </button>
        </div>

        <div className="px-7 py-6">
          {/* Step 1 — Select reason */}
          {state.step === "select" && (
            <div className="space-y-5">
              <p className="text-base text-gray-500">
                Please select the reason for ending your journey, {firstName}.
              </p>
              <div className="space-y-3">
                {(Object.entries(REASONS) as [EndReason, typeof REASONS[EndReason]][]).map(([key, r]) => {
                  const sel = state.reason === key;
                  return (
                    <button key={key} onClick={() => setState(s => ({ ...s, reason: key }))}
                      className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-all"
                      style={{
                        background: sel ? r.bg : "#F8F9FA",
                        border: `2px solid ${sel ? r.border : "#E5E7EB"}`,
                        color: sel ? r.color : "#374151",
                      }}>
                      <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: sel ? r.border + "40" : "#E5E7EB", color: sel ? r.color : "#9CA3AF" }}>
                        {r.icon}
                      </span>
                      <span className="font-bold text-base">{r.label}</span>
                      {sel && <CheckCircle2 size={20} className="ml-auto shrink-0" style={{ color: r.border }} />}
                    </button>
                  );
                })}
              </div>

              {cfg && (
                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400">
                    Your Note <span className="font-normal normal-case tracking-normal">(optional)</span>
                  </label>
                  <textarea rows={4} value={state.notes}
                    onChange={e => setState(s => ({ ...s, notes: e.target.value }))}
                    placeholder={cfg.placeholder}
                    className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-100 text-gray-700 text-sm leading-relaxed resize-none outline-none focus:border-[#7FD1E0] transition-colors"
                    style={{ fontFamily: "inherit" }} />
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={onClose}
                  className="flex-1 py-3.5 rounded-2xl font-bold text-sm border-2 border-gray-200 text-gray-500 hover:border-gray-300 transition-colors">
                  Cancel
                </button>
                <button disabled={!state.reason}
                  onClick={() => setState(s => ({ ...s, step: "confirm" }))}
                  className="flex-1 py-3.5 rounded-2xl font-black text-sm disabled:opacity-40 flex items-center justify-center gap-2 transition-all"
                  style={{ background: M, color: T }}>
                  Continue <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2 — Confirm */}
          {state.step === "confirm" && cfg && (
            <div className="space-y-5">
              <div className="rounded-2xl p-5" style={{ background: cfg.bg, border: `1.5px solid ${cfg.border}` }}>
                <p className="text-base leading-relaxed font-medium" style={{ color: cfg.color }}>
                  {cfg.message(firstName)}
                </p>
              </div>

              <div className="rounded-xl px-5 py-4 bg-gray-50 border border-gray-100 space-y-1">
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                  What will be saved
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Outcome</span>
                  <span className="text-sm font-bold" style={{ color: M }}>{cfg.label}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Status</span>
                  <span className="text-sm font-bold text-gray-400">Inactive</span>
                </div>
                {state.notes && (
                  <div className="flex items-start justify-between gap-4 pt-1">
                    <span className="text-sm text-gray-500 shrink-0">Note</span>
                    <span className="text-sm text-gray-600 text-right">{state.notes}</span>
                  </div>
                )}
              </div>

              {/* Dynamic redirect message */}
              <p className="text-sm text-gray-400 text-center">
                {state.reason === "delivered"
                  ? "After confirming, you'll be taken to the Child Development page."
                  : "After confirming, you can register a new pregnancy journey whenever you're ready."}
              </p>

              <div className="flex gap-3">
                <button onClick={() => setState(s => ({ ...s, step: "select" }))}
                  className="flex-1 py-3.5 rounded-2xl font-bold text-sm border-2 border-gray-200 text-gray-500 hover:border-gray-300 transition-colors">
                  Back
                </button>
                <button disabled={submitting} onClick={() => onConfirm(state.reason!, state.notes)}
                  className="flex-1 py-3.5 rounded-2xl font-black text-sm disabled:opacity-60 flex items-center justify-center gap-2 transition-all"
                  style={{ background: M, color: T }}>
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 rounded-full animate-spin"
                        style={{ borderColor: T, borderTopColor: "transparent" }} />
                      Saving...
                    </>
                  ) : <>Confirm & Continue <ArrowRight size={16} /></>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Main ───────────────────────────────────────────────────────
const PregnancyJourney: React.FC = () => {
  const { user } = useSelector((state: any) => state.auth);
  const navigate = useNavigate();

  const [activePregnancy, setActivePregnancy] = useState<Pregnancy | null>(null);
  const [allGuidance, setAllGuidance] = useState<PregnancyGuidance[]>([]);
  const [currentGuidance, setCurrentGuidance] = useState<PregnancyGuidance | null>(null);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [loadingPregnancy, setLoadingPregnancy] = useState(true);
  const [loadingGuidance, setLoadingGuidance] = useState(true);
  const [viewMode, setViewMode] = useState<"current"|"browse">("current");
  const [lmpDate, setLmpDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [endModalOpen, setEndModalOpen] = useState(false);
  const [endingJourney, setEndingJourney] = useState(false);

  const currentWeek = activePregnancy ? weeksFrom(activePregnancy.lmpDate) : 1;
  const trimester = trimesterOf(currentWeek);
  const daysToEDD = activePregnancy ? daysTo(activePregnancy.eddDate) : 0;

  useEffect(() => {
    if (!user?.id) { setLoadingPregnancy(false); return; }
    pregnancyApi.getActive(user.id)
      .then(res => {
        const p: Pregnancy = res?.data ?? res;
        if (p?.isActive) { setActivePregnancy(p); setSelectedWeek(weeksFrom(p.lmpDate)); }
      })
      .catch(err => { if (err?.response?.status !== 404) toast.error("Could not load pregnancy data."); })
      .finally(() => setLoadingPregnancy(false));
  }, [user?.id]);

  useEffect(() => {
    guidanceApi.getAll()
      .then(setAllGuidance)
      .catch(() => toast.error("Failed to load pregnancy guidance."))
      .finally(() => setLoadingGuidance(false));
  }, []);

  useEffect(() => {
    if (!activePregnancy || !allGuidance.length) return;
    const found = allGuidance.find(g => g.weekNumber === weeksFrom(activePregnancy.lmpDate));
    if (found) setCurrentGuidance(found);
  }, [activePregnancy, allGuidance]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await pregnancyApi.create({ userId: user.id, lmpDate });
      toast.success("Pregnancy registered! Welcome to your journey ✨");
      setLmpDate("");
      const res = await pregnancyApi.getActive(user.id);
      const p: Pregnancy = res?.data ?? res;
      if (p?.isActive) { setActivePregnancy(p); setSelectedWeek(weeksFrom(p.lmpDate)); }
    } catch { toast.error("Failed to register pregnancy. Please try again."); }
    finally { setSubmitting(false); }
  };

  const handleWeekChange = async (week: number) => {
    setSelectedWeek(week);
    try { setCurrentGuidance(await guidanceApi.getByWeek(week)); }
    catch { const f = allGuidance.find(g => g.weekNumber === week); if (f) setCurrentGuidance(f); }
  };

  const handleEndJourney = async (reason: EndReason, notes: string) => {
    if (!activePregnancy) return;
    setEndingJourney(true);
    try {
      // Saves outcome + isActive:false to DB — visible to admins & policy makers
      await pregnancyApi.update(activePregnancy.id, {
        isActive: false,
        outcome: REASONS[reason].outcome,   // "delivered" | "miscarriage" | "terminated"
        notes: notes || undefined,
      });
      toast.success("Your journey has been recorded. Take care of yourself. 💙");
      setEndModalOpen(false);
      setActivePregnancy(null); // clear local state

      setTimeout(() => {
        if (reason === "delivered") {
          navigate("/dashboard/child-dev");       // delivered → child development
        } else {
          navigate("/dashboard/journey");          // miscarriage / terminated → fresh register form
        }
      }, 1200);
    } catch { toast.error("Something went wrong. Please try again."); }
    finally { setEndingJourney(false); }
  };

  // ── Loading ────────────────────────────────────────────────
  if (loadingPregnancy || loadingGuidance) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
      <div className="text-center">
        <div className="w-12 h-12 border-2 rounded-full animate-spin mx-auto mb-4"
          style={{ borderColor: T, borderTopColor: "transparent" }} />
        <p className="text-gray-400">Loading your journey...</p>
      </div>
    </div>
  );

  // ── No active pregnancy — register form ────────────────────
  if (!activePregnancy) return (
    <div className="min-h-screen flex items-start justify-center p-6 pt-16 bg-[#F8F9FA]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: TL, border: `1px solid ${T}` }}>
            <Baby size={38} style={{ color: M }} />
          </div>
          <h2 className="text-3xl font-black mb-3 tracking-tight" style={{ color: M }}>
            No Active Pregnancy
          </h2>
          <p className="text-gray-500 text-base leading-relaxed">
            You haven't registered a pregnancy yet. Start your journey by adding your details.
          </p>
        </div>
        <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border-2"
          style={{ borderColor: M + "10" }}>
          <div className="p-10 text-center" style={{ backgroundColor: M }}>
            <h3 className="text-3xl font-black uppercase tracking-tighter" style={{ color: T }}>
              Begin Journey
            </h3>
            <p className="text-xs opacity-70 mt-2 font-bold tracking-widest uppercase text-white">
              Last Menstrual Period
            </p>
          </div>
          <form onSubmit={handleRegister} className="p-10 space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                Select Date
              </label>
              <input type="date" required value={lmpDate}
                onChange={e => setLmpDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 font-bold text-slate-800 outline-none focus:border-[#7FD1E0] transition-colors" />
            </div>
            <button type="submit" disabled={submitting}
              className="w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg active:scale-95 transition-all"
              style={{ backgroundColor: M, color: T }}>
              {submitting ? "Registering..." : "Confirm & Start Journey"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  // ── Active pregnancy ───────────────────────────────────────
  const displayedGuidance =
    viewMode === "current"
      ? (currentGuidance ?? allGuidance.find(g => g.weekNumber === currentWeek))
      : allGuidance.find(g => g.weekNumber === selectedWeek);

  return (
    <div className="min-h-screen font-sans bg-[#F8F9FA]">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-10">

        {/* Header */}
        <header className="mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Sparkles size={22} style={{ color: T }} />
              <span className="text-sm font-bold uppercase tracking-wider text-gray-400">Pregnancy Journey</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: M }}>
              Hello, {user?.firstName || "Mama"} 👋
            </h1>
            <p className="text-gray-400 text-base mt-1">Your week-by-week companion through motherhood.</p>
          </div>
          <button onClick={() => setEndModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm border-2 transition-all hover:shadow-md shrink-0 mt-1"
            style={{ borderColor: "#F0AAAA", color: "#7C3F3F", background: "#FDF2F2" }}>
            <HeartCrack size={16} /> End Journey
          </button>
        </header>

        {/* Stats card */}
        <div className="rounded-2xl p-6 mb-8 bg-white shadow-sm border border-[#E5E7EB]">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <span className="text-sm font-bold uppercase tracking-wider px-3 py-1.5 rounded-full"
              style={{ background: TL, color: M, border: `1px solid ${T}` }}>
              {trimester.label}
            </span>
            <div className="flex items-center gap-2 text-gray-400 text-base">
              <Calendar size={16} /><span>EDD: {fmtDate(activePregnancy.eddDate)}</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { val: currentWeek, label: "Current Week" },
              { val: daysToEDD,   label: "Days to EDD" },
              { val: trimester.num, label: "Trimester" },
            ].map((s, i) => (
              <div key={i} className={`text-center ${i === 1 ? "border-x border-gray-200" : ""}`}>
                <p className="text-5xl font-bold" style={{ color: M }}>{s.val}</p>
                <p className="text-sm text-gray-400 uppercase tracking-wider mt-1">{s.label}</p>
              </div>
            ))}
          </div>
          <WeekProgressBar currentWeek={currentWeek} />
          <p className="text-sm text-gray-400 text-center">
            LMP: {fmtDate(activePregnancy.lmpDate)}
            {activePregnancy.pregnancyNumber != null && (
              <span className="ml-3 opacity-50">· Pregnancy #{activePregnancy.pregnancyNumber}</span>
            )}
          </p>
        </div>

        {/* View toggle */}
        <div className="flex gap-2 p-1 rounded-xl mb-6 bg-white shadow-sm border border-[#E5E7EB]">
          {(["current", "browse"] as const).map(mode => (
            <button key={mode}
              onClick={() => { setViewMode(mode); if (mode === "current") setSelectedWeek(currentWeek); }}
              className="flex-1 py-2.5 rounded-lg text-base font-bold transition-all"
              style={{ background: viewMode === mode ? M : "transparent", color: viewMode === mode ? T : "#6B7280" }}>
              {mode === "current" ? `This Week (Week ${currentWeek})` : "Browse All Weeks"}
            </button>
          ))}
        </div>

        {/* Week browser */}
        {viewMode === "browse" && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => handleWeekChange(selectedWeek - 1)} disabled={selectedWeek <= 1}
                className="w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-30 hover:opacity-70 transition-all"
                style={{ background: TL, color: M }}>
                <ChevronLeft size={20} />
              </button>
              <span className="font-bold text-xl" style={{ color: M }}>Week {selectedWeek}</span>
              <button onClick={() => handleWeekChange(selectedWeek + 1)} disabled={selectedWeek >= 40}
                className="w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-30 hover:opacity-70 transition-all"
                style={{ background: TL, color: M }}>
                <ChevronRight size={20} />
              </button>
            </div>
            <div className="grid grid-cols-8 md:grid-cols-10 gap-1.5">
              {Array.from({ length: 40 }, (_, i) => i + 1).map(w => {
                const isSel = w === selectedWeek, isCur = w === currentWeek;
                return (
                  <button key={w} onClick={() => handleWeekChange(w)}
                    className="aspect-square rounded-lg text-sm font-bold transition-all hover:opacity-80"
                    style={{
                      background: isSel ? M : isCur ? TL : "#F3F4F6",
                      color: isSel ? T : isCur ? M : "#9CA3AF",
                      border: isCur && !isSel ? `1px solid ${T}` : "none",
                    }}>
                    {w}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-4 mt-3 justify-center">
              {["T1 (1–12)", "T2 (13–26)", "T3 (27–40)"].map(l => (
                <div key={l} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: T }} />
                  <span className="text-sm text-gray-400">{l}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Guidance */}
        {displayedGuidance
          ? <GuidanceCard guidance={displayedGuidance} isCurrentWeek={displayedGuidance.weekNumber === currentWeek} />
          : <div className="text-center py-16 text-gray-400">No guidance available for this week.</div>}

        {/* All weeks list */}
        {viewMode === "browse" && allGuidance.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">All Weeks</h2>
            <div className="space-y-4">
              {allGuidance.filter(g => g.weekNumber !== selectedWeek).map(g => (
                <div key={g.id} className="cursor-pointer" onClick={() => handleWeekChange(g.weekNumber)}>
                  <GuidanceCard guidance={g} isCurrentWeek={g.weekNumber === currentWeek} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <EndJourneyModal
        isOpen={endModalOpen}
        onClose={() => setEndModalOpen(false)}
        onConfirm={handleEndJourney}
        firstName={user?.firstName || "Mama"}
        submitting={endingJourney}
      />
    </div>
  );
};

export default PregnancyJourney;