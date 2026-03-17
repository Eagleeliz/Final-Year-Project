import axios from "axios";

const API_URL = "http://localhost:5000/api/guidance";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach JWT token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types matching your schema
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
  /**
   * Get all pregnancy guidance (weeks 1–40)
   * GET /api/guidance/week/all
   */
  getAll: async (): Promise<PregnancyGuidance[]> => {
    const response = await apiClient.get<GuidanceAllResponse>("/week/all");
    return response.data.data;
  },

  /**
   * Get guidance for a specific week
   * GET /api/guidance/week/:weekNumber
   */
  getByWeek: async (weekNumber: number): Promise<PregnancyGuidance> => {
    const response = await apiClient.get<GuidanceWeekResponse>(
      `/week/${weekNumber}`
    );
    return response.data.data;
  },
};

export default guidanceApi;