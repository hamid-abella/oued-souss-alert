-- =============================================================
-- Project: Oued-Souss Alert
-- File: constraints.sql
-- Description: CHECK constraints
-- =============================================================

-- Risk index value between 0 and 1
ALTER TABLE risk_indices
    ADD CONSTRAINT chk_index_value
    CHECK (index_value >= 0 AND index_value <= 1);

-- Zone area positive if set
ALTER TABLE zones
    ADD CONSTRAINT chk_area_positive
    CHECK (area_ha IS NULL OR area_ha > 0);

-- Sensor installation date cannot be in the future
ALTER TABLE sensors
    ADD CONSTRAINT chk_sensor_installation_date
    CHECK (installation_date IS NULL OR installation_date <= CURRENT_DATE);

-- Water level measurement timestamp cannot be in the future (+1s tolerance)
ALTER TABLE water_level_measurements
    ADD CONSTRAINT chk_water_measurement_date
    CHECK (timestamp <= NOW() + INTERVAL '1 second');

-- Rain measurement timestamp cannot be in the future (+1s tolerance)
ALTER TABLE rain_measurements
    ADD CONSTRAINT chk_rain_measurement_date
    CHECK (timestamp <= NOW() + INTERVAL '1 second');

-- Alert timestamp cannot be in the future (+1s tolerance)
ALTER TABLE alerts
    ADD CONSTRAINT chk_alert_date
    CHECK (alert_date <= NOW() + INTERVAL '1 second');

-- Drop FK in case PostgreSQL created implicit ones (precaution)
ALTER TABLE water_level_measurements_archive
    DROP CONSTRAINT IF EXISTS fk_water_level_sensor;

ALTER TABLE rain_measurements_archive
    DROP CONSTRAINT IF EXISTS fk_rain_sensor;