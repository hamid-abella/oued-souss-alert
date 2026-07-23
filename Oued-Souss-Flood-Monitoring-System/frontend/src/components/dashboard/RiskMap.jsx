import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { riskColor, zoneTypeLabel, formatValue } from '../../utils/formatters';
import RiskIndicator from '../common/RiskIndicator';

const MAP_CENTER = [30.42, -9.0];

// Receives zones from risk_summary_view:
// { zone_id, zone_name, zone_type, latitude, longitude, critical_level,
//   last_water_level_m, last_risk_level, active_alert_id, critical_level_pct }
const RiskMap = ({ zones = [], onZoneClick }) => (
  <div style={{ height: '380px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
    <MapContainer
      center={MAP_CENTER}
      zoom={9}
      style={{ height: '100%', width: '100%', background: '#080e1a' }}
      zoomControl={false}
    >
      <ZoomControl position="bottomright" />
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap &copy; CARTO'
      />
      {zones.map((zone) =>
        zone.latitude && zone.longitude ? (
          <CircleMarker
            key={zone.zone_id}
            center={[parseFloat(zone.latitude), parseFloat(zone.longitude)]}
            radius={
              zone.last_risk_level === 'CRITICAL' ? 18 :
              zone.last_risk_level === 'HIGH'     ? 14 : 10
            }
            pathOptions={{
              color:       riskColor(zone.last_risk_level),
              fillColor:   riskColor(zone.last_risk_level),
              fillOpacity: zone.active_alert_id ? 0.7 : 0.4,
              weight:      zone.active_alert_id ? 3 : 2,
            }}
            eventHandlers={{
              click: () => onZoneClick?.(zone)
            }}
          >
            <Popup>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#111', minWidth: '180px' }}>
                <strong style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>
                  {zone.zone_name}
                </strong>
                <div>Type: {zoneTypeLabel(zone.zone_type)}</div>
                <div>Critical level: {zone.critical_level} m</div>
                <div>Current level: {formatValue(zone.last_water_level_m, 'm')}</div>
                <div>Level %: {zone.critical_level_pct ?? '—'}%</div>
                <div style={{ marginTop: '6px' }}>
                  <RiskIndicator level={zone.last_risk_level} size="sm" showPulse />
                </div>
                {zone.active_alert_id && (
                  <div style={{ marginTop: '4px', color: 'var(--color-critique)', fontSize: '0.7rem', fontWeight: 700 }}>
                    ⚠ Active alert
                  </div>
                )}
              </div>
            </Popup>
          </CircleMarker>
        ) : null
      )}
    </MapContainer>
  </div>
);

export default RiskMap;