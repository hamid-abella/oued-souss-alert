// =============================================================
// Projet : Oued-Souss Alert
// Fichier : src/api/zones.api.js
// Description : Appels API pour les zones géographiques
// =============================================================

import api from './axios';

export const zonesApi = {
  // Récupérer toutes les zones avec leur dernier indice de risque
  getAll:    ()         => api.get('/zones'),
  getById:   (id)       => api.get(`/zones/${id}`),
  create:    (data)     => api.post('/zones', data),
  update:    (id, data) => api.put(`/zones/${id}`, data),
  delete:    (id)       => api.delete(`/zones/${id}`),
};