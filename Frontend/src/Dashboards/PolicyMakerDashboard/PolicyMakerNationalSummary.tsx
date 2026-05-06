import { useState, useEffect } from "react";
import { Map, Users, ChevronDown, X, Loader2, AlertTriangle } from "lucide-react";
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

interface LocationUser {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  userType: string | null;
  county: string | null;
  constituency: string | null;
  ward: string | null;
}

const PolicyMakerNationalSummary = () => {
  const midnightTeal = "#0B3B3F";
  const API_KEY = "keyPub1569gsvndc123kg9sjhg";
  const BASE_URL = "https://kenyaareadata.vercel.app/api/areas";

  const kenyanCounties = [
    "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita-Taveta", "Garissa",
    "Wajir", "Mandera", "Marsabit", "Isiolo", "Meru", "Tharaka-Nithi", "Embu",
    "Kitui", "Machakos", "Makueni", "Nyandarua", "Nyeri", "Kirinyaga", "Murang'a",
    "Kiambu", "Turkana", "West Pokot", "Samburu", "Trans Nzoia", "Uasin Gishu",
    "Elgeyo-Marakwet", "Nandi", "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado",
    "Kericho", "Bomet", "Kakamega", "Vihiga", "Bungoma", "Busia", "Siaya", "Kisumu",
    "Homa Bay", "Migori", "Kisii", "Nyamira", "Nairobi",
  ];

  // ── State ─────────────────────────────────────────────────────────────────
  const [nationalSummary, setNationalSummary]   = useState<NationalSummary | null>(null);
  const [, setLocationSummary]   = useState<NationalSummary | null>(null);
  const [riskTrends, setRiskTrends]             = useState<RiskTrends | null>(null);
  const [countyData, setCountyData]             = useState<CountyData[]>([]);
  const [locationUsers, setLocationUsers]       = useState<LocationUser[]>([]);

  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [loadingUsers, setLoadingUsers]         = useState(false);
  const [loadingConstituency, setLoadingConstituency] = useState(false);
  const [loadingWard, setLoadingWard]           = useState(false);

  const [selectedCounty, setSelectedCounty]           = useState("");
  const [selectedConstituency, setSelectedConstituency] = useState("");
  const [selectedWard, setSelectedWard]               = useState("");
  const [constituencies, setConstituencies]           = useState<string[]>([]);
  const [wards, setWards]                             = useState<string[]>([]);

  // ── Initial load ──────────────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      try {
        setLoadingDashboard(true);
        const [summary, trends, county, allUsers] = await Promise.all([
          dashboardApi.getNationalSummary(),
          dashboardApi.getRiskTrends(),
          dashboardApi.getCountyBreakdown(),
          dashboardApi.getUsersByLocation(),
        ]);
        setNationalSummary(summary);
        setRiskTrends(trends);
        setCountyData(county);
        setLocationUsers(Array.isArray(allUsers) ? allUsers : []);
      } catch {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoadingDashboard(false);
      }
    };
    init();
  }, []);

  // ── Constituencies when county changes ────────────────────────────────────
  useEffect(() => {
    if (!selectedCounty) {
      setConstituencies([]);
      setWards([]);
      setSelectedConstituency("");
      setSelectedWard("");
      return;
    }
    setSelectedConstituency("");
    setSelectedWard("");
    setWards([]);
    setLoadingConstituency(true);
    fetch(`${BASE_URL}?apiKey=${API_KEY}&county=${encodeURIComponent(selectedCounty)}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data) => setConstituencies(Object.keys(data[selectedCounty] || {})))
      .catch(() => toast.error("Could not load constituencies"))
      .finally(() => setLoadingConstituency(false));
  }, [selectedCounty]);

  // ── Wards when constituency changes ───────────────────────────────────────
  useEffect(() => {
    if (!selectedConstituency || !selectedCounty) {
      setWards([]);
      setSelectedWard("");
      return;
    }
    setSelectedWard("");
    setLoadingWard(true);
    fetch(`${BASE_URL}?apiKey=${API_KEY}&county=${encodeURIComponent(selectedCounty)}&constituency=${encodeURIComponent(selectedConstituency)}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data) => setWards(data[selectedCounty]?.[selectedConstituency] || []))
      .catch(() => toast.error("Could not load wards"))
      .finally(() => setLoadingWard(false));
  }, [selectedConstituency, selectedCounty]);

  // ── Users + location summary whenever location changes ────────────────────
  useEffect(() => {
    const fetchByLocation = async () => {
      setLoadingUsers(true);
      try {
        const params = {
          county:       selectedCounty       || undefined,
          constituency: selectedConstituency || undefined,
          ward:         selectedWard         || undefined,
        };

        const [users, summary] = await Promise.all([
          dashboardApi.getUsersByLocation(params),
          selectedCounty
            ? dashboardApi.getNationalSummary(params)
            : Promise.resolve(null),
        ]);

        setLocationUsers(Array.isArray(users) ? users : []);
        setLocationSummary(summary);
      } catch {
        toast.error("Failed to fetch location data");
        setLocationUsers([]);
        setLocationSummary(null);
      } finally {
        setLoadingUsers(false);
      }
    };

    const timer = setTimeout(fetchByLocation, 300);
    return () => clearTimeout(timer);
  }, [selectedCounty, selectedConstituency, selectedWard]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const clearFilters = () => {
    setSelectedCounty("");
    setSelectedConstituency("");
    setSelectedWard("");
    setConstituencies([]);
    setWards([]);
    setLocationSummary(null);
  };

  const hasFilters = selectedCounty || selectedConstituency || selectedWard;

  const locationLabel = selectedWard
    ? `${selectedWard}, ${selectedConstituency}, ${selectedCounty} County`
    : selectedConstituency
    ? `${selectedConstituency}, ${selectedCounty} County`
    : selectedCounty
    ? `${selectedCounty} County`
    : "All of Kenya";

  // Stats cards always use nationalSummary — never affected by location filters
  const stats = loadingDashboard
    ? []
    : [
        { label: "Total Users",       value: nationalSummary?.totalUsers      ?? 0, color: midnightTeal },
        { label: "Total Pregnancies", value: nationalSummary?.totalPregnancies ?? 0, color: "#1a5f6a"   },
        { label: "High Risk Cases",   value: riskTrends?.highRiskPregnancies   ?? 0, color: "#dc2626"   },
        { label: "Risk Check-ins",    value: riskTrends?.riskFlaggedCheckins   ?? 0, color: "#f59e0b"   },
      ];

  // ── Reusable select wrapper ───────────────────────────────────────────────
  const SelectField = ({
    label, value, onChange, disabled, loading, children,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    disabled?: boolean;
    loading?: boolean;
    children: React.ReactNode;
  }) => (
    <div>
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || loading}
          className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-[#0B3B3F] outline-none appearance-none bg-white text-gray-800 pr-10 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          {children}
        </select>
        {loading
          ? <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin pointer-events-none" size={18} />
          : <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
        }
      </div>
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Header */}
      <header>
        <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Policy Maker</p>
        <h1 className="text-3xl font-black" style={{ color: midnightTeal }}>National Summary</h1>
        <p className="text-gray-400 text-sm mt-1">Nationwide maternal health data overview</p>
      </header>

      {/* Stats Grid — always shows national totals */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loadingDashboard ? (
          <div className="col-span-4 flex items-center justify-center py-8">
            <Loader2 className="animate-spin text-gray-400" size={32} />
          </div>
        ) : (
          stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white p-6 rounded-2xl shadow-sm border-l-4 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
              style={{ borderLeftColor: stat.color }}
            >
              <div className="absolute inset-0 opacity-5" style={{ background: `linear-gradient(135deg, ${stat.color} 0%, transparent 50%)` }} />
              <div className="relative z-10">
                <p className="text-4xl font-black" style={{ color: stat.color }}>{stat.value.toLocaleString()}</p>
                <p className="text-base font-bold uppercase tracking-wider text-gray-500 mt-2">{stat.label}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Location Selector Card */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center gap-3 mb-6">
          <Map className="text-gray-400" size={22} />
          <h2 className="text-xl font-bold text-gray-800">Location-based User Statistics</h2>
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SelectField label="County" value={selectedCounty} onChange={setSelectedCounty}>
            <option value="">All Counties</option>
            {kenyanCounties.map((c) => <option key={c} value={c}>{c}</option>)}
          </SelectField>

          <SelectField
            label="Constituency"
            value={selectedConstituency}
            onChange={setSelectedConstituency}
            disabled={!selectedCounty}
            loading={loadingConstituency}
          >
            <option value="">All Constituencies</option>
            {constituencies.map((c) => <option key={c} value={c}>{c}</option>)}
          </SelectField>

          <SelectField
            label="Ward"
            value={selectedWard}
            onChange={setSelectedWard}
            disabled={!selectedConstituency}
            loading={loadingWard}
          >
            <option value="">All Wards</option>
            {wards.map((w) => <option key={w} value={w}>{w}</option>)}
          </SelectField>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              disabled={!hasFilters}
              className="w-full p-3 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <X size={18} /> Clear Filters
            </button>
          </div>
        </div>

        {/* Location bar */}
        <div className="mt-4 p-4 bg-gray-50 rounded-xl flex items-center justify-between flex-wrap gap-2">
          <p className="text-sm text-gray-600">
            <span className="font-bold">Location:</span> {locationLabel}
          </p>
          <div className="flex items-center gap-2">
            <Users size={18} className="text-gray-400" />
            <span className="text-2xl font-black" style={{ color: midnightTeal }}>
              {loadingUsers ? "..." : locationUsers.length}
            </span>
            <span className="text-sm text-gray-500">users</span>
          </div>
        </div>

        {/* Users List */}
        <div className="mt-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Registered Users</h3>

          {loadingUsers ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>
          ) : locationUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Users size={48} className="mx-auto mb-3 opacity-50" />
              <p>No users found for this location</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {locationUsers.slice(0, 20).map((user) => (
                  <div key={user.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
                      style={{ background: midnightTeal }}
                    >
                      {user.firstName?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      <p className="text-xs text-gray-400 truncate">
                        {[user.ward, user.constituency, user.county].filter(Boolean).join(", ") || "No location set"}
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs font-bold rounded-lg bg-[#e6f7f9] text-[#0B3B3F] capitalize flex-shrink-0">
                      {user.userType?.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
              {locationUsers.length > 20 && (
                <p className="text-center text-sm text-gray-500 py-2">
                  Showing 20 of {locationUsers.length} users
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* County Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-lg transition-shadow">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800">County Data</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-bold uppercase text-gray-400">County</th>
                <th className="px-6 py-3 text-left text-sm font-bold uppercase text-gray-400">Users</th>
                <th className="px-6 py-3 text-left text-sm font-bold uppercase text-gray-400">Pregnancies</th>
                <th className="px-6 py-3 text-left text-sm font-bold uppercase text-gray-400">Mothers</th>
                <th className="px-6 py-3 text-left text-sm font-bold uppercase text-gray-400">Health Workers</th>
                <th className="px-6 py-3 text-left text-sm font-bold uppercase text-gray-400">Risk Cases</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {countyData.length > 0 ? (
                countyData.map((row) => (
                  <tr key={row.county} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-base font-medium text-gray-800">{row.county}</td>
                    <td className="px-6 py-4 text-base text-gray-600">{row.users}</td>
                    <td className="px-6 py-4 text-base text-gray-600">{row.pregnancies}</td>
                    <td className="px-6 py-4 text-base text-gray-600">{row.mothers}</td>
                    <td className="px-6 py-4 text-base text-gray-600">{row.healthWorkers}</td>
                    <td className="px-6 py-4 text-base font-semibold">
                      {row.riskCases > 0 ? (
                        <span className="flex items-center gap-1 text-red-600">
                          <AlertTriangle size={14} /> {row.riskCases}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
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

export default PolicyMakerNationalSummary;