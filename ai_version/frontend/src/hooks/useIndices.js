import { useState, useCallback } from 'react';
import { indicesApi } from '../api/indices.api';

export const useIndices = () => {
  const [indices,  setIndices]  = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  const fetchIndices = useCallback(async (zoneId) => {
    try {
      setLoading(true);
      const res = await indicesApi.getByZone(zoneId);
      setIndices(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur indices.');
    } finally { setLoading(false); }
  }, []);

  const calculate = async (zoneId) => {
    const res = await indicesApi.calculate(zoneId);
    return res.data;
  };

  return { indices, loading, error, fetchIndices, calculate };
};