-- =============================================================
-- Projet : Oued-Souss Alert
-- Fichier : triggers/trg_close_alerte.sql
-- Description : Trigger de fermeture automatique des alertes
--               si le niveau d'eau redescend sous le seuil de sécurité
-- =============================================================

-- Dépendance : la fonction close_alerte_si_baisse() doit exister
-- Exécuter fn_update_niveau_alerte.sql avant ce fichier

CREATE TRIGGER trg_close_alerte
AFTER INSERT ON mesures_niveau_eau   -- déclenché à chaque nouvelle mesure
FOR EACH ROW
EXECUTE FUNCTION close_alerte_si_baisse();