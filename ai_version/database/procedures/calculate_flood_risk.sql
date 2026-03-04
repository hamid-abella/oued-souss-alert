CREATE OR REPLACE PROCEDURE calculate_flood_risk(p_zone_id INT)
LANGUAGE plpgsql
AS $$
DECLARE
    avg_niveau NUMERIC;
    avg_pluie NUMERIC;
    indice NUMERIC;
    niveau VARCHAR(20);
    seuil NUMERIC;
BEGIN

    -- Moyenne niveau eau 24h
    SELECT AVG(m.niveau_eau)
    INTO avg_niveau
    FROM mesures_niveau_eau m
    JOIN capteurs c ON m.capteur_id = c.capteur_id
    WHERE c.zone_id = p_zone_id
    AND m.date_heure >= NOW() - INTERVAL '1 day';

    -- Moyenne pluie 7 jours
    SELECT AVG(mp.quantite_pluie)
    INTO avg_pluie
    FROM mesures_pluie mp
    JOIN capteurs c ON mp.capteur_id = c.capteur_id
    WHERE c.zone_id = p_zone_id
    AND mp.date_heure >= NOW() - INTERVAL '7 days';

    indice := COALESCE(avg_niveau,0) * 0.6
            + COALESCE(avg_pluie,0) * 0.4;

    -- Récupérer seuil critique
    SELECT seuil_critique INTO seuil
    FROM zones
    WHERE zone_id = p_zone_id;

    -- Classification dynamique
    IF indice >= seuil THEN
        niveau := 'CRITIQUE';
    ELSIF indice >= seuil * 0.7 THEN
        niveau := 'ELEVE';
    ELSIF indice >= seuil * 0.4 THEN
        niveau := 'MOYEN';
    ELSE
        niveau := 'FAIBLE';
    END IF;

    INSERT INTO indices_risque (
        zone_id,
        date_calcul,
        valeur_indice,
        niveau_risque
    )
    VALUES (
        p_zone_id,
        NOW(),
        indice,
        niveau
    );

END;
$$;