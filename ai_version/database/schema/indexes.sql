-- Description: Indexes to optimize frequent queries

-- Sensors by zone
CREATE INDEX idx_sensors_zone ON sensors(zone_id);

-- Water measurements by sensor + timestamp desc
CREATE INDEX idx_water_sensor_date ON water_level_measurements(sensor_id, timestamp DESC);

-- Rain measurements by sensor + timestamp desc
CREATE INDEX idx_rain_sensor_date ON rain_measurements(sensor_id, timestamp DESC);

-- Risk indices by zone + date desc
CREATE INDEX idx_risk_zone_date ON risk_indices(zone_id, calculation_date DESC);

-- Alerts by zone + date desc
CREATE INDEX idx_alerts_zone_date ON alerts(zone_id, alert_date DESC);

-- Alerts status (filter active)
CREATE INDEX idx_alerts_status ON alerts(status);

-- Alerts by sensor
CREATE INDEX idx_alerts_sensor ON alerts(sensor_id);