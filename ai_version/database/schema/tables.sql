-- =============================================================
-- Projet : Oued-Souss Alert
-- Fichier : schema/tables.sql
-- Description : Création des 7 tables principales + 2 tables d'archive
-- Correction : Suppression explicite des contraintes FK héritées sur les
--              tables d'archive (CREATE TABLE AS copie la structure mais
--              pas les contraintes nommées ; les FK implicites peuvent
--              provoquer des erreurs lors d'archivage si les capteurs
--              référencés ont été supprimés entre-temps)
-- =============================================================

-- Table des utilisateurs du système
-- Gère l'authentification et le RBAC
CREATE TABLE users (
    user_id    SERIAL PRIMARY KEY,
    nom        VARCHAR(100)  NOT NULL,
    email      VARCHAR(150)  NOT NULL UNIQUE,
    password   VARCHAR(255)  NOT NULL,       -- hashé avec bcrypt
    role       VARCHAR(20)   NOT NULL CHECK (role IN ('admin', 'operateur', 'lecteur', 'securite')),
    actif      BOOLEAN       DEFAULT TRUE,   -- désactiver sans supprimer
    created_at TIMESTAMP     DEFAULT NOW(),
    updated_at TIMESTAMP     DEFAULT NOW()
);

-- Table des zones géographiques surveillées
-- Contient les zones agricoles et urbaines proches de l'Oued Souss
CREATE TABLE zones (
    zone_id        SERIAL PRIMARY KEY,
    nom            VARCHAR(100) NOT NULL,
    type_zone      VARCHAR(50)  CHECK (type_zone IN ('agricole', 'urbaine', 'mixte')),
    superficie     DECIMAL(10,2),                          -- superficie en hectares
    latitude       DECIMAL(9,6),                           -- coordonnées GPS
    longitude      DECIMAL(9,6),
    seuil_critique NUMERIC      NOT NULL CHECK (seuil_critique > 0) -- niveau d'eau en mètres déclenchant l'alerte
);

-- Table des capteurs installés sur le terrain
-- Chaque capteur appartient à une seule zone (relation 1-N)
CREATE TABLE capteurs (
    capteur_id        SERIAL PRIMARY KEY,
    zone_id           INTEGER      NOT NULL,
    type_capteur      VARCHAR(50)  NOT NULL CHECK (type_capteur IN ('niveau_eau', 'pluie')),
    date_installation DATE,
    statut            VARCHAR(20)  DEFAULT 'actif' CHECK (statut IN ('actif', 'maintenance', 'hors_service')),

    -- Intégrité référentielle : suppression zone => suppression capteurs associés
    CONSTRAINT fk_capteurs_zone
        FOREIGN KEY (zone_id)
        REFERENCES zones(zone_id)
        ON DELETE CASCADE
);

-- Table des mesures de niveau d'eau
-- Historique complet des relevés hydrologiques par capteur
CREATE TABLE mesures_niveau_eau (
    mesure_id  SERIAL PRIMARY KEY,
    capteur_id INTEGER         NOT NULL,
    date_heure TIMESTAMP       NOT NULL,
    niveau_eau NUMERIC(5,2)    NOT NULL, -- valeur en mètres, validée par trigger

    CONSTRAINT fk_mesures_niveau_capteur
        FOREIGN KEY (capteur_id)
        REFERENCES capteurs(capteur_id)
        ON DELETE CASCADE
);

-- Table des mesures de précipitations
-- Corrélée avec mesures_niveau_eau pour le calcul d'indice de risque
CREATE TABLE mesures_pluie (
    mesure_id  SERIAL PRIMARY KEY,
    capteur_id INTEGER         NOT NULL,
    date_heure TIMESTAMP       NOT NULL,
    pluie_mm   NUMERIC(5,2)    NOT NULL, -- quantité en millimètres, validée par trigger

    CONSTRAINT fk_mesures_pluie_capteur
        FOREIGN KEY (capteur_id)
        REFERENCES capteurs(capteur_id)
        ON DELETE CASCADE
);

-- Table des indices de risque calculés
-- Résultats de la procédure calculate_flood_risk, stockés pour historique analytique
CREATE TABLE indices_risque (
    indice_id     SERIAL PRIMARY KEY,
    zone_id       INTEGER         NOT NULL,
    date_calcul   TIMESTAMP       NOT NULL,
    valeur_indice NUMERIC(5,2)    NOT NULL, -- valeur normalisée entre 0 et 1
    niveau_risque VARCHAR(20)     CHECK (niveau_risque IN ('FAIBLE', 'MOYEN', 'ELEVE', 'CRITIQUE')),

    CONSTRAINT fk_indices_zone
        FOREIGN KEY (zone_id)
        REFERENCES zones(zone_id)
        ON DELETE CASCADE
);

-- Table des alertes générées par le système
-- Centralise toutes les alertes avec traçabilité complète (zone + capteur + indice)
CREATE TABLE alertes (
    alerte_id   SERIAL PRIMARY KEY,
    zone_id     INTEGER         NOT NULL,
    indice_id   INTEGER,                   -- nullable : ON DELETE SET NULL
    capteur_id  INTEGER,                   -- traçabilité du capteur déclencheur
    date_alerte TIMESTAMP       NOT NULL,
    type_alerte VARCHAR(50)     CHECK (type_alerte IN ('CRUE', 'PRECIPITATION_INTENSE', 'DEPASSEMENT_SEUIL')),
    message     TEXT,
    statut      VARCHAR(20)     DEFAULT 'ACTIVE' CHECK (statut IN ('ACTIVE', 'RESOLUE')),

    -- Si zone supprimée => alertes supprimées
    CONSTRAINT fk_alertes_zone
        FOREIGN KEY (zone_id)
        REFERENCES zones(zone_id)
        ON DELETE CASCADE,

    -- Si indice supprimé => indice_id mis à NULL (alerte reste dans l'historique)
    CONSTRAINT fk_alertes_indice
        FOREIGN KEY (indice_id)
        REFERENCES indices_risque(indice_id)
        ON DELETE SET NULL,

    -- Si capteur supprimé => capteur_id mis à NULL (alerte reste traçable)
    CONSTRAINT fk_alertes_capteur
        FOREIGN KEY (capteur_id)
        REFERENCES capteurs(capteur_id)
        ON DELETE SET NULL
);

-- =============================================================
-- Tables d'archive pour les anciennes mesures
-- Même structure que les tables principales, sans données
-- (remplies par la procédure archive_old_measurements)
--
-- IMPORTANT : CREATE TABLE AS copie uniquement les colonnes, pas les
-- contraintes nommées. Les FK sont explicitement supprimées ci-dessous
-- pour éviter des erreurs d'intégrité référentielle lors de l'archivage
-- (un capteur peut avoir été supprimé après la mesure originale).
-- =============================================================
CREATE TABLE mesures_niveau_eau_archive
    AS TABLE mesures_niveau_eau WITH NO DATA;

CREATE TABLE mesures_pluie_archive
    AS TABLE mesures_pluie WITH NO DATA;

-- Suppression des éventuelles FK héritées sur les tables d'archive
-- (PostgreSQL ne copie pas les contraintes nommées via AS TABLE,
--  mais cette suppression explicite sécurise les environnements
--  où la structure aurait été créée autrement)
ALTER TABLE mesures_niveau_eau_archive
    DROP CONSTRAINT IF EXISTS fk_mesures_niveau_capteur;

ALTER TABLE mesures_pluie_archive
    DROP CONSTRAINT IF EXISTS fk_mesures_pluie_capteur;