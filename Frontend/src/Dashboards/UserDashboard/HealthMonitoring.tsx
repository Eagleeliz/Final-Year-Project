import { useState, useEffect } from 'react';
import { Activity, ShieldAlert, Weight, Baby, CheckCircle2, AlertCircle, Heart, TrendingUp, Droplets, Footprints, ClipboardCheck, ClipboardList } from 'lucide-react';
import { weeklyCheckinApi } from '../../Features/Apis/WeeklyCheckinAPI';
import { pregnancyApi } from '../../Features/Apis/PregnancyAPI';

interface HealthFormData {
  pregnancy_id: number | null; week_number: number | "";
  blood_pressure_systolic: number | ""; blood_pressure_diastolic: number | "";
  weight: number | ""; temperature: number | "";
  nausea_level: number | null; fatigue_level: number | null;
  back_pain: boolean; headache: boolean; dizziness: boolean;
  swelling: boolean; vaginal_bleeding: boolean; blurred_vision: boolean;
  fetal_movements_count: number | ""; fetal_movement_notes: string;
  other_symptoms: string; general_notes: string;
}

const EMPTY: Partial<HealthFormData> = {
  week_number: "", blood_pressure_systolic: "", blood_pressure_diastolic: "",
  weight: "", temperature: "", nausea_level: null, fatigue_level: null,
  back_pain: false, headache: false, dizziness: false, swelling: false,
  vaginal_bleeding: false, blurred_vision: false, fetal_movements_count: "",
  fetal_movement_notes: "", other_symptoms: "", general_notes: "",
};

const SYMPTOMS = [
  { id: 'vaginal_bleeding', label: 'Vaginal Bleeding', critical: true },
  { id: 'blurred_vision',   label: 'Blurred Vision',   critical: true },
  { id: 'back_pain',        label: 'Back Pain',        critical: false },
  { id: 'headache',         label: 'Headache',         critical: false },
  { id: 'dizziness',        label: 'Dizziness',        critical: false },
  { id: 'swelling',         label: 'Swelling',         critical: false },
];

const TEAL         = "#0B3B3F";
const ACCENT       = "#7FD1E0";
const ACCENT_LIGHT = "#E6F7F9";
const RED          = "#DC2626";
const RED_LIGHT    = "#FEE2E2";

const inputClass    = "w-full px-4 py-3 rounded-xl border-2 text-gray-800 font-semibold text-xl outline-none transition-all focus:shadow-md";
const textareaClass = "w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 text-base outline-none resize-none focus:bg-white transition-all";

const CardHeader = ({ icon: Icon, title, sub }: { icon: any; title: string; sub?: string }) => (
  <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3" style={{ backgroundColor: ACCENT_LIGHT }}>
    <div className="p-2 rounded-lg bg-white"><Icon size={20} style={{ color: TEAL }} /></div>
    <h3 className="font-bold text-lg" style={{ color: TEAL }}>{title}</h3>
    {sub && <span className="ml-auto text-xs text-gray-500">{sub}</span>}
  </div>
);

// Checks all possible shapes the API response might return
const hasCheckinData = (ex: any): boolean => {
  if (!ex) return false;
  if (Array.isArray(ex)) return ex.length > 0;
  // unwrap common wrapper shapes: { data: {...} } or { data: [...] }
  const inner = ex.data ?? ex;
  if (Array.isArray(inner)) return inner.length > 0;
  return !!(inner.id || inner.weekNumber || inner.week_number || inner.pregnancyId);
};

const HealthMonitoring = () => {
  const [loading, setLoading]                       = useState(false);
  const [isSubmitted, setIsSubmitted]               = useState(false);
  const [error, setError]                           = useState<string | null>(null);
  const [weeklyStatusLoading, setWeeklyStatusLoading] = useState(true);
  const [alreadyCheckedIn, setAlreadyCheckedIn]     = useState(false);
  const [fd, setFd] = useState<HealthFormData>({ pregnancy_id: null, ...EMPTY } as HealthFormData);

  const set          = (field: keyof HealthFormData, value: any) => setFd(p => ({ ...p, [field]: value }));
  const nullIfEmpty  = (v: any) => v === "" ? null : v;

  useEffect(() => {
    (async () => {
      try {
        const userId = Number(localStorage.getItem("userId"));
        if (!userId) { setError("Please log in again."); return; }

        const pregnancy = (await pregnancyApi.getActive(userId))?.data ?? (await pregnancyApi.getActive(userId));
        if (pregnancy?.id) {
          const days = pregnancy.lmpDate
            ? Math.floor((Date.now() - new Date(pregnancy.lmpDate).getTime()) / 86400000) : null;
          const weekNumber = days != null ? Math.min(Math.max(Math.floor(days / 7) + 1, 1), 40) as any : "";
          setFd(p => ({ ...p, pregnancy_id: pregnancy.id, week_number: weekNumber }));

          if (weekNumber !== "") {
            try {
              const ex = await weeklyCheckinApi.getByWeek(pregnancy.id, weekNumber);
              console.log("getByWeek response:", ex); // helpful for debugging
              if (hasCheckinData(ex)) setAlreadyCheckedIn(true);
            } catch (e: any) {
              // 404 means no check-in yet — that's fine, ignore it
              if (e?.response?.status !== 404) console.error(e);
            }
          }
        }
      } catch (e: any) {
        if (e?.response?.status !== 404) setError("Could not load pregnancy profile.");
      } finally { setWeeklyStatusLoading(false); }
    })();
  }, []);

  const handleNum = (field: keyof HealthFormData, val: string) => {
    if (alreadyCheckedIn) return;
    if (val === "") { set(field, ""); return; }
    const n = Number(val); if (n >= 0) set(field, n);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (alreadyCheckedIn || !fd.pregnancy_id) { if (!fd.pregnancy_id) setError("Pregnancy profile not found."); return; }
    const bpS = fd.blood_pressure_systolic !== "", bpD = fd.blood_pressure_diastolic !== "";
    if (bpS !== bpD) { setError("Please enter both systolic and diastolic blood pressure."); return; }
    if (fd.nausea_level === null || fd.fatigue_level === null) { setError("Please select nausea and fatigue levels."); return; }

    setLoading(true); setError(null);
    try {
      await weeklyCheckinApi.create({
        pregnancyId: fd.pregnancy_id, weekNumber: fd.week_number,
        bloodPressureSystolic: nullIfEmpty(fd.blood_pressure_systolic),
        bloodPressureDiastolic: nullIfEmpty(fd.blood_pressure_diastolic),
        weight: nullIfEmpty(fd.weight), temperature: nullIfEmpty(fd.temperature),
        nauseaLevel: fd.nausea_level, fatigueLevel: fd.fatigue_level,
        backPain: fd.back_pain, headache: fd.headache, dizziness: fd.dizziness,
        swelling: fd.swelling, vaginalBleeding: fd.vaginal_bleeding, blurredVision: fd.blurred_vision,
        fetalMovementsCount: nullIfEmpty(fd.fetal_movements_count),
        fetalMovementNotes: fd.fetal_movement_notes,
        otherSymptoms: nullIfEmpty(fd.other_symptoms), generalNotes: fd.general_notes,
      });
      setAlreadyCheckedIn(true); // locks form + flips banner immediately
      setIsSubmitted(true);
      setFd(p => ({ ...p, ...EMPTY }));
    } catch (e: any) { setError(e.response?.data?.message || "Error saving check-in."); }
    finally { setLoading(false); }
  };

  const Scale = ({ label, field }: { label: string; field: 'nausea_level' | 'fatigue_level' }) => (
    <div className="flex-1 space-y-4">
      <div className="flex justify-between items-end">
        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{label}</label>
        <span className="text-base font-bold" style={{ color: TEAL }}>{fd[field] ? `${fd[field]}/5` : "Not rated"}</span>
      </div>
      <div className="flex gap-2">
        {[1,2,3,4,5].map(n => (
          <button key={n} type="button" disabled={alreadyCheckedIn}
            onClick={() => !alreadyCheckedIn && set(field, n)}
            className={`flex-1 py-4 rounded-xl font-bold text-base transition-all duration-200 ${fd[field] !== null && fd[field]! >= n ? "text-white shadow-md" : "bg-gray-100 text-gray-400 hover:bg-gray-200"} ${alreadyCheckedIn ? "opacity-60 cursor-not-allowed" : ""}`}
            style={fd[field] !== null && fd[field]! >= n ? { backgroundColor: ACCENT } : {}}>
            {n}
          </button>
        ))}
      </div>
    </div>
  );

  if (isSubmitted) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-md w-full space-y-6 border border-gray-100">
        <div className="flex justify-center">
          <div className="p-4 rounded-full" style={{ backgroundColor: ACCENT_LIGHT }}>
            <CheckCircle2 size={60} strokeWidth={1.5} style={{ color: TEAL }} />
          </div>
        </div>
        <h2 className="text-3xl font-bold" style={{ color: TEAL }}>Check-in Complete!</h2>
        <p className="text-gray-500 text-sm">Your health data has been recorded successfully.</p>
        <div className="flex flex-col gap-3">
          <button onClick={() => window.location.href = '/dashboard'}
            className="w-full py-4 rounded-xl font-semibold uppercase tracking-wide shadow-lg hover:shadow-xl"
            style={{ backgroundColor: TEAL, color: ACCENT }}>
            Return to Dashboard
          </button>
          <button onClick={() => setIsSubmitted(false)}
            className="w-full py-4 rounded-xl font-semibold uppercase tracking-wide border-2"
            style={{ borderColor: TEAL, color: TEAL, backgroundColor: "transparent" }}>
            View Submitted Entry
          </button>
        </div>
      </div>
    </div>
  );

  const weekLabel = fd.week_number !== "" ? `Week ${fd.week_number}` : "this week";
  const locked = alreadyCheckedIn;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F9FA" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: TEAL }}>Health Monitoring</h1>
            <div className="flex items-center gap-3 mt-2">
              <div className="px-3 py-1 rounded-full bg-white shadow-sm" style={{ borderLeft: `3px solid ${ACCENT}` }}>
                <span className="text-sm font-semibold" style={{ color: TEAL }}>Week {fd.week_number || "—"}</span>
              </div>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500 font-medium">Daily Health Log</span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
            <Heart size={16} style={{ color: ACCENT }} />
            <span className="text-xs font-medium text-gray-600">Track your pregnancy journey</span>
          </div>
        </div>

        {/* Weekly Banner */}
        {!weeklyStatusLoading && (
          <div className="flex items-center gap-4 px-6 py-4 rounded-2xl shadow-sm mb-8"
            style={{ backgroundColor: TEAL, borderLeft: `4px solid ${ACCENT}` }}>
            <div className="p-2 rounded-full" style={{ backgroundColor: "rgba(127,209,224,0.15)" }}>
              {locked
                ? <ClipboardCheck size={24} style={{ color: ACCENT }} />
                : <ClipboardList size={24} style={{ color: ACCENT }} />}
            </div>
            <div>
              <p className="font-bold text-lg" style={{ color: ACCENT }}>
                {locked ? `Weekly check-in for ${weekLabel} done ✓` : `Please enter your ${weekLabel} report`}
              </p>
              <p className="text-sm mt-0.5" style={{ color: "rgba(127,209,224,0.75)" }}>
                {locked
                  ? "You've already logged this week's report. Come back next week!"
                  : "Fill in your health details below to complete this week's check-in."}
              </p>
            </div>
          </div>
        )}

        <div className={locked ? "opacity-60 pointer-events-none select-none" : ""}>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* LEFT */}
              <div className="lg:col-span-2 space-y-8">

                {/* Biometric Vitals */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3" style={{ backgroundColor: ACCENT_LIGHT }}>
                    <div className="p-2 rounded-lg bg-white"><Activity size={20} style={{ color: TEAL }} /></div>
                    <h3 className="font-bold text-lg" style={{ color: TEAL }}>Biometric Vitals</h3>
                    <span className="ml-auto text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-400 uppercase tracking-wide">Optional</span>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                        <Droplets size={14} /> Blood Pressure
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <input type="number" min="0" placeholder="Systolic" className={inputClass} style={{ borderColor: "#E5E7EB" }}
                            value={fd.blood_pressure_systolic} onChange={e => handleNum("blood_pressure_systolic", e.target.value)} />
                          <p className="text-[10px] text-gray-400 mt-1 text-center">mmHg</p>
                        </div>
                        <span className="text-2xl text-gray-300">/</span>
                        <div className="flex-1">
                          <input type="number" min="0" placeholder="Diastolic" className={inputClass} style={{ borderColor: "#E5E7EB" }}
                            value={fd.blood_pressure_diastolic} onChange={e => handleNum("blood_pressure_diastolic", e.target.value)} />
                          <p className="text-[10px] text-gray-400 mt-1 text-center">mmHg</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                        <Weight size={14} /> Weight
                      </label>
                      <div className="relative">
                        <input type="number" min="0" step="0.1" placeholder="Enter weight" className={inputClass} style={{ borderColor: "#E5E7EB" }}
                          value={fd.weight} onChange={e => handleNum("weight", e.target.value)} />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">kg</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Symptom Tracking */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <CardHeader icon={TrendingUp} title="Symptom Tracking" />
                  <div className="p-6 flex flex-col md:flex-row gap-8">
                    <Scale label="Nausea Intensity" field="nausea_level" />
                    <Scale label="Fatigue Level" field="fatigue_level" />
                  </div>
                </div>

                {/* Clinical Observations */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <CardHeader icon={ShieldAlert} title="Clinical Observations" sub="Select all that apply" />
                  <div className="p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {SYMPTOMS.map(({ id, label, critical }) => {
                        const active = fd[id as keyof HealthFormData];
                        return (
                          <button key={id} type="button" disabled={locked}
                            onClick={() => !locked && setFd(p => ({ ...p, [id]: !p[id as keyof HealthFormData] }))}
                            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-base transition-all duration-200 ${active ? "text-white shadow-md" : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-200"} ${locked ? "cursor-not-allowed" : ""}`}
                            style={active ? { backgroundColor: critical ? RED : TEAL } : {}}>
                            <AlertCircle size={16} />{label}
                          </button>
                        );
                      })}
                    </div>
                    {(fd.vaginal_bleeding || fd.blurred_vision) && (
                      <div className="mt-4 p-3 rounded-xl flex items-center gap-2" style={{ backgroundColor: RED_LIGHT, borderLeft: `3px solid ${RED}` }}>
                        <AlertCircle size={16} style={{ color: RED }} />
                        <span className="text-sm font-medium" style={{ color: RED }}>⚠️ Critical symptom detected. Please contact your healthcare provider immediately.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-8">

                  {/* Fetal Activity */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <CardHeader icon={Baby} title="Fetal Activity" />
                    <div className="p-6 space-y-5">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                          Kick Count <span className="text-gray-400">(per hour)</span>
                        </label>
                        <div className="relative">
                          <input type="number" min="0" placeholder="0"
                            className="w-full px-4 py-3 rounded-xl border-2 text-gray-800 font-semibold text-3xl text-center outline-none"
                            style={{ borderColor: "#E5E7EB" }} value={fd.fetal_movements_count}
                            onChange={e => handleNum("fetal_movements_count", e.target.value)} />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2"><Footprints size={18} className="text-gray-300" /></div>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-2">Normal range: 10+ movements per hour</p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Movement Notes</label>
                        <textarea placeholder="Describe fetal movement patterns..." className={textareaClass} rows={4}
                          readOnly={locked} value={fd.fetal_movement_notes}
                          onChange={e => !locked && set("fetal_movement_notes", e.target.value)} />
                      </div>
                    </div>
                  </div>

                  {/* Notes & Submit */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100" style={{ backgroundColor: ACCENT_LIGHT }}>
                      <h4 className="font-semibold" style={{ color: TEAL }}>Additional Notes</h4>
                    </div>
                    <div className="p-6 space-y-5">
                      <textarea placeholder="Any other symptoms or concerns you'd like to note..." className={textareaClass} rows={4}
                        readOnly={locked} value={fd.general_notes}
                        onChange={e => !locked && set("general_notes", e.target.value)} />
                      {error && (
                        <div className="flex items-center gap-2 p-3 rounded-xl" style={{ backgroundColor: ACCENT_LIGHT }}>
                          <AlertCircle size={16} style={{ color: TEAL }} />
                          <span className="text-xs font-medium" style={{ color: TEAL }}>{error}</span>
                        </div>
                      )}
                      <button type="submit" disabled={loading || locked}
                        className="w-full py-4 rounded-xl font-bold uppercase tracking-wide shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: TEAL, color: ACCENT }}>
                        {loading
                          ? <span className="flex items-center justify-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</span>
                          : locked ? "Check-in Already Submitted" : "Log Health Entry"}
                      </button>
                      <p className="text-[10px] text-center text-gray-400">This information helps track your pregnancy health</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HealthMonitoring;