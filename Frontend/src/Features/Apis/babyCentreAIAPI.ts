import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Auto-attach JWT token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Types ─────────────────────────────────────────────────────

export interface HealthTip {
  id: number;
  category: "pregnancy" | "postnatal" | "newborn" | "toddler";
  title: string;
  content: string;
  targetTrimester?: number | null;
  targetAgeMonths?: number | null;
  isActive: boolean;
  createdAt?: string;
}

export interface AIResponse {
  success: boolean;
  answer: string;
}

// ── Health Tips API ───────────────────────────────────────────

export const babyCentreAIAPI = {
  // GET /api/health-tips/all
  getAll: async (): Promise<HealthTip[]> => {
    const response = await apiClient.get("/health-tips/all");
    return response.data.data;
  },

  // GET /api/health-tips/category/:category
  getByCategory: async (category: string): Promise<HealthTip[]> => {
    const response = await apiClient.get(`/health-tips/category/${category}`);
    return response.data.data;
  },

  // GET /api/health-tips/trimester/:trimester
  getByTrimester: async (trimester: number): Promise<HealthTip[]> => {
    const response = await apiClient.get(`/health-tips/trimester/${trimester}`);
    return response.data.data;
  },
};

// ── Groq AI API ───────────────────────────────────────────────

export const groqApi = {
  // POST /api/ai/ask
  ask: async (question: string): Promise<string> => {
    const response = await apiClient.post<AIResponse>("/ai/ask", { question });
    return response.data.answer;
  },
};

export default babyCentreAIAPI;