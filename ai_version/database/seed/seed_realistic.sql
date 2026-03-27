-- =============================================================
-- Project: Oued-Souss Alert
-- File: seed_realistic.sql
-- Description: Realistic test data for the Souss-Massa region
--              Allows testing of triggers and alert thresholds
--              without real data (Data Mocking)
-- Fix: Added measurements for Zone 5 (Ouled Teima) to
--      cover the scenario: rain sensor offline + water level active.
--      Reset warning added.
--
-- WARNING: This script is ADDITIVE. To avoid duplicates in
--          risk_indices and alerts tables upon reloading,
--          first reset the data with:
--            TRUNCATE alerts, risk_indices, rain_measurements,
--                     water_level_measurements, sensors, zones, users
--            RESTART IDENTITY CASCADE;
-- =============================================================

-- Passwords are hashed with bcrypt (10 rounds)
-- admin123, oper123, lecteur123, sec123
INSERT INTO users (name, email, password, role) VALUES
(
    'Admin Systeme',
    'admin@souss.ma',
    '$2a$10$6if2tvK/fh8FAXCPugMJIOCjaVS8KIIG3Pj5gt8VvoPx2lnErDX0S',
    'admin'
),
(
    'Operateur Terrain',
    'oper@souss.ma',
    '$2a$10$3O1pPKTjdxr.Q0Q4ljkp7eQvUCVir4uJ6jNEkqBFIXpjSCXVJmkAy',
    'operator'
),
(
    'Lecteur Dashboard',
    'lecteur@souss.ma',
    '$2a$10$U3qdrxOeXM53Abg1iRkBU.3eNYXndNsoS0EF4ob82zL/1p2Z5OeQe',
    'reader'
),
(
    'Agent Securite',
    'securite@souss.ma',
    '$2a$10$2cu4BdYczLso.CJSCGbD9OjQgSodW1xvIwHUPRTktL/laPBQtGuNe',
    'security'
);

-- ---------------------------------------------------------------
-- Agricultural and urban zones monitored
-- ---------------------------------------------------------------
INSERT INTO zones (name, zone_type, area_ha, latitude, longitude, critical_level) VALUES
('Zone Agricole Ait Melloul',  'agricultural', 450.00,  30.3372,  -9.4988, 3.50),
('Zone Agricole Taroudant',    'agricultural', 620.00,  30.4702,  -8.8770, 4.00),
('Zone Urbaine Agadir Centre', 'urban',  120.00,  30.4278,  -9.5981, 2.00),
('Zone Mixte Chtouka',         'mixed',    380.00,  30.1833,  -9.5333, 3.00),
('Zone Agricole Ouled Teima',  'agricultural', 510.00,  30.3667,  -9.2167, 3.80);

-- ---------------------------------------------------------------
-- Sensors installed in the field
-- ---------------------------------------------------------------
INSERT INTO sensors (zone_id, sensor_type, installation_date, status) VALUES
-- Zone 1: Ait Melloul
(1, 'water_level', '2024-01-15', 'active'),
(1, 'rain',      '2024-01-15', 'active'),
-- Zone 2: Taroudant
(2, 'water_level', '2024-02-10', 'active'),
(2, 'rain',      '2024-02-10', 'active'),
-- Zone 3: Agadir Centre
(3, 'water_level', '2024-03-05', 'active'),
(3, 'rain',      '2024-03-05', 'maintenance'),
-- Zone 4: Chtouka
(4, 'water_level', '2024-01-20', 'active'),
(4, 'rain',      '2024-01-20', 'active'),
-- Zone 5: Ouled Teima
(5, 'water_level', '2024-04-01', 'active'),
(5, 'rain',      '2024-04-01', 'offline');

-- ---------------------------------------------------------------
-- Water level measurements (normal scenarios + flood)
-- ---------------------------------------------------------------
INSERT INTO water_level_measurements (sensor_id, timestamp, water_level_m) VALUES
-- Sensor 1 (Zone 1 - Ait Melloul): gradual rise towards flood
(1, NOW() - INTERVAL '7 days',  1.20),
(1, NOW() - INTERVAL '6 days',  1.50),
(1, NOW() - INTERVAL '5 days',  1.80),
(1, NOW() - INTERVAL '4 days',  2.30),
(1, NOW() - INTERVAL '3 days',  2.90),
(1, NOW() - INTERVAL '2 days',  3.40),  -- approaching critical threshold 3.50
(1, NOW() - INTERVAL '1 day',   3.60),  -- exceeds threshold => CRITICAL alert
(1, NOW() - INTERVAL '6 hours', 3.80),
(1, NOW(),                      1.50),  -- going down => alert closure

-- Sensor 3 (Zone 2 - Taroudant): normal situation
(3, NOW() - INTERVAL '5 days',  0.80),
(3, NOW() - INTERVAL '4 days',  1.10),
(3, NOW() - INTERVAL '3 days',  1.20),
(3, NOW() - INTERVAL '2 days',  1.30),
(3, NOW() - INTERVAL '1 day',   1.40),
(3, NOW(),                      1.20),

-- Sensor 9 (Zone 5 - Ouled Teima): stable level, rain sensor offline
-- Scenario: validate that calculate_flood_risk works without rain data
--           (avg_rain = 0 via COALESCE because offline sensor is excluded)
(9, NOW() - INTERVAL '3 days',  0.60),
(9, NOW() - INTERVAL '2 days',  0.75),
(9, NOW() - INTERVAL '1 day',   0.80),
(9, NOW(),                      0.70);

-- ---------------------------------------------------------------
-- Rain measurements (correlated with level rises)
-- ---------------------------------------------------------------
INSERT INTO rain_measurements (sensor_id, timestamp, rain_mm) VALUES
-- Sensor 2 (Zone 1 - Ait Melloul): intense rain episode
(2, NOW() - INTERVAL '7 days',  12.0),
(2, NOW() - INTERVAL '6 days',  25.0),
(2, NOW() - INTERVAL '5 days',  45.0),
(2, NOW() - INTERVAL '4 days',  60.0),
(2, NOW() - INTERVAL '3 days',  55.0),
(2, NOW() - INTERVAL '2 days',  30.0),
(2, NOW() - INTERVAL '1 day',   10.0),
(2, NOW(),                       2.0),

-- Sensor 4 (Zone 2 - Taroudant): moderate rain
(4, NOW() - INTERVAL '5 days',   8.0),
(4, NOW() - INTERVAL '4 days',  15.0),
(4, NOW() - INTERVAL '3 days',  18.0),
(4, NOW() - INTERVAL '2 days',  12.0),
(4, NOW() - INTERVAL '1 day',    5.0),
(4, NOW(),                        1.0);

-- Note: no measurement for sensor 10 (Zone 5 - rain offline)
-- This is intentional: this scenario validates that calculate_flood_risk
-- correctly handles the absence of rain data (avg_rain = 0).

-- ---------------------------------------------------------------
-- QA Test: Outlier data (should be rejected by triggers)
-- These insertions will fail and validate the correct operation
-- ---------------------------------------------------------------
-- DO $$
-- BEGIN
--     -- Test 1: Negative level (failing sensor)
--     INSERT INTO water_level_measurements (sensor_id, timestamp, water_level_m)
--     VALUES (1, NOW(), -50.0);
--     RAISE NOTICE 'ERROR: The -50m value should have been rejected!';
-- EXCEPTION WHEN others THEN
--     RAISE NOTICE 'OK: -50m value correctly rejected by trigger.';
-- END;
-- $$;
--
-- DO $$
-- BEGIN
--     -- Test 2: Negative rain
--     INSERT INTO rain_measurements (sensor_id, timestamp, rain_mm)
--     VALUES (2, NOW(), -10.0);
--     RAISE NOTICE 'ERROR: The -10mm value should have been rejected!';
-- EXCEPTION WHEN others THEN
--     RAISE NOTICE 'OK: -10mm value correctly rejected by trigger.';
-- END;
-- $$;

-- =============================================================
-- Calculation of risk indices + automatic generation of alerts
-- The calls below trigger trg_generate_critical_alert (AFTER INSERT
-- on risk_indices) which creates an alert if risk_level = CRITICAL.
-- The anti-duplicate protection in generate_critical_alert() guarantees
-- that only one ACTIVE alert is created per zone, even in case of
-- partial reloading of the seed.
-- =============================================================
CALL calculate_flood_risk(1); -- Zone Ait Melloul  → should be CRITICAL
CALL calculate_flood_risk(2); -- Zone Taroudant    → should be MEDIUM
CALL calculate_flood_risk(3); -- Zone Agadir       → should be LOW
CALL calculate_flood_risk(4); -- Zone Chtouka      → should be MEDIUM
CALL calculate_flood_risk(5); -- Zone Ouled Teima  → should be LOW (rain absent)
