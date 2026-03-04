-- =========================
-- TABLES - Oued-Souss Alert
-- =========================

CREATE TABLE zones (
    zone_id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    type_zone VARCHAR(50),
    superficie DECIMAL(10,2),
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    seuil_critique DECIMAL(5,2) NOT NULL
);

CREATE TABLE capteurs (
    capteur_id SERIAL PRIMARY KEY,
    type_capteur VARCHAR(50) NOT NULL, -- niveau_eau, pluie
    zone_id INT NOT NULL,
    date_installation DATE,
    statut VARCHAR(20)
);

CREATE TABLE mesures_niveau_eau (
    mesure_id SERIAL PRIMARY KEY,
    capteur_id INT NOT NULL,
    date_heure TIMESTAMP NOT NULL,
    niveau_eau DECIMAL(5,2) NOT NULL
);

CREATE TABLE mesures_pluie (
    mesure_id SERIAL PRIMARY KEY,
    capteur_id INT NOT NULL,
    date_heure TIMESTAMP NOT NULL,
    quantite_pluie DECIMAL(5,2) NOT NULL
);

CREATE TABLE indices_risque (
    indice_id SERIAL PRIMARY KEY,
    zone_id INT NOT NULL,
    date_calcul TIMESTAMP NOT NULL,
    valeur_indice DECIMAL(4,2) NOT NULL,
    niveau_risque VARCHAR(20)
);

CREATE TABLE alertes (
    alerte_id SERIAL PRIMARY KEY,
    zone_id INT NOT NULL,
    indice_id INT,
    date_alerte TIMESTAMP NOT NULL,
    type_alerte VARCHAR(50),
    message TEXT,
    statut VARCHAR(20)
);