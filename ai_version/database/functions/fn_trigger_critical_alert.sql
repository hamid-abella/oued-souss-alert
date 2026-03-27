-- =============================================================
-- Project: Oued-Souss Alert
-- File: functions/fn_trigger_critical_alert.sql
-- Description: Automatic generation of alert when risk index = CRITICAL
--              Includes traceability of the triggering sensor
-- Fix: Check for existing active alert before insertion
--      to avoid duplicates during successive calls
-- =============================================================

CREATE OR REPLACE FUNCTION generate_critical_alert()
RETURNS TRIGGER AS $$
DECLARE
    v_sensor_id INT;
BEGIN
    -- Check if the calculated risk level is critical
    IF NEW.risk_level = 'CRITICAL' THEN

        -- Do not create a duplicate if an ACTIVE alert already exists for this zone
        IF EXISTS (
            SELECT 1 FROM alerts
            WHERE zone_id = NEW.zone_id
              AND status  = 'ACTIVE'
        ) THEN
            RETURN NEW; -- alert already open, nothing to do
        END IF;

        -- Retrieve the most recent water level sensor for this zone
        -- to ensure alert traceability
        SELECT s.sensor_id INTO v_sensor_id
        FROM sensors s
        JOIN water_level_measurements w ON w.sensor_id = s.sensor_id
        WHERE s.zone_id = NEW.zone_id
          AND s.status = 'active'           -- only active sensors
        ORDER BY w.timestamp DESC
        LIMIT 1;

        -- Insert the alert with full zone + index + sensor reference
        INSERT INTO alerts (
            zone_id,
            index_id,
            sensor_id,
            alert_date,
            alert_type,
            message,
            status
        )
        VALUES (
            NEW.zone_id,
            NEW.index_id,
            v_sensor_id,
            NOW(),
            'FLOOD',
            FORMAT(
                'Critical flood risk detected. Zone: %s | Index: %s | Sensor: %s',
                NEW.zone_id,
                NEW.index_value,
                v_sensor_id
            ),
            'ACTIVE'
        );

    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;