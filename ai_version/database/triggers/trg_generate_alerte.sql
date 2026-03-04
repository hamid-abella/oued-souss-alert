-- =========================
-- Génération automatique d’alerte 
-- Si niveau_risque = 'CRITIQUE' → créer une alerte
-- =========================

CREATE TRIGGER trg_generate_alerte
AFTER INSERT ON indices_risque
FOR EACH ROW
EXECUTE FUNCTION generate_alerte_critique();