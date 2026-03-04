-- =========================
-- Blocage des valeurs aberrantes (niveau eau)
-- =========================

CREATE TRIGGER trg_check_niveau_eau
BEFORE INSERT ON mesures_niveau_eau
FOR EACH ROW
EXECUTE FUNCTION check_niveau_eau_valide();