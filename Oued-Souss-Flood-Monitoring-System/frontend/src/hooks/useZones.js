import { useState, useEffect, useCallback } from 'react';
import { getZones, createZone as apiCreate, deleteZone as apiDelete } from '../api/zones.api';

export const useZones = () => {
  const [zones,   setZones]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const fetchZones = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getZones();
      setZones(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load zones.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchZones(); }, [fetchZones]);

  const createZone = async (data) => {
    const res = await apiCreate(data);
    setZones(prev => [...prev, res.data]);
    return res.data;
  };

  const deleteZone = async (id) => {
    await apiDelete(id);
    setZones(prev => prev.filter(z => z.zone_id !== id));
  };

  return { zones, loading, error, refetch: fetchZones, createZone, deleteZone };
};