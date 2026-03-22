import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  adminApi,
  type AdminUser,
  type AdminEmergencyAlert,
  type AdminCheckin,
  type AdminPregnancy,
} from "../../Features/Apis/adminApi";
import {
  Users, Baby, ShieldAlert, Activity,
  AlertTriangle, CheckCircle, Clock, XCircle,
} from "lucide-react";
import toast from "react-hot-toast";

// ── Types ─────────────────────────────────────────────────────

interface Stats {
  totalUsers: number;
  activePregnancies: number;
  pendingAlerts: number;
  riskCheckins: number;
}

// ── Helpers ───────────────────────────────────────────────────

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":    return { bg: "#fdecea", color: "#922",     label: "Pending" };
    case "notified":   return { bg: "#fff4e8", color: "#8a4a00",  label: "Notified" };
    case "responded":  return { bg: "#e8f5f6", color: "#005a63",  label: "Responded" };
    case "resolved":   return { bg: "#edf7ee", color: "#2e6b38",  label: "Resolved" };
    default:           return { bg: "#f1f1f1", color: "#555",     label: status };
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical": return "#e53e3e";
    case "high":     return "#dd6b20";
    case "medium":   return "#d69e2e";
    default:         return "#718096";
  }
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-KE", {
    day: "numeric", month: "short", year: "numeric",
  });
};

// ── Stat Card ─────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent: string;
  sub?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, accent, sub }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4" style={{ borderLeftColor: accent }}>
    <div className="flex items-center justify-between mb-3">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: accent + "15" }}
      >
        <div style={{ color: accent }}>{icon}</div>
      </div>
      <span
        className="text-3xl font-black"
        style={{ color: "#002e33" }}
      >
        {value}
      </span>
    </div>
    <p className="text-xs font-black uppercase tracking-widest text-gray-400">{label}</p>
    {sub && <p className="text-xs text-gray-300 mt-1">{sub}</p>}
  </div>
);

// ── Main Page ─────────────────────────────────────────────────

const AdminHome = () => {
  const { user } = useSelector((state: any) => state.auth);

  const [stats, setStats]           = useState<Stats>({
    totalUsers: 0,
    activePregnancies: 0,
    pendingAlerts: 0,
    riskCheckins: 0,
  });
  const [recentAlerts, setRecentAlerts]   = useState<AdminEmergencyAlert[]>([]);
  const [recentUsers, setRecentUsers]     = useState<AdminUser[]>([]);
  const [riskCheckins, setRiskCheckins]   = useState<AdminCheckin[]>([]);
  const [loading, setLoading]             = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [users, pregnancies, alerts, checkins] = await Promise.all([
          adminApi.getAllUsers(),
          adminApi.getAllPregnancies(),
          adminApi.getAllAlerts(),
          adminApi.getAllCheckins(),
        ]);

        // Calculate stats
        setStats({
          totalUsers:        users.length,
          activePregnancies: pregnancies.filter((p) => p.isActive).length,
          pendingAlerts:     alerts.filter((a) => a.status === "pending").length,
          riskCheckins:      checkins.filter((c) => c.riskFlag).length,
        });

        // Recent 5 of each
        setRecentAlerts(alerts.slice(0, 5));
        setRecentUsers(users.slice(0, 5));
        setRiskCheckins(checkins.filter((c) => c.riskFlag).slice(0, 5));

      } catch {
        toast.error("Failed to load admin data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // ── Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#002e33] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* ── Header */}
      <header>
        <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">
          Admin Overview
        </p>
        <h1
          className="text-3xl md:text-4xl font-black"
          style={{ color: "#002e33" }}
        >
          Welcome back, {user?.firstName || "Admin"} 👋
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Here's what's happening across MamaCare today.
        </p>
      </header>

      {/* ── Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Total Users"
          value={stats.totalUsers}
          icon={<Users size={20} />}
          accent="#002e33"
          sub="All registered mothers"
        />
        <StatCard
          label="Active Pregnancies"
          value={stats.activePregnancies}
          icon={<Baby size={20} />}
          accent="#86d9e1"
          sub="Currently ongoing"
        />
        <StatCard
          label="Pending Alerts"
          value={stats.pendingAlerts}
          icon={<ShieldAlert size={20} />}
          accent="#e53e3e"
          sub="Require immediate response"
        />
        <StatCard
          label="Risk Check-ins"
          value={stats.riskCheckins}
          icon={<Activity size={20} />}
          accent="#dd6b20"
          sub="Flagged this period"
        />
      </div>

      {/* ── Three columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Recent Emergency Alerts */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div
            className="px-6 py-4 border-b border-gray-100 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <ShieldAlert size={16} className="text-red-500" />
              <h2
                className="text-xs font-black uppercase tracking-widest"
                style={{ color: "#002e33" }}
              >
                Recent Emergency Alerts
              </h2>
            </div>
            <span className="text-xs text-gray-400">Latest 5</span>
          </div>

          {recentAlerts.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-300 text-sm">
              No emergency alerts yet
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentAlerts.map((alert) => {
                const status = getStatusColor(alert.status);
                return (
                  <div key={alert.id} className="px-6 py-4 flex items-center gap-4">
                    {/* Severity dot */}
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ background: getSeverityColor(alert.severity) }}
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate capitalize">
                        {alert.alertType?.replace(/_/g, " ") || "Emergency"}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        User #{alert.userId} · {formatDate(alert.createdAt)}
                      </p>
                    </div>

                    {/* Severity badge */}
                    <span
                      className="text-xs font-bold uppercase px-2 py-1 rounded-lg shrink-0 capitalize"
                      style={{ color: getSeverityColor(alert.severity), background: getSeverityColor(alert.severity) + "15" }}
                    >
                      {alert.severity}
                    </span>

                    {/* Status badge */}
                    <span
                      className="text-xs font-bold px-2 py-1 rounded-lg shrink-0"
                      style={{ background: status.bg, color: status.color }}
                    >
                      {status.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Right column */}
        <div className="space-y-6">

          {/* Recent Users */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <Users size={16} style={{ color: "#002e33" }} />
              <h2
                className="text-xs font-black uppercase tracking-widest"
                style={{ color: "#002e33" }}
              >
                Recent Users
              </h2>
            </div>
            {recentUsers.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-300 text-sm">
                No users yet
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {recentUsers.map((u) => (
                  <div key={u.id} className="px-6 py-3 flex items-center gap-3">
                    {/* Avatar */}
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
                      style={{ background: "#002e33" }}
                    >
                      {u.firstName?.[0] ?? "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate">
                        {u.firstName} {u.lastName}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{u.email}</p>
                    </div>
                    {/* Verified dot */}
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: u.isEmailVerified ? "#38a169" : "#e53e3e" }}
                      title={u.isEmailVerified ? "Verified" : "Not verified"}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Risk Flagged Check-ins */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <AlertTriangle size={16} className="text-orange-500" />
              <h2
                className="text-xs font-black uppercase tracking-widest"
                style={{ color: "#002e33" }}
              >
                Risk Flagged
              </h2>
            </div>
            {riskCheckins.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-300 text-sm">
                No risk flags
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {riskCheckins.map((c) => (
                  <div key={c.id} className="px-6 py-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-gray-800">
                        Week {c.weekNumber}
                      </p>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-orange-50 text-orange-600">
                        Risk
                      </span>
                    </div>
                    {c.riskReason && (
                      <p className="text-xs text-gray-400 mt-0.5 truncate">
                        {c.riskReason}
                      </p>
                    )}
                    <p className="text-xs text-gray-300 mt-0.5">
                      {formatDate(c.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── Alert Status Legend */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4">
        <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">
          Alert Status Guide
        </p>
        <div className="flex flex-wrap gap-4">
          {[
            { status: "pending",   icon: <Clock size={12} />,        label: "Pending — not yet actioned" },
            { status: "notified",  icon: <AlertTriangle size={12} />, label: "Notified — responder informed" },
            { status: "responded", icon: <Activity size={12} />,      label: "Responded — help dispatched" },
            { status: "resolved",  icon: <CheckCircle size={12} />,   label: "Resolved — situation handled" },
          ].map((item) => {
            const s = getStatusColor(item.status);
            return (
              <div
                key={item.status}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold"
                style={{ background: s.bg, color: s.color }}
              >
                {item.icon}
                {item.label}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default AdminHome;