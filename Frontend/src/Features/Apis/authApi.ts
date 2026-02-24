import axios from 'axios';

// 1. Base Configuration
const API_URL = 'http://localhost:5000/api/auth';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Token Interceptor: Automatically adds JWT to protected requests
// This ensures that methods like getProfile and completeProfile always have the token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 3. API Methods matching your AuthController
export const authApi = {
  /**
   * Register a new user
   * Controller: registerUser
   */
  register: async (userData: any) => {
    const response = await apiClient.post('/register', userData);
    return response.data;
  },

  /**
   * Login user and receive JWT + Profile
   * Controller: loginUser
   */
  login: async (credentials: { email: string; password: string }) => {
    const response = await apiClient.post('/login', credentials);
    return response.data; // Returns { token, userId, email, userType, isProfileComplete... }
  },

  /**
   * Finalize profile setup with DOB and Location details
   * Controller: completeProfile (Backend PATCH /complete-profile)
   */
  completeProfile: async (profileData: { dateOfBirth: string; subCounty: string; village: string }) => {
    const response = await apiClient.patch('/complete-profile', profileData);
    return response.data;
  },

  /**
   * Verify email via the token sent to user's email
   * Controller: verifyEmail
   */
  verifyEmail: async (token: string) => {
    const response = await apiClient.get(`/verify-email/${token}`);
    return response.data;
  },

  /**
   * Request a password reset link
   * Controller: passwordReset
   */
  requestPasswordReset: async (email: string) => {
    const response = await apiClient.post('/password-reset', { email });
    return response.data;
  },

  /**
   * Reset password using the token from email
   * Controller: resetPassword
   */
  resetPassword: async (token: string, password: string) => {
    const response = await apiClient.post(`/reset-password/${token}`, { password });
    return response.data;
  },

  /**
   * Get current user profile (requires valid token)
   * Controller: getUserProfile
   */
  getProfile: async () => {
    const response = await apiClient.get('/profile');
    return response.data;
  }
};

export default authApi;