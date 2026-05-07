import axios from "axios";
import { backend_url } from "../../backend.url";

const apiClient = axios.create({
  baseURL: `${backend_url}/api/emergency`,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    const cleanToken = token.replace(/^"|"$/g, '').trim();
    config.headers.Authorization = `Bearer ${cleanToken}`;
  }
  return config;
});

export interface EmergencyContact {
  id: number;
  userId: number;
  name: string;
  phoneNumber: string;
  relationship?: string;
  isPrimary: boolean;
  createdAt?: string;
}

export interface EmergencyAlert {
  id: number;
  userId: number;
  alertType: string;
  severity: string;
  description?: string;
  locationLat?: string;
  locationLong?: string;
  status: "pending" | "notified" | "responded" | "resolved";
  createdAt?: string;
  resolvedAt?: string;
}

export interface CreateAlertResponse {
  alert: EmergencyAlert;
  smsSent: boolean;
  message: string;
}

export const emergencyContactApi = {
  getByUser: async (userId: number): Promise<EmergencyContact> => {
    const response = await apiClient.get(`/contact/${userId}`);
    return response.data.data;
  },

  create: async (data: {
    userId: number;
    name: string;
    phoneNumber: string;
    relationship?: string;
  }): Promise<EmergencyContact> => {
    const response = await apiClient.post("/contact", data);
    return response.data.data;
  },

  update: async (
    id: number,
    data: { name?: string; phoneNumber?: string; relationship?: string }
  ): Promise<EmergencyContact> => {
    const response = await apiClient.put(`/contact/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/contact/${id}`);
  },
};

export const emergencyAlertApi = {
  create: async (data: {
    userId: number;
    pregnancyId?: number;
    alertType?: string;
    severity?: string;
    description?: string;
    locationLat?: number;
    locationLong?: number;
  }): Promise<CreateAlertResponse> => {
    const response = await apiClient.post("/alert", data);
    return {
      alert: response.data.data,
      smsSent: response.data.smsSent,
      message: response.data.message,
    };
  },

  getAllAlerts: async (): Promise<EmergencyAlert[]> => {
    const response = await apiClient.get("/alerts/all");
    return response.data?.data ?? response.data;
  },

  getByUser: async (userId: number): Promise<EmergencyAlert[]> => {
    const response = await apiClient.get(`/alerts/${userId}`);
    return response.data.data;
  },

  updateStatus: async (
    id: number,
    status: "pending" | "notified" | "responded" | "resolved"
  ): Promise<EmergencyAlert> => {
    const response = await apiClient.patch(`/alert/${id}/status`, { status });
    return response.data.data;
  },
};

export default emergencyContactApi;