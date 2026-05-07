import axios from 'axios';
import { backend_url } from "../../backend.url";

const API_URL = `${backend_url}/api/weeks`;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    const cleanToken = token.replace(/^"|"$/g, '').trim();
    config.headers.Authorization = `Bearer ${cleanToken}`;
  }
  return config;
});

export const weeklyCheckinApi = {
  create: async (data: any) => {
    const response = await apiClient.post('', data);
    return response.data;
  },

  getAll: async () => {
    const response = await apiClient.get('');
    return response.data;
  },

  getSummary: async (pregnancyId: number) => {
    const response = await apiClient.get(`/summary/${pregnancyId}`);
    return response.data;
  },

  getByPregnancy: async (pregnancyId: number) => {
    const response = await apiClient.get(`/pregnancy/${pregnancyId}`);
    return response.data;
  },

  getByWeek: async (pregnancyId: number, weekNumber: number) => {
    const response = await apiClient.get(`/week/${pregnancyId}/${weekNumber}`);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get(`/${id}`);
    return response.data;
  },

  update: async (id: number, data: any) => {
    const response = await apiClient.put(`/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`/${id}`);
    return response.data;
  }
};

export default weeklyCheckinApi;