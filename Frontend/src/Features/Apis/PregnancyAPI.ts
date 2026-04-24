import axios, { type AxiosError } from 'axios';

const API_URL = 'http://localhost:5000/api/pregnancies'; // Ensure no trailing slash here

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

export const pregnancyApi = {
  create: async (data: { userId: number; lmpDate: string; pregnancyNumber?: number }) => {
    // FIX: Change '/' to '' to avoid the trailing slash 404
    const response = await apiClient.post('', data); 
    return response.data;
  },

  getActive: async (userId: number) => {
    const response = await apiClient.get(`/active/${userId}`);
    return response.data;
  },

  getByUser: async (userId: number) => {
    const response = await apiClient.get(`/user/${userId}`);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get(`/${id}`);
    return response.data;
  },

  update: async (id: number, updateData: any) => {
    const response = await apiClient.put(`/${id}`, updateData);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`/${id}`);
    return response.data;
  },

  getAll: async () => {
    // FIX: Change '/' to '' here as well
    const response = await apiClient.get('');
    return response.data;
  }
};

export default pregnancyApi;