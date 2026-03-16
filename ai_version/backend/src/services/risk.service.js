const db = require("../config/db");


/*
Récupérer dernier indice de risque d'une zone
*/

exports.getLatestRisk = async (zoneId) => {

  const result = await db.query(
    `
    SELECT *
    FROM indices_risque
    WHERE zone_id=$1
    ORDER BY date_calcul DESC
    LIMIT 1
    `,
    [zoneId]
  );

  return result.rows[0];

};


/*
Historique du risque
*/

exports.getRiskHistory = async (zoneId) => {

  const result = await db.query(
    `
    SELECT *
    FROM indices_risque
    WHERE zone_id=$1
    ORDER BY date_calcul DESC
    `,
    [zoneId]
  );

  return result.rows;

};