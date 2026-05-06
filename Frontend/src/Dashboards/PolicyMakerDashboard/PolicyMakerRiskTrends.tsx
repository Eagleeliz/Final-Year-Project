import { useState, useEffect } from "react";
import {
  Loader2,
} from "lucide-react";
import dashboardApi from "../../Features/Apis/policyApi";

const PolicyMakerRiskTrends = () => {
  const midnightTeal = "#0B3B3F";

  const [riskTrends, setRiskTrends] = useState<any>(null);
  const [countyData, setCountyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [risks, counties] = await Promise.all([
          dashboardApi.getRiskTrends(),
          dashboardApi.getCountyBreakdown(),
        ]);
        setRiskTrends(risks);
        setCountyData(counties);
      } catch (error) {
        console.error("Failed to fetch risk data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const highRiskPregnancies = riskTrends?.highRiskPregnancies || 0;
  const riskCheckins = riskTrends?.riskFlaggedCheckins || 0;
  const totalNormal = Math.max(100 - highRiskPregnancies - riskCheckins, 0);
  const total = totalNormal + highRiskPregnancies + riskCheckins;
  const riskRate = total > 0 ? ((highRiskPregnancies + riskCheckins) / total) * 100 : 0;

  const riskData = [
    { level: "Normal", count: totalNormal, risk: 0 },
    { level: "Low Risk", count: riskCheckins, risk: 1 },
    { level: "High Risk", count: highRiskPregnancies, risk: 3 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-gray-400" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">
            Policy Maker
          </p>
          <h1 className="text-3xl font-black" style={{ color: midnightTeal }}>
            Risk Overview & Trends
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Maternal health risk assessment and trend analysis
          </p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Normal", value: totalNormal, color: "#2e6b38" },
          { label: "Low Risk", value: riskCheckins, color: "#dd6b20" },
          { label: "Pending Alerts", value: 0, color: "#c2410c" },
          { label: "High Risk", value: highRiskPregnancies, color: "#dc2626" },
        ].map((stat) => (
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
              <p className="text-4xl font-black" style={{ color: stat.color }}>
                {stat.value}
              </p>
              <p className="text-base font-bold uppercase tracking-wider text-gray-500 mt-2">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Overall Risk Rate */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 hover:shadow-lg transition-all duration-300" style={{ borderLeftColor: midnightTeal }}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Overall Risk Rate</h3>
            <p className="text-base text-gray-500">Percentage of at-risk pregnancies</p>
          </div>
          <p className="text-5xl font-black" style={{ color: midnightTeal }}>{riskRate.toFixed(1)}%</p>
        </div>
      </div>

      {/* Risk Distribution */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-lg transition-shadow">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Risk Distribution</h3>
        <div className="space-y-4">
          {riskData.map((item) => (
            <div key={item.level} className="flex items-center gap-4 group">
              <div className="w-28 text-base font-medium text-gray-700">{item.level}</div>
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300 group-hover:opacity-80"
                  style={{ width: `${total > 0 ? (item.count / total) * 100 : 0}%`, background: midnightTeal }}
                />
              </div>
              <div className="w-14 text-base font-bold text-gray-800 text-right">{item.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* County Risk Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-lg transition-shadow">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800">Risk by County</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-bold uppercase text-gray-400">County</th>
                <th className="px-6 py-3 text-left text-sm font-bold uppercase text-gray-400">Users</th>
                <th className="px-6 py-3 text-left text-sm font-bold uppercase text-gray-400">Pregnancies</th>
                <th className="px-6 py-3 text-left text-sm font-bold uppercase text-gray-400">Mothers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {countyData.length > 0 ? (
                countyData.map((row: any) => (
                  <tr key={row.county} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-base font-medium text-gray-800">{row.county}</td>
                    <td className="px-6 py-4 text-base text-green-600">{row.users}</td>
                    <td className="px-6 py-4 text-base text-gray-600">{row.pregnancies}</td>
                    <td className="px-6 py-4 text-base text-gray-600">{row.mothers}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                    No county data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PolicyMakerRiskTrends;