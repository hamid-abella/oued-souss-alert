-- =============================================================
-- Projet : Oued-Souss Alert
-- Fichier : schema/indexes.sql
-- Description : Index pour optimiser les performances des requêtes
--               fréquentes dans le système de surveillance
-- =============================================================

-- Index sur zone_id dans capteurs
-- Optimise : afficher tous les capteurs d'une zone donnée
CREATE INDEX idx_capteurs_zone
    ON capteurs(zone_id);

-- Index composite sur capteur_id + date_heure (DESC) dans mesures_niveau_eau
-- Optimise : récupérer les dernières mesures d'un capteur spécifique
CREATE INDEX idx_mesures_niveau_capteur_date
    ON mesures_niveau_eau(capteur_id, date_heure DESC);

-- Index composite sur capteur_id + date_heure (DESC) dans mesures_pluie
-- Optimise : récupérer les précipitations récentes d'un capteur
CREATE INDEX idx_mesures_pluie_capteur_date
    ON mesures_pluie(capteur_id, date_heure DESC);

-- Index composite sur zone_id + date_calcul (DESC) dans indices_risque
-- Optimise : afficher l'indice de risque actuel d'une zone sur le dashboard
CREATE INDEX idx_indices_zone_date
    ON indices_risque(zone_id, date_calcul DESC);

-- Index composite sur zone_id + date_alerte (DESC) dans alertes
-- Optimise : afficher les alertes récentes d'une zone
CREATE INDEX idx_alertes_zone_date
    ON alertes(zone_id, date_alerte DESC);

-- Index sur statut dans alertes
-- Optimise : filtrer uniquement les alertes actives sur le dashboard
CREATE INDEX idx_alertes_statut
    ON alertes(statut);

-- Index sur capteur_id dans alertes
-- Optimise : tracer les alertes déclenchées par un capteur spécifique
CREATE INDEX idx_alertes_capteur
    ON alertes(capteur_id);