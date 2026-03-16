-- =============================================================
-- Projet : Oued-Souss Alert
-- Fichier : triggers/trg_check_pluie.sql
-- Description : Trigger de validation de la quantité de pluie avant insertion
--               Appelle fn_check_valeurs_aberrantes.sql
-- =============================================================

-- Dépendance : la fonction check_pluie_valide() doit exister
-- Exécuter fn_check_valeurs_aberrantes.sql avant ce fichier

CREATE TRIGGER trg_check_pluie
BEFORE INSERT ON mesures_pluie       -- exécuté AVANT l'insertion pour bloquer les valeurs invalides
FOR EACH ROW
EXECUTE FUNCTION check_pluie_valide();