-- =============================================================
-- Project: Oued-Souss Alert
-- File: procedures/calculate_flood_risk.sql
-- Description: Calculation of the flood risk index
--              Cross-references current water level + 7-day historical rain
--              Variables are normalized between 0 and 1 before weighting
-- Weight: 60% level (direct indicator) + 40% rain (predictive indicator)
-- Fix: Added c.status = 'active' filter on rain measurements
--      (consistency with the filter already applied on water_level_measurements)
-- =============================================================

CREATE OR REPLACE PROCEDURE calculate_flood_risk(p_zone_id INT)
LANGUAGE plpgsql AS $$
DECLARE
    v_current_level    NUMERIC;
    v_avg_rain         NUMERIC;
    v_critical_level   NUMERIC;
    v_max_rain         NUMERIC := 150;  -- historical max Souss-Massa in mm/7d (source: ABH Souss-Massa)
    v_level_norm       NUMERIC;         -- normalized level [0, 1]
    v_rain_norm        NUMERIC;         -- normalized rain [0, 1]
    v_index            NUMERIC;
    v_level            VARCHAR(20);
BEGIN
    -- Step 1: Retrieve the latest water level measurement for the zone
    SELECT m.water_level_m INTO v_current_level
    FROM water_level_measurements m
    JOIN sensors c ON m.sensor_id = c.sensor_id
    WHERE c.zone_id = p_zone_id
      AND c.status  = 'active'       -- ignore sensors out of service
    ORDER BY m.timestamp DESC
    LIMIT 1;

    -- Step 2: Retrieve the critical threshold for the zone
    SELECT critical_level INTO v_critical_level
    FROM zones
    WHERE zone_id = p_zone_id;

    -- Step 3: Calculate the average rainfall over the last 7 days
    -- c.status = 'active' filter added for consistency with step 1:
    -- measurements from sensors out of service or in maintenance are excluded
    SELECT COALESCE(AVG(mp.rain_mm), 0) INTO v_avg_rain
    FROM rain_measurements mp
    JOIN sensors c ON mp.sensor_id = c.sensor_id
    WHERE c.zone_id    = p_zone_id
      AND c.status     = 'active'    -- ignore sensors out of service / in maintenance
      AND mp.timestamp >= NOW() - INTERVAL '7 days';

    -- Step 4: Normalization of variables between 0 and 1
    -- Avoids the issue of different units (meters vs millimeters)
    v_level_norm := LEAST(COALESCE(v_current_level, 0) / NULLIF(v_critical_level, 0), 1.0);
    v_rain_norm  := LEAST(COALESCE(v_avg_rain, 0) / v_max_rain, 1.0);

    -- Step 5: Calculation of the weighted index
    -- 60% water level: direct and immediate indicator of danger
    -- 40% rain       : predictive indicator (saturated soils amplify risk)
    v_index := (v_level_norm * 0.6) + (v_rain_norm * 0.4);

    -- Step 6: Classification of the risk level
    IF    v_index >= 0.9 THEN v_level := 'CRITICAL';  -- immediate intervention
    ELSIF v_index >= 0.7 THEN v_level := 'HIGH';      -- reinforced surveillance
    ELSIF v_index >= 0.4 THEN v_level := 'MEDIUM';    -- vigilance
    ELSE                      v_level := 'LOW';       -- normal situation
    END IF;

    -- Step 7: Save the result in the history
    INSERT INTO risk_indices(zone_id, calculation_date, index_value, risk_level)
    VALUES (p_zone_id, NOW(), v_index, v_level);

END;
$$;
