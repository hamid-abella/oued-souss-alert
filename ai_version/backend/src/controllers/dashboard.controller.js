const db = require("../config/db");


/*
Statistiques globales
*/

exports.getDashboardStats = async (req,res,next)=>{

  try{

    const zones = await db.query(`SELECT COUNT(*) FROM zones`);
    const capteurs = await db.query(`SELECT COUNT(*) FROM capteurs`);
    const alertes = await db.query(
      `SELECT COUNT(*) FROM alertes WHERE statut='active'`
    );

    res.json({

      zones: zones.rows[0].count,
      capteurs: capteurs.rows[0].count,
      alertes_actives: alertes.rows[0].count

    });

  }catch(err){

    next(err);

  }

};



/*
Dernières alertes pour dashboard
*/

exports.getRecentAlerts = async (req,res,next)=>{

  try{

    const alerts = await db.query(
      `
      SELECT *
      FROM alertes
      ORDER BY date_generation DESC
      LIMIT 10
      `
    );

    res.json(alerts.rows);

  }catch(err){

    next(err);

  }

};