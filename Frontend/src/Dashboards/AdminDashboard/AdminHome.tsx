import { useEffect, useState } from "react";
import {
  Users,
  Activity,
  AlertTriangle,
  HeartPulse,
} from "lucide-react";

import usersApi from "../../Features/Apis/usersApi";
import pregnancyApi from "../../Features/Apis/PregnancyAPI";
import { emergencyAlertApi } from "../../Features/Apis/emergencyContactApi";
import weeklyCheckinApi from "../../Features/Apis/WeeklyCheckinAPI";

type Stats = {
  totalUsers: number;
  activePregnancies: number;
  pendingAlerts: number;
  riskCheckins: number;
};

const StatCard = ({ icon: Icon, label, value }: any) => (
  <div className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col justify-between hover:shadow-md transition">
    <div className="flex items-center justify-between">
      <p className="text-gray-500 text-sm">{label}</p>
      <Icon className="text-gray-400" size={22} />
    </div>

    <h2 className="text-3xl font-bold text-black mt-4">
      {value}
    </h2>
  </div>
);

const AdminHome = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activePregnancies: 0,
    pendingAlerts: 0,
    riskCheckins: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

        const users = normalize(results[0]);
        const pregnancies = normalize(results[1]);
        const alerts = normalize(results[2]);
        const checkins = normalize(results[3]);

        setStats({
          totalUsers: users.length,
          activePregnancies: pregnancies.filter(
            (p: any) =>
              p?.isActive === true ||
              p?.status === "active" ||
              p?.active === true
          ).length,
          pendingAlerts: alerts.filter(
            (a: any) =>
              a?.status === "pending" || a?.status === "Pending"
          ).length,
          riskCheckins: checkins.filter(
            (c: any) =>
              c?.riskFlag === true ||
              c?.risk === true ||
              c?.isRisk === true
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-500">
        Loading dashboard...
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

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Dashboard Overview
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Quick insights into your system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats.totalUsers}
        />

        <StatCard
          icon={HeartPulse}
          label="Active Pregnancies"
          value={stats.activePregnancies}
        />

        <StatCard
          icon={AlertTriangle}
          label="Pending Alerts"
          value={stats.pendingAlerts}
        />

        <StatCard
          icon={Activity}
          label="Risk Check-ins"
          value={stats.riskCheckins}
        />
      </div>
    </div>
  );
};

export default AdminHome;
