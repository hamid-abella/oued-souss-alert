import api from './axios';

export const getZones       = ()          => api.get('/zones');
export const getZonesAtRisk = ()          => api.get('/zones/at-risk');
export const getZoneById    = (id)        => api.get(`/zones/${id}`);
export const createZone     = (data)      => api.post('/zones', data);
export const updateZone     = (id, data)  => api.put(`/zones/${id}`, data);
export const deleteZone     = (id)        => api.delete(`/zones/${id}`);