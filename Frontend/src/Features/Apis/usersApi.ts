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
  constituency?: string;
  ward?: string;
  userType?: 'mother' | 'health_worker' | 'admin' | 'policy_maker';
  isEmailVerified?: boolean;
}

export interface UserFilters {
  county?: string;
  constituency?: string;
  ward?: string;
}

export const usersApi = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get('/users');
    return response.data?.data ?? response.data;
  },

  getFilteredUsers: async (filters: UserFilters): Promise<User[]> => {
    const params = new URLSearchParams();
    if (filters.county) params.append('county', filters.county);
    if (filters.constituency) params.append('constituency', filters.constituency);
    if (filters.ward) params.append('ward', filters.ward);
    const response = await apiClient.get(`/users?${params.toString()}`);
    return response.data?.data ?? response.data;
  },

  getUsersByCounty: async (county: string): Promise<User[]> => {
    const response = await apiClient.get(`/users?county=${encodeURIComponent(county)}`);
    return response.data?.data ?? response.data;
  },

  getUsersByConstituency: async (county: string, constituency: string): Promise<User[]> => {
    const response = await apiClient.get(`/users?county=${encodeURIComponent(county)}&constituency=${encodeURIComponent(constituency)}`);
    return response.data?.data ?? response.data;
  },

  getUsersByWard: async (county: string, constituency: string, ward: string): Promise<User[]> => {
    const response = await apiClient.get(`/users?county=${encodeURIComponent(county)}&constituency=${encodeURIComponent(constituency)}&ward=${encodeURIComponent(ward)}`);
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

  verifyUser: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.put(`/users/${id}`, { isEmailVerified: true });
    return response.data;
  },

  getStatsByLocation: async (): Promise<any> => {
    const response = await apiClient.get('/users/stats/location');
    return response.data?.data ?? response.data;
  },
};

export default usersApi;