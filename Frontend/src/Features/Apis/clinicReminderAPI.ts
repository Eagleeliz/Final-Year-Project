import axios from "axios";
import { backend_url } from "../../backend.url";

const API_URL = `${backend_url}/api/clinic-reminders`;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const clinicReminderApi = {
  create: async (data: {
    title: string;
    appointmentDate: string | Date;
    userId: number;
    notes?: string;
    description?: string;
    pregnancyId?: number;
    facilityId?: number;
  }) => {
    const payload = {
      ...data,
      notes: data.notes || data.description,
    };
    const response = await apiClient.post("/", payload);
    return response.data;
  },

  getAll: async () => {
    const response = await apiClient.get("/all");
    return response.data;
  },

  getByUser: async (userId: number) => {
    const response = await apiClient.get(`/user/${userId}`);
    return response.data;
  },

  getById: async (id: number) => {
    const userId = localStorage.getItem("userId");
    const response = await apiClient.get(`/${id}?userId=${userId}`);
    return response.data;
  },

  update: async (id: number, updateData: Partial<{
    title: string;
    appointmentDate: string | Date;
    notes?: string;
    description?: string;
    status?: "pending" | "completed";
    userId: number;
  }>) => {
    const userId = localStorage.getItem("userId");
    const payload = {
      ...updateData,
      userId: Number(userId),
      notes: updateData.notes || updateData.description,
    };
    const response = await apiClient.put(`/${id}`, payload);
    return response.data;
  },

  delete: async (id: number) => {
    const userId = localStorage.getItem("userId");
    const response = await apiClient.delete(`/${id}?userId=${userId}`);
    return response.data;
  },
};

export default clinicReminderApi;