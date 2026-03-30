-- Description: Direct trigger on level measurement insertion.
--              Generates a LEVEL_EXCEEDED alert if the level
--              exceeds the critical threshold of the zone,
--              without waiting for the risk index calculation.

-- Complements trg_generate_critical_alert (which acts on risk_indices).

-- AFTER INSERT trigger: the level is already validated by trg_check_water_level
-- The PostgreSQL execution order ensures that check_water_level (BEFORE)
-- executes before this trigger (AFTER).

CREATE TRIGGER trg_alert_level_exceeded
AFTER INSERT ON water_level_measurements
FOR EACH ROW
EXECUTE FUNCTION fn_alert_level_exceeded();