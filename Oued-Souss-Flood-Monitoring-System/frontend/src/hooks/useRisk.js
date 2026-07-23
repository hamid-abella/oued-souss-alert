import { useState, useCallback } from 'react';
import { getRiskByZone, calculateRisk as apiCalculate } from '../api/risk-indices.api';

export const useRisk = () => {
  const [riskIndices, setRiskIndices] = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);

  const fetchRisk = useCallback(async (zoneId, limit = 30) => {
    try {
      setLoading(true);
      setError(null);
      const res = await getRiskByZone(zoneId, limit);
      setRiskIndices(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load risk indices.');
    } finally {
      setLoading(false);
    }
  }, []);

  const calculateRisk = async (zoneId) => {
    const res = await apiCalculate(zoneId);
    return res.data;
  };

  return { riskIndices, loading, error, fetchRisk, calculateRisk };
};