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
  Pencil
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
      toast.error("Select appointment date");
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
      const updated = await clinicReminderApi.update(id, {
        status: "completed",
        userId
      });

      setReminders((prev) =>
        prev.map((r) => (r.id === id ? updated : r))
      );

      toast.success("Marked as completed");
    } catch {
      toast.error("Update failed");
    }
  };

  // ✅ Updated deleteReminder to use SweetAlert2
const deleteReminder = async (id: number) => {
  MySwal.fire({
    title: "Are you sure?",
    text: "This will permanently delete the reminder.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it",
    cancelButtonText: "Cancel",
    background: "#002e33",
    color: "#ffffff"
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await clinicReminderApi.delete(id);
        setReminders((prev) => prev.filter((r) => r.id !== id));

        // ✅ Use Sonner toast here instead
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
        userId
      });

      setReminders((prev) =>
        prev.map((r) =>
          r.id === editingReminder.id ? updated : r
        )
      );

      setEditingReminder(null);
      toast.success("Reminder updated");
    } catch {
      toast.error("Failed to update reminder");
    }
  };

  return (
    <div className="min-h-screen bg-[#002e33] p-4 md:p-8 font-sans text-white">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-[#86d9e1] mb-2">
              Clinic Reminders
            </h1>
            <p className="text-[#86d9e1]/60">
              Track clinic visits and appointments
            </p>
          </div>

          <div className="bg-[#86d9e1]/10 px-5 py-2 rounded-xl border border-[#86d9e1]/30">
            {reminders.filter(r => r.status === "pending").length} Pending
          </div>
        </header>

        {/* Create Reminder */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl mb-10">
          <h2 className="text-[#86d9e1] font-bold mb-5 flex items-center gap-2">
            <Plus size={18}/> New Reminder
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Reminder title"
                value={newTitle}
                onChange={(e)=>setNewTitle(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#002e33]/50 border border-white/10"
              />

              <input
                type="datetime-local"
                value={newDate}
                onChange={(e)=>setNewDate(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#002e33]/50 border border-white/10"
              />
            </div>

            <textarea
              placeholder="Notes"
              value={newNotes}
              onChange={(e)=>setNewNotes(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#002e33]/50 border border-white/10"
            />
          </div>

          <button
            onClick={createReminder}
            disabled={loading}
            className="w-full mt-6 bg-[#86d9e1] text-[#002e33] py-3 rounded-xl font-bold flex justify-center gap-2"
          >
            {loading ? "Adding..." : <><Plus size={18}/> Add Reminder</>}
          </button>
        </div>

        {/* Reminders List */}
        <div className="space-y-5">
          {reminders.length === 0 && (
            <p className="text-center text-white/40 py-16">
              No reminders yet
            </p>
          )}

          {reminders.map((reminder) => {
            const now = new Date();
            const appointmentDate = new Date(reminder.appointmentDate);

            let cardStyle = "bg-white/5 border-white/10";
            let iconStyle = "bg-[#86d9e1]/20 text-[#86d9e1]";

            if (reminder.status === "completed") {
              cardStyle = "bg-gray-500/10 border-gray-400/20";
              iconStyle = "bg-green-500/20 text-green-400";
            } else if (appointmentDate < now) {
              cardStyle = "bg-red-500/10 border-red-400/30";
              iconStyle = "bg-red-500/20 text-red-400";
            } else {
              cardStyle = "bg-green-500/10 border-green-400/30";
              iconStyle = "bg-green-500/20 text-green-400";
            }

            return (
              <div key={reminder.id} className={`p-4 ${cardStyle} border rounded-2xl`}>
                <div className="flex gap-4">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${iconStyle}`}>
                    {reminder.status === "completed"
                      ? <CheckCircle size={20}/>
                      : <Calendar size={20}/>
                    }
                  </div>

                  <div className="flex-1">
                    <h3 className={`text-lg font-bold ${
                      reminder.status === "completed"
                        ? "line-through text-white/40"
                        : "text-white"
                    }`}>
                      {reminder.title}
                    </h3>

                    <p className="text-[#86d9e1] text-sm flex items-center gap-1 mt-1">
                      <Clock size={14}/>
                      {appointmentDate.toLocaleString()}
                    </p>

                    {reminder.notes && (
                      <p className="text-white/70 mt-2 break-words">
                        {reminder.notes}
                      </p>
                    )}

                    <div className="flex gap-2 mt-3 flex-wrap">
                      {reminder.status === "pending" && (
                        <button
                          onClick={() => markCompleted(reminder.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-[#86d9e1]/20 text-[#86d9e1] rounded-lg text-sm"
                        >
                          <CheckCircle size={14}/> Complete
                        </button>
                      )}

                      {reminder.status === "pending" && (
                        <button
                          onClick={() => startEdit(reminder)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-yellow-400/20 text-yellow-400 rounded-lg text-sm"
                        >
                          <Pencil size={14}/> Edit
                        </button>
                      )}

                      <button
                        onClick={() => deleteReminder(reminder.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm"
                      >
                        <Trash2 size={14}/> Delete
                      </button>
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#002e33] w-full max-w-lg p-8 rounded-3xl border border-white/10">
            <h2 className="text-xl font-bold text-[#86d9e1] mb-6">
              Edit Reminder
            </h2>

            <input
              value={editTitle}
              onChange={(e)=>setEditTitle(e.target.value)}
              className="w-full p-3 rounded-xl mb-4 bg-white/5 border border-white/10"
            />

            <input
              type="datetime-local"
              value={editDate}
              onChange={(e)=>setEditDate(e.target.value)}
              className="w-full p-3 rounded-xl mb-4 bg-white/5 border border-white/10"
            />

            <textarea
              value={editNotes}
              onChange={(e)=>setEditNotes(e.target.value)}
              className="w-full p-3 rounded-xl mb-6 bg-white/5 border border-white/10"
            />

            <div className="flex gap-4">
              <button
                onClick={updateReminder}
                className="flex-1 bg-[#86d9e1] text-[#002e33] py-3 rounded-xl font-bold"
              >
                Save
              </button>

              <button
                onClick={()=>setEditingReminder(null)}
                className="flex-1 bg-white/10 py-3 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RemindersPage;