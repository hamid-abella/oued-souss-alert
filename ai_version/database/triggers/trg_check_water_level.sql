-- =============================================================
-- Project: Oued-Souss Alert
-- File: triggers/trg_check_water_level.sql
-- Description: Trigger to validate water level before insertion
--              Calls fn_check_outlier_values.sql functions
-- QA Task: Failing sensor management (e.g., -50m)
-- =============================================================

-- Dependency: check_valid_water_level() function must exist
-- Execute fn_check_outlier_values.sql before this statement

CREATE TRIGGER trg_check_water_level
BEFORE INSERT ON water_level_measurements  -- executed BEFORE insert to block invalid values
FOR EACH ROW 
EXECUTE FUNCTION check_valid_water_level();