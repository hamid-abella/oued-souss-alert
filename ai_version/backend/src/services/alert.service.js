const db = require("../config/db");


/*
Récupérer toutes les alertes
*/

exports.getAllAlerts = async () => {

  const result = await db.query(`
        SELECT 
        a.id,
        a.type_alerte,
        a.message,
        a.statut,
        a.date_generation,
        z.nom as zone
        FROM alertes a
        JOIN zones z ON a.zone_id = z.id
        ORDER BY a.date_generation DESC
    `);

  return result.rows;
};


/*
Alertes actives seulement
Utilise index idx_alertes_statut
*/

exports.getActiveAlerts = async () => {

  const result = await db.query(
    `SELECT * FROM alertes WHERE statut='active'`
  );

  return result.rows;
};


/*
Créer alerte
*/

exports.createAlert = async (data) => {

  const { zone_id, type_alerte, message } = data;

  const result = await db.query(
    `
    INSERT INTO alertes
    (zone_id,type_alerte,message,statut)
    VALUES ($1,$2,$3,'active')
    RETURNING *
    `,
    [zone_id, type_alerte, message]
  );

  return result.rows[0];
};


/*
Fermer alerte
*/

exports.closeAlert = async (id) => {

  await db.query(
    `
    UPDATE alertes
    SET statut='resolue'
    WHERE id=$1
    `,
    [id]
  );

};