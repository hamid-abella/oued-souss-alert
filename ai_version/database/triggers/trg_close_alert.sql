-- =============================================================
-- Project: Oued-Souss Alert
-- File: triggers/trg_close_alert.sql
-- Description: Automatic alert closure trigger
--              if water level drops below safety threshold
-- =============================================================

-- Dependency: close_alert_if_low() function must exist
-- Execute fn_update_alert_level.sql before this statement

CREATE TRIGGER trg_close_alert
AFTER INSERT ON water_level_measurements   -- triggered on each new measurement
FOR EACH ROW
EXECUTE FUNCTION close_alert_if_low();
