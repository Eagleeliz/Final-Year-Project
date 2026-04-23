import { useEffect, useState } from "react";
import { pregnancyApi } from "../../Features/Apis/PregnancyAPI";
import {
  Baby, Search,
  AlertCircle, Trash2, Eye,
} from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const midnightTeal = "#0B3B3F";
const aquaLight    = "#E6F7F9";

interface Pregnancy {
  id: number;
  userId: number;
  lmpDate: string;
  eddDate: string;
  currentTrimester?: 1 | 2 | 3;
  pregnancyNumber?: number;
  isActive: boolean;
  outcome: "ongoing" | "delivered" | "miscarriage" | "terminated";
  deliveryDate?: string;
  deliveryType?: string;
  birthWeight?: string;
  notes?: string;
  createdAt?: string;
}

const calculateCurrentWeek = (lmpDate: string): number => {
  const diffDays = Math.floor(
    (new Date().getTime() - new Date(lmpDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  return Math.min(Math.max(Math.floor(diffDays / 7) + 1, 1), 40);
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-KE", {
    day: "numeric", month: "short", year: "numeric",
  });
};

const getOutcomeStyle = (outcome: string) => {
  switch (outcome) {
    case "ongoing":     return { bg: "#e8f5f6", color: "#005a63", label: "Ongoing" };
    case "delivered":   return { bg: "#edf7ee", color: "#2e6b38", label: "Delivered" };
    case "miscarriage": return { bg: "#fdecea", color: "#922",    label: "Miscarriage" };
    case "terminated":  return { bg: "#fff4e8", color: "#8a4a00", label: "Terminated" };
    default:            return { bg: "#f1f1f1", color: "#555",    label: outcome };
  }
};

const getTrimesterLabel = (week: number) => {
  if (week <= 12) return { label: "T1", color: "#86d9e1" };
  if (week <= 26) return { label: "T2", color: "#a8d5a2" };
  return            { label: "T3", color: "#f4b8a0" };
};

const AllPregnancies = () => {
  const [pregnancies, setPregnancies]           = useState<Pregnancy[]>([]);
  const [filtered, setFiltered]                 = useState<Pregnancy[]>([]);
  const [loading, setLoading]                   = useState(true);
  const [search, setSearch]                     = useState("");
  const [filterOutcome, setFilterOutcome]       = useState<string>("all");
  const [viewingPregnancy, setViewingPregnancy] = useState<Pregnancy | null>(null);

  useEffect(() => { fetchPregnancies(); }, []);

  const fetchPregnancies = async () => {
    try {
      setLoading(true);
      const response = await pregnancyApi.getAll();
      const data = Array.isArray(response) ? response : response?.data ?? [];
      setPregnancies(data);
      setFiltered(data);
    } catch {
      toast.error("Failed to load pregnancies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...pregnancies];
    if (filterOutcome !== "all") result = result.filter((p) => p.outcome === filterOutcome);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => String(p.userId).includes(q) || String(p.id).includes(q)
      );
    }
    setFiltered(result);
  }, [search, filterOutcome, pregnancies]);

  const handleDelete = (pregnancy: Pregnancy) => {
    MySwal.fire({
      title: "Delete this pregnancy record?",
      text: `Pregnancy #${pregnancy.id} for User #${pregnancy.userId} will be permanently removed.`,
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
          await pregnancyApi.delete(pregnancy.id);
          setPregnancies((prev) => prev.filter((p) => p.id !== pregnancy.id));
          setViewingPregnancy(null);
          toast.success("Pregnancy record deleted");
        } catch {
          toast.error("Failed to delete pregnancy.");
        }
      }
    });
  };

  const totalOngoing     = pregnancies.filter((p) => p.outcome === "ongoing").length;
  const totalDelivered   = pregnancies.filter((p) => p.outcome === "delivered").length;
  const totalMiscarriage = pregnancies.filter((p) => p.outcome === "miscarriage").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div
            className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3"
            style={{ borderColor: aquaLight, borderTopColor: midnightTeal }}
          />
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">
            Loading pregnancies...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── Header */}
      <header className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">
            Pregnancy Management
          </p>
          <h1 className="text-3xl font-black" style={{ color: midnightTeal }}>
            All Pregnancies
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Monitor all registered pregnancies across MamaCare
          </p>
        </div>
      </header>

      {/* ── Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total",       value: pregnancies.length, color: midnightTeal },
          { label: "Ongoing",     value: totalOngoing,       color: "#005a63" },
          { label: "Delivered",   value: totalDelivered,     color: "#2e6b38" },
          { label: "Miscarriage", value: totalMiscarriage,   color: "#e53e3e" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-5 rounded-2xl shadow-sm border-l-4"
            style={{ borderLeftColor: stat.color }}
          >
            <p className="text-2xl font-black" style={{ color: stat.color }}>
              {stat.value}
            </p>
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Search + Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] bg-gray-50 px-4 py-2.5 rounded-xl">
          <Search size={16} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by user ID or pregnancy ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none w-full text-gray-700 placeholder:text-gray-400"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {["all", "ongoing", "delivered", "miscarriage", "terminated"].map((outcome) => (
            <button
              key={outcome}
              onClick={() => setFilterOutcome(outcome)}
              className="px-3 py-2 rounded-xl text-xs font-bold transition-all capitalize"
              style={{
                background: filterOutcome === outcome ? midnightTeal : "#f1f5f9",
                color: filterOutcome === outcome ? "white" : "#64748b",
              }}
            >
              {outcome === "all" ? "All" : outcome}
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-400 font-bold ml-auto">
          {filtered.length} of {pregnancies.length} records
        </p>
      </div>

      {/* ── Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <AlertCircle size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm font-bold">No pregnancies found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["Pregnancy", "User", "Week", "Trimester", "EDD", "Outcome", "Registered", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-black uppercase tracking-widest text-gray-400"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((pregnancy) => {
                  const currentWeek = pregnancy.outcome === "ongoing"
                    ? calculateCurrentWeek(pregnancy.lmpDate)
                    : null;
                  const trimester = currentWeek ? getTrimesterLabel(currentWeek) : null;
                  const outcome   = getOutcomeStyle(pregnancy.outcome);

                  return (
                    <tr key={pregnancy.id} className="hover:bg-gray-50 transition-colors">

                      {/* Pregnancy ID */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: midnightTeal }}
                          >
                            <Baby size={16} style={{ color: "white" }} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800">
                              Pregnancy #{pregnancy.id}
                            </p>
                            {pregnancy.pregnancyNumber && (
                              <p className="text-xs text-gray-400">
                                #{pregnancy.pregnancyNumber} for this mother
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* User ID */}
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-gray-700">
                          User #{pregnancy.userId}
                        </p>
                      </td>

                      {/* Current week */}
                      <td className="px-6 py-4">
                        {currentWeek ? (
                          <span className="text-sm font-black" style={{ color: midnightTeal }}>
                            Week {currentWeek}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>

                      {/* Trimester badge */}
                      <td className="px-6 py-4">
                        {trimester ? (
                          <span
                            className="px-2 py-1 rounded-lg text-xs font-black"
                            style={{ background: trimester.color + "20", color: trimester.color }}
                          >
                            {trimester.label}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>

                      {/* EDD */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">{formatDate(pregnancy.eddDate)}</p>
                        <p className="text-xs text-gray-400">LMP: {formatDate(pregnancy.lmpDate)}</p>
                      </td>

                      {/* Outcome badge */}
                      <td className="px-6 py-4">
                        <span
                          className="px-2 py-1 rounded-lg text-xs font-bold capitalize"
                          style={{ background: outcome.bg, color: outcome.color }}
                        >
                          {outcome.label}
                        </span>
                      </td>

                      {/* Registered */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-500">{formatDate(pregnancy.createdAt)}</p>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setViewingPregnancy(pregnancy)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:opacity-80"
                            style={{ background: midnightTeal, color: "white" }}
                          >
                            <Eye size={13} /> View
                          </button>
                          <button
                            onClick={() => handleDelete(pregnancy)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:opacity-80"
                            style={{ background: midnightTeal, color: "white" }}
                          >
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

      {/* ── View Details Modal */}
      {viewingPregnancy && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl">

            <div className="mb-6">
              <h2 className="text-xl font-black" style={{ color: midnightTeal }}>
                Pregnancy #{viewingPregnancy.id} Details
              </h2>
            </div>

            <div className="space-y-3">
              {[
                { label: "User ID",          value: `#${viewingPregnancy.userId}` },
                { label: "Pregnancy Number", value: viewingPregnancy.pregnancyNumber ?? "—" },
                { label: "LMP Date",         value: formatDate(viewingPregnancy.lmpDate) },
                { label: "EDD Date",         value: formatDate(viewingPregnancy.eddDate) },
                { label: "Current Week",     value: viewingPregnancy.outcome === "ongoing" ? `Week ${calculateCurrentWeek(viewingPregnancy.lmpDate)}` : "—" },
                { label: "Trimester",        value: viewingPregnancy.currentTrimester ? `Trimester ${viewingPregnancy.currentTrimester}` : "—" },
                { label: "Outcome",          value: viewingPregnancy.outcome },
                { label: "Active",           value: viewingPregnancy.isActive ? "Yes" : "No" },
                { label: "Delivery Date",    value: formatDate(viewingPregnancy.deliveryDate) },
                { label: "Delivery Type",    value: viewingPregnancy.deliveryType ?? "—" },
                { label: "Birth Weight",     value: viewingPregnancy.birthWeight ? `${viewingPregnancy.birthWeight} kg` : "—" },
                { label: "Registered",       value: formatDate(viewingPregnancy.createdAt) },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between py-2.5 border-b border-gray-50"
                >
                  <span className="text-xs font-black uppercase tracking-widest text-gray-400">
                    {row.label}
                  </span>
                  <span className="text-sm font-bold text-gray-800 capitalize">
                    {String(row.value)}
                  </span>
                </div>
              ))}

              {viewingPregnancy.notes && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                    Notes
                  </p>
                  <p className="text-sm text-gray-600">{viewingPregnancy.notes}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleDelete(viewingPregnancy)}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm transition-all hover:opacity-80"
                style={{ background: midnightTeal, color: "white" }}
              >
                <Trash2 size={14} /> Delete Record
              </button>
              <button
                onClick={() => setViewingPregnancy(null)}
                className="flex-1 py-3 rounded-xl font-black text-sm transition-all hover:opacity-80"
                style={{ background: midnightTeal, color: "white" }}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AllPregnancies;