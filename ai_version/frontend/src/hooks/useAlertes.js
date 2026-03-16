import { useState, useEffect, useCallback } from 'react';
import { alertesApi } from '../api/alertes.api';

export const useAlertes = (zoneId = null) => {
  const [alertes, setAlertes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const fetchAlertes = useCallback(async () => {
    try {
      setLoading(true);
      const res = zoneId
        ? await alertesApi.getByZone(zoneId)
        : await alertesApi.getAll();
      setAlertes(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur alertes.');
    } finally {
      setLoading(false);
    }
  }, [zoneId]);

  useEffect(() => { fetchAlertes(); }, [fetchAlertes]);

  const resolveAlerte = async (id) => {
    await alertesApi.resolve(id);
    setAlertes(prev => prev.map(a =>
      a.alerte_id === id ? { ...a, statut: 'RESOLUE' } : a
    ));
  };

  return { alertes, loading, error, refetch: fetchAlertes, resolveAlerte };
};