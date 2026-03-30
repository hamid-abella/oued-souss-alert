import { createContext, useContext, useState, useCallback } from 'react';
import { login as apiLogin } from '../api/auth.api';
import { PERMISSIONS } from '../config/roles';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,  setUser]  = useState(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const login = useCallback(async (email, password) => {
    const res = await apiLogin({ email, password });
    const { token: t, user: u } = res.data;
    localStorage.setItem('token', t);
    localStorage.setItem('user', JSON.stringify(u));
    setToken(t);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  // RBAC: mirrors config/roles.js PERMISSIONS matrix
  // Usage: can('alerts', 'update') / can('zones', 'delete')
  const can = useCallback((resource, action) => {
    if (!user?.role) return false;
    return PERMISSIONS[resource]?.[user.role]?.includes(action) ?? false;
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, can, isAuth: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);