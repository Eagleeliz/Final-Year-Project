import { useEffect, useState } from "react";
import { emergencyAlertApi, type EmergencyAlert } from "../../Features/Apis/emergencyContactApi";
import { ShieldAlert, Search, Activity, X, Save, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import toast from "react-hot-toast";

const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" }) : "—";

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  pending:   { bg: "#fdecea", color: "#922",    label: "Pending"   },
  notified:  { bg: "#fff4e8", color: "#8a4a00", label: "Notified"  },
  responded: { bg: "#e8f5f6", color: "#005a63", label: "Responded" },
  resolved:  { bg: "#edf7ee", color: "#2e6b38", label: "Resolved"  },
};
const SEVERITY_STYLES: Record<string, { bg: string; color: string; dot: string }> = {
  critical: { bg: "#fdecea", color: "#922",    dot: "#e53e3e" },
  high:     { bg: "#fff4e8", color: "#8a4a00", dot: "#dd6b20" },
  medium:   { bg: "#fefce8", color: "#854d0e", dot: "#d69e2e" },
};
const getStatus   = (s: string) => STATUS_STYLES[s]   ?? { bg: "#f1f1f1", color: "#555", label: s };
const getSeverity = (s: string) => SEVERITY_STYLES[s] ?? { bg: "#f1f1f1", color: "#555", dot: "#718096" };
const fmtType = (t?: string) => t?.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) ?? "Emergency";
const mapUrl  = (lat?: number | string, lng?: number | string) => lat && lng ? `https://maps.google.com/?q=${lat},${lng}` : "#";

const StatCard = ({ icon: Icon, label, value, bg, color }: any) => (
  <div className="bg-white p-7 rounded-2xl shadow-sm border-l-4 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer relative overflow-hidden" style={{ borderLeftColor: color }}>
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

const EmergencyAlerts = () => {
  const [alerts, setAlerts]                   = useState<EmergencyAlert[]>([]);
  const [filtered, setFiltered]               = useState<EmergencyAlert[]>([]);
  const [loading, setLoading]                 = useState(true);
  const [search, setSearch]                   = useState("");
  const [filterStatus, setFilterStatus]       = useState("all");
  const [filterSeverity, setFilterSeverity]   = useState("all");
  const [respondingAlert, setRespondingAlert] = useState<EmergencyAlert | null>(null);
  const [newStatus, setNewStatus]             = useState<EmergencyAlert["status"]>("notified");
  const [respondLoading, setRespondLoading]   = useState(false);

  useEffect(() => { fetchAlerts(); }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const list = await emergencyAlertApi.getAllAlerts();
      const data = Array.isArray(list) ? list : [];
      setAlerts(data);
      setFiltered(data);
    } catch { toast.error("Failed to load emergency alerts."); }
    finally  { setLoading(false); }
  };

  useEffect(() => {
    let r = [...alerts];
    if (filterStatus   !== "all") r = r.filter(a => a.status   === filterStatus);
    if (filterSeverity !== "all") r = r.filter(a => a.severity === filterSeverity);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(a => String(a.userId).includes(q) || a.alertType?.toLowerCase().includes(q) || a.description?.toLowerCase().includes(q));
    }
    setFiltered(r);
  }, [search, filterStatus, filterSeverity, alerts]);

  const handleUpdateStatus = async () => {
    if (!respondingAlert) return;
    setRespondLoading(true);
    try {
      await emergencyAlertApi.updateStatus(respondingAlert.id, newStatus);
      setAlerts(prev => prev.map(a => a.id === respondingAlert.id ? { ...a, status: newStatus } : a));
      setRespondingAlert(null);
      toast.success(`Status updated to "${newStatus}"`);
    } catch { toast.error("Failed to update alert status."); }
    finally  { setRespondLoading(false); }
  };

  const totalPending  = alerts.filter(a => a.status   === "pending").length;
  const totalCritical = alerts.filter(a => a.severity === "critical").length;
  const totalResolved = alerts.filter(a => a.status   === "resolved").length;

  const STAT_CARDS = [
    { label: "Total Alerts", value: alerts.length,  icon: ShieldAlert,   bg: "#e6f7f9", color: "#002e33" },
    { label: "Pending",      value: totalPending,   icon: Clock,         bg: "#fdecea", color: "#e53e3e" },
    { label: "Critical",     value: totalCritical,  icon: AlertTriangle, bg: "#fff4e8", color: "#dd6b20" },
    { label: "Resolved",     value: totalResolved,  icon: CheckCircle,   bg: "#edf7ee", color: "#2e6b38" },
  ];

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-[#002e33] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Loading alerts...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <header className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Emergency Management</p>
          <h1 className="text-3xl font-black" style={{ color: "#002e33" }}>Emergency Alerts</h1>
          <p className="text-gray-400 text-sm mt-1">Monitor and respond to all emergency alerts</p>
        </div>
        {totalPending > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: "#fdecea", color: "#922" }}>
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-black">{totalPending} Pending</span>
          </div>
        )}
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Search + Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] bg-gray-50 px-4 py-2.5 rounded-xl">
          <Search size={16} className="text-gray-400 shrink-0" />
          <input type="text" placeholder="Search by user ID, alert type or description..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-sm outline-none w-full text-gray-700 placeholder:text-gray-400" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all","pending","notified","responded","resolved"].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} className="px-3 py-2 rounded-xl text-xs font-bold transition-all capitalize" style={{ background: filterStatus===s?"#002e33":"#f1f5f9", color: filterStatus===s?"#86d9e1":"#64748b" }}>
              {s==="all"?"All Status":s}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all","critical","high","medium"].map(s => (
            <button key={s} onClick={() => setFilterSeverity(s)} className="px-3 py-2 rounded-xl text-xs font-bold transition-all capitalize" style={{ background: filterSeverity===s?"#002e33":"#f1f5f9", color: filterSeverity===s?"#86d9e1":"#64748b" }}>
              {s==="all"?"All Severity":s}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 font-bold ml-auto">{filtered.length} of {alerts.length} alerts</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <ShieldAlert size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm font-bold">No alerts found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["Alert","User","Severity","Description","Location","Status","Date","Action"].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-black uppercase tracking-widest text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(alert => {
                  const st  = getStatus(alert.status ?? "pending");
                  const sev = getSeverity(alert.severity ?? "medium");
                  return (
                    <tr key={alert.id} className="hover:bg-gray-50 transition-colors" style={alert.status === "pending" ? { background: "#fff8f8" } : {}}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: sev.bg }}>
                            <ShieldAlert size={16} style={{ color: sev.color }} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800">{fmtType(alert.alertType)}</p>
                            <p className="text-xs text-gray-400">ID #{alert.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><p className="text-sm font-bold text-gray-700">User #{alert.userId}</p></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full shrink-0" style={{ background: sev.dot }} />
                          <span className="px-2 py-1 rounded-lg text-xs font-bold capitalize" style={{ background: sev.bg, color: sev.color }}>{alert.severity}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4"><p className="text-sm text-gray-600 truncate max-w-[160px]">{alert.description ?? "—"}</p></td>
                      <td className="px-6 py-4">
                        {alert.locationLat && alert.locationLong
                          ? <a href={mapUrl(alert.locationLat, alert.locationLong)} target="_blank" rel="noopener noreferrer" className="text-xs font-bold underline underline-offset-2" style={{ color: "#005a63" }}>View Map</a>
                          : <span className="text-sm text-gray-400">—</span>}
                      </td>
                      <td className="px-6 py-4"><span className="px-2 py-1 rounded-lg text-xs font-bold" style={{ background: st.bg, color: st.color }}>{st.label}</span></td>
                      <td className="px-6 py-4"><p className="text-sm text-gray-500">{formatDate(alert.createdAt)}</p></td>
                      <td className="px-6 py-4">
                        <button onClick={() => { setRespondingAlert(alert); setNewStatus(alert.status); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:opacity-80" style={alert.status === "pending" ? { background: "#002e33", color: "#86d9e1" } : { background: "#f1f5f9", color: "#64748b" }}>
                          <Activity size={12} /> Respond
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Respond Modal */}
      {respondingAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black" style={{ color: "#002e33" }}>Respond to Alert</h2>
              <button onClick={() => setRespondingAlert(null)} className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
                <X size={16} className="text-gray-400" />
              </button>
            </div>

            <div className="p-4 rounded-2xl mb-6" style={{ background: getSeverity(respondingAlert.severity ?? "medium").bg }}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: getSeverity(respondingAlert.severity ?? "medium").dot }} />
                <p className="text-sm font-black capitalize" style={{ color: getSeverity(respondingAlert.severity ?? "medium").color }}>
                  {fmtType(respondingAlert.alertType)} — {respondingAlert.severity}
                </p>
              </div>
              <p className="text-xs text-gray-500">User #{respondingAlert.userId}</p>
              {respondingAlert.description && <p className="text-sm text-gray-600 mt-2">{respondingAlert.description}</p>}
            </div>

            <div className="mb-4">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Current Status</p>
              <span className="px-3 py-1.5 rounded-lg text-xs font-bold capitalize" style={{ background: getStatus(respondingAlert.status).bg, color: getStatus(respondingAlert.status).color }}>
                {respondingAlert.status}
              </span>
            </div>

            <div className="mb-6">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Update Status To</p>
              <div className="grid grid-cols-2 gap-2">
                {(["pending","notified","responded","resolved"] as const).map(s => {
                  const st = getStatus(s);
                  return (
                    <button key={s} onClick={() => setNewStatus(s)} className="px-3 py-2.5 rounded-xl text-xs font-bold transition-all border-2 capitalize" style={{ background: newStatus===s?st.bg:"#f8fafc", color: newStatus===s?st.color:"#94a3b8", borderColor: newStatus===s?st.color+"40":"transparent" }}>
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={handleUpdateStatus} disabled={respondLoading || newStatus === respondingAlert.status} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm disabled:opacity-50 transition-all" style={{ background: "#002e33", color: "#86d9e1" }}>
                <Save size={14} />{respondLoading ? "Updating..." : "Update Status"}
              </button>
              <button onClick={() => setRespondingAlert(null)} className="flex-1 py-3 rounded-xl font-black text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default EmergencyAlerts;