import axios from "axios";
import { store } from "../store";
import { logout } from "../Auth/AuthSlice";

const API_URL = "http://localhost:5000/api/auth";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach token to EVERY request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Auto-logout on expired/invalid token — skip change-password endpoint
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isChangePassword = error.config?.url?.includes("/change-password");
    if (error.response?.status === 401 && !isChangePassword) {
      localStorage.clear();
      store.dispatch(logout());
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  // REGISTER
  register: async (userData: any) => {
    const response = await apiClient.post("/register", userData);
    return response.data;
  },

  // LOGIN
  login: async (credentials: { email: string; password: string }) => {
    const response = await apiClient.post("/login", credentials);
    return response.data;
  },

  // OTP
  verifyOtp: async (data: { email: string; otp: string }) => {
    const response = await apiClient.post("/verify-otp", data);
    return response.data;
  },

  resendOtp: async (data: { email: string }) => {
    const response = await apiClient.post("/resend-otp", data);
    return response.data;
  },

  // PASSWORD RESET
  forgotPassword: async (email: string) => {
    const response = await apiClient.post("/forgot-password", { email });
    return response.data;
  },

  resetPassword: async (data: {
    email: string;
    otp: string;
    newPassword: string;
  }) => {
    const response = await apiClient.post("/reset-password", data);
    return response.data;
  },

  // PROFILE
  getProfile: async () => {
    const response = await apiClient.get("/profile");
    return response.data;
  },

  // UPLOAD IMAGE
  uploadProfileImage: async (userId: number, file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await axios.post(
      `${API_URL}/upload-image/${userId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  },

  // CHANGE PASSWORD
  changePassword: async (data: {
    userId: number;
    currentPassword: string;
    newPassword: string;
  }) => {
    const response = await apiClient.post("/change-password", data);
    return response.data;
  },

  // UPDATE PROFILE
  completeProfile: async (data: any) => {
    const response = await apiClient.put("/complete-profile", data);
    return response.data;
  },
};

export default authApi;