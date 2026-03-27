-- =============================================================
-- Project: Oued-Souss Alert
-- File: functions/fn_update_alert_level.sql
-- Description: Automatic closure of active alerts
--              if water level drops below 50% of critical threshold
-- =============================================================

CREATE OR REPLACE FUNCTION close_alert_if_low()
RETURNS TRIGGER AS $$
DECLARE
    v_critical_level   NUMERIC;
    v_zone_id INT;
BEGIN
    -- Retrieve the zone associated with the sensor sending the measurement
    SELECT zone_id INTO v_zone_id
    FROM sensors
    WHERE sensor_id = NEW.sensor_id;

    -- Retrieve the critical threshold for this zone
    SELECT critical_level INTO v_critical_level
    FROM zones
    WHERE zone_id = v_zone_id;

    -- If the water level is below 50% of the threshold => danger averted
    -- Automatically resolve all active alerts for this zone
    IF NEW.water_level_m < (v_critical_level * 0.5) THEN
        UPDATE alerts
        SET status = 'RESOLVED'
        WHERE zone_id = v_zone_id
          AND status = 'ACTIVE';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;