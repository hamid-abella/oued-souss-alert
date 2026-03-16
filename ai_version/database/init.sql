-- =============================================================
-- Projet : Oued-Souss Alert
-- Fichier : init.sql
-- Description : Script d'initialisation complet de la base de données
--               Exécuter ce fichier pour déployer l'intégralité du projet
-- Ordre d'exécution : Tables > Contraintes > Index > Functions > Triggers > Procédures > Seed
-- =============================================================

-- Étape 1 : Création des tables et tables d'archive
\i schema/tables.sql

-- Étape 2 : Contraintes supplémentaires
\i schema/constraints.sql

-- Étape 3 : Index de performance
\i schema/indexes.sql

-- Étape 4 : Fonctions (doivent être créées AVANT les triggers qui les appellent)
\i functions/fn_check_valeurs_aberrantes.sql
\i functions/fn_trigger_alerte_critique.sql
\i functions/fn_update_niveau_alerte.sql
\i functions/fn_get_risk_trend.sql

-- Étape 5 : Triggers (dépendent des fonctions)
\i triggers/trg_check_niveau_eau.sql
\i triggers/trg_check_pluie.sql
\i triggers/trg_generate_alerte.sql
\i triggers/trg_close_alerte.sql

-- Étape 6 : Procédures stockées
\i procedures/calculate_flood_risk.sql
\i procedures/archive_old_measurements.sql

-- Étape 7 : Données de test
\i seed/mock_data.sql

\echo '========================================'
\echo 'Base de données Oued-Souss Alert initialisee avec succes.'
\echo '========================================'