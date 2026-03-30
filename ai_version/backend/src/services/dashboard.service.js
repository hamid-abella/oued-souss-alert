// =============================================================
// Project: Oued-Souss Alert
// File: src/services/dashboard.service.js
// Description: Business logic for aggregating dashboard metrics
// =============================================================

const pool = require('../config/db');

const getOverview = async () => {
  const { rows } = await pool.query(
    `SELECT * FROM risk_summary_view
     ORDER BY last_risk_index DESC NULLS LAST`
  );
  return rows;
};

const getStats = async () => {
  const { rows } = await pool.query(
    `SELECT
       COUNT(DISTINCT z.zone_id)                                    AS total_zones,
       COUNT(DISTINCT s.sensor_id)
         FILTER (WHERE s.status = 'active')                         AS active_sensors,
       COUNT(DISTINCT s.sensor_id)
         FILTER (WHERE s.status IN ('maintenance', 'offline'))       AS offline_sensors,
       COUNT(DISTINCT a.alert_id)
         FILTER (WHERE a.status = 'ACTIVE')                         AS active_alerts,
       COUNT(DISTINCT a.alert_id)
         FILTER (WHERE a.status = 'ACTIVE' AND a.alert_type = 'FLOOD') AS flood_alerts,
       COUNT(DISTINCT rv.zone_id)
         FILTER (WHERE rv.last_risk_level = 'CRITICAL')             AS critical_zones,
       COUNT(DISTINCT rv.zone_id)
         FILTER (WHERE rv.last_risk_level = 'HIGH')                 AS high_zones,
       ROUND(AVG(rv.last_risk_index)::NUMERIC, 3)                   AS avg_risk_index
     FROM zones z
     LEFT JOIN sensors s          ON s.zone_id   = z.zone_id
     LEFT JOIN alerts a           ON a.zone_id   = z.zone_id
     LEFT JOIN risk_summary_view rv ON rv.zone_id = z.zone_id`
  );
  return rows[0];
};

const getTrend = async (zoneId) => {
  const { rows: zone } = await pool.query(
    'SELECT zone_id, name FROM zones WHERE zone_id = $1',
    [zoneId]
  );

  if (zone.length === 0) return null;

  const { rows } = await pool.query(
    `SELECT index_id, calculation_date, index_value, risk_level
     FROM risk_indices
     WHERE zone_id = $1
       AND calculation_date >= NOW() - INTERVAL '30 days'
     ORDER BY calculation_date ASC`,
    [zoneId]
  );

  return {
    zone_id:   zone[0].zone_id,
    zone_name: zone[0].name,
    data:      rows
  };
};

module.exports = {
  getOverview,
  getStats,
  getTrend
};