import api from './axios';

export const dashboardApi = {
  getOverview: () => api.get('/dashboard/overview'),
  getStats:    () => api.get('/dashboard/stats'),
};