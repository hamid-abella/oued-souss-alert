// Import connexion DB
const db = require("../config/db");



// récupérer toutes les zones
exports.getAllZones = async () => {

  const result = await db.query(`
        SELECT 
            id,
            nom,
            type_zone,
            superficie,
            latitude,
            longitude,
            seuil_critique
        FROM zones
    `);

  return result.rows;

};



// récupérer zone par id
exports.getZoneById = async (id) => {

  const result = await db.query(
    `SELECT * FROM zones WHERE id = $1`,
    [id]
  );

  return result.rows[0];

};



// créer zone
exports.createZone = async (data) => {

  const { nom, type_zone, superficie, latitude, longitude, seuil_critique } = data;

  const result = await db.query(
    `
        INSERT INTO zones
        (nom, type_zone, superficie, latitude, longitude, seuil_critique)
        VALUES ($1,$2,$3,$4,$5,$6)
        RETURNING *
        `,
    [nom, type_zone, superficie, latitude, longitude, seuil_critique]
  );

  return result.rows[0];

};



// modifier zone
exports.updateZone = async (id, data) => {

  const { nom, type_zone, superficie, latitude, longitude, seuil_critique } = data;

  const result = await db.query(
    `
        UPDATE zones
        SET
        nom=$1,
        type_zone=$2,
        superficie=$3,
        latitude=$4,
        longitude=$5,
        seuil_critique=$6
        WHERE id=$7
        RETURNING *
        `,
    [nom, type_zone, superficie, latitude, longitude, seuil_critique, id]
  );

  return result.rows[0];

};



// supprimer zone
exports.deleteZone = async (id) => {

  await db.query(
    `DELETE FROM zones WHERE id=$1`,
    [id]
  );

};