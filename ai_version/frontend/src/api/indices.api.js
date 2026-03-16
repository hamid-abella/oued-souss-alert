import api from './axios';

export const indicesApi = {
  // Déclenche la procédure stockée calculate_flood_risk
  calculate:    (zoneId)                       => api.post(`/indices/zone/${zoneId}/calculate`),
  getByZone:    (zoneId, limit = 30)           => api.get(`/indices/zone/${zoneId}?limit=${limit}`),
  getTrend:     (zoneId, dateDebut, dateFin)   => api.get(`/indices/zone/${zoneId}/trend?date_debut=${dateDebut}&date_fin=${dateFin}`),
};