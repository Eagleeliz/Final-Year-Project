import axios from "axios";
import { weeklyCheckinApi } from "./WeeklyCheckinAPI";
import { pregnancyApi } from "./PregnancyAPI";

// ── Helper: clean token from localStorage ─────────────────────
// Token gets stored with extra quotes — strip them before use
const getCleanToken = (): string | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  return token.replace(/^"|"$/g, "").trim();
};

// ── Base clients ──────────────────────────────────────────────

const usersClient = axios.create({
  baseURL: "http://localhost:5000/api/users",
  headers: { "Content-Type": "application/json" },
});

const emergencyClient = axios.create({
  baseURL: "http://localhost:5000/api/emergency",
  headers: { "Content-Type": "application/json" },
});

// Auto-attach clean token to all clients
const attachToken = (client: any) => {
  client.interceptors.request.use((config: any) => {
    const token = getCleanToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
};

[usersClient, emergencyClient].forEach(attachToken);

// ── Types ─────────────────────────────────────────────────────

export interface AdminUser {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  county?: string;
  userType: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt?: string;
}

export interface AdminPregnancy {
  id: number;
  userId: number;
  lmpDate: string;
  eddDate: string;
  isActive: boolean;
  outcome: string;
  currentTrimester?: number;
  createdAt?: string;
}

export interface AdminEmergencyAlert {
  id: number;
  userId: number;
  alertType: string;
  severity: "medium" | "high" | "critical";
  description?: string;
  status: "pending" | "notified" | "responded" | "resolved";
  locationLat?: string;
  locationLong?: string;
  createdAt?: string;
  resolvedAt?: string;
}

export interface AdminCheckin {
  id: number;
  pregnancyId: number;
  weekNumber: number;
  riskFlag: boolean;
  riskReason?: string;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  weight?: string;
  createdAt?: string;
}

// ── Admin API ─────────────────────────────────────────────────

export const adminApi = {

  // ── Users ───────────────────────────────────────────────────
  // GET /api/users
  getAllUsers: async (): Promise<AdminUser[]> => {
    const response = await usersClient.get("");
    return response.data?.data ?? response.data;
  },

  // ── Pregnancies ─────────────────────────────────────────────
  // Reuses your existing pregnancyApi.getAll()
  // GET /api/pregnancies
  getAllPregnancies: async (): Promise<AdminPregnancy[]> => {
    const response = await pregnancyApi.getAll();
    return response?.data ?? response;
  },

  // ── Emergency Alerts ────────────────────────────────────────
  // GET /api/emergency/alerts/all
  getAllAlerts: async (): Promise<AdminEmergencyAlert[]> => {
    const response = await emergencyClient.get("/alerts/all");
    return response.data?.data ?? response.data;
  },

  // PATCH /api/emergency/alert/:id/status
  updateAlertStatus: async (
    id: number,
    status: "pending" | "notified" | "responded" | "resolved"
  ): Promise<AdminEmergencyAlert> => {
    const response = await emergencyClient.patch(`/alert/${id}/status`, { status });
    return response.data?.data ?? response.data;
  },

  // ── Weekly Check-ins ─────────────────────────────────────────
  // Reuses your existing weeklyCheckinApi.getAll()
  // GET /api/weeks
  getAllCheckins: async (): Promise<AdminCheckin[]> => {
    const response = await weeklyCheckinApi.getAll();
    return response?.data ?? response;
  },

};

export default adminApi;