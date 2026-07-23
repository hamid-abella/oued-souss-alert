-- Users of the system
CREATE TABLE users (
    user_id        SERIAL PRIMARY KEY,
    name           VARCHAR(100)  NOT NULL,
    email          VARCHAR(150)  NOT NULL UNIQUE,
    password       VARCHAR(255)  NOT NULL, -- bcrypt hashed
    role           VARCHAR(20)   NOT NULL CHECK (role IN ('admin', 'operator', 'reader', 'security')),
    active         BOOLEAN       DEFAULT TRUE,
    created_at     TIMESTAMP     DEFAULT NOW(),
    updated_at     TIMESTAMP     DEFAULT NOW()
);

-- Geographical zones
CREATE TABLE zones (
    zone_id        SERIAL PRIMARY KEY,
    name           VARCHAR(100)  NOT NULL,
    zone_type      VARCHAR(50)   CHECK (zone_type IN ('agricultural', 'urban', 'mixed')),
    area_ha        DECIMAL(10,2),
    latitude       DECIMAL(9,6),
    longitude      DECIMAL(9,6),
    critical_level NUMERIC       NOT NULL CHECK (critical_level > 0)
);

-- Sensors installed in zones
CREATE TABLE sensors (
    sensor_id       SERIAL PRIMARY KEY,
    zone_id         INTEGER       NOT NULL,
    sensor_type     VARCHAR(50)   NOT NULL CHECK (sensor_type IN ('water_level', 'rain')),
    installation_date DATE,
    status          VARCHAR(20)   DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'offline')),
    CONSTRAINT fk_sensors_zone
        FOREIGN KEY (zone_id) REFERENCES zones(zone_id)
        ON DELETE CASCADE
);

-- Water level measurements
CREATE TABLE water_level_measurements (
    measurement_id SERIAL PRIMARY KEY,
    sensor_id      INTEGER       NOT NULL,
    timestamp      TIMESTAMP     NOT NULL,
    water_level_m  NUMERIC(5,2) NOT NULL,
    CONSTRAINT fk_water_level_sensor
        FOREIGN KEY (sensor_id)
        REFERENCES sensors(sensor_id)
        ON DELETE CASCADE
);

-- Rain measurements
CREATE TABLE rain_measurements (
    measurement_id SERIAL PRIMARY KEY,
    sensor_id      INTEGER       NOT NULL,
    timestamp      TIMESTAMP     NOT NULL,
    rain_mm        NUMERIC(5,2) NOT NULL,
    CONSTRAINT fk_rain_sensor
        FOREIGN KEY (sensor_id)
        REFERENCES sensors(sensor_id)
        ON DELETE CASCADE
);

-- Flood risk indices
CREATE TABLE risk_indices (
    index_id       SERIAL PRIMARY KEY,
    zone_id        INTEGER       NOT NULL,
    calculation_date TIMESTAMP   NOT NULL,
    index_value    NUMERIC(5,2) NOT NULL,
    risk_level     VARCHAR(20)   CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    CONSTRAINT fk_risk_zone
        FOREIGN KEY (zone_id)
        REFERENCES zones(zone_id)
        ON DELETE CASCADE
);

-- Alerts
CREATE TABLE alerts (
    alert_id       SERIAL PRIMARY KEY,
    zone_id        INTEGER       NOT NULL,
    index_id       INTEGER,
    sensor_id      INTEGER,
    alert_date     TIMESTAMP     NOT NULL,
    alert_type     VARCHAR(50)   CHECK (alert_type IN ('FLOOD', 'HEAVY_RAIN', 'LEVEL_EXCEEDED')),
    message        TEXT,
    status         VARCHAR(20)   DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'RESOLVED')),
    CONSTRAINT fk_alerts_zone
        FOREIGN KEY (zone_id)
        REFERENCES zones(zone_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_alerts_index
        FOREIGN KEY (index_id)
        REFERENCES risk_indices(index_id)
        ON DELETE SET NULL,
    CONSTRAINT fk_alerts_sensor
        FOREIGN KEY (sensor_id)
        REFERENCES sensors(sensor_id)
        ON DELETE SET NULL
);

-- =============================================================
-- N-N Associations for Users
-- =============================================================

-- User configures zone
CREATE TABLE user_zone_configuration (
    user_id        INTEGER      NOT NULL,
    zone_id        INTEGER      NOT NULL,
    configuration_date TIMESTAMP NOT NULL DEFAULT NOW(),
    action_type    VARCHAR(50) NOT NULL,
    comment        TEXT,
    PRIMARY KEY (user_id, zone_id, configuration_date),
    CONSTRAINT fk_uzc_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_uzc_zone FOREIGN KEY (zone_id) REFERENCES zones(zone_id) ON DELETE CASCADE
);

-- User operates sensor
CREATE TABLE user_sensor_operations (
    user_id        INTEGER      NOT NULL,
    sensor_id      INTEGER      NOT NULL,
    operation_date TIMESTAMP    NOT NULL DEFAULT NOW(),
    operation_type VARCHAR(50)  NOT NULL,
    comment        TEXT,
    PRIMARY KEY (user_id, sensor_id, operation_date),
    CONSTRAINT fk_uso_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_uso_sensor FOREIGN KEY (sensor_id) REFERENCES sensors(sensor_id) ON DELETE CASCADE
);

-- User processes alert
CREATE TABLE user_alerts_processing (
    user_id        INTEGER      NOT NULL,
    alert_id       INTEGER      NOT NULL,
    process_date   TIMESTAMP    NOT NULL DEFAULT NOW(),
    action         VARCHAR(50)  NOT NULL,
    comment        TEXT,
    PRIMARY KEY (user_id, alert_id, process_date),
    CONSTRAINT fk_uap_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_uap_alert FOREIGN KEY (alert_id) REFERENCES alerts(alert_id) ON DELETE CASCADE
);

-- User triggers risk index
CREATE TABLE user_risk_index_operations (
    user_id          INTEGER      NOT NULL,
    index_id         INTEGER      NOT NULL,
    operation_date   TIMESTAMP    NOT NULL DEFAULT NOW(),
    trigger_mode     VARCHAR(50)  NOT NULL,
    comment          TEXT,
    PRIMARY KEY (user_id, index_id, operation_date),
    CONSTRAINT fk_urx_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_urx_index FOREIGN KEY (index_id) REFERENCES risk_indices(index_id) ON DELETE CASCADE
);

-- Archive of water level measurements
CREATE TABLE water_level_measurements_archive AS TABLE water_level_measurements WITH NO DATA;

-- Archive of rain measurements
CREATE TABLE rain_measurements_archive AS TABLE rain_measurements WITH NO DATA;