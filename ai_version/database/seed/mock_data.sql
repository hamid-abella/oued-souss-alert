-- ==========================================
-- Oued-Souss Alert
-- Seed / Mock Data Script
-- ==========================================

-- Nettoyer tables
TRUNCATE alertes CASCADE;
TRUNCATE indices_risque CASCADE;
TRUNCATE mesures_niveau_eau CASCADE;
TRUNCATE mesures_pluie CASCADE;
TRUNCATE capteurs CASCADE;
TRUNCATE zones CASCADE;


-- ==========================================
-- 1. ZONES
-- ==========================================

INSERT INTO zones (id, nom, type_zone, superficie, latitude, longitude, seuil_critique)
VALUES
(1,'Chtouka Ait Baha','agricole',1200,30.120,-9.450,3.5),
(2,'Taroudant Nord','agricole',900,30.450,-8.870,3.2),
(3,'Ait Melloul','mixte',700,30.330,-9.500,2.8),
(4,'Inezgane','urbaine',350,30.350,-9.530,2.5),
(5,'Oulad Teima','agricole',800,30.390,-9.210,3.0);


-- ==========================================
-- 2. CAPTEURS
-- ==========================================

INSERT INTO capteurs (id, zone_id, type_capteur, date_installation, statut)
VALUES
(1,1,'niveau_eau','2024-01-01','actif'),
(2,1,'pluie','2024-01-01','actif'),

(3,2,'niveau_eau','2024-02-01','actif'),
(4,2,'pluie','2024-02-01','actif'),

(5,3,'niveau_eau','2024-02-10','actif'),
(6,3,'pluie','2024-02-10','actif'),

(7,4,'niveau_eau','2024-03-05','actif'),
(8,4,'pluie','2024-03-05','actif'),

(9,5,'niveau_eau','2024-03-20','actif'),
(10,5,'pluie','2024-03-20','actif');


-- ==========================================
-- 3. MESURES PLUIE
-- Génération automatique (7 jours)
-- ==========================================

INSERT INTO mesures_pluie (capteur_id,date_mesure,quantite_pluie)
SELECT
2,
NOW() - (interval '1 hour' * s),
round(random()*20,2)
FROM generate_series(1,168) s;


INSERT INTO mesures_pluie (capteur_id,date_mesure,quantite_pluie)
SELECT
4,
NOW() - (interval '1 hour' * s),
round(random()*30,2)
FROM generate_series(1,168) s;


-- ==========================================
-- 4. MESURES NIVEAU EAU
-- Corrélé à la pluie
-- ==========================================

INSERT INTO mesures_niveau_eau (capteur_id,date_mesure,niveau_eau)
SELECT
1,
NOW() - (interval '1 hour' * s),
round(1 + random()*2,2)
FROM generate_series(1,168) s;


INSERT INTO mesures_niveau_eau (capteur_id,date_mesure,niveau_eau)
SELECT
3,
NOW() - (interval '1 hour' * s),
round(1 + random()*2.5,2)
FROM generate_series(1,168) s;


-- ==========================================
-- 5. SCENARIO CRUE (simulation)
-- montée rapide du niveau
-- ==========================================

INSERT INTO mesures_niveau_eau (capteur_id,date_mesure,niveau_eau)
VALUES
(1,NOW()-interval '5 hour',2.8),
(1,NOW()-interval '4 hour',3.1),
(1,NOW()-interval '3 hour',3.4),
(1,NOW()-interval '2 hour',3.8),
(1,NOW()-interval '1 hour',4.2);


-- ==========================================
-- 6. SCENARIO CAPTEUR DEFAILLANT
-- ==========================================

-- test QA demandé dans le projet
-- devrait être bloqué par le trigger

INSERT INTO mesures_niveau_eau
(capteur_id,date_mesure,niveau_eau)
VALUES
(1,NOW(),-50);


-- ==========================================
-- 7. INDICES DE RISQUE
-- ==========================================

INSERT INTO indices_risque (zone_id,date_calcul,valeur_indice)
VALUES
(1,NOW()-interval '3 hour',0.45),
(1,NOW()-interval '2 hour',0.62),
(1,NOW()-interval '1 hour',0.82),
(2,NOW()-interval '1 hour',0.33),
(3,NOW()-interval '1 hour',0.51);


-- ==========================================
-- Fin Seed
-- ==========================================