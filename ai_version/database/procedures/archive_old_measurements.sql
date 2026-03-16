-- =============================================================
-- Projet : Oued-Souss Alert
-- Fichier : procedures/archive_old_measurements.sql
-- Description : Déplacement des anciennes mesures vers les tables d'archive
--               Maintient les performances sur les tables actives
--               Les tables archive sont créées dans schema/tables.sql
-- =============================================================

CREATE OR REPLACE PROCEDURE archive_old_measurements(p_date_limite TIMESTAMP)
LANGUAGE plpgsql AS $$
BEGIN
    -- Archivage des mesures de niveau d'eau antérieures à la date limite
    INSERT INTO mesures_niveau_eau_archive
    SELECT * FROM mesures_niveau_eau
    WHERE date_heure < p_date_limite;

    -- Suppression des données archivées de la table active
    DELETE FROM mesures_niveau_eau
    WHERE date_heure < p_date_limite;

    -- Archivage des mesures de pluie antérieures à la date limite
    INSERT INTO mesures_pluie_archive
    SELECT * FROM mesures_pluie
    WHERE date_heure < p_date_limite;

    -- Suppression des données archivées de la table active
    DELETE FROM mesures_pluie
    WHERE date_heure < p_date_limite;

    RAISE NOTICE 'Archivage terminé : mesures antérieures au % déplacées.', p_date_limite;
END;
$$;