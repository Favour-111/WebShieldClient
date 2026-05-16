import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
};

export const userService = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/change-password', data),
  getNotifications: () => api.get('/users/notifications'),
  markAllNotificationsRead: () => api.put('/users/notifications/read-all'),
  // Admin
  getAllUsers: (params) => api.get('/users', { params }),
  toggleUserStatus: (id) => api.put(`/users/${id}/toggle-status`),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getActivityLogs: (params) => api.get('/users/admin/logs', { params }),
};

export const scanService = {
  createScan: (data) => api.post('/scans', data),
  getScans: (params) => api.get('/scans', { params }),
  getScanById: (id) => api.get(`/scans/${id}`),
  pauseScan: (id) => api.put(`/scans/${id}/pause`),
  resumeScan: (id) => api.put(`/scans/${id}/resume`),
  stopScan: (id) => api.put(`/scans/${id}/stop`),
  deleteScan: (id) => api.delete(`/scans/${id}`),
  // Admin
  getAllScans: (params) => api.get('/scans/admin/all', { params }),
};

export const vulnerabilityService = {
  getVulnerabilities: (params) => api.get('/vulnerabilities', { params }),
  getVulnerabilityById: (id) => api.get(`/vulnerabilities/${id}`),
  updateStatus: (id, status) => api.put(`/vulnerabilities/${id}/status`, { status }),
  getStats: () => api.get('/vulnerabilities/stats'),
};

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getTrend: (days) => api.get('/dashboard/trend', { params: { days } }),
  getAdminStats: () => api.get('/dashboard/admin'),
};

export const reportService = {
  generateReport: (scanId) => api.post(`/reports/generate/${scanId}`),
  getReports: (params) => api.get('/reports', { params }),
  getReportById: (id) => api.get(`/reports/${id}`),
  deleteReport: (id) => api.delete(`/reports/${id}`),
};
