-- =============================================================
-- Projet : Oued-Souss Alert
-- Fichier : schema/constraints.sql
-- Description : Contraintes CHECK supplémentaires
-- Correction : Tolérance de 1 seconde sur les contraintes de date des mesures
--              pour éviter des rejets aléatoires en cas de décalage d'horloge
--              entre le capteur et le serveur PostgreSQL
-- =============================================================

-- Contrainte : valeur indice toujours entre 0 et 1
ALTER TABLE indices_risque
    ADD CONSTRAINT chk_valeur_indice
    CHECK (valeur_indice >= 0 AND valeur_indice <= 1);

-- Contrainte : superficie toujours positive si renseignée
ALTER TABLE zones
    ADD CONSTRAINT chk_superficie_positive
    CHECK (superficie IS NULL OR superficie > 0);

-- Contrainte : date d'installation capteur ne peut pas être dans le futur
ALTER TABLE capteurs
    ADD CONSTRAINT chk_date_installation
    CHECK (date_installation IS NULL OR date_installation <= CURRENT_DATE);

-- Contrainte : date de mesure ne peut pas être dans le futur
-- Tolérance de 1 seconde pour absorber les légères dérives d'horloge
-- entre les capteurs terrain et le serveur de base de données
ALTER TABLE mesures_niveau_eau
    ADD CONSTRAINT chk_date_mesure_niveau
    CHECK (date_heure <= NOW() + INTERVAL '1 second');

ALTER TABLE mesures_pluie
    ADD CONSTRAINT chk_date_mesure_pluie
    CHECK (date_heure <= NOW() + INTERVAL '1 second');

-- Contrainte : date alerte ne peut pas être dans le futur
ALTER TABLE alertes
    ADD CONSTRAINT chk_date_alerte
    CHECK (date_alerte <= NOW() + INTERVAL '1 second');