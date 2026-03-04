CREATE OR REPLACE FUNCTION generate_alerte_critique()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.niveau_risque = 'CRITIQUE' THEN
        INSERT INTO alertes (
            zone_id,
            indice_id,
            date_alerte,
            type_alerte,
            message,
            statut
        )
        VALUES (
            NEW.zone_id,
            NEW.indice_id,
            NOW(),
            'CRUE',
            'Risque critique de crue détecté.',
            'ACTIVE'
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;