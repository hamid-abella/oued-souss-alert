// =============================================================
// Projet : Oued-Souss Alert
// Fichier : src/services/capteurs.service.js
// Description : Logique métier pour les capteurs
// =============================================================

const pool = require('../config/db');

const getAllCapteurs = async () => {
  const result = await pool.query(`
    SELECT c.*, z.nom AS zone_nom
    FROM capteurs c
    JOIN zones z ON c.zone_id = z.zone_id
    ORDER BY c.capteur_id
  `);
  return result.rows;
};

const getCapteursByZone = async (zoneId) => {
  const result = await pool.query(
    `SELECT * FROM capteurs WHERE zone_id = $1 ORDER BY capteur_id`,
    [zoneId]
  );
  return result.rows;
};

const getCapteurById = async (capteurId) => {
  const result = await pool.query(
    'SELECT * FROM capteurs WHERE capteur_id = $1',
    [capteurId]
  );
  return result.rows[0] || null;
};

const createCapteur = async (data) => {
  const { zone_id, type_capteur, date_installation, statut } = data;
  const result = await pool.query(
    `INSERT INTO capteurs (zone_id, type_capteur, date_installation, statut)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [zone_id, type_capteur, date_installation, statut || 'actif']
  );
  return result.rows[0];
};

const updateStatutCapteur = async (capteurId, statut) => {
  const result = await pool.query(
    `UPDATE capteurs SET statut = $1 WHERE capteur_id = $2 RETURNING *`,
    [statut, capteurId]
  );
  return result.rows[0] || null;
};

module.exports = {
  getAllCapteurs,
  getCapteursByZone,
  getCapteurById,
  createCapteur,
  updateStatutCapteur
};