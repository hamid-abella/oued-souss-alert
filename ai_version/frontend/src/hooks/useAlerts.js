import { useState, useEffect, useCallback } from 'react';
import { getAllAlerts, getAlertsByZone, resolveAlert as apiResolve } from '../api/alerts.api';

export const useAlerts = (zoneId = null) => {
  const [alerts,  setAlerts]  = useState([]);
  const [total,   setTotal]   = useState(0);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const fetchAlerts = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      if (zoneId) {
        const res = await getAlertsByZone(zoneId);
        setAlerts(res.data);
      } else {
        const res = await getAllAlerts(page);
        setAlerts(res.data.data);
        setTotal(res.data.total);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load alerts.');
    } finally {
      setLoading(false);
    }
  }, [zoneId]);

  useEffect(() => { fetchAlerts(); }, [fetchAlerts]);

  const resolveAlert = async (id, comment) => {
    await apiResolve(id, comment);
    setAlerts(prev => prev.map(a =>
      a.alert_id === id ? { ...a, status: 'RESOLVED' } : a
    ));
  };

  return { alerts, total, loading, error, refetch: fetchAlerts, resolveAlert };
};