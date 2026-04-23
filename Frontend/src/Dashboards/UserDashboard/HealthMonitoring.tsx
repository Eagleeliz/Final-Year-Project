import { useState, useEffect } from 'react';
import { Activity, ShieldAlert, Weight, Baby, CheckCircle2, AlertCircle, Heart, TrendingUp, Droplets, Footprints } from 'lucide-react';
import { weeklyCheckinApi } from '../../Features/Apis/WeeklyCheckinAPI';
import { pregnancyApi } from '../../Features/Apis/PregnancyAPI';

interface HealthFormData {
  pregnancy_id: number | null;
  week_number: number | "";
  blood_pressure_systolic: number | "";
  blood_pressure_diastolic: number | "";
  weight: number | "";
  temperature: number | "";
  nausea_level: number | null;
  fatigue_level: number | null;
  back_pain: boolean;
  headache: boolean;
  dizziness: boolean;
  swelling: boolean;
  vaginal_bleeding: boolean;
  blurred_vision: boolean;
  fetal_movements_count: number | "";
  fetal_movement_notes: string;
  other_symptoms: string;
  general_notes: string;
}

const HealthMonitoring = () => {
  const midnightTeal = "#0B3B3F";
  const aquaText = "#7FD1E0";
  const aquaLight = "#E6F7F9";
  const criticalRed = "#DC2626";
  const criticalRedLight = "#FEE2E2";

  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<HealthFormData>({
    pregnancy_id: null,
    week_number: "",
    blood_pressure_systolic: "",
    blood_pressure_diastolic: "",
    weight: "",
    temperature: "",
    nausea_level: null,
    fatigue_level: null,
    back_pain: false,
    headache: false,
    dizziness: false,
    swelling: false,
    vaginal_bleeding: false,
    blurred_vision: false,
    fetal_movements_count: "",
    fetal_movement_notes: "",
    other_symptoms: "",
    general_notes: ""
  });

  useEffect(() => {
    const getActivePregnancy = async () => {
      try {
        const userId = Number(localStorage.getItem("userId"));
        if (!userId) {
          setError("Please log in again.");
          return;
        }

        const response = await pregnancyApi.getActive(userId);
        const pregnancy = response?.data ?? response;

        if (pregnancy?.id) {
          const lmpDate = pregnancy.lmpDate;
          let weekNumber: number | "" = "";

          if (lmpDate) {
            const diffDays = Math.floor(
              (new Date().getTime() - new Date(lmpDate).getTime()) / (1000 * 60 * 60 * 24)
            );
            const calculated = Math.min(Math.max(Math.floor(diffDays / 7) + 1, 1), 40);
            weekNumber = calculated as any;
          }

          setFormData(prev => ({
            ...prev,
            pregnancy_id: pregnancy.id,
            week_number: weekNumber,
          }));
        }
      } catch (err: any) {
        if (err?.response?.status !== 404) {
          console.error("Failed to load pregnancy profile:", err);
          setError("Could not load pregnancy profile.");
        }
      }
    };

    getActivePregnancy();
  }, []);

  const handleNumberChange = (field: keyof HealthFormData, value: string) => {
    if (value === "") {
      setFormData(prev => ({ ...prev, [field]: "" }));
      return;
    }
    const num = Number(value);
    if (num < 0) return;
    setFormData(prev => ({ ...prev, [field]: num }));
  };

  const handleToggle = (field: keyof HealthFormData) => {
    if (typeof formData[field] === "boolean") {
      setFormData(prev => ({
        ...prev,
        [field]: !prev[field]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.pregnancy_id) {
      setError("Pregnancy profile not found.");
      return;
    }

    if (
      formData.blood_pressure_systolic === "" ||
      formData.blood_pressure_diastolic === "" ||
      formData.weight === ""
    ) {
      setError("Please enter required vitals.");
      return;
    }

    if (formData.nausea_level === null || formData.fatigue_level === null) {
      setError("Please select nausea and fatigue levels.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        pregnancyId: formData.pregnancy_id,
        weekNumber: formData.week_number,
        bloodPressureSystolic: formData.blood_pressure_systolic,
        bloodPressureDiastolic: formData.blood_pressure_diastolic,
        weight: formData.weight,
        temperature: formData.temperature === "" ? null : formData.temperature,
        nauseaLevel: formData.nausea_level,
        fatigueLevel: formData.fatigue_level,
        backPain: formData.back_pain,
        headache: formData.headache,
        dizziness: formData.dizziness,
        swelling: formData.swelling,
        vaginalBleeding: formData.vaginal_bleeding,
        blurredVision: formData.blurred_vision,
        fetalMovementsCount: formData.fetal_movements_count === "" ? null : formData.fetal_movements_count,
        fetalMovementNotes: formData.fetal_movement_notes,
        otherSymptoms: formData.other_symptoms === "" ? null : formData.other_symptoms,
        generalNotes: formData.general_notes,
      };

      await weeklyCheckinApi.create(payload);
      setIsSubmitted(true);

      setFormData(prev => ({
        ...prev,
        week_number: "",
        blood_pressure_systolic: "",
        blood_pressure_diastolic: "",
        weight: "",
        temperature: "",
        nausea_level: null,
        fatigue_level: null,
        back_pain: false,
        headache: false,
        dizziness: false,
        swelling: false,
        vaginal_bleeding: false,
        blurred_vision: false,
        fetal_movements_count: "",
        fetal_movement_notes: "",
        other_symptoms: "",
        general_notes: ""
      }));

    } catch (err: any) {
      console.log("Full error:", err.response?.data);
      setError(err.response?.data?.message || "Error saving check-in.");
    } finally {
      setLoading(false);
    }
  };

  const renderScale = (label: string, field: 'nausea_level' | 'fatigue_level') => (
    <div className="flex-1 space-y-4">
      <div className="flex justify-between items-end">
        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{label}</label>
        <span className="text-sm font-bold" style={{ color: midnightTeal }}>
          {formData[field] ? `${formData[field]}/5` : "Not rated"}
        </span>
      </div>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map(num => (
          <button
            key={num}
            type="button"
            onClick={() => setFormData({ ...formData, [field]: num })}
            className={`flex-1 py-3 rounded-xl font-bold transition-all duration-200 ${
              formData[field] !== null && formData[field]! >= num
                ? "text-white shadow-md"
                : "bg-gray-100 text-gray-400 hover:bg-gray-200"
            }`}
            style={
              formData[field] !== null && formData[field]! >= num
                ? { backgroundColor: aquaText, borderColor: aquaText }
                : {}
            }
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );

  if (isSubmitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-md w-full space-y-6 border border-gray-100">
          <div className="flex justify-center">
            <div className="p-4 rounded-full" style={{ backgroundColor: aquaLight }}>
              <CheckCircle2 size={60} strokeWidth={1.5} style={{ color: midnightTeal }} />
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight" style={{ color: midnightTeal }}>
            Check-in Complete!
          </h2>
          <p className="text-gray-500 text-sm">Your health data has been recorded successfully.</p>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="w-full py-4 rounded-xl font-semibold uppercase tracking-wide shadow-lg transition-all hover:shadow-xl"
            style={{ backgroundColor: midnightTeal, color: aquaText }}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F9FA" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: midnightTeal }}>
                Health Monitoring
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <div className="px-3 py-1 rounded-full bg-white shadow-sm" style={{ borderLeft: `3px solid ${aquaText}` }}>
                  <span className="text-sm font-semibold" style={{ color: midnightTeal }}>
                    Week {formData.week_number || "—"}
                  </span>
                </div>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500 font-medium">Daily Health Log</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
              <Heart size={16} style={{ color: aquaText }} />
              <span className="text-xs font-medium text-gray-600">Track your pregnancy journey</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">

              {/* Biometric Vitals */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100" style={{ backgroundColor: aquaLight }}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white">
                      <Activity size={20} style={{ color: midnightTeal }} />
                    </div>
                    <h3 className="font-bold text-lg" style={{ color: midnightTeal }}>Biometric Vitals</h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                        <Droplets size={14} /> Blood Pressure
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <input
                            type="number"
                            min="0"
                            placeholder="Systolic"
                            className="w-full px-4 py-3 rounded-xl border-2 text-gray-800 font-semibold text-lg outline-none transition-all focus:shadow-md"
                            style={{ borderColor: "#E5E7EB" }}
                            value={formData.blood_pressure_systolic}
                            onChange={(e) => handleNumberChange("blood_pressure_systolic", e.target.value)}
                          />
                          <p className="text-[10px] text-gray-400 mt-1 text-center">mmHg</p>
                        </div>
                        <span className="text-2xl text-gray-300">/</span>
                        <div className="flex-1">
                          <input
                            type="number"
                            min="0"
                            placeholder="Diastolic"
                            className="w-full px-4 py-3 rounded-xl border-2 text-gray-800 font-semibold text-lg outline-none transition-all focus:shadow-md"
                            style={{ borderColor: "#E5E7EB" }}
                            value={formData.blood_pressure_diastolic}
                            onChange={(e) => handleNumberChange("blood_pressure_diastolic", e.target.value)}
                          />
                          <p className="text-[10px] text-gray-400 mt-1 text-center">mmHg</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                        <Weight size={14} /> Weight
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          placeholder="Enter weight"
                          className="w-full px-4 py-3 rounded-xl border-2 text-gray-800 font-semibold text-lg outline-none transition-all focus:shadow-md"
                          style={{ borderColor: "#E5E7EB" }}
                          value={formData.weight}
                          onChange={(e) => handleNumberChange("weight", e.target.value)}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">kg</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Symptom Tracking */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100" style={{ backgroundColor: aquaLight }}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white">
                      <TrendingUp size={20} style={{ color: midnightTeal }} />
                    </div>
                    <h3 className="font-bold text-lg" style={{ color: midnightTeal }}>Symptom Tracking</h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-8">
                    {renderScale("Nausea Intensity", "nausea_level")}
                    {renderScale("Fatigue Level", "fatigue_level")}
                  </div>
                </div>
              </div>

              {/* Clinical Observations */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100" style={{ backgroundColor: aquaLight }}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white">
                      <ShieldAlert size={20} style={{ color: midnightTeal }} />
                    </div>
                    <h3 className="font-bold text-lg" style={{ color: midnightTeal }}>Clinical Observations</h3>
                    <span className="text-xs text-gray-500 ml-auto">Select all that apply</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'vaginal_bleeding', label: 'Vaginal Bleeding', critical: true },
                      { id: 'blurred_vision',   label: 'Blurred Vision',   critical: true },
                      { id: 'back_pain',        label: 'Back Pain',        critical: false },
                      { id: 'headache',         label: 'Headache',         critical: false },
                      { id: 'dizziness',        label: 'Dizziness',        critical: false },
                      { id: 'swelling',         label: 'Swelling',         critical: false },
                    ].map(item => {
                      const fieldKey = item.id as keyof HealthFormData;
                      const isActive = formData[fieldKey];
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleToggle(fieldKey)}
                          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                            isActive ? 'text-white shadow-md' : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-200'
                          }`}
                          style={
                            isActive
                              ? item.critical
                                ? { backgroundColor: criticalRed, borderColor: criticalRed }
                                : { backgroundColor: midnightTeal, borderColor: midnightTeal }
                              : {}
                          }
                        >
                          <AlertCircle size={16} />
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                  {(formData.vaginal_bleeding || formData.blurred_vision) && (
                    <div className="mt-4 p-3 rounded-xl flex items-center gap-2" style={{ backgroundColor: criticalRedLight, borderLeft: `3px solid ${criticalRed}` }}>
                      <AlertCircle size={16} style={{ color: criticalRed }} />
                      <span className="text-xs font-medium" style={{ color: criticalRed }}>
                        ⚠️ Critical symptom detected. Please contact your healthcare provider immediately.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-8">

                {/* Fetal Activity */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100" style={{ backgroundColor: aquaLight }}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white">
                        <Baby size={20} style={{ color: midnightTeal }} />
                      </div>
                      <h3 className="font-bold text-lg" style={{ color: midnightTeal }}>Fetal Activity</h3>
                    </div>
                  </div>
                  <div className="p-6 space-y-5">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                        Kick Count <span className="text-gray-400">(per hour)</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          className="w-full px-4 py-3 rounded-xl border-2 text-gray-800 font-semibold text-2xl text-center outline-none"
                          style={{ borderColor: "#E5E7EB" }}
                          value={formData.fetal_movements_count}
                          onChange={(e) => handleNumberChange("fetal_movements_count", e.target.value)}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Footprints size={18} className="text-gray-300" />
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-2">Normal range: 10+ movements per hour</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                        Movement Notes
                      </label>
                      <textarea
                        placeholder="Describe fetal movement patterns..."
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 text-sm outline-none resize-none focus:bg-white transition-all"
                        rows={4}
                        value={formData.fetal_movement_notes}
                        onChange={(e) => setFormData({ ...formData, fetal_movement_notes: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Notes & Submit */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100" style={{ backgroundColor: aquaLight }}>
                    <h4 className="font-semibold" style={{ color: midnightTeal }}>Additional Notes</h4>
                  </div>
                  <div className="p-6 space-y-5">
                    <textarea
                      placeholder="Any other symptoms or concerns you'd like to note..."
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 text-sm outline-none resize-none focus:bg-white transition-all"
                      rows={4}
                      value={formData.general_notes}
                      onChange={(e) => setFormData({ ...formData, general_notes: e.target.value })}
                    />

                    {error && (
                      <div className="flex items-center gap-2 p-3 rounded-xl" style={{ backgroundColor: aquaLight }}>
                        <AlertCircle size={16} style={{ color: midnightTeal }} />
                        <span className="text-xs font-medium" style={{ color: midnightTeal }}>{error}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 rounded-xl font-bold uppercase tracking-wide shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: midnightTeal, color: aquaText }}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Saving...
                        </span>
                      ) : (
                        "Log Health Entry"
                      )}
                    </button>

                    <p className="text-[10px] text-center text-gray-400">
                      This information helps track your pregnancy health
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HealthMonitoring;