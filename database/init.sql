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
\i functions/fn_check_niveau_eau.sql
\i functions/fn_generate_alerte.sql
\i functions/fn_close_alerte.sql

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
\i procedures/get_risk_trend.sql