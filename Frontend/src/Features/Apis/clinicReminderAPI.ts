import axios from "axios";

const API_URL = "http://localhost:5000/api/clinic-reminders";

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

export const clinicReminderApi = {
  /**
   * Create a new reminder
   */
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

  /**
   * Update reminder
   * FIXED: Added userId to the allowed properties in the type definition
   */
  update: async (id: number, updateData: Partial<{
    title: string;
    appointmentDate: string | Date;
    notes?: string;
    description?: string;
    status?: "pending" | "completed";
    userId: number; // <--- ADDED THIS LINE
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