import axios from "axios";
import { backend_url } from "../../backend.url";

const API_URL = `${backend_url}/api/guidance`;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    const cleanToken = token.replace(/^"|"$/g, "").trim();
    config.headers.Authorization = `Bearer ${cleanToken}`;
  }
  return config;
});

export interface PregnancyGuidance {
  id: number;
  weekNumber: number;
  title: string;
  summary: string;
  tips: string;
  source: string;
  link?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface GuidanceAllResponse {
  success: boolean;
  count: number;
  data: PregnancyGuidance[];
}

export interface GuidanceWeekResponse {
  success: boolean;
  data: PregnancyGuidance;
}

export const guidanceApi = {
  getAll: async (): Promise<PregnancyGuidance[]> => {
    const response = await apiClient.get<GuidanceAllResponse>("/week/all");
    return response.data.data;
  },

  getByWeek: async (weekNumber: number): Promise<PregnancyGuidance> => {
    const response = await apiClient.get<GuidanceWeekResponse>(`/week/${weekNumber}`);
    return response.data.data;
  },

  create: async (data: {
    weekNumber: number;
    title: string;
    summary: string;
    tips: string;
    source: string;
    link?: string;
  }): Promise<PregnancyGuidance> => {
    const response = await apiClient.post("/", data);
    return response.data.data;
  },

  update: async (
    id: number,
    data: Partial<{
      title: string;
      summary: string;
      tips: string;
      source: string;
      link: string;
    }>
  ): Promise<PregnancyGuidance> => {
    const response = await apiClient.put(`/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/${id}`);
  },
};

export default guidanceApi;