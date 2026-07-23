// =============================================================
// Project: Oued-Souss Alert
// File: src/services/alerts.service.js
// Description: Business logic for alerts management
// =============================================================

const pool = require('../config/db');

const ALERT_SELECT = `
  SELECT a.*,
         z.name      AS zone_name,
         z.latitude,
         z.longitude,
         s.sensor_type
  FROM alerts a
  JOIN zones z   ON z.zone_id   = a.zone_id
  LEFT JOIN sensors s ON s.sensor_id = a.sensor_id
`;

const getActiveAlerts = async () => {
  const { rows } = await pool.query(
    `${ALERT_SELECT}
     WHERE a.status = 'ACTIVE'
     ORDER BY a.alert_date DESC`
  );
  return rows;
};

const getAllAlerts = async (page = 1, limit = 20) => {
  const offset = (page - 1) * limit;

  const { rows } = await pool.query(
    `${ALERT_SELECT}
     ORDER BY a.alert_date DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  const { rows: count } = await pool.query('SELECT COUNT(*) FROM alerts');

  return {
    total: parseInt(count[0].count),
    page,
    limit,
    data: rows
  };
};

const getAlertsByZone = async (zoneId) => {
  const { rows } = await pool.query(
    `${ALERT_SELECT}
     WHERE a.zone_id = $1
     ORDER BY a.alert_date DESC`,
    [zoneId]
  );
  return rows;
};

const getAlertById = async (alertId) => {
  const { rows } = await pool.query(
    `${ALERT_SELECT}
     WHERE a.alert_id = $1`,
    [alertId]
  );
  return rows[0] || null;
};

const resolveAlert = async (alertId, userId, comment) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      `UPDATE alerts SET status = 'RESOLVED'
       WHERE alert_id = $1 AND status = 'ACTIVE'
       RETURNING *`,
      [alertId]
    );

    if (rows.length === 0) {
      await client.query('ROLLBACK');
      return null;
    }

    await client.query(
      `INSERT INTO user_alerts_processing (user_id, alert_id, action, comment)
       VALUES ($1, $2, 'RESOLVE', $3)`,
      [userId, alertId, comment ?? null]
    );

    await client.query('COMMIT');
    return rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

module.exports = {
  getActiveAlerts,
  getAllAlerts,
  getAlertsByZone,
  getAlertById,
  resolveAlert
};
