import api from './axios';

export const insertWaterLevel = (data) => api.post('/measurements/water-level', data);
export const insertRain = (data) => api.post('/measurements/rain', data);
export const getWaterLevelByZone = (zoneId) => api.get(`/measurements/water-level/zone/${zoneId}`);
export const getRainByZone = (zoneId) => api.get(`/measurements/rain/zone/${zoneId}`);
