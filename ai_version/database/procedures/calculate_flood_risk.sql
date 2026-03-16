-- =============================================================
-- Projet : Oued-Souss Alert
-- Fichier : procedures/calculate_flood_risk.sql
-- Description : Calcul de l'indice de risque de crue
--               Croise le niveau actuel de l'eau + historique 7 jours de pluie
--               Variables normalisées entre 0 et 1 avant pondération
-- Poids : 60% niveau (indicateur direct) + 40% pluie (indicateur prédictif)
-- =============================================================

CREATE OR REPLACE PROCEDURE calculate_flood_risk(p_zone_id INT)
LANGUAGE plpgsql AS $$
DECLARE
    niveau_actuel  NUMERIC;
    avg_pluie      NUMERIC;
    seuil          NUMERIC;
    pluie_max      NUMERIC := 150;  -- max historique Souss-Massa en mm/7j (source : ABH Souss-Massa)
    niveau_norm    NUMERIC;         -- niveau normalisé [0, 1]
    pluie_norm     NUMERIC;         -- pluie normalisée [0, 1]
    indice         NUMERIC;
    niveau         VARCHAR(20);
BEGIN
    -- Étape 1 : Récupérer la dernière mesure de niveau d'eau de la zone
    SELECT m.niveau_eau INTO niveau_actuel
    FROM mesures_niveau_eau m
    JOIN capteurs c ON m.capteur_id = c.capteur_id
    WHERE c.zone_id = p_zone_id
      AND c.statut  = 'actif'       -- ignorer les capteurs hors service
    ORDER BY m.date_heure DESC
    LIMIT 1;

    -- Étape 2 : Récupérer le seuil critique de la zone
    SELECT seuil_critique INTO seuil
    FROM zones
    WHERE zone_id = p_zone_id;

    -- Étape 3 : Calculer la moyenne des précipitations sur les 7 derniers jours
    SELECT COALESCE(AVG(mp.pluie_mm), 0) INTO avg_pluie
    FROM mesures_pluie mp
    JOIN capteurs c ON mp.capteur_id = c.capteur_id
    WHERE c.zone_id   = p_zone_id
      AND mp.date_heure >= NOW() - INTERVAL '7 days';

    -- Étape 4 : Normalisation des variables entre 0 et 1
    -- Évite le problème d'unités différentes (mètres vs millimètres)
    niveau_norm := LEAST(COALESCE(niveau_actuel, 0) / NULLIF(seuil, 0), 1.0);
    pluie_norm  := LEAST(COALESCE(avg_pluie, 0) / pluie_max, 1.0);

    -- Étape 5 : Calcul de l'indice pondéré
    -- 60% niveau d'eau : indicateur direct et immédiat du danger
    -- 40% pluie        : indicateur prédictif (sols saturés amplifient le risque)
    indice := (niveau_norm * 0.6) + (pluie_norm * 0.4);

    -- Étape 6 : Classification du niveau de risque
    IF    indice >= 0.9 THEN niveau := 'CRITIQUE';  -- intervention immédiate
    ELSIF indice >= 0.7 THEN niveau := 'ELEVE';     -- surveillance renforcée
    ELSIF indice >= 0.4 THEN niveau := 'MOYEN';     -- vigilance
    ELSE                     niveau := 'FAIBLE';    -- situation normale
    END IF;

    -- Étape 7 : Enregistrement du résultat dans l'historique
    INSERT INTO indices_risque(zone_id, date_calcul, valeur_indice, niveau_risque)
    VALUES (p_zone_id, NOW(), indice, niveau);

END;
$$;