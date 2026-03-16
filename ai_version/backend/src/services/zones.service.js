// =============================================================
// Projet : Oued-Souss Alert
// Fichier : src/services/zones.service.js
// Description : Logique métier pour les zones géographiques
// =============================================================

const pool = require('../config/db');

// Récupérer toutes les zones avec leur dernier indice de risque
const getAllZones = async () => {
  const result = await pool.query(`
    SELECT
      z.zone_id,
      z.nom,
      z.type_zone,
      z.superficie,
      z.latitude,
      z.longitude,
      z.seuil_critique,
      ir.niveau_risque   AS dernier_niveau_risque,
      ir.valeur_indice   AS dernier_indice,
      ir.date_calcul     AS date_dernier_calcul
    FROM zones z
    LEFT JOIN LATERAL (
      SELECT niveau_risque, valeur_indice, date_calcul
      FROM indices_risque
      WHERE zone_id = z.zone_id
      ORDER BY date_calcul DESC
      LIMIT 1
    ) ir ON true
    ORDER BY z.zone_id
  `);
  return result.rows;
};

// Récupérer une zone par ID
const getZoneById = async (zoneId) => {
  const result = await pool.query(
    'SELECT * FROM zones WHERE zone_id = $1',
    [zoneId]
  );
  return result.rows[0] || null;
};

// Créer une nouvelle zone
const createZone = async (data) => {
  const { nom, type_zone, superficie, latitude, longitude, seuil_critique } = data;
  const result = await pool.query(
    `INSERT INTO zones (nom, type_zone, superficie, latitude, longitude, seuil_critique)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [nom, type_zone, superficie, latitude, longitude, seuil_critique]
  );
  return result.rows[0];
};

// Mettre à jour le seuil critique d'une zone
const updateZone = async (zoneId, data) => {
  const { nom, type_zone, superficie, seuil_critique } = data;
  const result = await pool.query(
    `UPDATE zones
     SET nom = $1, type_zone = $2, superficie = $3, seuil_critique = $4
     WHERE zone_id = $5
     RETURNING *`,
    [nom, type_zone, superficie, seuil_critique, zoneId]
  );
  return result.rows[0] || null;
};

// Supprimer une zone
const deleteZone = async (zoneId) => {
  const result = await pool.query(
    'DELETE FROM zones WHERE zone_id = $1 RETURNING *',
    [zoneId]
  );
  return result.rows[0] || null;
};

module.exports = { getAllZones, getZoneById, createZone, updateZone, deleteZone };