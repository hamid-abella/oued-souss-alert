CREATE OR REPLACE FUNCTION close_alerte_si_baisse()
RETURNS TRIGGER AS $$
DECLARE
    seuil NUMERIC;
    id_zone INT;
BEGIN
    -- Récupérer la zone du capteur
    SELECT zone_id INTO id_zone
    FROM capteurs
    WHERE capteur_id = NEW.capteur_id;

    -- Récupérer seuil critique de la zone
    SELECT seuil_critique INTO seuil
    FROM zones
    WHERE zone_id = id_zone;

    -- Si niveau < 50% du seuil → clôturer alertes
    IF NEW.niveau_eau < (seuil * 0.5) THEN
        UPDATE alertes
        SET statut = 'RESOLUE'
        WHERE zone_id = id_zone
        AND statut = 'ACTIVE';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;