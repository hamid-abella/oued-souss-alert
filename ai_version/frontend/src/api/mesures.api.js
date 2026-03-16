import api from './axios';

export const mesuresApi = {
  // Insertion mesures (déclenchent les triggers PostgreSQL)
  insertNiveau:       (data)   => api.post('/mesures/niveau', data),
  insertPluie:        (data)   => api.post('/mesures/pluie', data),
  getNiveauByZone:    (zoneId, limit = 50) => api.get(`/mesures/niveau/zone/${zoneId}?limit=${limit}`),
  getPluieByZone:     (zoneId, limit = 50) => api.get(`/mesures/pluie/zone/${zoneId}?limit=${limit}`),
};