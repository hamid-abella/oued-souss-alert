-- =========================
-- Mise à jour automatique du statut alerte
-- Si une nouvelle mesure montre niveau < 50% seuil critique → Clôturer alertes actives
-- =========================

CREATE TRIGGER trg_close_alerte
AFTER INSERT ON mesures_niveau_eau
FOR EACH ROW
EXECUTE FUNCTION close_alerte_si_baisse();