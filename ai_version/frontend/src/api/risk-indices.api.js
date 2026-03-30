import api from './axios';

export const calculateRisk  = (zoneId)                      => api.post(`/risk/zone/${zoneId}/calculate`);
export const getRiskByZone  = (zoneId, limit=30)            => api.get(`/risk/zone/${zoneId}?limit=${limit}`);
export const getRiskTrend   = (zoneId, startDate, endDate)  =>
  api.get(`/risk/zone/${zoneId}/trend?start_date=${startDate}&end_date=${endDate}`);