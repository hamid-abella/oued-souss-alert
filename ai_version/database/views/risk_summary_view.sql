-- Description: Consolidated view by zone for the dashboard.
--              Aggregates: latest level measurement, latest calculated
--              risk index, and current active alert.
--              Used by the Node.js backend for the interactive map.

CREATE OR REPLACE VIEW risk_summary_view AS
SELECT
    z.zone_id,
    z.name                          AS zone_name,
    z.zone_type,
    z.latitude,
    z.longitude,
    z.critical_level,

    -- Latest water level measurement (most recent active sensor)
    wlm.water_level_m               AS last_water_level_m,
    wlm.timestamp                   AS last_measurement_at,
    wlm.sensor_id                   AS last_sensor_id,

    -- Percentage of the critical threshold reached (useful for the frontend gauge)
    ROUND(
        (wlm.water_level_m / NULLIF(z.critical_level, 0)) * 100, 1
    )                               AS critical_level_pct,

    -- Latest calculated risk index
    ri.index_value                  AS last_risk_index,
    ri.risk_level                   AS last_risk_level,
    ri.calculation_date             AS last_index_calculated_at,

    -- Current active alert (NULL if none)
    al.alert_id                     AS active_alert_id,
    al.alert_type                   AS active_alert_type,
    al.alert_date                   AS active_alert_since,
    al.message                      AS active_alert_message

FROM zones z

-- Latest water level measurement (DISTINCT ON to keep 1 row per zone)
LEFT JOIN LATERAL (
    SELECT wl.water_level_m, wl.timestamp, wl.sensor_id
    FROM water_level_measurements wl
    JOIN sensors s ON s.sensor_id = wl.sensor_id
    WHERE s.zone_id = z.zone_id
      AND s.status  = 'active'
    ORDER BY wl.timestamp DESC
    LIMIT 1
) wlm ON TRUE

-- Latest calculated risk index
LEFT JOIN LATERAL (
    SELECT r.index_value, r.risk_level, r.calculation_date
    FROM risk_indices r
    WHERE r.zone_id = z.zone_id
    ORDER BY r.calculation_date DESC
    LIMIT 1
) ri ON TRUE

-- Current active alert (NULL if none)
LEFT JOIN LATERAL (
    SELECT a.alert_id, a.alert_type, a.alert_date, a.message
    FROM alerts a
    WHERE a.zone_id = z.zone_id
      AND a.status  = 'ACTIVE'
    ORDER BY a.alert_date DESC
    LIMIT 1
) al ON TRUE;

-- Usage commentary
-- Backend sample query:
--   SELECT * FROM risk_summary_view ORDER BY last_risk_index DESC NULLS LAST;
-- Filter zones under alert:
--   SELECT * FROM risk_summary_view WHERE active_alert_id IS NOT NULL;
-- Filter critical zones:
--   SELECT * FROM risk_summary_view WHERE last_risk_level = 'CRITICAL';