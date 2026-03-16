-- =============================================================
-- Projet : Oued-Souss Alert
-- Fichier : triggers/trg_generate_alerte.sql
-- Description : Trigger de génération automatique d'alerte critique
--               Appelle fn_trigger_alerte_critique.sql
-- =============================================================

-- Dépendance : la fonction generate_alerte_critique() doit exister
-- Exécuter fn_trigger_alerte_critique.sql avant ce fichier

CREATE TRIGGER trg_generate_alerte
AFTER INSERT ON indices_risque   -- exécuté APRÈS insertion d'un indice calculé
FOR EACH ROW
EXECUTE FUNCTION generate_alerte_critique();