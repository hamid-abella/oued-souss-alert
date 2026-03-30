// =============================================================
// Project: Oued-Souss Alert
// File: src/services/measurements.service.js
// Description: Business logic for measurements (water level + rain)
// Validations are handled by PostgreSQL triggers
// =============================================================

const pool = require('../config/db');

const insertWaterLevel = async (sensorId, waterLevel) => {
  const { rows } = await pool.query(
    `INSERT INTO water_level_measurements (sensor_id, timestamp, water_level_m)
     VALUES ($1, NOW(), $2)
     RETURNING *`,
    [sensorId, waterLevel]
  );
  return rows[0];
};

const insertRain = async (sensorId, rainMm) => {
  const { rows } = await pool.query(
    `INSERT INTO rain_measurements (sensor_id, timestamp, rain_mm)
     VALUES ($1, NOW(), $2)
     RETURNING *`,
    [sensorId, rainMm]
  );
  return rows[0];
};

const getWaterLevelByZone = async (zoneId) => {
  const { rows } = await pool.query(
    `SELECT w.measurement_id, w.sensor_id, w.timestamp, w.water_level_m,
            s.status AS sensor_status
     FROM water_level_measurements w
     JOIN sensors s ON s.sensor_id = w.sensor_id
     WHERE s.zone_id = $1
       AND w.timestamp >= NOW() - INTERVAL '48 hours'
     ORDER BY w.timestamp DESC`,
    [zoneId]
  );
  return rows;
};

const getRainByZone = async (zoneId) => {
  const { rows } = await pool.query(
    `SELECT r.measurement_id, r.sensor_id, r.timestamp, r.rain_mm,
            s.status AS sensor_status
     FROM rain_measurements r
     JOIN sensors s ON s.sensor_id = r.sensor_id
     WHERE s.zone_id = $1
       AND r.timestamp >= NOW() - INTERVAL '48 hours'
     ORDER BY r.timestamp DESC`,
    [zoneId]
  );
  return rows;
};

module.exports = {
  insertWaterLevel,
  insertRain,
  getWaterLevelByZone,
  getRainByZone
};
