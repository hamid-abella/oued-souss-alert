-- =============================================================
-- Project: Oued-Souss Alert
-- File: triggers/trg_check_rain.sql
-- Description: Trigger to validate rain quantity before insertion
--              Calls fn_check_outlier_values.sql functions
-- =============================================================

-- Dependency: check_valid_rain() function must exist
-- Execute fn_check_outlier_values.sql before this statement

CREATE TRIGGER trg_check_rain
BEFORE INSERT ON rain_measurements       -- executed BEFORE insert to block invalid values
FOR EACH ROW
EXECUTE FUNCTION check_valid_rain();