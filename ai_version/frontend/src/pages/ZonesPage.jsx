import { useState } from 'react';
import { MapPin, Plus, RefreshCw, AlertTriangle } from 'lucide-react';
import ZoneCard       from '../components/zones/ZoneCard';
import ZoneForm       from '../components/zones/ZoneForm';
import RiskIndicator  from '../components/common/RiskIndicator';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useZones }   from '../hooks/useZones';
import { useAuth }    from '../context/AuthContext';
import { formatValue, zoneTypeLabel } from '../utils/formatters';

const ZonesPage = () => {
  const { zones, loading, error, refetch, createZone, deleteZone } = useZones();
  const { can } = useAuth();
  const [showForm,      setShowForm]      = useState(false);
  const [selectedZone,  setSelectedZone]  = useState(null);
  const [typeFilter,    setTypeFilter]    = useState('ALL');

  const filtered = zones.filter(z =>
    typeFilter === 'ALL' || z.zone_type === typeFilter
  );

  const handleCreate = async (data) => {
    await createZone(data);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this zone and all its associated data?')) return;
    await deleteZone(id);
    if (selectedZone?.zone_id === id) setSelectedZone(null);
  };

  return (
    <div className="page-stack">

      <div className="page-header">
        <div>
          <div className="page-title">Zones</div>
          <div className="page-subtitle">{zones.length} monitored zone{zones.length !== 1 ? 's' : ''}</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={refetch} className="btn-ghost"><RefreshCw size={14} /> Refresh</button>
          {can('zones', 'create') && (
            <button onClick={() => setShowForm(p => !p)} className="btn-primary">
              <Plus size={14} /> New Zone
            </button>
          )}
        </div>
      </div>

      {error && (
        <div style={{ padding: '12px 16px', background: 'rgba(232,48,58,0.1)', border: '1px solid var(--color-danger)', borderRadius: 'var(--radius-md)', color: 'var(--color-danger)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
          {error}
        </div>
      )}

      {showForm && can('zones', 'create') && (
        <ZoneForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      )}

      {/* Type filter */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {['ALL', 'agricultural', 'urban', 'mixed'].map(t => (
          <button key={t} onClick={() => setTypeFilter(t)} className={`btn-filter ${typeFilter === t ? 'active' : ''}`}>
            {t === 'ALL' ? 'All' : zoneTypeLabel(t)}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedZone ? '1fr 340px' : '1fr', gap: '20px' }}>

        {/* Zone grid */}
        <div>
          {loading ? (
            <LoadingSpinner text="Loading zones..." />
          ) : filtered.length === 0 ? (
            <div className="empty-state">No zones found.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {filtered.map(zone => (
                <ZoneCard
                  key={zone.zone_id}
                  zone={zone}
                  selected={selectedZone?.zone_id === zone.zone_id}
                  onSelect={setSelectedZone}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>

        {/* Zone detail panel */}
        {selectedZone && (
          <div className="panel-card animate-in" style={{ height: 'fit-content', position: 'sticky', top: '80px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} color="var(--color-primary)" />
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{selectedZone.name}</span>
              </div>
              <button onClick={() => setSelectedZone(null)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '1.1rem' }}>×</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
              {[
                ['Zone ID',        `#${selectedZone.zone_id}`],
                ['Type',           zoneTypeLabel(selectedZone.zone_type)],
                ['Area',           formatValue(selectedZone.area_ha, 'ha', 0)],
                ['Latitude',       selectedZone.latitude ?? '—'],
                ['Longitude',      selectedZone.longitude ?? '—'],
                ['Critical level', formatValue(selectedZone.critical_level, 'm')],
                ['Current level',  formatValue(selectedZone.last_water_level_m, 'm')],
                ['Level %',        selectedZone.critical_level_pct ? `${selectedZone.critical_level_pct}%` : '—'],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--color-border)' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>{label}</span>
                  <span style={{ fontWeight: 500 }}>{value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Risk level</span>
                <RiskIndicator level={selectedZone.last_risk_level} size="sm" />
              </div>
              {selectedZone.active_alert_id && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', background: 'rgba(232,48,58,0.1)', borderRadius: 'var(--radius-md)', color: 'var(--color-critique)' }}>
                  <AlertTriangle size={13} /> Active alert #{selectedZone.active_alert_id}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ZonesPage;