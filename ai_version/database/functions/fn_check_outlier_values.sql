-- Description: Sensor data validation functions
--              Prevents insertion of physically impossible values
-- QA Task: Failing sensor scenario (e.g., -50m)

-- Water level validation function
-- Realistic interval: 0m (dry) to 20m (exceptional Oued Souss flood)
CREATE OR REPLACE FUNCTION check_valid_water_level()
RETURNS TRIGGER AS $$
BEGIN
    -- Reject outlier values (e.g., -50m sent by failing sensor)
    IF NEW.water_level_m < 0 OR NEW.water_level_m > 20 THEN
        RAISE EXCEPTION
            'Invalid water level value: % m. Accepted range: [0, 20]',
            NEW.water_level_m;
    END IF;

    RETURN NEW; -- allow insertion
END;
$$ LANGUAGE plpgsql;

-- Rain quantity validation function
-- Realistic interval: 0mm to 500mm (max recorded in Morocco)
CREATE OR REPLACE FUNCTION check_valid_rain()
RETURNS TRIGGER AS $$
BEGIN
    -- Reject negative or physically impossible values
    IF NEW.rain_mm < 0 OR NEW.rain_mm > 500 THEN
        RAISE EXCEPTION
            'Invalid rain value: % mm. Accepted range: [0, 500]',
            NEW.rain_mm;
    END IF;

    RETURN NEW; -- allow insertion
END;
$$ LANGUAGE plpgsql;