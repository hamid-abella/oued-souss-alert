-- =============================================================
-- Projet : Oued-Souss Alert
-- Fichier : functions/fn_get_risk_trend.sql
-- Description : Analyse de la tendance du risque pour une zone
--               sur une période donnée (utile pour le dashboard)
-- =============================================================

CREATE OR REPLACE FUNCTION get_risk_trend(
    p_zone_id    INT,
    p_date_debut TIMESTAMP,
    p_date_fin   TIMESTAMP
)
RETURNS TABLE (
    zone_id       INT,
    indice_debut  NUMERIC,
    indice_fin    NUMERIC,
    tendance      TEXT
)
LANGUAGE plpgsql AS $$
DECLARE
    v_indice_debut NUMERIC;
    v_indice_fin   NUMERIC;
BEGIN
    -- Premier indice de risque dans la période (ordre croissant)
    SELECT valeur_indice INTO v_indice_debut
    FROM indices_risque
    WHERE zone_id      = p_zone_id
      AND date_calcul >= p_date_debut
      AND date_calcul <= p_date_fin
    ORDER BY date_calcul ASC
    LIMIT 1;

    -- Dernier indice de risque dans la période (ordre décroissant)
    SELECT valeur_indice INTO v_indice_fin
    FROM indices_risque
    WHERE zone_id      = p_zone_id
      AND date_calcul >= p_date_debut
      AND date_calcul <= p_date_fin
    ORDER BY date_calcul DESC
    LIMIT 1;

    -- Comparaison des deux valeurs pour déterminer la tendance
    RETURN QUERY
    SELECT
        p_zone_id,
        v_indice_debut,
        v_indice_fin,
        CASE
            WHEN v_indice_fin > v_indice_debut THEN 'augmentation' -- risque croissant
            WHEN v_indice_fin < v_indice_debut THEN 'diminution'   -- risque décroissant
            ELSE 'stable'                                           -- risque constant
        END;
END;
$$;