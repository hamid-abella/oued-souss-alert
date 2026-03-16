import api from './axios';

export const capteursApi = {
  getAll:         ()           => api.get('/capteurs'),
  getByZone:      (zoneId)     => api.get(`/capteurs/zone/${zoneId}`),
  getById:        (id)         => api.get(`/capteurs/${id}`),
  create:         (data)       => api.post('/capteurs', data),
  updateStatut:   (id, statut) => api.patch(`/capteurs/${id}/statut`, { statut }),
};