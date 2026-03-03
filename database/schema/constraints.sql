-- =========================
-- FOREIGN KEYS & CONSTRAINTS
-- =========================

ALTER TABLE zones
ADD CONSTRAINT check_seuil_positive
CHECK (seuil_critique > 0);

ALTER TABLE capteurs
ADD CONSTRAINT fk_capteurs_zone
FOREIGN KEY (zone_id)
REFERENCES zones(zone_id)
ON DELETE CASCADE;

ALTER TABLE mesures_niveau_eau
ADD CONSTRAINT fk_mesures_niveau_capteur
FOREIGN KEY (capteur_id)
REFERENCES capteurs(capteur_id)
ON DELETE CASCADE;

ALTER TABLE mesures_pluie
ADD CONSTRAINT fk_mesures_pluie_capteur
FOREIGN KEY (capteur_id)
REFERENCES capteurs(capteur_id)
ON DELETE CASCADE;

ALTER TABLE indices_risque
ADD CONSTRAINT fk_indices_zone
FOREIGN KEY (zone_id)
REFERENCES zones(zone_id)
ON DELETE CASCADE;

ALTER TABLE alertes
ADD CONSTRAINT fk_alertes_zone
FOREIGN KEY (zone_id)
REFERENCES zones(zone_id)
ON DELETE CASCADE;

ALTER TABLE alertes
ADD CONSTRAINT fk_alertes_indice
FOREIGN KEY (indice_id)
REFERENCES indices_risque(indice_id)
ON DELETE SET NULL;