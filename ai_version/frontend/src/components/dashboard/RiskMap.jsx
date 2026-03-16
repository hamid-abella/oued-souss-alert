// =============================================================
// Projet : Oued-Souss Alert
// Fichier : src/components/dashboard/RiskMap.jsx
// Description : Carte Leaflet des zones avec niveau de risque
// Spec : Carte interactive affichant les zones menacées en rouge
// =============================================================

import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { riskColor } from '../../utils/formatters';
import RiskIndicator from '../common/RiskIndicator';

// Centre sur la région Souss-Massa
const MAP_CENTER = [30.42, -9.0];

const RiskMap = ({ zones = [] }) => (
  <div style={{
    height:       '380px',
    borderRadius: 'var(--radius-lg)',
    overflow:     'hidden',
    border:       '1px solid var(--color-border)',
  }}>
    <MapContainer
      center={MAP_CENTER}
      zoom={9}
      style={{ height: '100%', width: '100%', background: '#080e1a' }}
      zoomControl={false}
    >
      <ZoomControl position="bottomright" />
      {/* Tuile sombre OpenStreetMap */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap &copy; CARTO'
      />

      {/* Marqueur par zone */}
      {zones.map((zone) => (
        zone.latitude && zone.longitude && (
          <CircleMarker
            key={zone.zone_id}
            center={[parseFloat(zone.latitude), parseFloat(zone.longitude)]}
            radius={zone.dernier_niveau_risque === 'CRITIQUE' ? 18 :
                    zone.dernier_niveau_risque === 'ELEVE'    ? 14 : 10}
            pathOptions={{
              color:       riskColor(zone.dernier_niveau_risque),
              fillColor:   riskColor(zone.dernier_niveau_risque),
              fillOpacity: 0.5,
              weight:      2,
            }}
          >
            <Popup>
              <div style={{
                fontFamily:  'var(--font-mono)',
                fontSize:    '0.8rem',
                color:       '#111',
                minWidth:    '160px',
              }}>
                <strong style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem' }}>
                  {zone.nom}
                </strong>
                <br />
                Type : {zone.type_zone}<br />
                Seuil : {zone.seuil_critique} m<br />
                Dernier niveau : {zone.dernier_niveau_eau ?? '—'} m<br />
                Risque : <strong>{zone.dernier_niveau_risque ?? 'N/A'}</strong>
              </div>
            </Popup>
          </CircleMarker>
        )
      ))}
    </MapContainer>
  </div>
);

export default RiskMap;