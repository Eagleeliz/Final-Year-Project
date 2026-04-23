import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Save,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import guidanceApi, {
  type PregnancyGuidance,
} from "../../Features/Apis/GuidanceAPI";

const primaryTeal = "#2aa99b";

const ManageGuidance = () => {
  const [guidanceList, setGuidanceList] = useState<PregnancyGuidance[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [weekFilter, setWeekFilter] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuidance, setEditingGuidance] =
    useState<PregnancyGuidance | null>(null);

  const [formData, setFormData] = useState({
    weekNumber: 1,
    title: "",
    summary: "",
    tips: "",
    source: "",
    link: "",
  });

  const fetchGuidance = async () => {
    try {
      setLoading(true);
      const data = await guidanceApi.getAll();
      setGuidanceList(data);
    } catch {
      toast.error("Failed to fetch guidance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuidance();
  }, []);

  const handleOpenCreate = () => {
    setEditingGuidance(null);
    setFormData({
      weekNumber: 1,
      title: "",
      summary: "",
      tips: "",
      source: "",
      link: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (g: PregnancyGuidance) => {
    setEditingGuidance(g);
    setFormData({
      weekNumber: g.weekNumber,
      title: g.title,
      summary: g.summary,
      tips: g.tips,
      source: g.source,
      link: g.link || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this guidance?")) return;

    try {
      await guidanceApi.delete(id);
      toast.success("Deleted successfully");
      fetchGuidance();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.title || !formData.summary) {
        toast.error("Fill required fields");
        return;
      }

      if (editingGuidance) {
        await guidanceApi.update(editingGuidance.id, formData);
        toast.success("Updated successfully");
      } else {
        await guidanceApi.create(formData);
        toast.success("Created successfully");
      }

      setIsModalOpen(false);
      fetchGuidance();
    } catch {
      toast.error("Operation failed");
    }
  };

  const filtered = guidanceList.filter((g) => {
    const matchesSearch = g.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesWeek = weekFilter
      ? g.weekNumber === Number(weekFilter)
      : true;

    return matchesSearch && matchesWeek;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-600 hover:text-[#2aa99b] transition-colors">
          Manage Guidance
        </h1>
        
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 text-white px-4 py-2 rounded-lg hover:opacity-90 transition active:scale-95"
          style={{ backgroundColor: primaryTeal }}
        >
          <Plus size={18} /> Add Guidance
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 w-full bg-white shadow-sm">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search by title..."
            className="w-full outline-none text-gray-700 placeholder-gray-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <input
          type="number"
          placeholder="Week"
          className="border border-gray-300 rounded-lg px-3 py-2 w-full md:w-32 text-gray-700 bg-white shadow-sm"
          value={weekFilter}
          onChange={(e) => setWeekFilter(e.target.value)}
        />
      </div>

      {/* Cards */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((g) => (
            <div
              key={g.id}
              className="bg-white shadow-md hover:shadow-lg transition rounded-xl p-5 space-y-2"
            >
              <h2 className="font-bold text-lg text-gray-600 hover:text-[#2aa99b] transition-colors cursor-pointer hover:underline">
                Week {g.weekNumber}: {g.title}
              </h2>

              <p className="text-sm text-gray-700">{g.summary}</p>

              <div className="text-xs text-gray-500">
                Source: {g.source}
              </div>

              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => handleEdit(g)}
                  className="text-white p-2 rounded hover:scale-105 active:scale-95 transition"
                  style={{ backgroundColor: primaryTeal }}
                >
                  <Edit size={16} />
                </button>

                <button
                  onClick={() => handleDelete(g.id)}
                  className="text-white p-2 rounded hover:scale-105 active:scale-95 transition"
                  style={{ backgroundColor: primaryTeal }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-600">
                {editingGuidance ? "Edit" : "Create"} Guidance
              </h2>

              {/* ✅ Styled X button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg text-white hover:opacity-90 transition"
                style={{ backgroundColor: primaryTeal }}
              >
                <X size={18} />
              </button>
            </div>

            <input
              type="number"
              className="w-full border p-2 rounded text-gray-700"
              value={formData.weekNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  weekNumber: Number(e.target.value),
                })
              }
            />

            <input
              type="text"
              placeholder="Title"
              className="w-full border p-2 rounded text-gray-700"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />

            <textarea
              placeholder="Summary"
              className="w-full border p-2 rounded text-gray-700"
              value={formData.summary}
              onChange={(e) =>
                setFormData({ ...formData, summary: e.target.value })
              }
            />

            <textarea
              placeholder="Tips"
              className="w-full border p-2 rounded text-gray-700"
              value={formData.tips}
              onChange={(e) =>
                setFormData({ ...formData, tips: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Source"
              className="w-full border p-2 rounded text-gray-700"
              value={formData.source}
              onChange={(e) =>
                setFormData({ ...formData, source: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Link"
              className="w-full border p-2 rounded text-gray-700"
              value={formData.link}
              onChange={(e) =>
                setFormData({ ...formData, link: e.target.value })
              }
            />

            <button
              onClick={handleSubmit}
              className="w-full text-white py-2 rounded flex justify-center items-center gap-2 hover:opacity-90 transition active:scale-95"
              style={{ backgroundColor: primaryTeal }}
            >
              <Save size={18} />
              {editingGuidance ? "Update" : "Create"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageGuidance;