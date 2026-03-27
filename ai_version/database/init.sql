-- =============================================================
-- Project: Oued-Souss Alert
-- File: init.sql
-- Description: Complete initialization script for the database
--              Run this file to deploy the entire project
-- Execution order: Tables > Constraints > Indexes > Functions/Triggers > Procedures > Seed
-- =============================================================

-- Step 1: Creation of tables and archive tables
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

-- Step 5: Triggers
\i triggers/trg_check_water_level.sql
\i triggers/trg_check_rain.sql
\i triggers/trg_generate_critical_alert.sql
\i triggers/trg_close_alert.sql

-- Step 6: Stored procedures
\i procedures/calculate_flood_risk.sql
\i procedures/archive_old_measurements.sql

-- Step 7: Test data
\i seed/seed_realistic.sql

\echo '========================================'
\echo 'Oued-Souss Alert database successfully initialized.'
\echo '========================================'
