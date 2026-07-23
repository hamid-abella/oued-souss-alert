// =============================================================
// Project: Oued-Souss Alert
// File: src/services/risk-indices.service.js
// Description: Business logic for calculating and retrieving risk indices
// =============================================================

const pool = require('../config/db');

const calculateRisk = async (zoneId) => {
  const { rows: zone } = await pool.query(
    'SELECT zone_id FROM zones WHERE zone_id = $1',
    [zoneId]
  );

  if (zone.length === 0) return null;

  // Calls the PostgreSQL stored procedure
  await pool.query('CALL calculate_flood_risk($1)', [zoneId]);

  // Return the freshly calculated index
  const { rows } = await pool.query(
    `SELECT * FROM risk_indices
     WHERE zone_id = $1
     ORDER BY calculation_date DESC
     LIMIT 1`,
    [zoneId]
  );

  return rows[0];
};

const getByZone = async (zoneId, limit = 30) => {
  const { rows } = await pool.query(
    `SELECT * FROM risk_indices
     WHERE zone_id = $1
     ORDER BY calculation_date DESC
     LIMIT $2`,
    [zoneId, limit]
  );
  return rows;
};

const getTrend = async (zoneId, startDate, endDate) => {
  const { rows } = await pool.query(
    'SELECT * FROM get_risk_trend($1, $2, $3)',
    [zoneId, startDate, endDate]
  );
  return rows[0] || null;
};

module.exports = {
  calculateRisk,
  getByZone,
  getTrend
};
