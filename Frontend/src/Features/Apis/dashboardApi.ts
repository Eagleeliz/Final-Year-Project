import axios from 'axios';
import { backend_url } from "../../backend.url";

const API_URL = `${backend_url}/api`;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    const cleanToken = token.replace(/^"|$/g, '').trim();
    config.headers.Authorization = `Bearer ${cleanToken}`;
  }
  return config;
});

export interface DashboardStats {
  totalUsers: number;
  userCountByCounty: Record<string, number>;
  userRegistrationStats: Array<{ month: string; count: number }>;
  totalPregnancies: number;
  pregnancyCountByCounty: Record<string, number>;
  pregnancyOutcomeStats: { delivered: number; miscarriage: number; terminated: number };
  trimesterStats: { first: number; second: number; third: number };
  deliveryStats: Array<{ month: string; count: number }>;
  highRiskPregnancies: number;
  riskCountByCounty: Record<string, number>;
  riskCheckins: number;
  pendingEmergencies: number;
}

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

export interface RiskTrends {
  highRiskPregnancies: number;
  riskFlaggedCheckins: number;
}

export interface CountyData {
  county: string;
  users: number;
  pregnancies: number;
  mothers: number;
  healthWorkers: number;
}

const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get('/dashboard/stats');
    return response.data?.data ?? response.data;
  },

  getNationalSummary: async (params?: {
    county?: string;
    constituency?: string;
    ward?: string;
  }): Promise<NationalSummary> => {
    const queryParams = new URLSearchParams();
    if (params?.county) queryParams.append('county', params.county);
    if (params?.constituency) queryParams.append('constituency', params.constituency);
    if (params?.ward) queryParams.append('ward', params.ward);

    const response = await apiClient.get(`/dashboard/national-summary?${queryParams.toString()}`);
    return response.data?.data ?? response.data;
  },

  getRiskTrends: async (): Promise<RiskTrends> => {
    const response = await apiClient.get('/dashboard/risk-trends');
    return response.data?.data ?? response.data;
  },

  getCountyBreakdown: async (): Promise<CountyData[]> => {
    const response = await apiClient.get('/dashboard/county-breakdown');
    return response.data?.data ?? response.data;
  },

  getRegistrationStats: async (): Promise<Array<{ month: string; count: number }>> => {
    const response = await apiClient.get('/dashboard/stats');
    return response.data?.data?.userRegistrationStats ?? response.data?.userRegistrationStats ?? [];
  },
};

export default dashboardApi;