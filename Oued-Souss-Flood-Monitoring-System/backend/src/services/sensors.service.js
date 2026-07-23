// =============================================================
// Project: Oued-Souss Alert
// File: src/services/sensors.service.js
// Description: Business logic for sensors
// =============================================================

const pool = require('../config/db');

const getAllSensors = async () => {
  const { rows } = await pool.query(
    `SELECT s.*, z.name AS zone_name
     FROM sensors s
     JOIN zones z ON z.zone_id = s.zone_id
     ORDER BY s.zone_id, s.sensor_type`
  );
  return rows;
};

const getSensorsByZone = async (zoneId) => {
  const { rows } = await pool.query(
    `SELECT s.*, z.name AS zone_name
     FROM sensors s
     JOIN zones z ON z.zone_id = s.zone_id
     WHERE s.zone_id = $1
     ORDER BY s.sensor_type`,
    [zoneId]
  );
  return rows;
};

const getSensorById = async (sensorId) => {
  const { rows } = await pool.query(
    `SELECT s.*, z.name AS zone_name, z.critical_level
     FROM sensors s
     JOIN zones z ON z.zone_id = s.zone_id
     WHERE s.sensor_id = $1`,
    [sensorId]
  );
  return rows[0] || null;
};

const getSensorHistory = async (sensorId) => {
  const { rows: sensor } = await pool.query(
    'SELECT sensor_type FROM sensors WHERE sensor_id = $1',
    [sensorId]
  );

  if (sensor.length === 0) return null;

  const table = sensor[0].sensor_type === 'water_level'
    ? 'water_level_measurements'
    : 'rain_measurements';

  const valueCol = sensor[0].sensor_type === 'water_level'
    ? 'water_level_m'
    : 'rain_mm';

  const { rows } = await pool.query(
    `SELECT measurement_id, sensor_id, timestamp, ${valueCol} AS value
     FROM ${table}
     WHERE sensor_id = $1
     ORDER BY timestamp DESC
     LIMIT 100`,
    [sensorId]
  );

  return {
    sensor_id:   parseInt(sensorId),
    sensor_type: sensor[0].sensor_type,
    unit:        sensor[0].sensor_type === 'water_level' ? 'm' : 'mm',
    measurements: rows
  };
};

const createSensor = async (data) => {
  const { zone_id, sensor_type, installation_date, status } = data;
  const { rows } = await pool.query(
    `INSERT INTO sensors (zone_id, sensor_type, installation_date, status)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [zone_id, sensor_type, installation_date ?? null, status ?? 'active']
  );
  return rows[0];
};

const updateSensorStatus = async (sensorId, status) => {
  const { rows } = await pool.query(
    `UPDATE sensors SET status = $1
     WHERE sensor_id = $2
     RETURNING *`,
    [status, sensorId]
  );
  return rows[0] || null;
};

module.exports = {
  getAllSensors,
  getSensorsByZone,
  getSensorById,
  getSensorHistory,
  createSensor,
  updateSensorStatus
};
