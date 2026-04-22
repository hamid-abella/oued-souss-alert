CREATE OR REPLACE FUNCTION fn_alert_level_exceeded()
RETURNS TRIGGER AS $$
DECLARE
    v_zone_id        INT;
    v_critical_level NUMERIC;
BEGIN
    SELECT s.zone_id, z.critical_level
    INTO v_zone_id, v_critical_level
    FROM sensors s
    JOIN zones z ON z.zone_id = s.zone_id
    WHERE s.sensor_id = NEW.sensor_id;

    IF NEW.water_level_m >= v_critical_level THEN

        IF NOT EXISTS (
            SELECT 1 FROM alerts
            WHERE zone_id    = v_zone_id
              AND status     = 'ACTIVE'
              AND alert_type = 'LEVEL_EXCEEDED'
        ) THEN
            INSERT INTO alerts (zone_id, sensor_id, alert_date, alert_type, message, status            )
            VALUES ( v_zone_id, NEW.sensor_id, NOW(), 'LEVEL_EXCEEDED',
                FORMAT(
                    'Critical level exceeded. Zone: %s | Measured level: %s m | Level: %s m | Sensor: %s',
                    v_zone_id,
                    NEW.water_level_m,
                    v_critical_level,
                    NEW.sensor_id
                ),
                'ACTIVE'
            );
        END IF;

    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


