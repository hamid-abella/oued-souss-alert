-- Description: Analysis of the risk trend for a specific zone
--              over a given period (useful for the dashboard)

CREATE OR REPLACE FUNCTION get_risk_trend(p_zone_id INT, p_start_date TIMESTAMP, p_end_date TIMESTAMP)
RETURNS TABLE (zone_id INT, start_index NUMERIC, end_index NUMERIC, trend TEXT)
LANGUAGE plpgsql AS $$
DECLARE
    v_start_index NUMERIC;
    v_end_index   NUMERIC;
BEGIN
    -- First risk index value in the period (ascending order)
    SELECT index_value INTO v_start_index
    FROM risk_indices
    WHERE zone_id          = p_zone_id
      AND calculation_date >= p_start_date
      AND calculation_date <= p_end_date
    ORDER BY calculation_date ASC
    LIMIT 1;

    -- Last risk index value in the period (descending order)
    SELECT index_value INTO v_end_index
    FROM risk_indices
    WHERE zone_id          = p_zone_id
      AND calculation_date >= p_start_date
      AND calculation_date <= p_end_date
    ORDER BY calculation_date DESC
    LIMIT 1;

    -- Compare the two values to determine the trend
    RETURN QUERY
    SELECT
        p_zone_id,
        v_start_index,
        v_end_index,
        CASE
            WHEN v_end_index > v_start_index THEN 'increasing'  -- risk is growing
            WHEN v_end_index < v_start_index THEN 'decreasing'  -- risk is lowering
            ELSE 'stable'                                       -- risk is constant
        END;
END;
$$;
