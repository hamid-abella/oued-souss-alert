// =============================================================
// Projet : Oued-Souss Alert
// Fichier : src/hooks/useZones.js
// Description : Hook personnalisé pour la gestion des zones
// =============================================================

import { useState, useEffect, useCallback } from 'react';
import { zonesApi } from '../api/zones.api';

export const useZones = () => {
  const [zones,   setZones]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const fetchZones = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await zonesApi.getAll();
      setZones(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors du chargement des zones.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchZones(); }, [fetchZones]);

  const createZone = async (data) => {
    const res = await zonesApi.create(data);
    setZones(prev => [...prev, res.data]);
    return res.data;
  };

  const deleteZone = async (id) => {
    await zonesApi.delete(id);
    setZones(prev => prev.filter(z => z.zone_id !== id));
  };

  return { zones, loading, error, refetch: fetchZones, createZone, deleteZone };
};