// =============================================================
// Project: Oued-Souss Alert
// File: src/services/zones.service.js
// Description: Business logic for geographical zones
// =============================================================

const pool = require('../config/db');

const getAllZones = async () => {
  const { rows } = await pool.query('SELECT * FROM zones ORDER BY name ASC');
  return rows;
};

const getZonesAtRisk = async () => {
  const { rows } = await pool.query(`
    SELECT *
    FROM risk_summary_view
    WHERE last_risk_level IN ('HIGH', 'CRITICAL')
       OR active_alert_id IS NOT NULL
    ORDER BY last_risk_index DESC NULLS LAST
  `);
  return rows;
};

const getZoneById = async (zoneId) => {
  const { rows } = await pool.query(
    'SELECT * FROM zones WHERE zone_id = $1',
    [zoneId]
  );
  return rows[0] || null;
};

const createZone = async (data) => {
  const { name, zone_type, area_ha, latitude, longitude, critical_level } = data;
  const { rows } = await pool.query(
    `INSERT INTO zones (name, zone_type, area_ha, latitude, longitude, critical_level)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [name, zone_type, area_ha ?? null, latitude, longitude, critical_level]
  );
  return rows[0];
};

const updateZone = async (zoneId, data) => {
  const { name, zone_type, area_ha, latitude, longitude, critical_level } = data;
  const { rows } = await pool.query(
    `UPDATE zones
     SET name = $1, zone_type = $2, area_ha = $3,
         latitude = $4, longitude = $5, critical_level = $6
     WHERE zone_id = $7
     RETURNING *`,
    [name, zone_type, area_ha ?? null, latitude, longitude, critical_level, zoneId]
  );
  return rows[0] || null;
};

const deleteZone = async (zoneId) => {
  const { rows } = await pool.query(
    'DELETE FROM zones WHERE zone_id = $1 RETURNING zone_id, name',
    [zoneId]
  );
  return rows[0] || null;
};

module.exports = { getAllZones, getZonesAtRisk, getZoneById, createZone, updateZone, deleteZone };