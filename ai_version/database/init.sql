-- Description: Complete initialization script for the database
--              Run this file to deploy the entire project

-- Step 1: Tables
\i schema/tables.sql

-- Step 2: Additional constraints
\i schema/constraints.sql

-- Step 3: Performance indexes
\i schema/indexes.sql

-- Step 4: Functions
\i functions/fn_check_outlier_values.sql
\i functions/fn_trigger_critical_alert.sql
\i functions/fn_update_alert_level.sql
\i functions/fn_get_risk_trend.sql
\i functions/fn_alert_level_exceeded.sql

-- Step 5: Triggers
\i triggers/trg_check_water_level.sql
\i triggers/trg_check_rain.sql
\i triggers/trg_generate_critical_alert.sql
\i triggers/trg_close_alert.sql
\i triggers/trg_alert_level_exceeded.sql

-- Step 6: Procedures
\i procedures/calculate_flood_risk.sql
\i procedures/archive_old_measurements.sql

-- Step 7: Views
\i views/risk_summary_view.sql

-- Step 8: PostgreSQL-level RBAC using native roles and GRANT
\i rbac.sql

-- Step 9: Seed data
\i seed/seed_realistic.sql

\echo '========================================'
\echo 'Oued-Souss Alert database successfully initialized.'
\echo '========================================'
