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

// ── Color tokens ──────────────────────────────────────────────
const midnightTeal = "#0B3B3F";
const aquaText     = "#7FD1E0";
const aquaLight    = "#E6F7F9";
const warmGray     = "#F8F9FA";

// ── Alert Types ───────────────────────────────────────────────

const ALERT_TYPES = [
  { id: "bleeding",          label: "Bleeding",          emoji: "🩸", severity: "critical" },
  { id: "water_break",       label: "Water Break",       emoji: "💧", severity: "critical" },
  { id: "contractions",      label: "Contractions",      emoji: "🔄", severity: "critical" },
  { id: "severe_pain",       label: "Severe Pain",       emoji: "😣", severity: "high"     },
  { id: "high_fever",        label: "High Fever",        emoji: "🌡️", severity: "high"     },
  { id: "severe_headache",   label: "Severe Headache",   emoji: "🤕", severity: "high"     },
  { id: "blurred_vision",    label: "Blurred Vision",    emoji: "👁️", severity: "high"     },
  { id: "reduced_movements", label: "Reduced Movements", emoji: "👶", severity: "medium"   },
  { id: "other",             label: "Other",             emoji: "❓", severity: "medium"   },
];

const getHighestSeverity = (selected: string[]): "critical" | "high" | "medium" => {
  const severities = selected.map(
    (id) => ALERT_TYPES.find((t) => t.id === id)?.severity ?? "medium"
  );
  if (severities.includes("critical")) return "critical";
  if (severities.includes("high"))     return "high";
  return "medium";
};

const getMostSevereType = (selected: string[]): string => {
  const order = ["bleeding", "water_break", "contractions",
    "severe_pain", "high_fever", "severe_headache",
    "blurred_vision", "reduced_movements", "other"];
  return order.find((id) => selected.includes(id)) ?? "other";
};

const severityColors: Record<string, { bg: string; color: string; label: string }> = {
  critical: { bg: "#FEE2E2", color: "#DC2626", label: "CRITICAL" },
  high:     { bg: "#FEF3C7", color: "#D97706", label: "HIGH"     },
  medium:   { bg: aquaLight,  color: midnightTeal, label: "MEDIUM" },
};

// ── Helpers ───────────────────────────────────────────────────

const getStatusColor = (status: string) => {
  switch (status) {
    case "resolved":  return { bg: "#DCFCE7", color: "#16A34A" };
    case "responded": return { bg: aquaLight,  color: midnightTeal };
    case "notified":  return { bg: "#FEF3C7", color: "#D97706" };
    default:          return { bg: "#FEE2E2", color: "#DC2626" };
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
  const statusStyle   = getStatusColor(alert.status);
  const severityStyle = severityColors[alert.severity] ?? severityColors.medium;

  const openLocation = () => {
    if (alert.locationLat && alert.locationLong) {
      window.open(
        `https://maps.google.com/?q=${alert.locationLat},${alert.locationLong}`,
        "_blank"
      );
    }
  };

  return (
    <div
      className="p-4 rounded-2xl border"
      style={{ background: "#FFFFFF", borderColor: "#E5E7EB" }}
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
            <p className="text-sm font-bold capitalize" style={{ color: midnightTeal }}>
              {alert.alertType.replace(/_/g, " ")} Alert
            </p>
            <p className="text-xs text-gray-400">
              {alert.createdAt ? formatDate(alert.createdAt) : "—"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-black px-2 py-1 rounded-full"
            style={{ background: severityStyle.bg, color: severityStyle.color }}
          >
            {severityStyle.label}
          </span>
          <span
            className="text-xs font-bold px-3 py-1 rounded-full capitalize flex items-center gap-1"
            style={{ background: statusStyle.bg, color: statusStyle.color }}
          >
            {getStatusIcon(alert.status)}
            {alert.status}
          </span>
        </div>
      </div>

      {alert.description && (
        <p className="text-xs text-gray-400 mb-2 capitalize">
          Symptoms: {alert.description.replace(/_/g, " ")}
        </p>
      )}

      {alert.locationLat && alert.locationLong && (
        <button
          onClick={openLocation}
          className="text-xs flex items-center gap-1 hover:opacity-70"
          style={{ color: aquaText, background: "none", border: "none", padding: 0, cursor: "pointer" }}
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

  const severity      = selected.length > 0 ? getHighestSeverity(selected) : null;
  const severityStyle = severity ? severityColors[severity] : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div
        className="w-full max-w-md rounded-3xl p-6 bg-white shadow-xl"
        style={{ border: "1px solid #E5E7EB" }}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-black" style={{ color: midnightTeal }}>
            What is your emergency?
          </h2>
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-xl flex items-center justify-center hover:opacity-70"
            style={{ background: warmGray }}
          >
            <X size={16} style={{ color: "#9CA3AF" }} />
          </button>
        </div>
        <p className="text-xs text-gray-400 mb-5">Select all that apply</p>

        {/* Symptom grid */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {ALERT_TYPES.map((type) => {
            const isSelected = selected.includes(type.id);
            const typeColor  = severityColors[type.severity];
            return (
              <button
                key={type.id}
                onClick={() => toggle(type.id)}
                className="flex flex-col items-center justify-center p-3 rounded-2xl text-center transition-all"
                style={{
                  background: isSelected ? typeColor.bg : warmGray,
                  border: isSelected
                    ? `1px solid ${typeColor.color}`
                    : "1px solid #E5E7EB",
                }}
              >
                <span style={{ fontSize: "20px" }}>{type.emoji}</span>
                <span
                  className="text-xs font-bold mt-1 leading-tight"
                  style={{ color: isSelected ? typeColor.color : "#6B7280" }}
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
            style={{
              background: severityStyle.bg,
              border: `1px solid ${severityStyle.color}40`,
            }}
          >
            <div>
              <p className="text-xs text-gray-400">Auto severity</p>
              <p className="font-black text-sm" style={{ color: severityStyle.color }}>
                {severityStyle.label}
              </p>
            </div>
            <p className="text-xs text-gray-400">
              {selected.length} symptom{selected.length > 1 ? "s" : ""} selected
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl font-bold text-sm"
            style={{ background: warmGray, color: "#6B7280" }}
          >
            Cancel
          </button>
          <button
            onClick={() => selected.length > 0 && onConfirm(selected)}
            disabled={selected.length === 0}
            className="flex-1 py-3 rounded-xl font-black text-sm transition-all disabled:opacity-30"
            style={{ background: "#DC2626", color: "white" }}
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

  const handleSOSClick = () => {
    if (!contact) {
      toast.error("Please add an emergency contact first!");
      return;
    }
    setShowSymptomModal(true);
  };

  const handleConfirmSOS = async (selectedSymptoms: string[]) => {
    setShowSymptomModal(false);
    setSosLoading(true);
    try {
      const getLocation = (): Promise<{ lat: number; lng: number } | null> =>
        new Promise((resolve) => {
          if (!navigator.geolocation) { resolve(null); return; }
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            () => resolve(null),
            { timeout: 10000 }
          );
        });

      const location    = await getLocation();
      const alertType   = getMostSevereType(selectedSymptoms);
      const severity    = getHighestSeverity(selectedSymptoms);
      const description = selectedSymptoms.join(", ");

      const newAlert = await emergencyAlertApi.create({
        userId, alertType, severity, description,
        locationLat: location?.lat,
        locationLong: location?.lng,
      });

      setAlerts((prev) => [newAlert, ...prev]);

      const severityStyle = severityColors[severity];
      toast.success(`${severityStyle.label} alert sent to ${contact?.name}!`, {
        duration: 5000,
      });
    } catch {
      toast.error("Failed to send alert. Please call your contact directly.");
    } finally {
      setSosLoading(false);
    }
  };

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

  const handleDeleteContact = async () => {
    if (!contact) return;
    const result = await Swal.fire({
      title: "Delete contact?",
      text: "You won't be able to send SOS alerts without a contact.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete",
      background: "#FFFFFF",
      color: midnightTeal,
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

  const handleCall    = () => { if (contact) window.open(`tel:${contact.phoneNumber}`); };
  const openMapsSearch = () => {
    window.open(
      `https://www.google.com/maps/search/hospitals+in+${user?.county}+Kenya`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen font-sans" style={{ background: warmGray, color: midnightTeal }}>

      {showSymptomModal && (
        <SymptomModal
          onConfirm={handleConfirmSOS}
          onCancel={() => setShowSymptomModal(false)}
        />
      )}

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-10">

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ShieldAlert size={28} style={{ color: "#DC2626" }} />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: midnightTeal }}>
              Emergency Services
            </h1>
          </div>
          <p className="text-gray-400 text-base">
            Quick access to emergency help and nearby facilities.
          </p>
        </header>

        {/* SOS Button */}
        <div
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 text-center"
        >
          <p className="text-gray-400 text-sm mb-6">
            {contact
              ? `Alert will be sent to ${contact.name} (${contact.phoneNumber})`
              : "Add an emergency contact below to enable SOS"}
          </p>
          <button
            onClick={handleSOSClick}
            disabled={sosLoading || !contact}
            className="w-40 h-40 rounded-full font-black text-xl uppercase tracking-widest mx-auto flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{ background: "#DC2626", color: "white" }}
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
            <p className="text-xs text-gray-400 mt-4">
              SOS disabled — no emergency contact saved
            </p>
          )}
        </div>

        {/* Emergency Contact */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="px-6 py-5 border-b border-gray-100" style={{ backgroundColor: aquaLight }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white">
                  <Phone size={22} style={{ color: midnightTeal }} />
                </div>
                <h2 className="font-bold text-xl" style={{ color: midnightTeal }}>
                  Emergency Contact
                </h2>
              </div>
              {!contact && !showContactForm && (
                <button
                  onClick={() => { setShowContactForm(true); setEditingContact(false); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-80"
                  style={{ background: midnightTeal, color: aquaText }}
                >
                  <Plus size={16} /> Add Contact
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            {loadingContact ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={24} className="animate-spin" style={{ color: aquaText }} />
              </div>
            ) : showContactForm ? (
              <div className="space-y-4">
                <input
                  placeholder="Full name *"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 text-sm outline-none focus:shadow-md"
                  style={{ borderColor: "#E5E7EB", color: midnightTeal }}
                />
                <input
                  placeholder="Phone number * (e.g. +254712345678)"
                  value={contactForm.phoneNumber}
                  onChange={(e) => setContactForm({ ...contactForm, phoneNumber: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 text-sm outline-none focus:shadow-md"
                  style={{ borderColor: "#E5E7EB", color: midnightTeal }}
                />
                <input
                  placeholder="Relationship (e.g. Husband, Mother)"
                  value={contactForm.relationship}
                  onChange={(e) => setContactForm({ ...contactForm, relationship: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 text-sm outline-none focus:shadow-md"
                  style={{ borderColor: "#E5E7EB", color: midnightTeal }}
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleSaveContact}
                    className="flex-1 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-80"
                    style={{ background: midnightTeal, color: aquaText }}
                  >
                    {editingContact ? "Update Contact" : "Save Contact"}
                  </button>
                  <button
                    onClick={() => { setShowContactForm(false); setEditingContact(false); }}
                    className="w-12 rounded-xl flex items-center justify-center transition-all hover:bg-gray-100"
                    style={{ background: warmGray, border: "1px solid #E5E7EB" }}
                  >
                    <X size={16} style={{ color: "#9CA3AF" }} />
                  </button>
                </div>
              </div>
            ) : contact ? (
              <div
                className="flex items-center justify-between p-4 rounded-2xl"
                style={{ background: warmGray, border: "1px solid #E5E7EB" }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg"
                    style={{ background: aquaLight, color: midnightTeal }}
                  >
                    {contact.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold" style={{ color: midnightTeal }}>{contact.name}</p>
                    <p className="text-sm" style={{ color: aquaText }}>{contact.phoneNumber}</p>
                    {contact.relationship && (
                      <p className="text-xs text-gray-400">{contact.relationship}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCall}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:opacity-80"
                    style={{ background: "#DCFCE7", color: "#16A34A" }}
                  >
                    <Phone size={16} />
                  </button>
                  <button
                    onClick={startEdit}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:opacity-80"
                    style={{ background: "#FEF3C7", color: "#D97706" }}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={handleDeleteContact}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:opacity-80"
                    style={{ background: "#FEE2E2", color: "#DC2626" }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: aquaLight }}
                >
                  <User size={28} style={{ color: midnightTeal }} />
                </div>
                <p className="text-gray-400 text-sm">No emergency contact saved yet.</p>
                <button
                  onClick={() => setShowContactForm(true)}
                  className="mt-4 px-6 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-80"
                  style={{ background: midnightTeal, color: aquaText }}
                >
                  Add Contact
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Nearby Facilities */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="px-6 py-5 border-b border-gray-100" style={{ backgroundColor: aquaLight }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white">
                  <MapPin size={22} style={{ color: midnightTeal }} />
                </div>
                <div>
                  <h2 className="font-bold text-xl" style={{ color: midnightTeal }}>
                    Nearby Facilities
                  </h2>
                  <p className="text-xs text-gray-400">
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
                  style={{ background: midnightTeal, color: aquaText }}
                >
                  <MapPin size={14} /> Open in Maps
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
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
                style={{ background: warmGray }}
              >
                <div className="text-center">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: aquaLight }}
                  >
                    <MapPin size={28} style={{ color: midnightTeal }} />
                  </div>
                  <p className="text-gray-400 text-sm">
                    Go to Profile and set your county to see nearby hospitals.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Alert History */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100" style={{ backgroundColor: "#FEE2E2" }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white">
                <ShieldAlert size={22} style={{ color: "#DC2626" }} />
              </div>
              <h2 className="font-bold text-xl" style={{ color: "#DC2626" }}>
                Alert History
              </h2>
            </div>
          </div>

          <div className="p-6">
            {loadingAlerts ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={24} className="animate-spin" style={{ color: aquaText }} />
              </div>
            ) : alerts.length === 0 ? (
              <div className="text-center py-8">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: "#FEE2E2" }}
                >
                  <ShieldAlert size={28} style={{ color: "#DC2626" }} />
                </div>
                <p className="text-gray-400 text-sm">No emergency alerts yet.</p>
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
    </div>
  );
};

export default EmergencyPage;