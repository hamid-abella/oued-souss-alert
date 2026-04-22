# 🗄️ Database — oued_souss_alert

## Technologies

- **PostgreSQL** 14+
- **PL/pgSQL** for triggers and stored procedures
- **3NF normalization** respected

---

## Installation
```bash
# Create database
psql -U postgres -c "CREATE DATABASE oued_souss_alert;"

# Initialize (tables + triggers + procedures + data)
psql -U postgres -d oued_souss_alert -f init.sql
```

---

## Project Structure
```
database/
├── init.sql
├── schema/
│   ├── tables.sql
│   ├── constraints.sql
│   └── indexes.sql
├── functions/
│   ├── fn_check_outlier_values.sql
│   ├── fn_trigger_critical_alert.sql
│   ├── fn_update_alert_level.sql
│   ├── fn_alert_level_exceeded.sql
│   └── fn_get_risk_trend.sql
├── triggers/
│   ├── trg_check_water_level.sql
│   ├── trg_check_rain.sql
│   ├── trg_generate_critical_alert.sql
│   ├── trg_close_alert.sql
│   └── trg_alert_level_exceeded.sql
├── procedures/
│   ├── calculate_flood_risk.sql
│   └── archive_old_measurements.sql
├── views/
│   └── risk_summary_view.sql
├── rbac/
│   └── rbac.sql
└── seed/
    └── seed_realistic.sql
```

---

## Database Schema

### `users`
| Column | Type | Description |
|---|---|---|
| user_id | SERIAL PK | Unique identifier |
| name | VARCHAR(100) | Full name |
| email | VARCHAR(150) | Unique email |
| password | VARCHAR(255) | Hashed password (bcrypt) |
| role | VARCHAR(20) | admin / operator / reader / security |
| active | BOOLEAN | Active account or desactive |
| created_at | TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | Last update |

### `zones`
| Column | Type | Description |
|---|---|---|
| zone_id | SERIAL PK | Unique identifier |
| name | VARCHAR(100) | Zone name |
| zone_type | VARCHAR(50) | agricultural / urban / mixed |
| area_ha | DECIMAL(10,2) | Area in hectares |
| latitude | DECIMAL(9,6) | GPS coordinate |
| longitude | DECIMAL(9,6) | GPS coordinate |
| critical_level | NUMERIC | Water level threshold triggering alerts |

### `sensors`
| Column | Type | Description |
|---|---|---|
| sensor_id | SERIAL PK | Unique identifier |
| zone_id | INTEGER FK | Linked zone |
| sensor_type | VARCHAR(50) | water_level / rain |
| installation_date | DATE | Installation date |
| status | VARCHAR(20) | active / maintenance / offline |

### `water_level_measurements`
| Column | Type | Description |
|---|---|---|
| measurement_id | SERIAL PK | Unique identifier |
| sensor_id | INTEGER FK | Sensor source |
| timestamp | TIMESTAMP | Exact datetime |
| water_level_m | NUMERIC(5,2) | Value in meters **[0, 20]** |

### `rain_measurements`
| Column | Type | Description |
|---|---|---|
| measurement_id | SERIAL PK | Unique identifier |
| sensor_id | INTEGER FK | Sensor source |
| timestamp | TIMESTAMP | Exact datetime |
| rain_mm | NUMERIC(5,2) | Rainfall in mm **[0, 500]** |

### `risk_indices`
| Column | Type | Description |
|---|---|---|
| index_id | SERIAL PK | Unique identifier |
| zone_id | INTEGER FK | Zone analyzed |
| calculation_date | TIMESTAMP | Calculation date |
| index_value | NUMERIC(5,2) | Normalized index **[0, 1]** |
| risk_level | VARCHAR(20) | LOW / MEDIUM / HIGH / CRITICAL |

### `alerts`
| Column | Type | Description |
|---|---|---|
| alert_id | SERIAL PK | Unique identifier |
| zone_id | INTEGER FK | Concerned zone |
| index_id | INTEGER FK | Triggering index (nullable) |
| sensor_id | INTEGER FK | Source sensor (nullable) |
| alert_date | TIMESTAMP | Creation date |
| alert_type | VARCHAR(50) | FLOOD / LEVEL_EXCEEDED / HEAVY_RAIN |
| message | TEXT | Alert description |
| status | VARCHAR(20) | ACTIVE / RESOLVED |

---

## Triggers

### `trg_check_water_level`
```sql
-- BEFORE INSERT ON water_level_measurements
-- Rejects values outside [0, 20] meters
-- QA Case: faulty sensor sending -50m → automatically rejected
```

### `trg_check_rain`
```sql
-- BEFORE INSERT ON rain_measurements
-- Rejects values outside [0, 500] mm
```

### `trg_generate_critical_alert`
```sql
-- AFTER INSERT ON risk_indices
-- Creates alert if risk_level = 'CRITICAL'
-- Prevents duplicates (one active alert per zone)
-- Includes: zone traceability + index + sensor
```

### `trg_close_alert`
```sql
-- AFTER INSERT ON water_level_measurements
-- Closes alerts if level < 50% of threshold
-- closure is zonal (all sensors in the zone are considered)
```

### `trg_alert_level_exceeded`
```sql
-- AFTER INSERT ON water_level_measurements
-- Generates immediate LEVEL_EXCEEDED alert
-- when water level >= zone critical threshold
-- Does NOT wait for risk index calculation
-- Prevents duplicate ACTIVE alerts per zone
```

---

## Procédures stockées

### `calculate_flood_risk(p_zone_id INT)`

Calculates the flood risk index for a given zone.
```sql
-- Call
CALL calculate_flood_risk(1);

-- Formula
index = (normalized_level × 0.6) + (normalized_rain × 0.4)

-- Classification
≥ 0.9 → CRITICAL
≥ 0.7 → HIGH
≥ 0.4 → MEDIUM
< 0.4 → LOW
```

### `archive_old_measurements(p_cutoff_date TIMESTAMP)`

Moves old measurements to archive tables.

```sql
CALL archive_old_measurements(NOW() - INTERVAL '6 months');
```
---

## ⏰ Automatic Archiving

This project uses PostgreSQL `pg_cron` to automatically archive old measurements.

### Setup

1. Enable pg_cron in PostgreSQL:
   - Add to postgresql.conf:
     shared_preload_libraries = 'pg_cron'

2. Restart PostgreSQL

3. Run:
   CREATE EXTENSION pg_cron;

4. Execute:
   database/cron_jobs.sql

### Behavior

- Runs every day at midnight
- Archives data older than 6 months
---

Archive tables (`water_level_measurements_archive`, `rain_measurements_archive`) do not include foreign key constraints to avoid integrity errors if sensors were deleted after measurements were recorded.

---

## Views
### `risk_summary_view`
Consolidated dashboard view per zone.
Includes:
- Latest water level measurement
- Latest risk index
- Active alert (if any)
- % of critical threshold reached
```sql
-- Example usage
SELECT * FROM risk_summary_view;

-- Zones under alert
SELECT * FROM risk_summary_view WHERE active_alert_id IS NOT NULL;

-- Critical zones
SELECT * FROM risk_summary_view WHERE last_risk_level = 'CRITICAL';
```
---
## RBAC (Role-Based Access Control)

Implemented using native PostgreSQL roles.

Roles
- app_admin → Full access
- app_operator → Insert measurements, manage alerts
- app_reader → Read-only access
- app_security → Audit + alert validation

Key Features
- Revokes default PUBLIC permissions
- Fine-grained GRANT per table
- Sequence access control
- Procedure execution control
- Compatible with Node.js dynamic role switching

```sql
SET LOCAL ROLE app_operator;
```
---
## Test Data

The `seed/seed_realistic.sql` file includes:

- **5 zones** Souss-Massa
- **10 sensors** 
- **4 users** (admin, operator, reader, security)
- **7-day historical measurements** with a flood scenario for Zone 1
- **Zone 5 measurements** covering the `offline` rain sensor scenario
- **Appels** à `calculate_flood_risk` pour générer indices et alertes
-- **Automatic alert generation**

```bash
# Completely reset test data
psql -U postgres -d oued_souss_alert -c "
TRUNCATE alerts, risk_indices, rain_measurements, water_level_measurements,
         sensors, zones, users RESTART IDENTITY CASCADE;"

psql -U postgres -d oued_souss_alert -f database/seed/seed_realistic.sql
```

> **Attention** : Without the prior `TRUNCATE`, re-running `seed_realistic.sql` > will generate duplicates in `risk_indices`. While the anti-duplicate protection of > `generate_critical_alert()` prevents duplicate `alerts`, but > `risk_indices` remains additive.

---

## Useful Queries
```sql
-- General system status
SELECT z.name, ir.risk_level, ir.index_value,
       COUNT(a.alert_id) FILTER (WHERE a.status = 'ACTIVE') AS alertes_actives
FROM zones z
LEFT JOIN risk_indices ir ON ir.zone_id = z.zone_id
LEFT JOIN alerts a ON a.zone_id = z.zone_id
GROUP BY z.name, ir.risk_level, ir.index_value
ORDER BY ir.index_value DESC NULLS LAST;

-- Latest active alerts
SELECT z.name AS zone_name, a.alert_type, a.message, a.alert_date
FROM alerts a JOIN zones z ON a.zone_id = z.zone_id
WHERE a.status = 'ACTIVE'
ORDER BY a.alert_date DESC;

-- Zone measurement history
SELECT timestamp, water_level_m
FROM water_level_measurements m
JOIN sensors c ON m.sensor_id = c.sensor_id
WHERE c.zone_id = 1
ORDER BY timestamp DESC
LIMIT 20;

-- Risk trend over a period
SELECT * FROM get_risk_trend(1, NOW() - INTERVAL '7 days', NOW());
```
