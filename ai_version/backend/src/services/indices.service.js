// =============================================================
// Projet : Oued-Souss Alert
// Fichier : src/services/indices.service.js
// Description : Logique métier pour les indices de risque
// Appelle la procédure stockée calculate_flood_risk côté PostgreSQL
// =============================================================

const pool = require('../config/db');

// Déclencher le calcul d'indice via la procédure stockée PostgreSQL
const calculateFloodRisk = async (zoneId) => {
  // Appel de la procédure stockée définie dans procedures/calculate_flood_risk.sql
  await pool.query('CALL calculate_flood_risk($1)', [zoneId]);

  // Retourner le dernier indice calculé
  const result = await pool.query(
    `SELECT * FROM indices_risque
     WHERE zone_id = $1
     ORDER BY date_calcul DESC
     LIMIT 1`,
    [zoneId]
  );
  return result.rows[0];
};

// Récupérer l'historique des indices d'une zone
const getIndicesByZone = async (zoneId, limit = 30) => {
  const result = await pool.query(
    `SELECT * FROM indices_risque
     WHERE zone_id = $1
     ORDER BY date_calcul DESC
     LIMIT $2`,
    [zoneId, limit]
  );
  return result.rows;
};

// Appel de la fonction get_risk_trend pour analyser la tendance
const getRiskTrend = async (zoneId, dateDebut, dateFin) => {
  const result = await pool.query(
    'SELECT * FROM get_risk_trend($1, $2, $3)',
    [zoneId, dateDebut, dateFin]
  );
  return result.rows[0];
};

module.exports = { calculateFloodRisk, getIndicesByZone, getRiskTrend };