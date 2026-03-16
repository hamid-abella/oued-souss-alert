import { useState, useCallback } from 'react';
import { mesuresApi } from '../api/mesures.api';

export const useMesures = () => {
  const [mesuresNiveau, setMesuresNiveau] = useState([]);
  const [mesuresPluie,  setMesuresPluie]  = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const fetchNiveau = useCallback(async (zoneId) => {
    try {
      setLoading(true);
      const res = await mesuresApi.getNiveauByZone(zoneId);
      setMesuresNiveau(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur mesures niveau.');
    } finally { setLoading(false); }
  }, []);

  const fetchPluie = useCallback(async (zoneId) => {
    try {
      setLoading(true);
      const res = await mesuresApi.getPluieByZone(zoneId);
      setMesuresPluie(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur mesures pluie.');
    } finally { setLoading(false); }
  }, []);

  const insertNiveau = async (capteurId, niveauEau) => {
    const res = await mesuresApi.insertNiveau({ capteur_id: capteurId, niveau_eau: niveauEau });
    return res.data;
  };

  const insertPluie = async (capteurId, pluieMm) => {
    const res = await mesuresApi.insertPluie({ capteur_id: capteurId, pluie_mm: pluieMm });
    return res.data;
  };

  return {
    mesuresNiveau, mesuresPluie,
    loading, error,
    fetchNiveau, fetchPluie,
    insertNiveau, insertPluie
  };
};