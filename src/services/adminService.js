import api from './api';

export const adminService = {
  getPlatformStats: () => api.get('/admin/stats'),
  getAllUsers: (page = 0, size = 10) => api.get(`/admin/users?page=${page}&size=${size}`),
  getAllServiceRequests: (page = 0, size = 10, status = '') => 
    api.get(`/admin/requests?page=${page}&size=${size}&status=${status}`),
  getAllBookings: (page = 0, size = 10, status = '') => 
    api.get(`/admin/bookings?page=${page}&size=${size}&status=${status}`),
  getAllQuotes: (page = 0, size = 10) => api.get(`/admin/quotes?page=${page}&size=${size}`),
  updateUserStatus: (userId, active) => api.put(`/admin/users/${userId}/status`, { active }),
  updateRequestStatus: (requestId, status) => api.put(`/admin/requests/${requestId}/status`, { status }),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  deleteRequest: (requestId) => api.delete(`/admin/requests/${requestId}`),
  getRevenueAnalytics: (period = 'monthly') => api.get(`/admin/analytics/revenue?period=${period}`),
  getUserGrowth: (period = 'monthly') => api.get(`/admin/analytics/users?period=${period}`)
};