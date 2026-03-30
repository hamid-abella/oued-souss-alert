-- Description: Automatic critical alert generation trigger
--              Calls fn_trigger_critical_alert.sql

-- Dependency: generate_critical_alert() function must exist
-- Execute fn_trigger_critical_alert.sql before this statement

CREATE TRIGGER trg_generate_critical_alert
AFTER INSERT ON risk_indices   -- executed AFTER insertion of a calculated index
FOR EACH ROW
EXECUTE FUNCTION generate_critical_alert();
