-- =============================================================
-- Projet : Oued-Souss Alert
-- Fichier : functions/fn_update_niveau_alerte.sql
-- Description : Fermeture automatique des alertes actives
--               si le niveau d'eau redescend sous 50% du seuil critique
-- =============================================================

CREATE OR REPLACE FUNCTION close_alerte_si_baisse()
RETURNS TRIGGER AS $$
DECLARE
    v_seuil   NUMERIC;
    v_zone_id INT;
BEGIN
    -- Récupérer la zone associée au capteur ayant envoyé la mesure
    SELECT zone_id INTO v_zone_id
    FROM capteurs
    WHERE capteur_id = NEW.capteur_id;

    -- Récupérer le seuil critique de cette zone
    SELECT seuil_critique INTO v_seuil
    FROM zones
    WHERE zone_id = v_zone_id;

    -- Si le niveau d'eau est inférieur à 50% du seuil => danger écarté
    -- On résout automatiquement toutes les alertes actives de cette zone
    IF NEW.niveau_eau < (v_seuil * 0.5) THEN
        UPDATE alertes
        SET statut = 'RESOLUE'
        WHERE zone_id = v_zone_id
          AND statut = 'ACTIVE';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;