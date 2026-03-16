// =============================================================
// Projet : Oued-Souss Alert
// Fichier : src/services/mesures.service.js
// Description : Logique métier pour les mesures (niveau eau + pluie)
// Les triggers de validation s'exécutent automatiquement côté PostgreSQL
// =============================================================

const pool = require('../config/db');

// Insérer une mesure de niveau d'eau
// Le trigger trg_check_niveau_eau valide automatiquement la valeur
const insertMesureNiveauEau = async (capteurId, niveauEau) => {
  const result = await pool.query(
    `INSERT INTO mesures_niveau_eau (capteur_id, date_heure, niveau_eau)
     VALUES ($1, NOW(), $2)
     RETURNING *`,
    [capteurId, niveauEau]
  );
  return result.rows[0];
};

// Insérer une mesure de pluie
// Le trigger trg_check_pluie valide automatiquement la valeur
const insertMesurePluie = async (capteurId, pluieMm) => {
  const result = await pool.query(
    `INSERT INTO mesures_pluie (capteur_id, date_heure, pluie_mm)
     VALUES ($1, NOW(), $2)
     RETURNING *`,
    [capteurId, pluieMm]
  );
  return result.rows[0];
};

// Récupérer les dernières mesures de niveau d'eau pour une zone
const getMesuresNiveauByZone = async (zoneId, limit = 50) => {
  const result = await pool.query(
    `SELECT m.*, c.zone_id
     FROM mesures_niveau_eau m
     JOIN capteurs c ON m.capteur_id = c.capteur_id
     WHERE c.zone_id = $1
     ORDER BY m.date_heure DESC
     LIMIT $2`,
    [zoneId, limit]
  );
  return result.rows;
};

// Récupérer les dernières mesures de pluie pour une zone
const getMesuresPluieByZone = async (zoneId, limit = 50) => {
  const result = await pool.query(
    `SELECT m.*, c.zone_id
     FROM mesures_pluie m
     JOIN capteurs c ON m.capteur_id = c.capteur_id
     WHERE c.zone_id = $1
     ORDER BY m.date_heure DESC
     LIMIT $2`,
    [zoneId, limit]
  );
  return result.rows;
};

module.exports = {
  insertMesureNiveauEau,
  insertMesurePluie,
  getMesuresNiveauByZone,
  getMesuresPluieByZone
};