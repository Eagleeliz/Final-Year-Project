import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Baby, Plus, ChevronDown, ChevronUp, CheckCircle2,
  Circle, Pencil, Trash2, X, ArrowRight, Sparkles,
  Heart, Brain, MessageSquare, Zap, Calendar, Weight,
  Ruler, Droplets, Star, AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

// ── API ────
const BASE = "/api/children";

const childApi = {
  getByUser: async (userId: number) => {
    const res = await fetch(`${BASE}/user/${userId}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data as Child[];
  },
  create: async (body: CreateChildBody) => {
    const res = await fetch(BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data as Child;
  },
  update: async (id: number, body: Partial<CreateChildBody>) => {
    const res = await fetch(`${BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data as Child;
  },
  delete: async (id: number) => {
    const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
  },
};

const milestoneApi = {
  getByChild: async (childId: number) => {
    const res = await fetch(`${BASE}/${childId}/milestones`);
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data as Milestone[];
  },
  create: async (childId: number, body: CreateMilestoneBody) => {
    const res = await fetch(`${BASE}/${childId}/milestones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data as Milestone;
  },
  update: async (childId: number, milestoneId: number, body: Partial<CreateMilestoneBody>) => {
    const res = await fetch(`${BASE}/${childId}/milestones/${milestoneId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return json.data as Milestone;
  },
  delete: async (childId: number, milestoneId: number) => {
    const res = await fetch(`${BASE}/${childId}/milestones/${milestoneId}`, { method: "DELETE" });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
  },
};

// ── Types ──────────────────────────────────────────────────────
interface Child {
  id: number;
  userId: number;
  pregnancyId?: number;
  name?: string;
  gender?: "male" | "female" | "other";
  dateOfBirth: string;
  birthWeight?: string;
  birthHeight?: string;
  apgarScore?: string;
  bloodGroup?: string;
  createdAt?: string;
}

interface Milestone {
  id: number;
  childId: number;
  milestoneType?: "motor" | "language" | "social" | "cognitive";
  milestoneDescription?: string;
  ageMonths?: string;
  achieved?: boolean;
  notes?: string;
  milestoneDate?: string;
}

interface CreateChildBody {
  userId: number;
  pregnancyId?: number;
  name?: string;
  gender?: "male" | "female" | "other";
  dateOfBirth: string;
  birthWeight?: number;
  birthHeight?: number;
  apgarScore?: string;
  bloodGroup?: string;
}

interface CreateMilestoneBody {
  milestoneType?: "motor" | "language" | "social" | "cognitive";
  milestoneDescription?: string;
  ageMonths?: number;
  achieved?: boolean;
  notes?: string;
  milestoneDate?: string;
}

// ── Constants ──────────────────────────────────────────────────
const T = "#7FD1E0";
const TL = "#E6F7F9";
const M = "#0B3B3F";

type MilestoneTypeKey = "motor" | "language" | "social" | "cognitive";

const MILESTONE_TYPES: Record<
  MilestoneTypeKey,
  { label: string; icon: React.ReactNode; color: string; bg: string }
> = {
  motor:     { label: "Motor",     icon: <Zap size={15} />,           color: "#1A6B5A", bg: "#E6F7F2" },
  language:  { label: "Language",  icon: <MessageSquare size={15} />, color: "#5A3A8A", bg: "#F2EDF9" },
  social:    { label: "Social",    icon: <Heart size={15} />,         color: "#8A3A5A", bg: "#F9EDF2" },
  cognitive: { label: "Cognitive", icon: <Brain size={15} />,         color: "#5A5A1A", bg: "#F9F9E6" },
};

const BLOOD_GROUPS = ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"];

// ── Helpers ────────────────────────────────────────────────────
const ageLabel = (dob: string) => {
  const months =
    (new Date().getFullYear() - new Date(dob).getFullYear()) * 12 +
    (new Date().getMonth() - new Date(dob).getMonth());
  if (months < 1) return "Newborn";
  if (months < 24) return `${months} month${months !== 1 ? "s" : ""}`;
  const years = Math.floor(months / 12);
  return `${years} year${years !== 1 ? "s" : ""}`;
};

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" });

const genderColor = (g?: string) =>
  g === "male" ? { color: "#1A5A8A", bg: "#E6F0F9" }
  : g === "female" ? { color: "#8A1A5A", bg: "#F9E6F2" }
  : { color: M, bg: TL };

// ── RegisterChildModal ─────────────────────────────────────────
const RegisterChildModal = ({
  isOpen, onClose, onSave, userId, submitting,
}: {
  isOpen: boolean; onClose: () => void;
  onSave: (body: CreateChildBody) => Promise<void>;
  userId: number; submitting: boolean;
}) => {
  const [form, setForm] = useState<Omit<CreateChildBody, "userId">>({ dateOfBirth: "" });

  useEffect(() => { if (isOpen) setForm({ dateOfBirth: "" }); }, [isOpen]);

  if (!isOpen) return null;

  const set = (k: keyof typeof form, v: any) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(11,59,63,0.55)", backdropFilter: "blur(4px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl"
        style={{ border: "1.5px solid #E5E7EB" }}>
        <div className="px-7 py-5 flex items-center justify-between" style={{ background: M }}>
          <div>
            <h2 className="text-xl font-black tracking-tight" style={{ color: T }}>Register Child</h2>
            <p className="text-xs mt-0.5 font-medium" style={{ color: "rgba(127,209,224,0.6)" }}>
              Add your baby's birth details
            </p>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:opacity-70"
            style={{ background: "rgba(127,209,224,0.15)", color: T }}>
            <X size={18} />
          </button>
        </div>

        <div className="px-7 py-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1.5">
              Baby's Name <span className="font-normal normal-case tracking-normal opacity-60">(optional)</span>
            </label>
            <input
              type="text" value={form.name ?? ""}
              onChange={e => set("name", e.target.value)}
              placeholder="e.g. Amara"
              className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-100 font-medium text-slate-700 outline-none focus:border-[#7FD1E0] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1.5">
              Date of Birth <span className="text-red-400">*</span>
            </label>
            <input
              type="date" required value={form.dateOfBirth}
              onChange={e => set("dateOfBirth", e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-100 font-medium text-slate-700 outline-none focus:border-[#7FD1E0] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1.5">Gender</label>
            <div className="flex gap-2">
              {(["male", "female", "other"] as const).map(g => {
                const sel = form.gender === g;
                const gc = genderColor(g);
                return (
                  <button key={g} onClick={() => set("gender", sel ? undefined : g)}
                    className="flex-1 py-3 rounded-2xl font-bold text-sm capitalize transition-all"
                    style={{
                      background: sel ? gc.bg : "#F8F9FA",
                      color: sel ? gc.color : "#6B7280",
                      border: `2px solid ${sel ? gc.color + "60" : "#E5E7EB"}`,
                    }}>
                    {g}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1.5">
                Birth Weight (kg)
              </label>
              <input
                type="number" step="0.01" min="0" value={form.birthWeight ?? ""}
                onChange={e => set("birthWeight", e.target.value ? Number(e.target.value) : undefined)}
                placeholder="e.g. 3.2"
                className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-100 font-medium text-slate-700 outline-none focus:border-[#7FD1E0] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1.5">
                Birth Height (cm)
              </label>
              <input
                type="number" step="0.1" min="0" value={form.birthHeight ?? ""}
                onChange={e => set("birthHeight", e.target.value ? Number(e.target.value) : undefined)}
                placeholder="e.g. 50"
                className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-100 font-medium text-slate-700 outline-none focus:border-[#7FD1E0] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1.5">
                APGAR Score
              </label>
              <input
                type="text" value={form.apgarScore ?? ""}
                onChange={e => set("apgarScore", e.target.value)}
                placeholder="e.g. 9/10"
                className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-100 font-medium text-slate-700 outline-none focus:border-[#7FD1E0] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1.5">
                Blood Group
              </label>
              <select
                value={form.bloodGroup ?? ""}
                onChange={e => set("bloodGroup", e.target.value || undefined)}
                className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-100 font-medium text-slate-700 outline-none focus:border-[#7FD1E0] transition-colors bg-white"
              >
                <option value="">Select</option>
                {BLOOD_GROUPS.map(bg => <option key={bg}>{bg}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={onClose}
              className="flex-1 py-3.5 rounded-2xl font-bold text-sm border-2 border-gray-200 text-gray-500 hover:border-gray-300 transition-colors">
              Cancel
            </button>
            <button
              disabled={!form.dateOfBirth || submitting}
              onClick={() => onSave({ userId, ...form })}
              className="flex-1 py-3.5 rounded-2xl font-black text-sm disabled:opacity-40 flex items-center justify-center gap-2 transition-all"
              style={{ background: M, color: T }}>
              {submitting
                ? <><div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: T, borderTopColor: "transparent" }} /> Saving...</>
                : <>Register Baby <ArrowRight size={16} /></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── MilestoneModal ─────────────────────────────────────────────
const MilestoneModal = ({
  isOpen, onClose, onSave, existing, submitting,
}: {
  isOpen: boolean; onClose: () => void;
  onSave: (body: CreateMilestoneBody) => Promise<void>;
  childId: number; existing?: Milestone; submitting: boolean;
}) => {
  const [form, setForm] = useState<CreateMilestoneBody>({});

  useEffect(() => {
    if (isOpen) {
      setForm(existing
        ? {
            milestoneType: existing.milestoneType,
            milestoneDescription: existing.milestoneDescription ?? "",
            ageMonths: existing.ageMonths ? Number(existing.ageMonths) : undefined,
            achieved: existing.achieved,
            notes: existing.notes ?? "",
            milestoneDate: existing.milestoneDate ?? "",
          }
        : {});
    }
  }, [isOpen, existing]);

  if (!isOpen) return null;
  const set = (k: keyof CreateMilestoneBody, v: any) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(11,59,63,0.55)", backdropFilter: "blur(4px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl"
        style={{ border: "1.5px solid #E5E7EB" }}>
        <div className="px-7 py-5 flex items-center justify-between" style={{ background: M }}>
          <div>
            <h2 className="text-xl font-black tracking-tight" style={{ color: T }}>
              {existing ? "Edit Milestone" : "Add Milestone"}
            </h2>
            <p className="text-xs mt-0.5 font-medium" style={{ color: "rgba(127,209,224,0.6)" }}>
              Track your baby's development
            </p>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:opacity-70"
            style={{ background: "rgba(127,209,224,0.15)", color: T }}>
            <X size={18} />
          </button>
        </div>

        <div className="px-7 py-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
              Milestone Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(MILESTONE_TYPES) as [MilestoneTypeKey, typeof MILESTONE_TYPES[MilestoneTypeKey]][]).map(([k, cfg]) => {
                const sel = form.milestoneType === k;
                return (
                  <button
                    key={k as string}
                    onClick={() => set("milestoneType", sel ? undefined : k)}
                    className="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-left text-sm font-bold transition-all"
                    style={{
                      background: sel ? cfg.bg : "#F8F9FA",
                      color: sel ? cfg.color : "#6B7280",
                      border: `2px solid ${sel ? cfg.color + "50" : "#E5E7EB"}`,
                    }}>
                    <span style={{ color: sel ? cfg.color : "#9CA3AF" }}>{cfg.icon}</span>
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1.5">
              Description
            </label>
            <input
              type="text" value={form.milestoneDescription ?? ""}
              onChange={e => set("milestoneDescription", e.target.value)}
              placeholder="e.g. First steps, said 'mama'..."
              className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-100 font-medium text-slate-700 outline-none focus:border-[#7FD1E0] transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1.5">
                Age (months)
              </label>
              <input
                type="number" min="0" value={form.ageMonths ?? ""}
                onChange={e => set("ageMonths", e.target.value ? Number(e.target.value) : undefined)}
                placeholder="auto-calculated"
                className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-100 font-medium text-slate-700 outline-none focus:border-[#7FD1E0] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1.5">
                Milestone Date
              </label>
              <input
                type="date" value={form.milestoneDate ?? ""}
                onChange={e => set("milestoneDate", e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-100 font-medium text-slate-700 outline-none focus:border-[#7FD1E0] transition-colors"
              />
            </div>
          </div>

          <div
            className="flex items-center justify-between px-5 py-4 rounded-2xl cursor-pointer transition-all"
            style={{
              background: form.achieved ? TL : "#F8F9FA",
              border: `2px solid ${form.achieved ? T : "#E5E7EB"}`,
            }}
            onClick={() => set("achieved", !form.achieved)}
          >
            <span className="font-bold text-sm" style={{ color: form.achieved ? M : "#6B7280" }}>
              Mark as achieved
            </span>
            {form.achieved
              ? <CheckCircle2 size={22} style={{ color: T }} />
              : <Circle size={22} className="text-gray-300" />}
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-1.5">
              Notes <span className="font-normal normal-case tracking-normal opacity-60">(optional)</span>
            </label>
            <textarea
              rows={3} value={form.notes ?? ""}
              onChange={e => set("notes", e.target.value)}
              placeholder="Any observations or details..."
              className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-100 text-slate-700 text-sm leading-relaxed resize-none outline-none focus:border-[#7FD1E0] transition-colors"
              style={{ fontFamily: "inherit" }}
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={onClose}
              className="flex-1 py-3.5 rounded-2xl font-bold text-sm border-2 border-gray-200 text-gray-500 hover:border-gray-300 transition-colors">
              Cancel
            </button>
            <button
              disabled={submitting}
              onClick={() => onSave(form)}
              className="flex-1 py-3.5 rounded-2xl font-black text-sm disabled:opacity-40 flex items-center justify-center gap-2 transition-all"
              style={{ background: M, color: T }}>
              {submitting
                ? <><div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: T, borderTopColor: "transparent" }} /> Saving...</>
                : <>{existing ? "Save Changes" : "Add Milestone"} <ArrowRight size={16} /></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── MilestoneItem ──────────────────────────────────────────────
const MilestoneItem = ({
  milestone, childId, onUpdated, onDeleted,
}: {
  milestone: Milestone; childId: number;
  onUpdated: (m: Milestone) => void;
  onDeleted: (id: number) => void;
}) => {
  const [editOpen, setEditOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const cfg = milestone.milestoneType ? MILESTONE_TYPES[milestone.milestoneType] : null;

  const handleToggle = async () => {
    try {
      const updated = await milestoneApi.update(childId, milestone.id, { achieved: !milestone.achieved });
      onUpdated(updated);
    } catch { toast.error("Failed to update milestone."); }
  };

  const handleSave = async (body: CreateMilestoneBody) => {
    setSubmitting(true);
    try {
      const updated = await milestoneApi.update(childId, milestone.id, body);
      onUpdated(updated);
      setEditOpen(false);
      toast.success("Milestone updated!");
    } catch { toast.error("Failed to update milestone."); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    try {
      await milestoneApi.delete(childId, milestone.id);
      onDeleted(milestone.id);
      toast.success("Milestone removed.");
    } catch { toast.error("Failed to delete milestone."); }
  };

  return (
    <>
      <div className="flex items-start gap-3 px-4 py-3.5 rounded-2xl transition-all hover:bg-gray-50 group"
        style={{ border: "1px solid #F3F4F6" }}>
        <button onClick={handleToggle} className="mt-0.5 shrink-0 transition-transform hover:scale-110">
          {milestone.achieved
            ? <CheckCircle2 size={20} style={{ color: T }} />
            : <Circle size={20} className="text-gray-300" />}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            {cfg && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
                style={{ background: cfg.bg, color: cfg.color }}>
                {cfg.icon} {cfg.label}
              </span>
            )}
            {milestone.ageMonths && (
              <span className="text-xs text-gray-400 font-medium">{milestone.ageMonths}m</span>
            )}
          </div>
          <p className={`text-sm font-medium ${milestone.achieved ? "line-through text-gray-400" : "text-gray-700"}`}>
            {milestone.milestoneDescription || "—"}
          </p>
          {milestone.notes && (
            <p className="text-xs text-gray-400 mt-0.5 truncate">{milestone.notes}</p>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button onClick={() => setEditOpen(true)}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:opacity-70 transition-all"
            style={{ background: TL, color: M }}>
            <Pencil size={13} />
          </button>
          <button onClick={handleDelete}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:opacity-70 transition-all"
            style={{ background: "#FDF2F2", color: "#7C3F3F" }}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      <MilestoneModal
        isOpen={editOpen} onClose={() => setEditOpen(false)}
        onSave={handleSave} childId={childId} existing={milestone} submitting={submitting}
      />
    </>
  );
};

// ── ChildCard ──────────────────────────────────────────────────
const ChildCard = ({
  child, onDeleted,
}: {
  child: Child; onUpdated: (c: Child) => void; onDeleted: (id: number) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loadingMs, setLoadingMs] = useState(false);
  const [milestoneOpen, setMilestoneOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const gc = genderColor(child.gender);
  const age = ageLabel(child.dateOfBirth);
  const achieved = milestones.filter(m => m.achieved).length;

  useEffect(() => {
    if (!expanded || milestones.length) return;
    setLoadingMs(true);
    milestoneApi.getByChild(child.id)
      .then(setMilestones)
      .catch(() => toast.error("Failed to load milestones."))
      .finally(() => setLoadingMs(false));
  }, [expanded]);

  const handleAddMilestone = async (body: CreateMilestoneBody) => {
    setSubmitting(true);
    try {
      const ms = await milestoneApi.create(child.id, body);
      setMilestones(prev => [...prev, ms]);
      setMilestoneOpen(false);
      toast.success("Milestone added! 🌟");
    } catch { toast.error("Failed to add milestone."); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    try {
      await childApi.delete(child.id);
      onDeleted(child.id);
      toast.success("Child record removed.");
    } catch { toast.error("Failed to delete."); }
  };

  const grouped = milestones.reduce<Record<string, Milestone[]>>((acc, m) => {
    const k = m.milestoneType ?? "other";
    (acc[k] = acc[k] ?? []).push(m);
    return acc;
  }, {});

  return (
    <>
      <div className="rounded-2xl overflow-hidden bg-white shadow-sm border border-[#E5E7EB] transition-all hover:shadow-md">
        <div className="px-6 py-5 flex items-center gap-4"
          style={{ background: `linear-gradient(135deg, ${M} 0%, #144448 100%)` }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 font-black text-xl"
            style={{ background: TL, color: M }}>
            {child.name ? child.name[0].toUpperCase() : <Baby size={26} style={{ color: M }} />}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-black tracking-tight truncate" style={{ color: T }}>
              {child.name || "Baby"}
            </h3>
            <div className="flex items-center gap-2 flex-wrap mt-1">
              <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: TL, color: M }}>
                {age}
              </span>
              {child.gender && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold capitalize"
                  style={{ background: gc.bg, color: gc.color }}>
                  {child.gender}
                </span>
              )}
              {child.bloodGroup && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: "#FDF2F2", color: "#7C3F3F" }}>
                  <Droplets size={10} /> {child.bloodGroup}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => setConfirmDelete(true)}
              className="w-8 h-8 rounded-xl flex items-center justify-center hover:opacity-70 transition-all"
              style={{ background: "rgba(240,170,170,0.2)", color: "#F0AAAA" }}>
              <Trash2 size={14} />
            </button>
            <button onClick={() => setExpanded(e => !e)}
              className="w-8 h-8 rounded-xl flex items-center justify-center hover:opacity-70 transition-all"
              style={{ background: "rgba(127,209,224,0.15)", color: T }}>
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>

        <div className="px-6 py-3 flex items-center gap-6 flex-wrap bg-white border-b border-[#F3F4F6]">
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Calendar size={14} style={{ color: T }} />
            <span>{fmtDate(child.dateOfBirth)}</span>
          </div>
          {child.birthWeight && (
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <Weight size={14} style={{ color: T }} />
              <span>{child.birthWeight} kg</span>
            </div>
          )}
          {child.birthHeight && (
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <Ruler size={14} style={{ color: T }} />
              <span>{child.birthHeight} cm</span>
            </div>
          )}
          {child.apgarScore && (
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <Star size={14} style={{ color: T }} />
              <span>APGAR {child.apgarScore}</span>
            </div>
          )}
        </div>

        {expanded && (
          <div className="px-6 py-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-black uppercase tracking-wider" style={{ color: M }}>
                  Milestones
                </h4>
                {milestones.length > 0 && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    {achieved} of {milestones.length} achieved
                  </p>
                )}
              </div>
              <button
                onClick={() => setMilestoneOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm transition-all hover:opacity-80"
                style={{ background: TL, color: M, border: `1px solid ${T}` }}>
                <Plus size={14} /> Add
              </button>
            </div>

            {milestones.length > 0 && (
              <div className="mb-5">
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${(achieved / milestones.length) * 100}%`, backgroundColor: T }} />
                </div>
              </div>
            )}

            {loadingMs && (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 rounded-full animate-spin mx-auto"
                  style={{ borderColor: T, borderTopColor: "transparent" }} />
              </div>
            )}

            {!loadingMs && milestones.length === 0 && (
              <div className="text-center py-8 rounded-2xl" style={{ background: TL }}>
                <Star size={28} className="mx-auto mb-2" style={{ color: T }} />
                <p className="text-sm font-bold" style={{ color: M }}>No milestones yet</p>
                <p className="text-xs text-gray-400 mt-1">Tap "Add" to record your baby's first milestone!</p>
              </div>
            )}

            {!loadingMs && Object.entries(grouped).map(([type, ms]) => {
              const cfg = MILESTONE_TYPES[type as MilestoneTypeKey];
              return (
                <div key={type} className="mb-4">
                  {cfg && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-2 py-1 rounded-lg"
                        style={{ background: cfg.bg, color: cfg.color }}>
                        {cfg.icon} {cfg.label}
                      </span>
                    </div>
                  )}
                  <div className="space-y-1.5">
                    {ms.map(m => (
                      <MilestoneItem key={m.id} milestone={m} childId={child.id}
                        onUpdated={updated => setMilestones(prev => prev.map(x => x.id === updated.id ? updated : x))}
                        onDeleted={id => setMilestones(prev => prev.filter(x => x.id !== id))}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(11,59,63,0.55)", backdropFilter: "blur(4px)" }}>
          <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl"
            style={{ border: "1.5px solid #E5E7EB" }}>
            <div className="px-7 py-6 text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "#FDF2F2" }}>
                <AlertCircle size={28} style={{ color: "#7C3F3F" }} />
              </div>
              <h3 className="text-lg font-black mb-2" style={{ color: M }}>Remove Child Record?</h3>
              <p className="text-sm text-gray-500 mb-6">
                This will permanently delete{" "}
                <strong>{child.name || "this child"}</strong>'s record and all milestones.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(false)}
                  className="flex-1 py-3.5 rounded-2xl font-bold text-sm border-2 border-gray-200 text-gray-500">
                  Keep
                </button>
                <button onClick={() => { handleDelete(); setConfirmDelete(false); }}
                  className="flex-1 py-3.5 rounded-2xl font-black text-sm text-white"
                  style={{ background: "#7C3F3F" }}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <MilestoneModal
        isOpen={milestoneOpen} onClose={() => setMilestoneOpen(false)}
        onSave={handleAddMilestone} childId={child.id} submitting={submitting}
      />
    </>
  );
};

// ── Main ───────────────────────────────────────────────────────
const ChildDevelopment: React.FC = () => {
  const { user } = useSelector((state: any) => state.auth);

  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }
    childApi.getByUser(user.id)
      .then(setChildren)
      .catch(() => toast.error("Could not load children."))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const handleRegister = async (body: CreateChildBody) => {
    setSubmitting(true);
    try {
      const child = await childApi.create(body);
      setChildren(prev => [...prev, child]);
      setRegisterOpen(false);
      toast.success(`Welcome, ${body.name || "little one"}! 🎉`);
    } catch { toast.error("Failed to register child. Please try again."); }
    finally { setSubmitting(false); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
      <div className="text-center">
        <div className="w-12 h-12 border-2 rounded-full animate-spin mx-auto mb-4"
          style={{ borderColor: T, borderTopColor: "transparent" }} />
        <p className="text-gray-400">Loading child records...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen font-sans bg-[#F8F9FA]">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-10">

        <header className="mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Sparkles size={22} style={{ color: T }} />
              <span className="text-sm font-bold uppercase tracking-wider text-gray-400">
                Child Development
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: M }}>
              Hello, {user?.firstName || "Mama"} 
            </h1>
            <p className="text-gray-400 text-base mt-1">
              Track your child's growth and milestone journey.
            </p>
          </div>
          <button
            onClick={() => setRegisterOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all hover:shadow-md shrink-0 mt-1"
            style={{ background: M, color: T }}>
            <Plus size={16} /> Register Child
          </button>
        </header>

        {children.length > 0 && (
          <div className="rounded-2xl p-5 mb-8 bg-white shadow-sm border border-[#E5E7EB]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { val: children.length, label: "Children" },
                { val: children.filter(c => {
                    const m = (new Date().getFullYear() - new Date(c.dateOfBirth).getFullYear()) * 12
                      + (new Date().getMonth() - new Date(c.dateOfBirth).getMonth());
                    return m < 12;
                  }).length, label: "Under 1 yr" },
                { val: children.filter(c => c.gender === "male").length, label: "Boys" },
                { val: children.filter(c => c.gender === "female").length, label: "Girls" },
              ].map((s, i, arr) => (
                <div key={i}
                  className={`text-center ${i < arr.length - 1 ? "md:border-r md:border-gray-200" : ""}`}>
                  <p className="text-4xl font-bold" style={{ color: M }}>{s.val}</p>
                  <p className="text-sm text-gray-400 uppercase tracking-wider mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {children.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 rounded-3xl bg-white border-2 border-dashed"
            style={{ borderColor: T + "60" }}>
                <h2
  className="text-2xl font-black mb-2 tracking-tight mt-2"
  style={{ color: M }}
>
  No Children Yet
</h2>
            <p className="text-gray-400 text-sm text-center max-w-xs mb-6">
              Register your baby's details to start tracking milestones and development.
            </p>
            <button
              onClick={() => setRegisterOpen(true)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm transition-all hover:shadow-lg"
              style={{ background: M, color: T }}>
              <Plus size={16} /> Register First Child
            </button>
          </div>
        )}

        {children.length > 0 && (
          <div className="space-y-4">
            {children.map(child => (
              <ChildCard
                key={child.id}
                child={child}
                onUpdated={updated => setChildren(prev => prev.map(c => c.id === updated.id ? updated : c))}
                onDeleted={id => setChildren(prev => prev.filter(c => c.id !== id))}
              />
            ))}
          </div>
        )}
      </div>

      <RegisterChildModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSave={handleRegister}
        userId={user?.id}
        submitting={submitting}
      />
    </div>
  );
};

export default ChildDevelopment;