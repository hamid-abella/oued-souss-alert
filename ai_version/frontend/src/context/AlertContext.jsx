// =============================================================
// Projet : Oued-Souss Alert
// Fichier : src/context/AlertContext.jsx
// Description : Contexte pour les alertes actives (polling 30s)
// =============================================================

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { alertesApi } from '../api/alertes.api';
import { useAuth } from './AuthContext';

const AlertContext = createContext(null);

export const AlertProvider = ({ children }) => {
  const { isAuth }                = useAuth();
  const [alertes,  setAlertes]    = useState([]);
  const [loading,  setLoading]    = useState(false);

  const fetchAlertes = useCallback(async () => {
    if (!isAuth) return;
    try {
      setLoading(true);
      const res = await alertesApi.getActives();
      setAlertes(res.data);
    } catch {
      // silencieux en cas d'erreur réseau
    } finally {
      setLoading(false);
    }
  }, [isAuth]);

  // Polling toutes les 30 secondes
  useEffect(() => {
    fetchAlertes();
    const interval = setInterval(fetchAlertes, 30000);
    return () => clearInterval(interval);
  }, [fetchAlertes]);

  return (
    <AlertContext.Provider value={{ alertes, loading, refresh: fetchAlertes }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = () => useContext(AlertContext);