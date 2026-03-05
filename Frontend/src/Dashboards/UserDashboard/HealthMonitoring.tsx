import { useState, useEffect } from 'react';
import { Activity, ShieldAlert, Weight, Baby, PlusCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { weeklyCheckinApi } from '../../Features/Apis/WeeklyCheckinAPI';

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
  const midnightTeal = "#002e33";
  const aquaText = "#86d9e1";

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

  // Fetch pregnancy profile
  useEffect(() => {
    const getActivePregnancy = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (data?.pregnancy?.id) {
          setFormData(prev => ({
            ...prev,
            pregnancy_id: data.pregnancy.id
          }));
        }
      } catch (err) {
        console.error("Failed to load pregnancy profile:", err);
        setError("Could not load pregnancy profile.");
      }
    };

    getActivePregnancy();
  }, []);

  const handleNumberChange = (field: keyof HealthFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value === "" ? "" : Number(value)
    }));
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

    if (!formData.nausea_level || !formData.fatigue_level) {
      setError("Please select nausea and fatigue levels.");
      return;
    }

    setLoading(true);
    try {
      await weeklyCheckinApi.create(formData);

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
      setError(err.response?.data?.message || "Error saving check-in.");
    } finally {
      setLoading(false);
    }
  };

  const renderScale = (label: string, field: 'nausea_level' | 'fatigue_level') => (
    <div className="flex-1 space-y-4">
      <div className="flex justify-between items-end">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</label>
        <span className="text-sm font-black" style={{ color: midnightTeal }}>
          {formData[field] ? `LVL ${formData[field]}` : "Not Selected"}
        </span>
      </div>
      <div className="flex gap-2">
        {[1,2,3,4,5].map(num => (
          <button
            key={num}
            type="button"
            onClick={() => setFormData({ ...formData, [field]: num })}
            className={`flex-1 py-4 rounded-xl font-black transition-all border-2 ${
              formData[field] !== null && formData[field]! >= num ? "text-white shadow-md" : "border-gray-50 bg-gray-50 text-gray-400"
            }`}
            style={formData[field] !== null && formData[field]! >= num ? { backgroundColor: aquaText, borderColor: aquaText } : {}}
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
        <div className="bg-white p-12 rounded-[4rem] shadow-2xl text-center max-w-lg w-full space-y-8 border border-gray-100">
          <div className="flex justify-center">
            <div className="p-6 rounded-full bg-emerald-50 text-emerald-500">
              <CheckCircle2 size={80} strokeWidth={1.5} />
            </div>
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter" style={{ color: midnightTeal }}>Data Synced</h2>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="w-full py-6 rounded-[2.5rem] font-black uppercase tracking-widest shadow-xl"
            style={{ backgroundColor: midnightTeal, color: aquaText }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700">
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter" style={{ color: midnightTeal }}>
          Health Monitoring
        </h1>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-1">
          Week {formData.week_number || "N/A"} • Patient Status Log
        </p>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
        {/* LEFT SIDE */}
        <div className="lg:col-span-8 space-y-8">
          {/* Biometric Vitals */}
          <section className="bg-white p-8 md:p-10 rounded-[3rem] shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-2xl bg-[#002e33]/5 text-[#002e33]">
                <Activity size={24} />
              </div>
              <h3 className="font-black text-xl uppercase tracking-tight" style={{ color: midnightTeal }}>Biometric Vitals</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Blood Pressure Reading</label>
                <div className="flex items-center gap-4">
                  <div className="flex-1 space-y-2">
                    <p className="text-[10px] text-center font-bold text-gray-300">SYS</p>
                    <input 
                      type="number"
                      placeholder="Enter SYS"
                      className="w-full p-5 rounded-2xl border-2 text-black font-black text-2xl text-center outline-none placeholder:text-xs placeholder:text-gray-400"
                      style={{ borderColor: aquaText }}
                      value={formData.blood_pressure_systolic}
                      onChange={(e) => handleNumberChange("blood_pressure_systolic", e.target.value)}
                    />
                  </div>
                  <span className="text-gray-200 font-thin text-4xl mt-6">/</span>
                  <div className="flex-1 space-y-2">
                    <p className="text-[10px] text-center font-bold text-gray-300">DIA</p>
                    <input 
                      type="number"
                      placeholder="Enter DIA"
                      className="w-full p-5 rounded-2xl border-2 text-black font-black text-2xl text-center outline-none placeholder:text-xs placeholder:text-gray-400"
                      style={{ borderColor: aquaText }}
                      value={formData.blood_pressure_diastolic}
                      onChange={(e) => handleNumberChange("blood_pressure_diastolic", e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4 pt-6">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Weight (KG)</label>
                <div className="relative">
                  <input 
                    type="number"
                    step="0.1"
                    placeholder="Enter Weight"
                    className="w-full p-5 rounded-2xl border-2 text-black font-black text-2xl outline-none placeholder:text-xs placeholder:text-gray-400"
                    style={{ borderColor: aquaText }}
                    value={formData.weight}
                    onChange={(e) => handleNumberChange("weight", e.target.value)}
                  />
                  <div className="absolute top-4 right-4 p-2 rounded-lg bg-gray-50">
                    <Weight size={18} className="text-gray-300" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Scales */}
          <section className="bg-white p-8 md:p-10 rounded-[3rem] shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row gap-10">
              {renderScale("Nausea Intensity", "nausea_level")}
              {renderScale("Fatigue Level", "fatigue_level")}
            </div>
          </section>

          {/* Clinical Observations */}
          <section className="bg-white p-8 md:p-10 rounded-[3rem] shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-8">
              <ShieldAlert className="text-red-500" size={24} />
              <h3 className="font-black text-xl uppercase tracking-tight" style={{ color: midnightTeal }}>Clinical Observations</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[ 
                { id: 'vaginal_bleeding', label: 'Vaginal Bleeding', urgent: true },
                { id: 'blurred_vision', label: 'Blurred Vision', urgent: true },
                { id: 'back_pain', label: 'Back Pain', urgent: false },
                { id: 'headache', label: 'Headache', urgent: false },
                { id: 'dizziness', label: 'Dizziness', urgent: false },
                { id: 'swelling', label: 'Swelling', urgent: false },
              ].map(item => {
                const fieldKey = item.id as keyof HealthFormData;
                const isActive = formData[fieldKey];
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleToggle(fieldKey)}
                    className={`flex flex-col items-center justify-center p-6 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all border-2 gap-3 ${
                      isActive 
                        ? (item.urgent ? 'bg-red-600 border-red-600 text-white shadow-lg' : 'text-white shadow-lg') 
                        : 'bg-gray-50 border-transparent text-gray-400 hover:border-gray-200'
                    }`}
                    style={isActive ? (item.urgent ? { backgroundColor:'#dc2626', borderColor:'#dc2626' } : { backgroundColor: midnightTeal, borderColor: midnightTeal }) : {}}
                  >
                    <PlusCircle size={18} className={isActive ? 'rotate-45 transition-transform' : 'transition-transform'} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-4 space-y-8">
          <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 space-y-8">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#86d9e1]/10 text-[#002e33]">
                <Baby size={24} />
              </div>
              <h3 className="font-black text-lg uppercase tracking-tight" style={{ color: midnightTeal }}>Fetal Activity</h3>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Kick Count (Per Hour)</label>
              <input 
                type="number"
                placeholder="Enter Kick Count"
                className="w-full p-5 rounded-2xl border-2 text-black font-black text-2xl outline-none placeholder:text-xs placeholder:text-gray-400"
                style={{ borderColor: aquaText }}
                value={formData.fetal_movements_count}
                onChange={(e) => handleNumberChange("fetal_movements_count", e.target.value)}
              />
              <textarea 
                placeholder="Fetal movement notes..."
                className="w-full p-5 rounded-2xl bg-gray-50 border-none text-black font-medium text-sm h-32 outline-none placeholder:text-xs placeholder:text-gray-400"
                value={formData.fetal_movement_notes}
                onChange={(e) => setFormData({...formData, fetal_movement_notes: e.target.value})}
              />
            </div>
          </section>

          <div className="space-y-4">
            <textarea 
              placeholder="General notes or other symptoms..."
              className="w-full p-6 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm text-black font-medium text-sm h-40 outline-none placeholder:text-xs placeholder:text-gray-400"
              value={formData.general_notes}
              onChange={(e) => setFormData({...formData, general_notes: e.target.value})}
            />

            {error && (
              <div className="flex items-center gap-2 p-4 rounded-2xl bg-red-50 text-red-600 border border-red-100 animate-in slide-in-from-top-2">
                <AlertCircle size={16} />
                <span className="text-[10px] font-black uppercase tracking-wider">{error}</span>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-7 rounded-[2.5rem] font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              style={{ backgroundColor: midnightTeal, color: aquaText }}
            >
              {loading ? "Syncing..." : "Log Entry"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default HealthMonitoring;