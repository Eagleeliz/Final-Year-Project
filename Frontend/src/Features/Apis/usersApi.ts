import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-attach JWT — strips extra quotes from localStorage
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    const cleanToken = token.replace(/^"|"$/g, '').trim();
    config.headers.Authorization = `Bearer ${cleanToken}`;
  }
  return config;
});

// ── Types matching usersTable in your schema ──────────────────

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
}

// ── API Methods ───────────────────────────────────────────────

export const usersApi = {
  /**
   * Get all users (admin only)
   * GET /api/users
   */
  getAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get('/users');
    // handle both { data: [...] } and plain array
    return response.data?.data ?? response.data;
  },

  /**
   * Get a single user by ID
   * GET /api/users/:id
   */
  getUserById: async (id: number): Promise<User> => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data?.data ?? response.data;
  },

  /**
   * Create a new user (admin only)
   * POST /api/users
   */
  createUser: async (userData: CreateUserPayload): Promise<{ message: string }> => {
    const response = await apiClient.post('/users', userData);
    return response.data;
  },

  /**
   * Update a user's details
   * PUT /api/users/:id
   */
  updateUser: async (id: number, updatedData: UpdateUserPayload): Promise<{ message: string }> => {
    const response = await apiClient.put(`/users/${id}`, updatedData);
    return response.data;
  },

  /**
   * Delete a user by ID (admin only)
   * DELETE /api/users/:id
   */
  deleteUser: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },
};

export default usersApi;