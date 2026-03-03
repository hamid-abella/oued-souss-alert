CREATE OR REPLACE FUNCTION check_niveau_eau_valide()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.niveau_eau < 0 OR NEW.niveau_eau > 20 THEN
        RAISE EXCEPTION 'Valeur niveau_eau invalide: %', NEW.niveau_eau;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;