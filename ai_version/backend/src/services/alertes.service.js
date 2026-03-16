// =============================================================
// Projet : Oued-Souss Alert
// Fichier : src/services/alertes.service.js
// Description : Logique métier pour les alertes
// =============================================================

const pool = require('../config/db');

// Récupérer toutes les alertes actives
const getAlertesActives = async () => {
  const result = await pool.query(`
    SELECT
      a.*,
      z.nom        AS zone_nom,
      z.latitude,
      z.longitude,
      z.type_zone
    FROM alertes a
    JOIN zones z ON a.zone_id = z.zone_id
    WHERE a.statut = 'ACTIVE'
    ORDER BY a.date_alerte DESC
  `);
  return result.rows;
};

// Récupérer toutes les alertes (historique complet)
const getAllAlertes = async (limit = 100) => {
  const result = await pool.query(`
    SELECT a.*, z.nom AS zone_nom
    FROM alertes a
    JOIN zones z ON a.zone_id = z.zone_id
    ORDER BY a.date_alerte DESC
    LIMIT $1
  `, [limit]);
  return result.rows;
};

// Récupérer les alertes d'une zone spécifique
const getAlertesByZone = async (zoneId) => {
  const result = await pool.query(
    `SELECT * FROM alertes
     WHERE zone_id = $1
     ORDER BY date_alerte DESC`,
    [zoneId]
  );
  return result.rows;
};

// Résoudre manuellement une alerte
const resolveAlerte = async (alerteId) => {
  const result = await pool.query(
    `UPDATE alertes
     SET statut = 'RESOLUE'
     WHERE alerte_id = $1
     RETURNING *`,
    [alerteId]
  );
  return result.rows[0] || null;
};

module.exports = {
  getAlertesActives,
  getAllAlertes,
  getAlertesByZone,
  resolveAlerte
};