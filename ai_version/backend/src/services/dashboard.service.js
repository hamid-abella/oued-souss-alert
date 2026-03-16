// =============================================================
// Projet : Oued-Souss Alert
// Fichier : src/services/dashboard.service.js
// Description : Données agrégées pour le dashboard interactif
// Spec : Carte interactive affichant les zones menacées
// =============================================================

const pool = require('../config/db');

// Vue globale : toutes les zones avec leur état de risque actuel
const getDashboardOverview = async () => {
  const result = await pool.query(`
    SELECT
      z.zone_id,
      z.nom,
      z.type_zone,
      z.latitude,
      z.longitude,
      z.seuil_critique,
      ir.niveau_risque,
      ir.valeur_indice,
      ir.date_calcul,
      -- Dernier niveau d'eau mesuré
      (
        SELECT m.niveau_eau
        FROM mesures_niveau_eau m
        JOIN capteurs c ON m.capteur_id = c.capteur_id
        WHERE c.zone_id = z.zone_id
        ORDER BY m.date_heure DESC
        LIMIT 1
      ) AS dernier_niveau_eau,
      -- Nombre d'alertes actives sur cette zone
      (
        SELECT COUNT(*)
        FROM alertes a
        WHERE a.zone_id = z.zone_id
          AND a.statut = 'ACTIVE'
      ) AS alertes_actives_count
    FROM zones z
    LEFT JOIN LATERAL (
      SELECT niveau_risque, valeur_indice, date_calcul
      FROM indices_risque
      WHERE zone_id = z.zone_id
      ORDER BY date_calcul DESC
      LIMIT 1
    ) ir ON true
    ORDER BY ir.valeur_indice DESC NULLS LAST
  `);
  return result.rows;
};

// Statistiques générales pour les widgets du dashboard
const getDashboardStats = async () => {
  const result = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM zones)                              AS total_zones,
      (SELECT COUNT(*) FROM capteurs WHERE statut = 'actif')   AS capteurs_actifs,
      (SELECT COUNT(*) FROM alertes WHERE statut = 'ACTIVE')   AS alertes_actives,
      (SELECT COUNT(*) FROM alertes
       WHERE statut = 'ACTIVE'
         AND type_alerte = 'CRUE')                             AS crues_actives,
      (SELECT COUNT(*) FROM capteurs WHERE statut = 'hors_service') AS capteurs_hs
  `);
  return result.rows[0];
};

module.exports = { getDashboardOverview, getDashboardStats };