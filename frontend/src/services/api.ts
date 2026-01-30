import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
          const { token, refreshToken: newRefreshToken } = response.data;
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', newRefreshToken);
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        } catch {
          localStorage.clear();
          window.location.href = '/login';
        }
      } else {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth
export const authAPI = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  refresh: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),
  signup: (data: any) =>
    api.post('/auth/signup', data),
};

// Customer Update Requests - UPDATED to send JSON instead of FormData
export const requestsAPI = {
  // Changed from FormData to JSON object
  create: (data: any) => api.post('/requests', data),
  
  getAll: (page = 0, size = 20, sortBy = 'createdAt', sortDir = 'desc') =>
    api.get(`/requests?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`),
  
  getMy: (page = 0, size = 20) =>
    api.get(`/requests/my?page=${page}&size=${size}`),
  
  getById: (id: number) => api.get(`/requests/${id}`),
  
  getByStatus: (status: string, page = 0, size = 20) =>
    api.get(`/requests/status/${status}?page=${page}&size=${size}`),
  
  search: (params: any) => api.get('/requests/search', { params }),
  
  getDashboardStats: () => api.get('/requests/dashboard-stats'),
  
  process: (id: number) => api.post(`/requests/${id}/process`),
};

// Approvals
export const approvalsAPI = {
  getPending: (page = 0, size = 20) =>
    api.get(`/approvals/pending?page=${page}&size=${size}`),
  action: (data: { requestId: number; action: string; comments?: string }) =>
    api.post('/approvals/action', data),
};

// Bulk Upload
export const bulkUploadAPI = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/bulk-upload/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  preview: (id: number) => api.get(`/bulk-upload/${id}/preview`),
  process: (id: number) => api.post(`/bulk-upload/${id}/process`),
  getAll: (page = 0, size = 20) => api.get(`/bulk-upload?page=${page}&size=${size}`),
  getById: (id: number) => api.get(`/bulk-upload/${id}`),
};

// Audit
export const auditAPI = {
  getAll: (page = 0, size = 50) => api.get(`/audit?page=${page}&size=${size}`),
  search: (params: any) => api.get('/audit/search', { params }),
  getEntityLogs: (entityType: string, entityId: number, page = 0) =>
    api.get(`/audit/entity/${entityType}/${entityId}?page=${page}`),
};

// Admin
export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  getUser: (id: number) => api.get(`/admin/users/${id}`),
  createUser: (data: any) => api.post('/admin/users', data),
  updateUser: (id: number, data: any) => api.put(`/admin/users/${id}`, data),
  toggleStatus: (id: number) => api.patch(`/admin/users/${id}/toggle-status`),
  unlockUser: (id: number) => api.patch(`/admin/users/${id}/unlock`),
};

// Reports
export const reportsAPI = {
  daily: () => api.get('/reports/daily'),
  weekly: () => api.get('/reports/weekly'),
  monthly: () => api.get('/reports/monthly'),
};