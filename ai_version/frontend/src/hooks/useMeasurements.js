import { useState, useCallback } from 'react';
import {
  getWaterLevelByZone, getRainByZone,
  insertWaterLevel as apiInsertWater,
  insertRain as apiInsertRain
} from '../api/measurements.api';

export const useMeasurements = () => {
  const [waterLevels,      setWaterLevels]      = useState([]);
  const [rainMeasurements, setRainMeasurements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const fetchWaterLevel = useCallback(async (zoneId) => {
    try {
      setLoading(true);
      setError(null);
      const res = await getWaterLevelByZone(zoneId);
      setWaterLevels(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load water level data.');
    } finally { setLoading(false); }
  }, []);

  const fetchRain = useCallback(async (zoneId) => {
    try {
      setLoading(true);
      setError(null);
      const res = await getRainByZone(zoneId);
      setRainMeasurements(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load rain data.');
    } finally { setLoading(false); }
  }, []);

  const insertWaterLevel = async (sensorId, waterLevelM) => {
    const res = await apiInsertWater({ sensor_id: sensorId, water_level_m: waterLevelM });
    return res.data;
  };

  const insertRain = async (sensorId, rainMm) => {
    const res = await apiInsertRain({ sensor_id: sensorId, rain_mm: rainMm });
    return res.data;
  };

  return {
    waterLevels, rainMeasurements,
    loading, error,
    fetchWaterLevel, fetchRain,
    insertWaterLevel, insertRain,
  };
};