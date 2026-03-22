import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api/emergency",
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

// ── Emergency Contact API ─────────────────────────────────────

export const emergencyContactApi = {
  // GET /api/emergency/contact/:userId
  getByUser: async (userId: number): Promise<EmergencyContact> => {
    const response = await apiClient.get(`/contact/${userId}`);
    return response.data.data;
  },

  // POST /api/emergency/contact
  create: async (data: {
    userId: number;
    name: string;
    phoneNumber: string;
    relationship?: string;
  }): Promise<EmergencyContact> => {
    const response = await apiClient.post("/contact", data);
    return response.data.data;
  },

  // PUT /api/emergency/contact/:id
  update: async (
    id: number,
    data: { name?: string; phoneNumber?: string; relationship?: string }
  ): Promise<EmergencyContact> => {
    const response = await apiClient.put(`/contact/${id}`, data);
    return response.data.data;
  },

  // DELETE /api/emergency/contact/:id
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/contact/${id}`);
  },
};

// ── Emergency Alert API ───────────────────────────────────────

export const emergencyAlertApi = {
  // POST /api/emergency/alert — trigger SOS
  create: async (data: {
    userId: number;
    pregnancyId?: number;
    alertType?: string;
    severity?: string;
    description?: string;
    locationLat?: number;
    locationLong?: number;
  }): Promise<EmergencyAlert> => {
    const response = await apiClient.post("/alert", data);
    return response.data.data;
  },
  // GET /api/emergency/alerts/all — admin only
getAllAlerts: async (): Promise<EmergencyAlert[]> => {
  const response = await apiClient.get("/alerts/all");
  return response.data?.data ?? response.data;
},
  // GET /api/emergency/alerts/:userId — alert history
  getByUser: async (userId: number): Promise<EmergencyAlert[]> => {
    const response = await apiClient.get(`/alerts/${userId}`);
    return response.data.data;
  },

  // PATCH /api/emergency/alert/:id/status
  updateStatus: async (
    id: number,
    status: "pending" | "notified" | "responded" | "resolved"
  ): Promise<EmergencyAlert> => {
    const response = await apiClient.patch(`/alert/${id}/status`, { status });
    return response.data.data;
  },
};

export default emergencyContactApi;