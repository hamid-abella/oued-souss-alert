-- =============================================================
-- Projet : Oued-Souss Alert
-- Fichier : seed/mock_data.sql
-- Description : Données de test réalistes pour la région Souss-Massa
--               Permet de tester les triggers et seuils d'alerte
--               sans données réelles (Data Mocking)
-- =============================================================

-- ---------------------------------------------------------------
-- Zones agricoles et urbaines surveillées
-- ---------------------------------------------------------------
INSERT INTO zones (nom, type_zone, superficie, latitude, longitude, seuil_critique) VALUES
('Zone Agricole Aït Melloul',  'agricole', 450.00,  30.3372,  -9.4988, 3.50),
('Zone Agricole Taroudant',    'agricole', 620.00,  30.4702,  -8.8770, 4.00),
('Zone Urbaine Agadir Centre', 'urbaine',  120.00,  30.4278,  -9.5981, 2.00),
('Zone Mixte Chtouka',         'mixte',    380.00,  30.1833,  -9.5333, 3.00),
('Zone Agricole Ouled Teima',  'agricole', 510.00,  30.3667,  -9.2167, 3.80);

-- ---------------------------------------------------------------
-- Capteurs installés sur le terrain
-- ---------------------------------------------------------------
INSERT INTO capteurs (zone_id, type_capteur, date_installation, statut) VALUES
-- Zone 1 : Aït Melloul
(1, 'niveau_eau', '2024-01-15', 'actif'),
(1, 'pluie',      '2024-01-15', 'actif'),
-- Zone 2 : Taroudant
(2, 'niveau_eau', '2024-02-10', 'actif'),
(2, 'pluie',      '2024-02-10', 'actif'),
-- Zone 3 : Agadir Centre
(3, 'niveau_eau', '2024-03-05', 'actif'),
(3, 'pluie',      '2024-03-05', 'maintenance'),
-- Zone 4 : Chtouka
(4, 'niveau_eau', '2024-01-20', 'actif'),
(4, 'pluie',      '2024-01-20', 'actif'),
-- Zone 5 : Ouled Teima
(5, 'niveau_eau', '2024-04-01', 'actif'),
(5, 'pluie',      '2024-04-01', 'hors_service');

-- ---------------------------------------------------------------
-- Mesures de niveau d'eau (scénarios normaux + crue)
-- ---------------------------------------------------------------
INSERT INTO mesures_niveau_eau (capteur_id, date_heure, niveau_eau) VALUES
-- Capteur 1 (Zone 1 - Aït Melloul) : montée progressive vers crue
(1, NOW() - INTERVAL '7 days',  1.20),
(1, NOW() - INTERVAL '6 days',  1.50),
(1, NOW() - INTERVAL '5 days',  1.80),
(1, NOW() - INTERVAL '4 days',  2.30),
(1, NOW() - INTERVAL '3 days',  2.90),
(1, NOW() - INTERVAL '2 days',  3.40),  -- approche du seuil critique 3.50
(1, NOW() - INTERVAL '1 day',   3.60),  -- dépasse le seuil => alerte CRITIQUE
(1, NOW() - INTERVAL '6 hours', 3.80),
(1, NOW(),                      1.50),  -- redescente => fermeture alerte

-- Capteur 3 (Zone 2 - Taroudant) : situation normale
(3, NOW() - INTERVAL '5 days',  0.80),
(3, NOW() - INTERVAL '4 days',  1.10),
(3, NOW() - INTERVAL '3 days',  1.20),
(3, NOW() - INTERVAL '2 days',  1.30),
(3, NOW() - INTERVAL '1 day',   1.40),
(3, NOW(),                      1.20);

-- ---------------------------------------------------------------
-- Mesures de pluie (corrélées avec les montées de niveau)
-- ---------------------------------------------------------------
INSERT INTO mesures_pluie (capteur_id, date_heure, pluie_mm) VALUES
-- Capteur 2 (Zone 1 - Aït Melloul) : épisode pluvieux intense
(2, NOW() - INTERVAL '7 days',  12.0),
(2, NOW() - INTERVAL '6 days',  25.0),
(2, NOW() - INTERVAL '5 days',  45.0),
(2, NOW() - INTERVAL '4 days',  60.0),
(2, NOW() - INTERVAL '3 days',  55.0),
(2, NOW() - INTERVAL '2 days',  30.0),
(2, NOW() - INTERVAL '1 day',   10.0),
(2, NOW(),                       2.0),

-- Capteur 4 (Zone 2 - Taroudant) : pluie modérée
(4, NOW() - INTERVAL '5 days',   8.0),
(4, NOW() - INTERVAL '4 days',  15.0),
(4, NOW() - INTERVAL '3 days',  18.0),
(4, NOW() - INTERVAL '2 days',  12.0),
(4, NOW() - INTERVAL '1 day',    5.0),
(4, NOW(),                        1.0);

-- ---------------------------------------------------------------
-- Test QA : Données aberrantes (doivent être rejetées par les triggers)
-- Ces insertions échoueront et valideront le bon fonctionnement
-- ---------------------------------------------------------------
-- DO $$
-- BEGIN
--     -- Test 1 : Niveau négatif (capteur défaillant)
--     INSERT INTO mesures_niveau_eau (capteur_id, date_heure, niveau_eau)
--     VALUES (1, NOW(), -50.0);
--     RAISE NOTICE 'ERREUR : La valeur -50m aurait dû être rejetée !';
-- EXCEPTION WHEN others THEN
--     RAISE NOTICE 'OK : Valeur -50m correctement rejetée par le trigger.';
-- END;
-- $$;
--
-- DO $$
-- BEGIN
--     -- Test 2 : Pluie négative
--     INSERT INTO mesures_pluie (capteur_id, date_heure, pluie_mm)
--     VALUES (2, NOW(), -10.0);
--     RAISE NOTICE 'ERREUR : La valeur -10mm aurait dû être rejetée !';
-- EXCEPTION WHEN others THEN
--     RAISE NOTICE 'OK : Valeur -10mm correctement rejetée par le trigger.';
-- END;
-- $$;

-- =============================================================
-- Fichier : database/seed/mock_data.sql
-- AJOUT : Calcul des indices + génération des alertes
-- =============================================================

-- Calculer les indices pour toutes les zones
-- Cela déclenche automatiquement les triggers d'alerte
CALL calculate_flood_risk(1); -- Zone Aït Melloul  → devrait être CRITIQUE
CALL calculate_flood_risk(2); -- Zone Taroudant    → devrait être MOYEN
CALL calculate_flood_risk(3); -- Zone Agadir       → devrait être FAIBLE
CALL calculate_flood_risk(4); -- Zone Chtouka      → devrait être MOYEN
CALL calculate_flood_risk(5); -- Zone Ouled Teima  → devrait être FAIBLE