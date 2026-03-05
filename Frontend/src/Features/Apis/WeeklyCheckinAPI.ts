import axios from 'axios';

// Ensure this matches your backend port and the prefix in your index.ts
const API_URL = 'http://localhost:5000/api/weeks';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach the JWT token for protected routes
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const weeklyCheckinApi = {
  /**
   * CREATE: POST /api/weeks
   * Submits new vitals and symptoms. 
   * Returns calculated riskFlag and riskReason.
   */
  create: async (data: any) => {
    const response = await apiClient.post('', data);
    return response.data;
  },

  /**
   * READ (All): GET /api/weeks
   * Admin/System use to see every check-in globally.
   */
  getAll: async () => {
    const response = await apiClient.get('');
    return response.data;
  },

  /**
   * READ (Summary): GET /api/weeks/summary/:pregnancyId
   * Returns a simplified list for dashboard charts (weekNumber, riskLevel, etc.)
   */
  getSummary: async (pregnancyId: number) => {
    const response = await apiClient.get(`/summary/${pregnancyId}`);
    return response.data;
  },

  /**
   * READ (By Pregnancy): GET /api/weeks/pregnancy/:pregnancyId
   * Returns all detailed check-ins for the user's current journey.
   */
  getByPregnancy: async (pregnancyId: number) => {
    const response = await apiClient.get(`/pregnancy/${pregnancyId}`);
    return response.data;
  },

  /**
   * READ (By Specific Week): GET /api/weeks/week/:pregnancyId/:weekNumber
   * Fetches the data for a specific week to show "Last Week's Stats".
   */
  getByWeek: async (pregnancyId: number, weekNumber: number) => {
    const response = await apiClient.get(`/week/${pregnancyId}/${weekNumber}`);
    return response.data;
  },

  /**
   * READ (By ID): GET /api/weeks/:id
   * Fetches a single check-in record for editing or detailed view.
   */
  getById: async (id: number) => {
    const response = await apiClient.get(`/${id}`);
    return response.data;
  },

  /**
   * UPDATE: PUT /api/weeks/:id
   * Updates an existing check-in and triggers a risk re-assessment.
   */
  update: async (id: number, data: any) => {
    const response = await apiClient.put(`/${id}`, data);
    return response.data;
  },

  /**
   * DELETE: DELETE /api/weeks/:id
   * Removes a check-in record.
   */
  delete: async (id: number) => {
    const response = await apiClient.delete(`/${id}`);
    return response.data;
  }
};

export default weeklyCheckinApi;