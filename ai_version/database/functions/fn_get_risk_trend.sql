CREATE OR REPLACE FUNCTION get_risk_trend(
    p_zone_id INT,
    p_date_debut TIMESTAMP,
    p_date_fin TIMESTAMP
)
RETURNS TABLE (
    zone_id INT,
    indice_debut NUMERIC,
    indice_fin NUMERIC,
    tendance TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_indice_debut NUMERIC;
    v_indice_fin NUMERIC;
BEGIN

    -- Premier indice dans la période
    SELECT valeur_indice
    INTO v_indice_debut
    FROM indices_risque
    WHERE zone_id = p_zone_id
    AND date_calcul >= p_date_debut
    ORDER BY date_calcul ASC
    LIMIT 1;

    -- Dernier indice dans la période
    SELECT valeur_indice
    INTO v_indice_fin
    FROM indices_risque
    WHERE zone_id = p_zone_id
    AND date_calcul <= p_date_fin
    ORDER BY date_calcul DESC
    LIMIT 1;

    -- Détermination de la tendance
    RETURN QUERY
    SELECT 
        p_zone_id,
        v_indice_debut,
        v_indice_fin,
        CASE
            WHEN v_indice_fin > v_indice_debut THEN 'augmentation'
            WHEN v_indice_fin < v_indice_debut THEN 'diminution'
            ELSE 'stable'
        END;

END;
$$;