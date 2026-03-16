-- Contrainte : un capteur de type 'niveau_eau' ne peut mesurer que dans mesures_niveau_eau
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
ALTER TABLE mesures_niveau_eau
    ADD CONSTRAINT chk_date_mesure_niveau
    CHECK (date_heure <= NOW());

ALTER TABLE mesures_pluie
    ADD CONSTRAINT chk_date_mesure_pluie
    CHECK (date_heure <= NOW());

-- Contrainte : date alerte ne peut pas être dans le futur
ALTER TABLE alertes
    ADD CONSTRAINT chk_date_alerte
    CHECK (date_alerte <= NOW());