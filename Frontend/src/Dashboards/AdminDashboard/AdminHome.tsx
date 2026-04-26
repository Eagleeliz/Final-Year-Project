import { useEffect, useState, useMemo } from "react";
import {
  Users,
  Activity,
  AlertTriangle,
  HeartPulse,
  Loader2,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import usersApi, { type User } from "../../Features/Apis/usersApi";
import pregnancyApi from "../../Features/Apis/PregnancyAPI";
import { emergencyAlertApi } from "../../Features/Apis/emergencyContactApi";
import weeklyCheckinApi from "../../Features/Apis/WeeklyCheckinAPI";

type Stats = {
  totalUsers: number;
  activePregnancies: number;
  pendingAlerts: number;
  riskCheckins: number;
};

const midnightTeal = "#0B3B3F";

const calendarStyle = `
  .teal-calendar {
    width: 100% !important;
    border: none !important;
    background: transparent !important;
    font-family: inherit !important;
  }
  .teal-calendar .react-calendar__navigation {
    margin-bottom: 8px;
  }
  .teal-calendar .react-calendar__navigation button {
    color: ${midnightTeal};
    font-weight: 700;
    font-size: 17px;
    background: none;
    min-width: 32px;
  }
  .teal-calendar .react-calendar__navigation button:hover,
  .teal-calendar .react-calendar__navigation button:focus {
    background: #e6f7f9 !important;
    border-radius: 8px;
  }
  .teal-calendar .react-calendar__month-view__weekdays {
    text-align: center;
    font-size: 13px;
    font-weight: 800;
    color: #000000;
    text-transform: uppercase;
    text-decoration: none !important;
  }
  .teal-calendar .react-calendar__month-view__weekdays abbr {
    text-decoration: none !important;
    border-bottom: none !important;
  }
  .teal-calendar .react-calendar__tile {
    padding: 12px 4px;
    font-size: 15px;
    color: #000000;
    background: none;
    border-radius: 10px;
    border: none !important;
  }
  .teal-calendar .react-calendar__tile:hover {
    background: #e6f7f9 !important;
    color: ${midnightTeal} !important;
  }
  .teal-calendar .react-calendar__tile--now,
  .teal-calendar .react-calendar__tile--now:enabled,
  .teal-calendar .react-calendar__tile--now:disabled {
    background: ${midnightTeal} !important;
    color: #fff !important;
    border-radius: 12px !important;
    font-weight: 900 !important;
    font-size: 18px !important;
    box-shadow: 0 4px 14px ${midnightTeal}66 !important;
    transform: scale(1.15);
    position: relative;
    z-index: 1;
  }
  .teal-calendar .react-calendar__tile--active {
    background: ${midnightTeal}22 !important;
    color: ${midnightTeal} !important;
    font-weight: 700;
  }
  .teal-calendar .react-calendar__tile:disabled {
    background: none !important;
    color: #9ca3af !important;
    cursor: default;
  }
  .teal-calendar .react-calendar__month-view__days__day--neighboringMonth {
    color: #9ca3af !important;
  }
`;

const StatCard = ({ icon: Icon, label, value, bg, color }: any) => (
  <div
    className="bg-white p-6 rounded-2xl shadow-sm border-l-4 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer relative overflow-hidden"
    style={{ borderLeftColor: color }}
  >
    <div
      className="absolute inset-0 opacity-5"
      style={{ background: `linear-gradient(135deg, ${color} 0%, transparent 50%)` }}
    />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-xl" style={{ background: bg }}>
          <Icon size={24} style={{ color }} />
        </div>
      </div>
      <p className="text-4xl font-black" style={{ color }}>
        {value.toLocaleString()}
      </p>
      <p className="text-base font-bold uppercase tracking-wider text-gray-500 mt-2">
        {label}
      </p>
    </div>
  </div>
);

const AdminHome = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activePregnancies: 0,
    pendingAlerts: 0,
    riskCheckins: 0,
  });
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const results = await Promise.allSettled([
          usersApi.getAllUsers(),
          pregnancyApi.getAll(),
          emergencyAlertApi.getAllAlerts(),
          weeklyCheckinApi.getAll(),
        ]);

        const normalize = (res: any) => {
          if (res.status !== "fulfilled") return [];
          const data = res.value;
          if (Array.isArray(data)) return data;
          if (data?.data && Array.isArray(data.data)) return data.data;
          return [];
        };

        const users = normalize(results[0]) as User[];
        const pregnancies = normalize(results[1]);
        const alerts = normalize(results[2]);
        const checkins = normalize(results[3]);

        setAllUsers(users);
        setStats({
          totalUsers: users.length,
          activePregnancies: pregnancies.filter(
            (p: any) => p?.isActive === true || p?.status === "active" || p?.active === true
          ).length,
          pendingAlerts: alerts.filter(
            (a: any) => a?.status === "pending" || a?.status === "Pending"
          ).length,
          riskCheckins: checkins.filter(
            (c: any) => c?.riskFlag === true || c?.risk === true || c?.isRisk === true
          ).length,
        });
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const last6MonthsData = useMemo(() => {
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return {
        month: d.toLocaleString("default", { month: "short", year: "numeric" }),
        shortLabel: d.toLocaleString("default", { month: "short" }),
        count: 0,
      };
    });

    allUsers.forEach((u) => {
      if (!u.createdAt) return;
      const d = new Date(u.createdAt);
      const key = d.toLocaleString("default", { month: "short", year: "numeric" });
      const slot = months.find((m) => m.month === key);
      if (slot) slot.count += 1;
    });

    return months;
  }, [allUsers]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin" size={40} style={{ color: midnightTeal }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-red-500">
        {error}
      </div>
    );
  }

  const statCards = [
    { label: "Total Users",        value: stats.totalUsers,        icon: Users,         bg: "#e6f7f9", color: midnightTeal },
    { label: "Active Pregnancies", value: stats.activePregnancies, icon: HeartPulse,    bg: "#f0fdf4", color: "#2e6b38"   },
    { label: "Pending Alerts",     value: stats.pendingAlerts,     icon: AlertTriangle, bg: "#fff7ed", color: "#c2410c"   },
    { label: "Risk Check-ins",     value: stats.riskCheckins,      icon: Activity,      bg: "#faf5ff", color: "#7c3aed"   },
  ];

  return (
    <>
      <style>{calendarStyle}</style>

      <div className="space-y-6">
        {/* Header */}
        <header>
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Admin</p>
          <h1 className="text-3xl font-black" style={{ color: midnightTeal }}>Dashboard Overview</h1>
          <p className="text-gray-400 text-sm mt-1">Quick insights into your system</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <StatCard
              key={stat.label}
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              bg={stat.bg}
              color={stat.color}
            />
          ))}
        </div>

        {/* Calendar + Chart */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Calendar */}
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
            <p className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: midnightTeal }}>
              Calendar
            </p>
            <Calendar
              value={selectedDate}
              onChange={(val) => {
                if (val instanceof Date) setSelectedDate(val);
              }}
              className="teal-calendar"
              tileDisabled={() => true}
            />
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 flex flex-col">
            <div className="mb-4">
              <p className="text-xs font-black uppercase tracking-widest" style={{ color: midnightTeal }}>
                Monthly Registrations
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Last 6 months</p>
            </div>

            {last6MonthsData.every((d) => d.count === 0) ? (
              <div className="flex flex-1 items-center justify-center text-gray-400 text-sm">
                No registration data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={last6MonthsData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis
                    dataKey="shortLabel"
                    tick={{ fontSize: 14, fill: "#000000" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 13, fill: "#000000" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "#f0f9fa" }}
                    contentStyle={{
                      backgroundColor: midnightTeal,
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                    formatter={(value: any) => [value, "Registrations"]}
                    labelFormatter={(label) => {
                      const item = last6MonthsData.find((d) => d.shortLabel === label);
                      return item?.month ?? label;
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill={midnightTeal}
                    radius={[6, 6, 0, 0]}
                    name="Registrations"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminHome;