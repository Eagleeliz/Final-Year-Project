import { useState, useEffect } from "react";
import {
  Users,
  Baby,
  AlertTriangle,
  Activity,
  TrendingUp,
  Loader2,
} from "lucide-react";
import dashboardApi from "../../Features/Apis/dashboardApi";

const PolicyMakerHome = () => {
  const midnightTeal = "#0B3B3F";

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [riskTrends, setRiskTrends] = useState<any>(null);
  const [registrationStats, setRegistrationStats] = useState<Array<{ month: string; count: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const summary = await dashboardApi.getNationalSummary();
        const risks = await dashboardApi.getRiskTrends();
        const stats = await dashboardApi.getStats();
        setDashboardData(summary);
        setRiskTrends(risks);
        setRegistrationStats(stats.userRegistrationStats || []);
      } catch (error: any) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: "Total Users", value: dashboardData?.totalUsers || 0, icon: Users, bg: "#e6f7f9", color: midnightTeal },
    { label: "Active Pregnancies", value: dashboardData?.activePregnancies || 0, icon: Baby, bg: "#f0fdf4", color: "#2e6b38" },
    { label: "Pending Alerts", value: 0, icon: AlertTriangle, bg: "#fff7ed", color: "#c2410c" },
    { label: "Risk Check-ins", value: riskTrends?.riskFlaggedCheckins || 0, icon: Activity, bg: "#faf5ff", color: "#7c3aed" },
  ];

  const quickInsights = [
    { label: "Delivered", value: dashboardData?.delivered || 0 },
    { label: "Miscarriage", value: dashboardData?.miscarriage || 0 },
    { label: "Health Workers", value: dashboardData?.healthWorkers || 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">
            Policy Maker
          </p>
          <h1 className="text-3xl font-black" style={{ color: midnightTeal }}>
            Policy Dashboard Overview
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Key insights for maternal health policy making
          </p>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-gray-400" size={40} />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white p-6 rounded-2xl shadow-sm border-l-4 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer relative overflow-hidden"
                style={{ borderLeftColor: stat.color }}
              >
                <div 
                  className="absolute inset-0 opacity-5"
                  style={{ 
                    background: `linear-gradient(135deg, ${stat.color} 0%, transparent 50%)`
                  }}
                />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div 
                      className="p-3 rounded-xl"
                      style={{ background: stat.bg }}
                    >
                      <stat.icon size={24} style={{ color: stat.color }} />
                    </div>
                  </div>
                  <p className="text-4xl font-black" style={{ color: stat.color }}>
                    {stat.value.toLocaleString()}
                  </p>
                  <p className="text-base font-bold uppercase tracking-wider text-gray-500 mt-2">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Insights */}
          <div className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="text-gray-400" size={22} />
              <h2 className="text-xl font-bold text-gray-800">
                Key Insights
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {quickInsights.map((insight) => (
                <div key={insight.label} className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <p className="text-base text-gray-500 mb-1">{insight.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{insight.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Registration Trend Chart */}
          <div className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="text-gray-400" size={22} />
              <h2 className="text-xl font-bold text-gray-800">
                User Registration Trend
              </h2>
            </div>
            <div className="space-y-3">
              {registrationStats.length > 0 ? (
                registrationStats.map((stat, index) => {
                  const maxCount = Math.max(...registrationStats.map(s => s.count));
                  const percentage = maxCount > 0 ? (stat.count / maxCount) * 100 : 0;
                  return (
                    <div key={index} className="flex items-center gap-4">
                      <span className="w-16 text-sm font-medium text-gray-600 text-right">
                        {stat.month}
                      </span>
                      <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden">
                        <div 
                          className="h-full rounded-lg transition-all duration-500"
                          style={{ 
                            width: `${percentage}%`, 
                            backgroundColor: midnightTeal 
                          }}
                        />
                      </div>
                      <span className="w-12 text-sm font-bold text-gray-800">
                        {stat.count}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-400 text-center py-8">No registration data available</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PolicyMakerHome;