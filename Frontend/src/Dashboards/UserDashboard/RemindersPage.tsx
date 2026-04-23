import React, { useEffect, useState } from "react";
import clinicReminderApi from "../../Features/Apis/clinicReminderAPI";
import { toast } from "sonner";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  Calendar,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  Pencil,
  Bell,
} from "lucide-react";

const MySwal = withReactContent(Swal);

interface ClinicReminder {
  id: number;
  title: string;
  notes?: string;
  appointmentDate: string;
  status: "pending" | "completed";
}

const RemindersPage: React.FC = () => {
  const midnightTeal = "#0B3B3F";
  const aquaText = "#7FD1E0";
  const aquaLight = "#E6F7F9";
  const warmGray = "#F8F9FA";

  const [reminders, setReminders] = useState<ClinicReminder[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [newDate, setNewDate] = useState("");
  const [loading, setLoading] = useState(false);

  const [editingReminder, setEditingReminder] = useState<ClinicReminder | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editDate, setEditDate] = useState("");

  const userId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    if (userId) {
      fetchReminders();
    } else {
      toast.error("User session not found. Please log in.");
    }
  }, [userId]);

  const fetchReminders = async () => {
    try {
      const data = await clinicReminderApi.getByUser(userId);
      setReminders(data);
    } catch {
      toast.error("Failed to load your reminders");
    }
  };

  const createReminder = async () => {
    if (!newTitle.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (!newDate) {
      toast.error("Select appointment date and time");
      return;
    }

    setLoading(true);
    try {
      const created = await clinicReminderApi.create({
        userId,
        title: newTitle.trim(),
        notes: newNotes.trim() || undefined,
        appointmentDate: new Date(newDate).toISOString(),
      });

      setReminders((prev) => [created, ...prev]);
      setNewTitle("");
      setNewNotes("");
      setNewDate("");
      toast.success("Reminder created successfully");
    } catch {
      toast.error("Failed to create reminder");
    } finally {
      setLoading(false);
    }
  };

  const markCompleted = async (id: number) => {
    try {
      const updated = await clinicReminderApi.update(id, { status: "completed", userId });
      setReminders((prev) => prev.map((r) => (r.id === id ? updated : r)));
      toast.success("Marked as completed");
    } catch {
      toast.error("Update failed");
    }
  };

  const deleteReminder = async (id: number) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the reminder.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      background: "#FFFFFF",
      color: "#0B3B3F",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await clinicReminderApi.delete(id);
          setReminders((prev) => prev.filter((r) => r.id !== id));
          toast.success("Reminder deleted", { duration: 3000 });
        } catch {
          toast.error("Delete failed", { duration: 3000 });
        }
      }
    });
  };

  const startEdit = (reminder: ClinicReminder) => {
    setEditingReminder(reminder);
    setEditTitle(reminder.title);
    setEditNotes(reminder.notes || "");
    setEditDate(reminder.appointmentDate.slice(0, 16));
  };

  const updateReminder = async () => {
    if (!editingReminder) return;
    try {
      const updated = await clinicReminderApi.update(editingReminder.id, {
        title: editTitle,
        notes: editNotes,
        appointmentDate: new Date(editDate).toISOString(),
        userId,
      });
      setReminders((prev) =>
        prev.map((r) => (r.id === editingReminder.id ? updated : r))
      );
      setEditingReminder(null);
      toast.success("Reminder updated");
    } catch {
      toast.error("Failed to update reminder");
    }
  };

  const getCardStyle = (reminder: ClinicReminder) => {
    const now = new Date();
    const appointmentDate = new Date(reminder.appointmentDate);

    if (reminder.status === "completed") {
      return {
        bg: "#F9FAFB", border: "#E5E7EB", iconBg: "#F3F4F6",
        iconColor: "#9CA3AF", titleColor: "#9CA3AF", textColor: "#9CA3AF",
      };
    } else if (appointmentDate < now) {
      return {
        bg: "#FEF2F2", border: "#FCA5A5", iconBg: "#FEE2E2",
        iconColor: "#DC2626", titleColor: "#DC2626", textColor: "#DC2626",
      };
    } else {
      return {
        bg: "#FFFFFF", border: "#E5E7EB", iconBg: aquaLight,
        iconColor: midnightTeal, titleColor: midnightTeal, textColor: "#6B7280",
      };
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: warmGray }}>
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-10">

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <Bell size={28} style={{ color: aquaText }} />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: midnightTeal }}>
              Clinic Reminders
            </h1>
          </div>
          <p className="text-gray-400 text-base">Track clinic visits and appointments</p>
        </header>

        {/* Stats Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: aquaLight }}>
                <Calendar size={28} style={{ color: midnightTeal }} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Appointments</p>
                <p className="text-4xl font-bold" style={{ color: midnightTeal }}>
                  {reminders.filter((r) => r.status === "pending").length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-gray-100">
              <span className="text-sm font-medium text-gray-500">Total Reminders</span>
              <span className="text-2xl font-bold" style={{ color: midnightTeal }}>{reminders.length}</span>
            </div>
          </div>
        </div>

        {/* Create Reminder Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="px-6 py-5 border-b border-gray-100" style={{ backgroundColor: aquaLight }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white">
                <Plus size={22} style={{ color: midnightTeal }} />
              </div>
              <h2 className="font-bold text-xl" style={{ color: midnightTeal }}>
                Create New Reminder
              </h2>
            </div>
          </div>

          <div className="p-8 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Reminder Title *
              </label>
              <input
                type="text"
                placeholder="e.g., Prenatal Checkup, Ultrasound Scan, etc."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-5 py-4 rounded-xl border-2 text-gray-800 font-medium text-base outline-none transition-all focus:shadow-md"
                style={{ borderColor: "#E5E7EB" }}
              />
            </div>

            {/* Date & Time — direct input, no toggle */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Appointment Date & Time *
              </label>
              <div
                className="w-full px-5 py-4 rounded-xl border-2 flex items-center gap-3 transition-all focus-within:shadow-md"
                style={{ borderColor: newDate ? aquaText : "#E5E7EB", backgroundColor: newDate ? aquaLight : "white" }}
              >
                <Calendar size={20} style={{ color: midnightTeal, flexShrink: 0 }} />
                <input
                  type="datetime-local"
                  value={newDate}
                  min={getMinDateTime()}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="flex-1 bg-transparent text-gray-800 font-medium text-base outline-none"
                  style={{ colorScheme: "light" }}
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                placeholder="Add any additional information about this appointment..."
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="w-full px-5 py-4 rounded-xl border-2 text-gray-800 font-medium text-base outline-none transition-all focus:shadow-md resize-none"
                style={{ borderColor: "#E5E7EB" }}
                rows={4}
              />
            </div>

            {/* Submit */}
            <button
              onClick={createReminder}
              disabled={loading}
              className="w-full py-5 rounded-xl font-bold text-lg uppercase tracking-wide shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: midnightTeal, color: aquaText }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating Reminder...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  <Plus size={22} /> Create Reminder
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Reminders List */}
        <div className="space-y-4">
          {reminders.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: aquaLight }}>
                <Calendar size={40} style={{ color: midnightTeal }} />
              </div>
              <p className="text-gray-400 text-lg">No reminders yet</p>
              <p className="text-gray-400 text-sm mt-1">Create your first clinic reminder above</p>
            </div>
          )}

          {reminders.map((reminder) => {
            const style = getCardStyle(reminder);
            const appointmentDate = new Date(reminder.appointmentDate);
            const isOverdue = reminder.status === "pending" && appointmentDate < new Date();

            return (
              <div
                key={reminder.id}
                className="rounded-2xl border transition-all duration-200 hover:shadow-md"
                style={{ backgroundColor: style.bg, borderColor: style.border }}
              >
                <div className="p-5">
                  <div className="flex gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: style.iconBg }}
                    >
                      {reminder.status === "completed" ? (
                        <CheckCircle size={22} style={{ color: style.iconColor }} />
                      ) : isOverdue ? (
                        <Clock size={22} style={{ color: style.iconColor }} />
                      ) : (
                        <Calendar size={22} style={{ color: style.iconColor }} />
                      )}
                    </div>

                    <div className="flex-1">
                      <h3
                        className="text-lg font-bold mb-1"
                        style={{
                          color: style.titleColor,
                          textDecoration: reminder.status === "completed" ? "line-through" : "none",
                        }}
                      >
                        {reminder.title}
                      </h3>

                      <div className="flex items-center gap-2 text-sm mb-2">
                        <Clock size={14} style={{ color: style.iconColor }} />
                        <span style={{ color: style.textColor }}>
                          {appointmentDate.toLocaleString()}
                        </span>
                        {isOverdue && (
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-bold"
                            style={{ backgroundColor: "#FEE2E2", color: "#DC2626" }}
                          >
                            Overdue
                          </span>
                        )}
                      </div>

                      {reminder.notes && (
                        <p className="text-gray-500 text-sm mt-2 break-words">{reminder.notes}</p>
                      )}

                      <div className="flex gap-2 mt-3 flex-wrap">
                        {reminder.status === "pending" && (
                          <>
                            <button
                              onClick={() => markCompleted(reminder.id)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:opacity-80"
                              style={{ backgroundColor: aquaLight, color: midnightTeal }}
                            >
                              <CheckCircle size={14} /> Complete
                            </button>
                            <button
                              onClick={() => startEdit(reminder)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:opacity-80"
                              style={{ backgroundColor: "#FEF3C7", color: "#D97706" }}
                            >
                              <Pencil size={14} /> Edit
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => deleteReminder(reminder.id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:opacity-80"
                          style={{ backgroundColor: "#FEE2E2", color: "#DC2626" }}
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Modal */}
      {editingReminder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-5" style={{ backgroundColor: aquaLight }}>
              <h2 className="text-xl font-bold" style={{ color: midnightTeal }}>
                Edit Reminder
              </h2>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reminder Title *
                </label>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Reminder title"
                  className="w-full px-4 py-3 rounded-xl border-2 text-gray-800 font-medium outline-none focus:shadow-md"
                  style={{ borderColor: "#E5E7EB" }}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Appointment Date & Time *
                </label>
                <div
                  className="w-full px-4 py-3 rounded-xl border-2 flex items-center gap-3 focus-within:shadow-md"
                  style={{ borderColor: "#E5E7EB" }}
                >
                  <Calendar size={18} style={{ color: midnightTeal, flexShrink: 0 }} />
                  <input
                    type="datetime-local"
                    value={editDate}
                    min={getMinDateTime()}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="flex-1 bg-transparent text-gray-800 font-medium outline-none"
                    style={{ colorScheme: "light" }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Notes (optional)"
                  className="w-full px-4 py-3 rounded-xl border-2 text-gray-800 font-medium outline-none focus:shadow-md resize-none"
                  style={{ borderColor: "#E5E7EB" }}
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={updateReminder}
                  className="flex-1 py-3 rounded-xl font-bold transition-all hover:shadow-md"
                  style={{ backgroundColor: midnightTeal, color: aquaText }}
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingReminder(null)}
                  className="flex-1 py-3 rounded-xl font-bold transition-all hover:bg-gray-100"
                  style={{ backgroundColor: "#F3F4F6", color: "#6B7280" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RemindersPage;