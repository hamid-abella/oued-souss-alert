import api from './axios';

export const getActiveAlerts  = ()               => api.get('/alerts/active');
export const getAllAlerts      = (page=1, limit=20) => api.get(`/alerts?page=${page}&limit=${limit}`);
export const getAlertsByZone  = (zoneId)         => api.get(`/alerts/zone/${zoneId}`);
export const getAlertById     = (id)             => api.get(`/alerts/${id}`);
export const resolveAlert     = (id, comment)    => api.patch(`/alerts/${id}/resolve`, { comment });