CREATE OR REPLACE PROCEDURE get_risk_trend(
    p_zone_id INT,
    p_days INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    SELECT date_calcul,
           valeur_indice,
           niveau_risque
    FROM indices_risque
    WHERE zone_id = p_zone_id
    AND date_calcul >= NOW() - (p_days || ' days')::INTERVAL
    ORDER BY date_calcul DESC;
END;
$$;