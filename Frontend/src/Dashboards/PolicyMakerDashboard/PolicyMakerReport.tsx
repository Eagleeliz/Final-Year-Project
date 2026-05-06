import { useState, useEffect } from "react";
import { Download, Loader2, Map, AlertTriangle, Users } from "lucide-react";
import { toast } from "sonner";
import dashboardApi from "../../Features/Apis/policyApi";

interface NationalSummary {
  totalUsers: number;
  totalPregnancies: number;
  activePregnancies: number;
  delivered: number;
  miscarriage: number;
  terminated: number;
  mothers: number;
  healthWorkers: number;
  policymakers: number;
}

interface RiskTrends {
  highRiskPregnancies: number;
  riskFlaggedCheckins: number;
}

interface CountyData {
  county: string;
  users: number;
  pregnancies: number;
  mothers: number;
  healthWorkers: number;
  riskCases: number;
}

const PolicyMakerReport = () => {
  const midnightTeal = "#0B3B3F";
  const [loading, setLoading] = useState(true);
  const [nationalSummary, setNationalSummary] = useState<NationalSummary | null>(null);
  const [riskTrends, setRiskTrends] = useState<RiskTrends | null>(null);
  const [countyData, setCountyData] = useState<CountyData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [summary, risks, counties] = await Promise.all([
          dashboardApi.getNationalSummary(),
          dashboardApi.getRiskTrends(),
          dashboardApi.getCountyBreakdown(),
        ]);
        setNationalSummary(summary);
        setRiskTrends(risks);
        setCountyData(counties || []);
      } catch {
        toast.error("Failed to load report data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const highRisk = riskTrends?.highRiskPregnancies || 0;
  const riskCheckins = riskTrends?.riskFlaggedCheckins || 0;
  const totalNormal = Math.max(100 - highRisk - riskCheckins, 0);
  const total = totalNormal + highRisk + riskCheckins;
  const riskRate = total > 0 ? ((highRisk + riskCheckins) / total) * 100 : 0;

  const handleDownload = () => {
    const reportContent = document.getElementById("report-content");
    if (!reportContent) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>BabyCentre Maternal Health Report</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; }
          h1 { color: #0B3B3F; font-size: 28px; margin-bottom: 8px; }
          h2 { color: #0B3B3F; font-size: 20px; margin: 24px 0 12px 0; border-bottom: 2px solid #0B3B3F; padding-bottom: 8px; }
          h3 { color: #333; font-size: 16px; margin: 16px 0 8px 0; }
          p { color: #666; font-size: 14px; margin-bottom: 4px; }
          .header { text-align: center; border-bottom: 3px solid #0B3B3F; padding-bottom: 20px; margin-bottom: 30px; }
          .date { color: #999; font-size: 12px; }
          .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 20px 0; }
          .stat-box { background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; }
          .stat-value { font-size: 32px; font-weight: bold; color: #0B3B3F; }
          .stat-label { font-size: 12px; color: #666; text-transform: uppercase; }
          .stat-box.green .stat-value { color: #2e6b38; }
          .stat-box.red .stat-value { color: #dc2626; }
          .breakdown-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 20px 0; }
          .breakdown-box { background: #f5f5f5; padding: 16px; border-radius: 8px; text-align: center; }
          .risk-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 20px 0; }
          .risk-box { padding: 16px; border-radius: 8px; text-align: center; border-left: 4px solid; }
          .risk-box.green { background: #f0fdf4; border-color: #2e6b38; }
          .risk-box.orange { background: #fff7ed; border-color: #dd6b20; }
          .risk-box.red { background: #fef2f2; border-color: #dc2626; }
          .risk-box.gray { background: #f5f5f5; border-color: #666; }
          .risk-value { font-size: 24px; font-weight: bold; }
          .risk-box.green .risk-value { color: #2e6b38; }
          .risk-box.orange .risk-value { color: #dd6b20; }
          .risk-box.red .risk-value { color: #dc2626; }
          .risk-box.gray .risk-value { color: #0B3B3F; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 12px; }
          th { background-color: #f5f5f5; font-weight: bold; }
          td.right { text-align: right; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 10px; color: #999; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        ${reportContent.innerHTML}
        <div class="footer">
          <p>BabyCentre Maternal Health System - Report generated on ${new Date().toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `BabyCentre_Report_${new Date().toISOString().split("T")[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Report downloaded successfully");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-gray-400" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Download Button */}
      <div className="flex justify-end">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-[#0B3B3F] text-white rounded-lg hover:bg-[#0a3236] transition-colors"
        >
          <Download size={18} />
          Download Report
        </button>
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-2xl shadow-sm border p-6" id="report-content">
        <div className="text-center border-b pb-4 mb-6">
          <h1 className="text-2xl font-black" style={{ color: midnightTeal }}>
            BabyCentre Maternal Health Report
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Generated on {new Date().toLocaleDateString("en-KE", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </p>
        </div>

        {/* National Overview */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Users size={20} className="text-gray-400" />
            National Overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-3xl font-black" style={{ color: midnightTeal }}>
                {nationalSummary?.totalUsers || 0}
              </p>
              <p className="text-sm text-gray-500">Total Users</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-3xl font-black" style={{ color: midnightTeal }}>
                {nationalSummary?.totalPregnancies || 0}
              </p>
              <p className="text-sm text-gray-500">Total Pregnancies</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl">
              <p className="text-3xl font-black text-green-600">
                {nationalSummary?.delivered || 0}
              </p>
              <p className="text-sm text-gray-500">Delivered</p>
            </div>
            <div className="bg-red-50 p-4 rounded-xl">
              <p className="text-3xl font-black text-red-600">
                {(nationalSummary?.miscarriage || 0) + (nationalSummary?.terminated || 0)}
              </p>
              <p className="text-sm text-gray-500">High Risk Outcomes</p>
            </div>
          </div>
        </div>

        {/* User Breakdown */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">User Breakdown</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-gray-800">{nationalSummary?.mothers || 0}</p>
              <p className="text-sm text-gray-500">Mothers</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-gray-800">{nationalSummary?.healthWorkers || 0}</p>
              <p className="text-sm text-gray-500">Health Workers</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-gray-800">{nationalSummary?.policymakers || 0}</p>
              <p className="text-sm text-gray-500">Policy Makers</p>
            </div>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <AlertTriangle size={20} className="text-gray-400" />
            Risk Assessment
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-green-50 p-4 rounded-xl border-l-4 border-green-600">
              <p className="text-2xl font-black text-green-600">{totalNormal}</p>
              <p className="text-sm text-gray-500">Normal</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-xl border-l-4 border-orange-500">
              <p className="text-2xl font-black text-orange-500">{riskCheckins}</p>
              <p className="text-sm text-gray-500">Low Risk Check-ins</p>
            </div>
            <div className="bg-red-50 p-4 rounded-xl border-l-4 border-red-600">
              <p className="text-2xl font-black text-red-600">{highRisk}</p>
              <p className="text-sm text-gray-500">High Risk Pregnancies</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-gray-400">
              <p className="text-2xl font-black" style={{ color: midnightTeal }}>
                {riskRate.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-500">Overall Risk Rate</p>
            </div>
          </div>
        </div>

        {/* County Data Table */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Map size={20} className="text-gray-400" />
            County Data Summary
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left font-bold text-gray-600">County</th>
                  <th className="px-4 py-2 text-right font-bold text-gray-600">Users</th>
                  <th className="px-4 py-2 text-right font-bold text-gray-600">Pregnancies</th>
                  <th className="px-4 py-2 text-right font-bold text-gray-600">Mothers</th>
                  <th className="px-4 py-2 text-right font-bold text-gray-600">Health Workers</th>
                  <th className="px-4 py-2 text-right font-bold text-gray-600">Risk Cases</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {countyData.length > 0 ? (
                  countyData.map((row) => (
                    <tr key={row.county} className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium text-gray-800">{row.county}</td>
                      <td className="px-4 py-2 text-right text-gray-600">{row.users}</td>
                      <td className="px-4 py-2 text-right text-gray-600">{row.pregnancies}</td>
                      <td className="px-4 py-2 text-right text-gray-600">{row.mothers}</td>
                      <td className="px-4 py-2 text-right text-gray-600">{row.healthWorkers}</td>
                      <td className="px-4 py-2 text-right">
                        {row.riskCases > 0 ? (
                          <span className="text-red-600 font-semibold">{row.riskCases}</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-4 text-center text-gray-400">
                      No county data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t text-center text-xs text-gray-400">
          <p>BabyCentre Maternal Health System</p>
        </div>
      </div>
    </div>
  );
};

export default PolicyMakerReport;