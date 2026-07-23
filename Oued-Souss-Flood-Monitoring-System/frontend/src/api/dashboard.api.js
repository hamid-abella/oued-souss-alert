import api from './axios';

export const getDashboardOverview = ()       => api.get('/dashboard/overview');
export const getDashboardStats    = ()       => api.get('/dashboard/stats');
export const getDashboardTrend    = (zoneId) => api.get(`/dashboard/trend/${zoneId}`);