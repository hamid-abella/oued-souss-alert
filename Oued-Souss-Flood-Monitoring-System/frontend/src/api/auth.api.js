import api from './axios';

export const login    = (credentials) => api.post('/auth/login', credentials);
export const getMe    = ()            => api.get('/auth/me');
export const getUsers = ()            => api.get('/auth/users');