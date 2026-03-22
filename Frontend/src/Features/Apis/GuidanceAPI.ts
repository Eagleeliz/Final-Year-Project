import axios from "axios";

const API_URL = "http://localhost:5000/api/guidance";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Auto-attach JWT — strips extra quotes from localStorage
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    const cleanToken = token.replace(/^"|"$/g, "").trim();
    config.headers.Authorization = `Bearer ${cleanToken}`;
  }
  return config;
});

// ── Types ─────────────────────────────────────────────────────

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

// ── API Methods ───────────────────────────────────────────────

export const guidanceApi = {
  // GET /api/guidance/week/all
  getAll: async (): Promise<PregnancyGuidance[]> => {
    const response = await apiClient.get<GuidanceAllResponse>("/week/all");
    return response.data.data;
  },

  // GET /api/guidance/week/:weekNumber
  getByWeek: async (weekNumber: number): Promise<PregnancyGuidance> => {
    const response = await apiClient.get<GuidanceWeekResponse>(`/week/${weekNumber}`);
    return response.data.data;
  },

  // POST /api/guidance
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

  // PUT /api/guidance/:id
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

  // DELETE /api/guidance/:id
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/${id}`);
  },
};

export default guidanceApi;