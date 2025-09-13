import api from './api';

export const adminService = {
  getPlatformStats: () => api.get('/admin/stats')
};