import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

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

export interface User {
  id: number;
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  county?: string;
  subCounty?: string;
  village?: string;
  userType: 'mother' | 'health_worker' | 'admin' | 'policy_maker';
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
}

export interface CreateUserPayload {
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  county?: string;
  userType: 'mother' | 'health_worker' | 'admin' | 'policy_maker';
  password: string;
}

export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  county?: string;
  subCounty?: string;
  village?: string;
  userType?: 'mother' | 'health_worker' | 'admin' | 'policy_maker';
  isEmailVerified?: boolean; // ← added
}

export const usersApi = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get('/users');
    return response.data?.data ?? response.data;
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data?.data ?? response.data;
  },

  createUser: async (userData: CreateUserPayload): Promise<{ message: string }> => {
    const response = await apiClient.post('/users', userData);
    return response.data;
  },

  updateUser: async (id: number, updatedData: UpdateUserPayload): Promise<{ message: string }> => {
    const response = await apiClient.put(`/users/${id}`, updatedData);
    return response.data;
  },

  deleteUser: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },

  // ← reuses PUT /users/:id — no new backend route needed
  verifyUser: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.put(`/users/${id}`, { isEmailVerified: true });
    return response.data;
  },
};

export default usersApi;