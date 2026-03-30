-- Description: Move old measurements to archive tables
--              Maintains performance on active tables
--              Archive tables are created in schema/tables.sql

CREATE OR REPLACE PROCEDURE archive_old_measurements(p_cutoff_date TIMESTAMP)
LANGUAGE plpgsql AS $$
BEGIN
    -- Archiving water level measurements prior to the cutoff date
    INSERT INTO water_level_measurements_archive
    SELECT * FROM water_level_measurements
    WHERE timestamp < p_cutoff_date;

    -- Deleting archived data from the active table
    DELETE FROM water_level_measurements
    WHERE timestamp < p_cutoff_date;

    -- Archiving rain measurements prior to the cutoff date
    INSERT INTO rain_measurements_archive
    SELECT * FROM rain_measurements
    WHERE timestamp < p_cutoff_date;

    -- Deleting archived data from the active table
    DELETE FROM rain_measurements
    WHERE timestamp < p_cutoff_date;

    RAISE NOTICE 'Archiving complete: measurements prior to % moved.', p_cutoff_date;
END;
$$;
