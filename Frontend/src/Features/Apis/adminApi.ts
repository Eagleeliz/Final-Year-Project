import axios from "axios";
import { weeklyCheckinApi } from "./WeeklyCheckinAPI";
import { pregnancyApi } from "./PregnancyAPI";

// ── Helper: clean token from localStorage ─────────────────────
const getCleanToken = (): string | null => {
  const storedToken = localStorage.getItem("token");

  if (!storedToken) return null;

  let token: string;

  try {
    token = JSON.parse(storedToken);
  } catch {
    token = storedToken.replace(/^"|"$/g, "").trim();
  }

  return token;
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

// ── Attach token interceptor ──────────────────────────────────
const attachToken = (client: any) => {
  console.log("Interceptor attached ✅");

  client.interceptors.request.use((config: any) => {
    console.log("Interceptor running 🔥");

    const token = getCleanToken();
    console.log("TOKEN:", token);

    // ensure headers exist
    config.headers = config.headers || {};

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });
};

// Apply interceptor
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
  getAllUsers: async (): Promise<AdminUser[]> => {
    const response = await usersClient.get("");
    return response.data?.data ?? response.data;
  },

  // ── Pregnancies ─────────────────────────────────────────────
  getAllPregnancies: async (): Promise<AdminPregnancy[]> => {
    const response = await pregnancyApi.getAll();
    return response?.data ?? response;
  },

  // ── Emergency Alerts ────────────────────────────────────────
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
  getAllCheckins: async (): Promise<AdminCheckin[]> => {
    const response = await weeklyCheckinApi.getAll();
    return response?.data ?? response;
  },

};

export default adminApi;