import api from './axios';

export const getSensors = () => api.get('/sensors');
export const getSensorsByZone = (zoneId) => api.get(`/sensors/zone/${zoneId}`);
export const getSensorById = (id) => api.get(`/sensors/${id}`);
export const getSensorHistory = (id) => api.get(`/sensors/${id}/history`);
export const createSensor = (data) => api.post('/sensors', data);
export const updateSensorStatus = (id, status) => api.patch(`/sensors/${id}/status`, { status });
