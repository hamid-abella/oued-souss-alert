import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getActiveAlerts } from '../api/alerts.api';
import { useAuth } from './AuthContext';

const AlertContext = createContext(null);

export const AlertProvider = ({ children }) => {
  const { isAuth }  = useAuth();
  const [alerts,  setAlerts]  = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAlerts = useCallback(async () => {
    if (!isAuth) return;
    try {
      setLoading(true);
      const res = await getActiveAlerts();
      setAlerts(res.data);
    } catch {
      // silent on network error
    } finally {
      setLoading(false);
    }
  }, [isAuth]);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  return (
    <AlertContext.Provider value={{ alerts, loading, refresh: fetchAlerts }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = () => useContext(AlertContext);