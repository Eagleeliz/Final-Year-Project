// src/Features/Apis/dashboardApi.ts

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface NationalSummary {
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

export interface RiskCase {
  pregnancyId: number;
  userId: number;
  weekNumber: number;
  riskReason: string;
  checkinDate: string;
  vaginalBleeding: boolean;
  blurredVision: boolean;
  severeHeadache: boolean;
  dizziness: boolean;
  swelling: boolean;
}

export interface RiskTrends {
  highRiskPregnancies: number;
  riskFlaggedCheckins: number;
  riskCases: RiskCase[];         // ← detailed list, filtered by location
}

export interface CountyData {
  county: string;
  users: number;
  pregnancies: number;
  mothers: number;
  healthWorkers: number;
  riskCases: number;             // ← now included
}

export interface LocationUser {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  userType: string | null;
  county: string | null;
  constituency: string | null;
  ward: string | null;
  createdAt: string | null;
}

export interface RegistrationStat {
  month: string;
  count: number;
}

export interface DashboardStats {
  userRegistrationStats: RegistrationStat[];
}

export interface LocationParams {
  county?: string;
  constituency?: string;
  ward?: string;
}

// ── Helper ────────────────────────────────────────────────────────────────────

const buildQuery = (params: Record<string, string | undefined>): string => {
  const filtered = Object.entries(params).filter(([, v]) => Boolean(v));
  if (filtered.length === 0) return "";
  return "?" + new URLSearchParams(filtered as [string, string][]).toString();
};

const handleResponse = async <T>(res: Response): Promise<T> => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
};

// ── API ───────────────────────────────────────────────────────────────────────

const dashboardApi = {
  /**
   * National (or location-filtered) summary stats.
   * GET /api/dashboard/national-summary?county=X&constituency=Y&ward=Z
   */
  getNationalSummary: async (params: LocationParams = {}): Promise<NationalSummary> => {
    const query = buildQuery(params as Record<string, string | undefined>);
    const res = await fetch(`${BASE_URL}/dashboard/national-summary${query}`);
    return handleResponse<NationalSummary>(res);
  },

  /**
   * Risk trends — NOW supports location filtering.
   * GET /api/dashboard/risk-trends?county=X&constituency=Y&ward=Z
   */
  getRiskTrends: async (params: LocationParams = {}): Promise<RiskTrends> => {
    const query = buildQuery(params as Record<string, string | undefined>);
    const res = await fetch(`${BASE_URL}/dashboard/risk-trends${query}`);
    return handleResponse<RiskTrends>(res);
  },

  /**
   * Registration trend (last 12 months).
   * GET /api/dashboard/stats
   */
  getStats: async (): Promise<DashboardStats> => {
    const res = await fetch(`${BASE_URL}/dashboard/stats`);
    return handleResponse<DashboardStats>(res);
  },

  /**
   * Per-county breakdown including riskCases count.
   * GET /api/dashboard/county-breakdown
   */
  getCountyBreakdown: async (): Promise<CountyData[]> => {
    const res = await fetch(`${BASE_URL}/dashboard/county-breakdown`);
    return handleResponse<CountyData[]>(res);
  },

  /**
   * Users filtered strictly by their stored county/constituency/ward.
   * Replaces getUsersByCounty / getUsersByConstituency / getUsersByWard calls.
   * GET /api/dashboard/users-by-location?county=X
   * GET /api/dashboard/users-by-location?county=X&constituency=Y
   * GET /api/dashboard/users-by-location?county=X&constituency=Y&ward=Z
   * GET /api/dashboard/users-by-location   (no params = all users)
   */
  getUsersByLocation: async (params: LocationParams = {}): Promise<LocationUser[]> => {
    const query = buildQuery(params as Record<string, string | undefined>);
    const res = await fetch(`${BASE_URL}/dashboard/users-by-location${query}`);
    return handleResponse<LocationUser[]>(res);
  },
};

export default dashboardApi;