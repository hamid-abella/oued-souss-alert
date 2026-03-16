// =============================================================
// Projet : Oued-Souss Alert
// Fichier : src/context/AuthContext.jsx
// Description : Contexte global d'authentification JWT + RBAC
// =============================================================

import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Récupération de l'état depuis localStorage au démarrage
  const [user,  setUser]  = useState(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  // Connexion : appel API + stockage token
  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: t, role, nom } = res.data;
    localStorage.setItem('token', t);
    localStorage.setItem('user', JSON.stringify({ role, nom }));
    setToken(t);
    setUser({ role, nom });
    return { role, nom };
  }, []);

  // Déconnexion : nettoyage localStorage
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  // Vérification des permissions RBAC côté frontend
  const can = useCallback((action) => {
    const permissions = {
      admin:      ['read','create','update','delete','resolve'],
      operateur:  ['read','create','update','resolve'],
      lecteur:    ['read'],
      securite:   ['read','resolve'],
    };
    return permissions[user?.role]?.includes(action) ?? false;
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, can, isAuth: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);