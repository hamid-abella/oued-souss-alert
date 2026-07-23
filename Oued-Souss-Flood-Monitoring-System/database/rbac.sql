-- Description: PostgreSQL-level RBAC using native roles and GRANT.
--              Mirrors the PERMISSIONS matrix defined in config/roles.js.
--              Run once as superuser after tables.sql has been executed.

-- ---------------------------------------------------------------
-- 1. Revoke dangerous public defaults
-- ---------------------------------------------------------------
REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;

-- ---------------------------------------------------------------
-- 2. Create PostgreSQL roles (one per application role)
--    IF NOT EXISTS prevents errors on re-run.
-- ---------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'app_admin')    THEN CREATE ROLE app_admin;    END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'app_operator')  THEN CREATE ROLE app_operator;  END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'app_reader')    THEN CREATE ROLE app_reader;    END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'app_security')  THEN CREATE ROLE app_security;  END IF;
END;
$$;

-- ---------------------------------------------------------------
-- 3. app_admin — full access to all tables
-- ---------------------------------------------------------------
GRANT ALL ON ALL TABLES IN SCHEMA public TO app_admin;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO app_admin;
GRANT USAGE ON SCHEMA public TO app_admin;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO app_admin;
GRANT EXECUTE ON ALL PROCEDURES IN SCHEMA public TO app_admin;

-- ---------------------------------------------------------------
-- 4. app_operator — insert measurements, read most, resolve alerts,
--                   update sensor status
-- mirrors PERMISSIONS.measurements: ['read','create']
--         PERMISSIONS.alerts:       ['read','update']
--         PERMISSIONS.sensors:      ['read','update']
--         PERMISSIONS.zones:        ['read']
--         PERMISSIONS.risk:         ['read','create']
-- ---------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO app_operator;

GRANT SELECT, INSERT ON water_level_measurements         TO app_operator;
GRANT SELECT, INSERT ON rain_measurements                TO app_operator;
GRANT SELECT          ON water_level_measurements_archive TO app_operator;
GRANT SELECT          ON rain_measurements_archive        TO app_operator;

GRANT SELECT          ON zones                           TO app_operator;
GRANT SELECT, UPDATE  ON sensors                         TO app_operator;
GRANT SELECT, UPDATE  ON alerts                          TO app_operator;
GRANT SELECT, INSERT  ON risk_indices                    TO app_operator;

GRANT SELECT, INSERT  ON user_alerts_processing          TO app_operator;
GRANT SELECT, INSERT  ON user_sensor_operations          TO app_operator;

GRANT USAGE ON SEQUENCE water_level_measurements_measurement_id_seq TO app_operator;
GRANT USAGE ON SEQUENCE rain_measurements_measurement_id_seq         TO app_operator;
GRANT USAGE ON SEQUENCE risk_indices_index_id_seq                    TO app_operator;
GRANT USAGE ON SEQUENCE alerts_alert_id_seq                          TO app_operator;

GRANT EXECUTE ON PROCEDURE calculate_flood_risk(INT) TO app_operator;

-- ---------------------------------------------------------------
-- 5. app_reader — SELECT only on data tables
-- mirrors PERMISSIONS.*: ['read'] for all resources
-- ---------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO app_reader;

GRANT SELECT ON zones                            TO app_reader;
GRANT SELECT ON sensors                          TO app_reader;
GRANT SELECT ON water_level_measurements         TO app_reader;
GRANT SELECT ON rain_measurements                TO app_reader;
GRANT SELECT ON risk_indices                     TO app_reader;
GRANT SELECT ON alerts                           TO app_reader;

-- View access (dashboard)
GRANT SELECT ON risk_summary_view                TO app_reader;

-- ---------------------------------------------------------------
-- 6. app_security — SELECT on all tables for audit purposes
-- mirrors PERMISSIONS.sensors:  ['read']  (getHistory)
--         PERMISSIONS.alerts:   ['read','update']
--         PERMISSIONS.users:    ['read']
-- ---------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO app_security;

GRANT SELECT ON ALL TABLES IN SCHEMA public      TO app_security;
GRANT UPDATE ON alerts                           TO app_security;
GRANT INSERT ON user_alerts_processing           TO app_security;

-- ---------------------------------------------------------------
-- 7. Grant schema usage to the Node.js pool DB user.
--    The pool connects as 'app_user' (set in .env as DB_USER).
--    At runtime, the app sets the role dynamically based on
--    req.user.role before each query using SET LOCAL ROLE.
--    This block gives app_user permission to assume each role.
-- ---------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'app_user') THEN
    GRANT app_admin    TO app_user;
    GRANT app_operator TO app_user;
    GRANT app_reader   TO app_user;
    GRANT app_security TO app_user;
    GRANT USAGE ON SCHEMA public TO app_user;
  END IF;
END;
$$;

-- ---------------------------------------------------------------
-- Usage note:
-- To activate per-request role enforcement in Node.js, wrap each
-- db.query() call with:
--   await client.query(`SET LOCAL ROLE app_${req.user.role}`);
-- This is handled in the db middleware or service layer.
-- For the initial implementation, application-level RBAC
-- (config/roles.js) is sufficient. PostgreSQL-level roles add
-- a second enforcement layer for direct DB access scenarios
-- (DBA tools, ETL scripts, security audits).
-- ---------------------------------------------------------------