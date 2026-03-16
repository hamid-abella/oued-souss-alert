-- =============================================================
-- Projet : Oued-Souss Alert
-- Fichier : triggers/trg_check_niveau_eau.sql
-- Description : Trigger de validation du niveau d'eau avant insertion
--               Appelle fn_check_valeurs_aberrantes.sql
-- Tâche QA : Gestion capteur défaillant (ex: -50m)
-- =============================================================

-- Dépendance : la fonction check_niveau_eau_valide() doit exister
-- Exécuter fn_check_valeurs_aberrantes.sql avant ce fichier

CREATE TRIGGER trg_check_niveau_eau
BEFORE INSERT ON mesures_niveau_eau  -- exécuté AVANT l'insertion pour bloquer les valeurs invalides
FOR EACH ROW
EXECUTE FUNCTION check_niveau_eau_valide();