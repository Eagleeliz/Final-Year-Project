import { useState, useEffect } from "react";
import {
  Users,
  Baby,
  AlertTriangle,
  Activity,
  TrendingUp,
  Loader2,
} from "lucide-react";
import dashboardApi from "../../Features/Apis/policyAPI";

const PolicyMakerHome = () => {
  const midnightTeal = "#0B3B3F";

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [riskTrends, setRiskTrends] = useState<any>(null);
  const [registrationStats, setRegistrationStats] = useState<Array<{ month: string; count: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summary, risks, stats] = await Promise.all([
          dashboardApi.getNationalSummary(),
          dashboardApi.getRiskTrends(),
          dashboardApi.getStats(),
        ]);
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

  const statCards = [
    { label: "Total Users",        value: dashboardData?.totalUsers       || 0, icon: Users,         bg: "#e6f7f9", color: midnightTeal },
    { label: "Active Pregnancies", value: dashboardData?.activePregnancies || 0, icon: Baby,          bg: "#f0fdf4", color: "#2e6b38"   },
    { label: "High Risk Cases",    value: riskTrends?.highRiskPregnancies  || 0, icon: AlertTriangle, bg: "#fff7ed", color: "#c2410c"   },
    { label: "Risk Check-ins",     value: riskTrends?.riskFlaggedCheckins  || 0, icon: Activity,      bg: "#faf5ff", color: "#7c3aed"   },
  ];

  const quickInsights = [
    { label: "Delivered",      value: dashboardData?.delivered     || 0 },
    { label: "Miscarriage",    value: dashboardData?.miscarriage   || 0 },
    { label: "Health Workers", value: dashboardData?.healthWorkers || 0 },
  ];

  const maxCount = registrationStats.length > 0
    ? Math.max(...registrationStats.map((s) => s.count), 1)
    : 1;

  const totalRegistrations = registrationStats.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="space-y-6">

      {/* Header */}
      <header>
        <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Policy Maker</p>
        <h1 className="text-3xl font-black" style={{ color: midnightTeal }}>Policy Dashboard Overview</h1>
        <p className="text-gray-400 text-sm mt-1">Key insights for maternal health policy making</p>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-gray-400" size={40} />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat) => (
              <div
                key={stat.label}
                className="bg-white p-6 rounded-2xl shadow-sm border-l-4 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer relative overflow-hidden"
                style={{ borderLeftColor: stat.color }}
              >
                <div
                  className="absolute inset-0 opacity-5"
                  style={{ background: `linear-gradient(135deg, ${stat.color} 0%, transparent 50%)` }}
                />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl" style={{ background: stat.bg }}>
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
              <h2 className="text-xl font-bold text-gray-800">Key Insights</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {quickInsights.map((insight) => (
                <div
                  key={insight.label}
                  className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <p className="text-base text-gray-500 mb-1">{insight.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{insight.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart — Jan to Dec */}
          <div className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="text-gray-400" size={22} />
                <div>
                  <h2 className="text-xl font-bold text-gray-800">User Registration Trend</h2>
                  <p className="text-sm text-gray-400 mt-0.5">Monthly registrations — Jan to Dec</p>
                </div>
              </div>
              {registrationStats.length > 0 && (
                <div className="text-right">
                  <p className="text-2xl font-black" style={{ color: midnightTeal }}>
                    {totalRegistrations.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Total</p>
                </div>
              )}
            </div>

            {registrationStats.length === 0 ? (
              <p className="text-gray-400 text-center py-12">No registration data available</p>
            ) : (
              <>
                {/* Chart */}
                <div className="flex items-end justify-between gap-2 px-2" style={{ height: "200px" }}>
                  {registrationStats.map((stat) => {
                    const heightPct = (stat.count / maxCount) * 100;
                    return (
                      <div
                        key={stat.month}
                        className="flex-1 flex flex-col items-center gap-1 h-full justify-end group"
                      >
                        {/* Count — visible on hover */}
                        <span
                          className="text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          style={{ color: midnightTeal }}
                        >
                          {stat.count}
                        </span>

                        {/* Bar */}
                        <div className="w-full flex items-end" style={{ height: "160px" }}>
                          <div
                            className="w-full rounded-t-md transition-all duration-700 ease-out"
                            style={{
                              height: `${Math.max(heightPct, 2)}%`,
                              backgroundColor: midnightTeal,
                              minHeight: "4px",
                            }}
                          />
                        </div>

                        {/* Month label */}
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                          {stat.month}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Y-axis guides */}
                <div className="mt-3 flex justify-between text-xs text-gray-300 font-medium px-2">
                  <span>0</span>
                  <span>{Math.round(maxCount / 2)}</span>
                  <span>{maxCount}</span>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PolicyMakerHome;