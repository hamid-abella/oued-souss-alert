-- =========================
-- TABLES
-- =========================
\i schema/tables.sql

-- =========================
-- CONSTRAINTS & INDEX
-- =========================
\i schema/constraints.sql
\i schema/indexes.sql

-- =========================
-- FUNCTIONS
-- =========================
\i functions/fn_check_valeurs_aberrantes.sql
\i functions/fn_get_risk_trend.sql
\i functions/fn_trigger_alerte_crue.sql
\i functions/fn_update_niveau_risque.sql

-- =========================
-- TRIGGERS
-- =========================
\i triggers/trg_check_niveau_eau.sql
\i triggers/trg_generate_alerte.sql
\i triggers/trg_close_alerte.sql

-- =========================
-- PROCEDURES
-- =========================
\i procedures/calculate_flood_risk.sql
\i procedures/archive_old_measurements.sql

-- =========================
-- SEED DATA (Data Mocking)
-- =========================
\i seed/mock_data.sql