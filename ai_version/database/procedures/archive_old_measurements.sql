CREATE OR REPLACE PROCEDURE archive_old_measurements(p_date_limite TIMESTAMP)
LANGUAGE plpgsql
AS $$
BEGIN

    -- Archiver les mesures de niveau d'eau
    INSERT INTO mesures_niveau_eau_archive
    SELECT *
    FROM mesures_niveau_eau
    WHERE date_heure < p_date_limite;

    DELETE FROM mesures_niveau_eau
    WHERE date_heure < p_date_limite;

    -- Archiver les mesures de pluie
    INSERT INTO mesures_pluie_archive
    SELECT *
    FROM mesures_pluie
    WHERE date_heure < p_date_limite;

    DELETE FROM mesures_pluie
    WHERE date_heure < p_date_limite;

END;
$$;