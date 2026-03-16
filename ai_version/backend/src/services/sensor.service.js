// connexion base de données
const db = require("../config/db");

/*
Récupérer tous les capteurs
Chaque capteur appartient à une zone
Relation : zones (1) ---- (N) capteurs
*/

exports.getAllSensors = async () => {

  const result = await db.query(`
        SELECT 
            c.id,
            c.type_capteur,
            c.date_installation,
            c.statut,
            c.zone_id,
            z.nom as zone_nom
        FROM capteurs c
        JOIN zones z ON c.zone_id = z.id
  `);

  return result.rows;
};


/*
Récupérer capteurs d'une zone
Utilise l'index idx_capteurs_zone
*/

exports.getSensorsByZone = async (zoneId) => {

  const result = await db.query(
    `SELECT * FROM capteurs WHERE zone_id = $1`,
    [zoneId]
  );

  return result.rows;
};


/*
Créer un capteur
*/

exports.createSensor = async (data) => {

  const { type_capteur, statut, zone_id } = data;

  const result = await db.query(
    `
    INSERT INTO capteurs
    (type_capteur, statut, zone_id)
    VALUES ($1,$2,$3)
    RETURNING *
    `,
    [type_capteur, statut, zone_id]
  );

  return result.rows[0];
};


/*
Supprimer capteur
Cascade supprimera les mesures associées
*/

exports.deleteSensor = async (id) => {

  await db.query(
    `DELETE FROM capteurs WHERE id=$1`,
    [id]
  );

};