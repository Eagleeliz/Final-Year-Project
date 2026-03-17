import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  emergencyContactApi,
  emergencyAlertApi,
  type EmergencyContact,
  type EmergencyAlert,
} from "../../Features/Apis/emergencyContactApi";
import {
  ShieldAlert, Phone, MapPin, Plus,
  Pencil, Trash2, CheckCircle, Clock,
  AlertTriangle, User, X, Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

// ── Alert Types ───────────────────────────────────────────────

const ALERT_TYPES = [
  { id: "bleeding",          label: "Bleeding",           emoji: "🩸", severity: "critical" },
  { id: "water_break",       label: "Water Break",        emoji: "💧", severity: "critical" },
  { id: "contractions",      label: "Contractions",       emoji: "🔄", severity: "critical" },
  { id: "severe_pain",       label: "Severe Pain",        emoji: "😣", severity: "high"     },
  { id: "high_fever",        label: "High Fever",         emoji: "🌡️", severity: "high"     },
  { id: "severe_headache",   label: "Severe Headache",    emoji: "🤕", severity: "high"     },
  { id: "blurred_vision",    label: "Blurred Vision",     emoji: "👁️", severity: "high"     },
  { id: "reduced_movements", label: "Reduced Movements",  emoji: "👶", severity: "medium"   },
  { id: "other",             label: "Other",              emoji: "❓", severity: "medium"   },
];

// Auto-set severity to highest selected
const getHighestSeverity = (selected: string[]): "critical" | "high" | "medium" => {
  const severities = selected.map(
    (id) => ALERT_TYPES.find((t) => t.id === id)?.severity ?? "medium"
  );
  if (severities.includes("critical")) return "critical";
  if (severities.includes("high"))     return "high";
  return "medium";
};

// Get most severe alert type from selected
const getMostSevereType = (selected: string[]): string => {
  const order = ["bleeding", "water_break", "contractions",
    "severe_pain", "high_fever", "severe_headache",
    "blurred_vision", "reduced_movements", "other"];
  return order.find((id) => selected.includes(id)) ?? "other";
};

const severityColors: Record<string, { bg: string; color: string; label: string }> = {
  critical: { bg: "rgba(231,76,60,0.2)",    color: "#e74c3c", label: "CRITICAL" },
  high:     { bg: "rgba(244,184,160,0.2)",  color: "#f4b8a0", label: "HIGH"     },
  medium:   { bg: "rgba(134,217,225,0.2)",  color: "#86d9e1", label: "MEDIUM"   },
};

// ── Helpers ───────────────────────────────────────────────────

const getStatusColor = (status: string) => {
  switch (status) {
    case "resolved":  return { bg: "rgba(168,213,162,0.15)", color: "#a8d5a2" };
    case "responded": return { bg: "rgba(134,217,225,0.15)", color: "#86d9e1" };
    case "notified":  return { bg: "rgba(244,184,160,0.15)", color: "#f4b8a0" };
    default:          return { bg: "rgba(231,76,60,0.15)",   color: "#e74c3c" };
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "resolved":
    case "responded": return <CheckCircle size={14} />;
    case "notified":  return <Clock size={14} />;
    default:          return <AlertTriangle size={14} />;
  }
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-KE", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

// ── Alert Card ────────────────────────────────────────────────

interface AlertCardProps {
  alert: EmergencyAlert;
}

const AlertCard: React.FC<AlertCardProps> = ({ alert }) => {
  const statusStyle = getStatusColor(alert.status);

  const openLocation = () => {
    if (alert.locationLat && alert.locationLong) {
      window.open(
        `https://maps.google.com/?q=${alert.locationLat},${alert.locationLong}`,
        "_blank"
      );
    }
  };

  const severityStyle = severityColors[alert.severity] ?? severityColors.medium;

  return (
    <div
      className="p-4 rounded-2xl"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: statusStyle.bg, color: statusStyle.color }}
          >
            {getStatusIcon(alert.status)}
          </div>
          <div>
            <p className="text-sm font-bold text-white capitalize">
              {alert.alertType.replace(/_/g, " ")} Alert
            </p>
            <p className="text-xs text-white/40">
              {alert.createdAt ? formatDate(alert.createdAt) : "—"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Severity badge */}
          <span
            className="text-xs font-black px-2 py-1 rounded-full"
            style={{ background: severityStyle.bg, color: severityStyle.color }}
          >
            {severityStyle.label}
          </span>
          {/* Status badge */}
          <span
            className="text-xs font-bold px-3 py-1 rounded-full capitalize flex items-center gap-1"
            style={{ background: statusStyle.bg, color: statusStyle.color }}
          >
            {getStatusIcon(alert.status)}
            {alert.status}
          </span>
        </div>
      </div>

      {/* Description — all selected symptoms */}
      {alert.description && (
        <p className="text-xs text-white/50 mb-2 capitalize">
          Symptoms: {alert.description.replace(/_/g, " ")}
        </p>
      )}

      {/* Location button */}
      {alert.locationLat && alert.locationLong && (
        <button
          onClick={openLocation}
          className="text-xs flex items-center gap-1 hover:opacity-70"
          style={{ color: "#86d9e1", background: "none", border: "none", padding: 0, cursor: "pointer" }}
        >
          <MapPin size={10} /> View location
        </button>
      )}
    </div>
  );
};

// ── Symptom Modal ─────────────────────────────────────────────

interface SymptomModalProps {
  onConfirm: (selected: string[]) => void;
  onCancel: () => void;
}

const SymptomModal: React.FC<SymptomModalProps> = ({ onConfirm, onCancel }) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const severity = selected.length > 0 ? getHighestSeverity(selected) : null;
  const severityStyle = severity ? severityColors[severity] : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)" }}
    >
      <div
        className="w-full max-w-md rounded-3xl p-6"
        style={{ background: "#002e33", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-black text-white">What is your emergency?</h2>
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-xl flex items-center justify-center hover:opacity-70"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            <X size={16} style={{ color: "rgba(255,255,255,0.5)" }} />
          </button>
        </div>
        <p className="text-xs text-white/40 mb-5">Select all that apply</p>

        {/* Symptom grid */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {ALERT_TYPES.map((type) => {
            const isSelected = selected.includes(type.id);
            const typeColor = severityColors[type.severity];
            return (
              <button
                key={type.id}
                onClick={() => toggle(type.id)}
                className="flex flex-col items-center justify-center p-3 rounded-2xl text-center transition-all"
                style={{
                  background: isSelected ? typeColor.bg : "rgba(255,255,255,0.05)",
                  border: isSelected
                    ? `1px solid ${typeColor.color}`
                    : "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span style={{ fontSize: "20px" }}>{type.emoji}</span>
                <span
                  className="text-xs font-bold mt-1 leading-tight"
                  style={{ color: isSelected ? typeColor.color : "rgba(255,255,255,0.5)" }}
                >
                  {type.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Severity preview */}
        {severityStyle && severity && (
          <div
            className="rounded-2xl px-4 py-3 mb-5 flex items-center justify-between"
            style={{ background: severityStyle.bg, border: `1px solid ${severityStyle.color}40` }}
          >
            <div>
              <p className="text-xs text-white/50">Auto severity</p>
              <p className="font-black text-sm" style={{ color: severityStyle.color }}>
                {severityStyle.label}
              </p>
            </div>
            <p className="text-xs text-white/40 max-w-[60%] text-right">
              {selected.length} symptom{selected.length > 1 ? "s" : ""} selected
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl font-bold text-sm"
            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}
          >
            Cancel
          </button>
          <button
            onClick={() => selected.length > 0 && onConfirm(selected)}
            disabled={selected.length === 0}
            className="flex-1 py-3 rounded-xl font-black text-sm transition-all disabled:opacity-30"
            style={{ background: "#e74c3c", color: "white" }}
          >
            Send Alert
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────

const EmergencyPage: React.FC = () => {
  const { user } = useSelector((state: any) => state.auth);
  const userId = Number(localStorage.getItem("userId"));

  const [contact, setContact]                   = useState<EmergencyContact | null>(null);
  const [loadingContact, setLoadingContact]     = useState(true);
  const [showContactForm, setShowContactForm]   = useState(false);
  const [editingContact, setEditingContact]     = useState(false);
  const [contactForm, setContactForm]           = useState({
    name: "", phoneNumber: "", relationship: "",
  });
  const [alerts, setAlerts]                     = useState<EmergencyAlert[]>([]);
  const [loadingAlerts, setLoadingAlerts]       = useState(true);
  const [sosLoading, setSosLoading]             = useState(false);
  const [showSymptomModal, setShowSymptomModal] = useState(false);

  // Fetch contact
  useEffect(() => {
    const run = async () => {
      try {
        const data = await emergencyContactApi.getByUser(userId);
        setContact(data);
      } catch (err: any) {
        if (err?.response?.status !== 404) {
          toast.error("Could not load emergency contact.");
        }
      } finally {
        setLoadingContact(false);
      }
    };
    if (userId) run();
  }, [userId]);

  // Fetch alerts
  useEffect(() => {
    const run = async () => {
      try {
        const data = await emergencyAlertApi.getByUser(userId);
        setAlerts(data);
      } catch {
        // silently ignore
      } finally {
        setLoadingAlerts(false);
      }
    };
    if (userId) run();
  }, [userId]);

  // SOS click — open symptom modal
  const handleSOSClick = () => {
    if (!contact) {
      toast.error("Please add an emergency contact first!");
      return;
    }
    setShowSymptomModal(true);
  };

  // After symptoms selected — send alert
  const handleConfirmSOS = async (selectedSymptoms: string[]) => {
    setShowSymptomModal(false);
    setSosLoading(true);

    try {
      // Get GPS location
      const getLocation = (): Promise<{ lat: number; lng: number } | null> =>
        new Promise((resolve) => {
          if (!navigator.geolocation) { resolve(null); return; }
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            () => resolve(null),
            { timeout: 10000 }
          );
        });

      const location = await getLocation();

      // Get most severe type and auto severity
      const alertType = getMostSevereType(selectedSymptoms);
      const severity  = getHighestSeverity(selectedSymptoms);

      // All selected symptoms saved in description
      const description = selectedSymptoms.join(", ");

      const newAlert = await emergencyAlertApi.create({
        userId,
        alertType,
        severity,
        description,
        locationLat: location?.lat,
        locationLong: location?.lng,
      });

      setAlerts((prev) => [newAlert, ...prev]);

      const severityStyle = severityColors[severity];
      toast.success(
        `${severityStyle.label} alert sent to ${contact?.name}!`,
        {
          duration: 5000,
          style: {
            background: "#002e33",
            color: severityStyle.color,
            border: `1px solid ${severityStyle.color}40`,
          },
        }
      );
    } catch {
      toast.error("Failed to send alert. Please call your contact directly.");
    } finally {
      setSosLoading(false);
    }
  };

  // Save contact
  const handleSaveContact = async () => {
    if (!contactForm.name.trim() || !contactForm.phoneNumber.trim()) {
      toast.error("Name and phone number are required.");
      return;
    }
    try {
      if (editingContact && contact) {
        const updated = await emergencyContactApi.update(contact.id, contactForm);
        setContact(updated);
        toast.success("Contact updated!");
      } else {
        const created = await emergencyContactApi.create({ userId, ...contactForm });
        setContact(created);
        toast.success("Emergency contact saved!");
      }
      setShowContactForm(false);
      setEditingContact(false);
      setContactForm({ name: "", phoneNumber: "", relationship: "" });
    } catch {
      toast.error("Failed to save contact.");
    }
  };

  // Delete contact
  const handleDeleteContact = async () => {
    if (!contact) return;
    const result = await Swal.fire({
      title: "Delete contact?",
      text: "You won't be able to send SOS alerts without a contact.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete",
      background: "#002e33",
      color: "#ffffff",
    });
    if (!result.isConfirmed) return;
    try {
      await emergencyContactApi.delete(contact.id);
      setContact(null);
      toast.success("Contact deleted.");
    } catch {
      toast.error("Failed to delete contact.");
    }
  };

  // Start editing
  const startEdit = () => {
    if (!contact) return;
    setContactForm({
      name: contact.name,
      phoneNumber: contact.phoneNumber,
      relationship: contact.relationship || "",
    });
    setEditingContact(true);
    setShowContactForm(true);
  };

  // Call contact
  const handleCall = () => {
    if (contact) window.open(`tel:${contact.phoneNumber}`);
  };

  // Open maps
  const openMapsSearch = () => {
    window.open(
      `https://www.google.com/maps/search/hospitals+in+${user?.county}+Kenya`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen font-sans" style={{ background: "#001e22", color: "white" }}>

      {/* Symptom Modal */}
      {showSymptomModal && (
        <SymptomModal
          onConfirm={handleConfirmSOS}
          onCancel={() => setShowSymptomModal(false)}
        />
      )}

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-10">

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <ShieldAlert size={20} style={{ color: "#e74c3c" }} />
            <span className="text-xs font-bold uppercase tracking-widest text-white/40">
              Emergency
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white">
            Emergency Services
          </h1>
          <p className="text-white/40 mt-1">
            Quick access to emergency help and nearby facilities.
          </p>
        </header>

        {/* SOS Button */}
        <div
          className="rounded-3xl p-8 mb-8 text-center"
          style={{
            background: "rgba(231,76,60,0.06)",
            border: "1px solid rgba(231,76,60,0.2)",
          }}
        >
          <p className="text-white/50 text-sm mb-6">
            {contact
              ? `Alert will be sent to ${contact.name} (${contact.phoneNumber})`
              : "Add an emergency contact below to enable SOS"}
          </p>
          <button
            onClick={handleSOSClick}
            disabled={sosLoading || !contact}
            className="w-40 h-40 rounded-full font-black text-xl uppercase tracking-widest mx-auto flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{ background: "#e74c3c", color: "white" }}
          >
            {sosLoading ? (
              <Loader2 size={32} className="animate-spin" />
            ) : (
              <div className="text-center">
                <ShieldAlert size={32} className="mx-auto mb-1" />
                <span>SOS</span>
              </div>
            )}
          </button>
          {!contact && (
            <p className="text-xs text-white/30 mt-4">
              SOS disabled — no emergency contact saved
            </p>
          )}
        </div>

        {/* Emergency Contact */}
        <div
          className="rounded-3xl p-6 mb-8"
          style={{
            background: "rgba(134,217,225,0.04)",
            border: "1px solid rgba(134,217,225,0.15)",
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(134,217,225,0.15)" }}
              >
                <Phone size={18} style={{ color: "#86d9e1" }} />
              </div>
              <h2 className="font-bold text-white">Emergency Contact</h2>
            </div>
            {!contact && !showContactForm && (
              <button
                onClick={() => { setShowContactForm(true); setEditingContact(false); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-80"
                style={{ background: "rgba(134,217,225,0.15)", color: "#86d9e1" }}
              >
                <Plus size={16} /> Add Contact
              </button>
            )}
          </div>

          {loadingContact ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={24} className="animate-spin" style={{ color: "#86d9e1" }} />
            </div>
          ) : showContactForm ? (
            <div className="space-y-4">
              <input
                placeholder="Full name *"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                className="w-full p-3 rounded-xl text-white text-sm outline-none"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />
              <input
                placeholder="Phone number * (e.g. +254712345678)"
                value={contactForm.phoneNumber}
                onChange={(e) => setContactForm({ ...contactForm, phoneNumber: e.target.value })}
                className="w-full p-3 rounded-xl text-white text-sm outline-none"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />
              <input
                placeholder="Relationship (e.g. Husband, Mother)"
                value={contactForm.relationship}
                onChange={(e) => setContactForm({ ...contactForm, relationship: e.target.value })}
                className="w-full p-3 rounded-xl text-white text-sm outline-none"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleSaveContact}
                  className="flex-1 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-80"
                  style={{ background: "#86d9e1", color: "#002e33" }}
                >
                  {editingContact ? "Update Contact" : "Save Contact"}
                </button>
                <button
                  onClick={() => { setShowContactForm(false); setEditingContact(false); }}
                  className="w-12 rounded-xl flex items-center justify-center transition-all hover:opacity-80"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <X size={16} style={{ color: "rgba(255,255,255,0.5)" }} />
                </button>
              </div>
            </div>
          ) : contact ? (
            <div
              className="flex items-center justify-between p-4 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg"
                  style={{ background: "rgba(134,217,225,0.15)", color: "#86d9e1" }}
                >
                  {contact.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-white">{contact.name}</p>
                  <p className="text-sm" style={{ color: "#86d9e1" }}>
                    {contact.phoneNumber}
                  </p>
                  {contact.relationship && (
                    <p className="text-xs text-white/40">{contact.relationship}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCall}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:opacity-80"
                  style={{ background: "rgba(168,213,162,0.15)", color: "#a8d5a2" }}
                >
                  <Phone size={16} />
                </button>
                <button
                  onClick={startEdit}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:opacity-80"
                  style={{ background: "rgba(134,217,225,0.15)", color: "#86d9e1" }}
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={handleDeleteContact}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:opacity-80"
                  style={{ background: "rgba(231,76,60,0.15)", color: "#e74c3c" }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <User size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-white/40 text-sm">No emergency contact saved yet.</p>
              <button
                onClick={() => setShowContactForm(true)}
                className="mt-4 px-6 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-80"
                style={{ background: "rgba(134,217,225,0.15)", color: "#86d9e1" }}
              >
                Add Contact
              </button>
            </div>
          )}
        </div>

        {/* Nearby Facilities */}
        <div
          className="rounded-3xl p-6 mb-8 overflow-hidden"
          style={{
            background: "rgba(134,217,225,0.04)",
            border: "1px solid rgba(134,217,225,0.15)",
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(134,217,225,0.15)" }}
              >
                <MapPin size={18} style={{ color: "#86d9e1" }} />
              </div>
              <div>
                <h2 className="font-bold text-white">Nearby Facilities</h2>
                <p className="text-xs text-white/40">
                  {user?.county
                    ? `Hospitals in ${user.county}`
                    : "Update your county in profile to see nearby hospitals"}
                </p>
              </div>
            </div>
            {user?.county && (
              <button
                onClick={openMapsSearch}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-80"
                style={{ background: "rgba(134,217,225,0.15)", color: "#86d9e1" }}
              >
                <MapPin size={14} /> Open in Maps
              </button>
            )}
          </div>

          {user?.county ? (
            <div className="rounded-2xl overflow-hidden">
              <iframe
                title="Nearby Hospitals"
                width="100%"
                height="350"
                style={{ border: 0, borderRadius: "16px" }}
                loading="lazy"
                allowFullScreen
                src={`https://maps.google.com/maps?q=hospitals+maternity+in+${encodeURIComponent(user.county)}+Kenya&output=embed`}
              />
            </div>
          ) : (
            <div
              className="rounded-2xl flex items-center justify-center py-16"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <div className="text-center">
                <MapPin size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-white/40 text-sm">
                  Go to Profile and set your county to see nearby hospitals.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Alert History */}
        <div
          className="rounded-3xl p-6"
          style={{
            background: "rgba(134,217,225,0.04)",
            border: "1px solid rgba(134,217,225,0.15)",
          }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(231,76,60,0.15)" }}
            >
              <ShieldAlert size={18} style={{ color: "#e74c3c" }} />
            </div>
            <h2 className="font-bold text-white">Alert History</h2>
          </div>

          {loadingAlerts ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={24} className="animate-spin" style={{ color: "#86d9e1" }} />
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-8">
              <ShieldAlert size={32} className="mx-auto mb-3 opacity-20" />
              <p className="text-white/30 text-sm">No emergency alerts yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default EmergencyPage;