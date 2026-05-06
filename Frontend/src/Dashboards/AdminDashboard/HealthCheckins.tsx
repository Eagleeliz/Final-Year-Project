import { useEffect, useState } from "react";
import { weeklyCheckinApi } from "../../Features/Apis/WeeklyCheckinAPI";

import { Activity, Search, AlertTriangle, Eye, Trash2, ShieldCheck, Thermometer } from "lucide-react";

import toast from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);
const midnightTeal = "#0B3B3F";

interface Checkin {
  id: number;
  pregnancyId: number;
  weekNumber: number;
  checkinDate?: string;
  nauseaLevel?: number;
  fatigueLevel?: number;
  backPain?: boolean;
  headache?: boolean;
  dizziness?: boolean;
  swelling?: boolean;
  vaginalBleeding?: boolean;
  blurredVision?: boolean;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  weight?: string;
  temperature?: string;
  fetalMovementsCount?: number;
  fetalMovementNotes?: string;
  otherSymptoms?: string;
  generalNotes?: string;
  riskFlag?: boolean;
  riskReason?: string;
  createdAt?: string;
}

const formatDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" }) : "—";

const getLevelColor = (level?: number) => {
  if (!level)      return { bg: "#f1f1f1", color: "#555" };
  if (level >= 4)  return { bg: "#fdecea", color: "#922" };
  if (level >= 3)  return { bg: "#fff4e8", color: "#8a4a00" };
  return             { bg: "#edf7ee", color: "#2e6b38" };
};

const BoolBadge = ({ value, label }: { value?: boolean; label: string }) =>
  value ? <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-red-50 text-red-500">{label}</span> : null;

// ── Stat Card ─────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, bg, color }: any) => (
  <div
    className="bg-white p-7 rounded-2xl shadow-sm border-l-4 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer relative overflow-hidden"
    style={{ borderLeftColor: color }}
  >
    <div className="absolute inset-0 opacity-5" style={{ background: `linear-gradient(135deg, ${color} 0%, transparent 50%)` }} />
    <div className="relative z-10">
      <div className="p-3 rounded-xl w-fit mb-4" style={{ background: bg }}>
        <Icon size={24} style={{ color }} />
      </div>
      <p className="text-4xl font-black" style={{ color }}>{value.toLocaleString()}</p>
      <p className="text-sm font-black uppercase tracking-wider text-gray-500 mt-2">{label}</p>
    </div>
  </div>
);

// ── Component ─────────────────────────────────────────────────
const HealthCheckins = () => {
  const [checkins, setCheckins]             = useState<Checkin[]>([]);
  const [filtered, setFiltered]             = useState<Checkin[]>([]);
  const [loading, setLoading]               = useState(true);
  const [search, setSearch]                 = useState("");
  const [filterRisk, setFilterRisk]         = useState("all");
  const [viewingCheckin, setViewingCheckin] = useState<Checkin | null>(null);

  useEffect(() => { fetchCheckins(); }, []);

  const fetchCheckins = async () => {
    try {
      setLoading(true);
      const response = await weeklyCheckinApi.getAll();
      const data = Array.isArray(response) ? response : response?.data ?? [];
      setCheckins(data);
      setFiltered(data);
    } catch { toast.error("Failed to load health check-ins."); }
    finally  { setLoading(false); }
  };

  useEffect(() => {
    let result = [...checkins];
    if (filterRisk === "risk")   result = result.filter(c => c.riskFlag === true);
    if (filterRisk === "normal") result = result.filter(c => !c.riskFlag);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        String(c.pregnancyId).includes(q) ||
        String(c.weekNumber).includes(q)  ||
        c.riskReason?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [search, filterRisk, checkins]);

  const handleDelete = (checkin: Checkin) => {
    MySwal.fire({
      title: "Delete this check-in?",
      text: `Week ${checkin.weekNumber} check-in for Pregnancy #${checkin.pregnancyId} will be removed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: midnightTeal,
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      background: "#FFFFFF",
      color: midnightTeal,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await weeklyCheckinApi.delete(checkin.id);
          setCheckins(prev => prev.filter(c => c.id !== checkin.id));
          toast.success("Check-in deleted");
        } catch { toast.error("Failed to delete check-in."); }
      }
    });
  };

  const totalRisk   = checkins.filter(c => c.riskFlag).length;
  const totalNormal = checkins.filter(c => !c.riskFlag).length;
  const highNausea  = checkins.filter(c => (c.nauseaLevel ?? 0) >= 4).length;

  const STAT_CARDS = [
    { label: "Total Check-ins", value: checkins.length, icon: Activity,     bg: "#e6f7f9", color: midnightTeal },
    { label: "Risk Flagged",    value: totalRisk,        icon: AlertTriangle, bg: "#fdecea", color: "#e53e3e"   },
    { label: "Normal",          value: totalNormal,      icon: ShieldCheck,  bg: "#edf7ee", color: "#2e6b38"   },
    { label: "High Nausea",     value: highNausea,       icon: Thermometer,  bg: "#fff4e8", color: "#dd6b20"   },
  ];

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3" style={{ borderColor: "#E6F7F9", borderTopColor: midnightTeal }} />
        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Loading check-ins...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <header className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Health Monitoring</p>
          <h1 className="text-3xl font-black" style={{ color: midnightTeal }}>Health Check-ins</h1>
          <p className="text-gray-400 text-sm mt-1">All weekly health check-ins across BabyCentre</p>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Search + Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] bg-gray-50 px-4 py-2.5 rounded-xl">
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by pregnancy ID, week or risk reason..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none w-full text-gray-700 placeholder:text-gray-400"
          />
        </div>
        <div className="flex gap-2">
          {[{ value: "all", label: "All" }, { value: "risk", label: "Risk Flagged" }, { value: "normal", label: "Normal" }].map(f => (
            <button key={f.value} onClick={() => setFilterRisk(f.value)} className="px-3 py-2 rounded-xl text-xs font-bold transition-all" style={{ background: filterRisk===f.value?midnightTeal:"#f1f5f9", color: filterRisk===f.value?"white":"#64748b" }}>
              {f.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 font-bold ml-auto">{filtered.length} of {checkins.length} records</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Activity size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm font-bold">No check-ins found</p>
          </div>
        ) : (
          <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200">
                  {["Pregnancy","Week","Vitals","Nausea","Fatigue","Symptoms","Risk","Date","Actions"].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-black uppercase tracking-widest text-black">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(checkin => {
                  const nauseaStyle  = getLevelColor(checkin.nauseaLevel);
                  const fatigueStyle = getLevelColor(checkin.fatigueLevel);
                  return (
                    <tr key={checkin.id} className="hover:bg-gray-50 transition-colors" style={checkin.riskFlag ? { background: "#fff8f8" } : {}}>
                      {/* Pregnancy */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: checkin.riskFlag ? "#fdecea" : "#e8f5f6" }}>
                            {checkin.riskFlag
                              ? <AlertTriangle size={16} className="text-red-500" />
                              : <Activity size={16} style={{ color: "#005a63" }} />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800">Pregnancy #{checkin.pregnancyId}</p>
                            <p className="text-xs text-gray-400">ID #{checkin.id}</p>
                          </div>
                        </div>
                      </td>
                      {/* Week */}
                      <td className="px-6 py-4">
                        <span className="text-sm font-black px-2 py-1 rounded-lg" style={{ background: "#e8f5f6", color: "#005a63" }}>
                          Week {checkin.weekNumber}
                        </span>
                      </td>
                      {/* Vitals */}
                      <td className="px-6 py-4">
                        {checkin.bloodPressureSystolic && checkin.bloodPressureDiastolic ? (
                          <p className="text-sm font-bold text-gray-700">
                            {checkin.bloodPressureSystolic}/{checkin.bloodPressureDiastolic}
                            <span className="text-xs text-gray-400 ml-1">mmHg</span>
                          </p>
                        ) : <span className="text-sm text-gray-400">—</span>}
                        {checkin.weight && <p className="text-xs text-gray-400">{checkin.weight} kg</p>}
                      </td>
                      {/* Nausea */}
                      <td className="px-6 py-4">
                        {checkin.nauseaLevel
                          ? <span className="px-2 py-1 rounded-lg text-xs font-black" style={{ background: nauseaStyle.bg, color: nauseaStyle.color }}>{checkin.nauseaLevel}/5</span>
                          : <span className="text-sm text-gray-400">—</span>}
                      </td>
                      {/* Fatigue */}
                      <td className="px-6 py-4">
                        {checkin.fatigueLevel
                          ? <span className="px-2 py-1 rounded-lg text-xs font-black" style={{ background: fatigueStyle.bg, color: fatigueStyle.color }}>{checkin.fatigueLevel}/5</span>
                          : <span className="text-sm text-gray-400">—</span>}
                      </td>
                      {/* Symptoms */}
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-[160px]">
                          <BoolBadge value={checkin.vaginalBleeding} label="Bleeding"  />
                          <BoolBadge value={checkin.blurredVision}   label="Vision"    />
                          <BoolBadge value={checkin.headache}        label="Headache"  />
                          <BoolBadge value={checkin.dizziness}       label="Dizziness" />
                          <BoolBadge value={checkin.swelling}        label="Swelling"  />
                          <BoolBadge value={checkin.backPain}        label="Back Pain" />
                          {!checkin.vaginalBleeding && !checkin.blurredVision && !checkin.headache &&
                           !checkin.dizziness && !checkin.swelling && !checkin.backPain && (
                            <span className="text-xs text-gray-400">None</span>
                          )}
                        </div>
                      </td>
                      {/* Risk */}
                      <td className="px-6 py-4">
                        {checkin.riskFlag ? (
                          <div>
                            <span className="px-2 py-1 rounded-lg text-xs font-bold bg-red-50 text-red-500">Risk</span>
                            {checkin.riskReason && <p className="text-xs text-gray-400 mt-1 max-w-[120px] truncate">{checkin.riskReason}</p>}
                          </div>
                        ) : (
                          <span className="px-2 py-1 rounded-lg text-xs font-bold bg-green-50 text-green-600">Normal</span>
                        )}
                      </td>
                      {/* Date */}
                      <td className="px-6 py-4"><p className="text-sm text-gray-500">{formatDate(checkin.createdAt)}</p></td>
                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setViewingCheckin(checkin)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:opacity-80" style={{ background: midnightTeal, color: "white" }}>
                            <Eye size={13} /> View
                          </button>
                          <button onClick={() => handleDelete(checkin)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:opacity-80" style={{ background: midnightTeal, color: "white" }}>
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {viewingCheckin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-xl font-black" style={{ color: midnightTeal }}>Check-in Details</h2>
            </div>

            {viewingCheckin.riskFlag && (
              <div className="flex items-center gap-3 p-4 rounded-2xl mb-6 bg-red-50 border border-red-100">
                <AlertTriangle size={18} className="text-red-500 shrink-0" />
                <div>
                  <p className="text-sm font-black text-red-600">Risk Flagged</p>
                  {viewingCheckin.riskReason && <p className="text-xs text-red-400 mt-0.5">{viewingCheckin.riskReason}</p>}
                </div>
              </div>
            )}

            <div className="space-y-2">
              {[
                { label: "Pregnancy ID",     value: `#${viewingCheckin.pregnancyId}` },
                { label: "Week Number",      value: `Week ${viewingCheckin.weekNumber}` },
                { label: "Check-in Date",    value: formatDate(viewingCheckin.checkinDate) },
                { label: "Blood Pressure",   value: viewingCheckin.bloodPressureSystolic ? `${viewingCheckin.bloodPressureSystolic}/${viewingCheckin.bloodPressureDiastolic} mmHg` : "—" },
                { label: "Weight",           value: viewingCheckin.weight ? `${viewingCheckin.weight} kg` : "—" },
                { label: "Temperature",      value: viewingCheckin.temperature ? `${viewingCheckin.temperature} °C` : "—" },
                { label: "Nausea Level",     value: viewingCheckin.nauseaLevel ? `${viewingCheckin.nauseaLevel}/5` : "—" },
                { label: "Fatigue Level",    value: viewingCheckin.fatigueLevel ? `${viewingCheckin.fatigueLevel}/5` : "—" },
                { label: "Fetal Movements",  value: viewingCheckin.fetalMovementsCount ?? "—" },
                { label: "Back Pain",        value: viewingCheckin.backPain ? "Yes" : "No" },
                { label: "Headache",         value: viewingCheckin.headache ? "Yes" : "No" },
                { label: "Dizziness",        value: viewingCheckin.dizziness ? "Yes" : "No" },
                { label: "Swelling",         value: viewingCheckin.swelling ? "Yes" : "No" },
                { label: "Vaginal Bleeding", value: viewingCheckin.vaginalBleeding ? "Yes" : "No" },
                { label: "Blurred Vision",   value: viewingCheckin.blurredVision ? "Yes" : "No" },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between py-2.5 border-b border-gray-50">
                  <span className="text-xs font-black uppercase tracking-widest text-gray-400">{row.label}</span>
                  <span className="text-sm font-bold text-gray-800">{String(row.value)}</span>
                </div>
              ))}
            </div>

            {viewingCheckin.fetalMovementNotes && (
              <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Fetal Movement Notes</p>
                <p className="text-sm text-gray-600">{viewingCheckin.fetalMovementNotes}</p>
              </div>
            )}
            {viewingCheckin.generalNotes && (
              <div className="mt-3 p-4 bg-gray-50 rounded-xl">
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">General Notes</p>
                <p className="text-sm text-gray-600">{viewingCheckin.generalNotes}</p>
              </div>
            )}

            <button onClick={() => setViewingCheckin(null)} className="w-full mt-6 py-3 rounded-xl font-black text-sm transition-all hover:opacity-80" style={{ background: midnightTeal, color: "white" }}>
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default HealthCheckins;