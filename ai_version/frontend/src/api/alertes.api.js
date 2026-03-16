import api from './axios';

export const alertesApi = {
  getActives:   ()      => api.get('/alertes/actives'),
  getAll:       (limit) => api.get(`/alertes?limit=${limit || 100}`),
  getByZone:    (zoneId)=> api.get(`/alertes/zone/${zoneId}`),
  resolve:      (id)    => api.patch(`/alertes/${id}/resolve`),
};