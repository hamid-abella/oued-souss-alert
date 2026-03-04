-- =========================
-- INDEXES FOR PERFORMANCE
-- =========================

CREATE INDEX idx_capteurs_zone
ON capteurs(zone_id);

CREATE INDEX idx_mesures_niveau_capteur_date
ON mesures_niveau_eau(capteur_id, date_heure DESC);

CREATE INDEX idx_mesures_pluie_capteur_date
ON mesures_pluie(capteur_id, date_heure DESC);

CREATE INDEX idx_indices_zone_date
ON indices_risque(zone_id, date_calcul DESC);

CREATE INDEX idx_alertes_zone_date
ON alertes(zone_id, date_alerte DESC);

CREATE INDEX idx_alertes_statut
ON alertes(statut);