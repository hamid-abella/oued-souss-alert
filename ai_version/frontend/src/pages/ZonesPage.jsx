import { useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { useZones }   from '../hooks/useZones';
import { useAuth }    from '../context/AuthContext';
import ZoneCard       from '../components/zones/ZoneCard';
import ZoneForm       from '../components/zones/ZoneForm';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ZonesPage = () => {
  const { zones, loading, error, refetch, createZone, deleteZone } = useZones();
  const { can }       = useAuth();
  const [showForm,    setShowForm]    = useState(false);
  const [selectedId,  setSelectedId]  = useState(null);

  const handleCreate = async (data) => {
    await createZone(data);
    setShowForm(false);
  };

  if (loading) return <LoadingSpinner text="Chargement des zones..." />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* En-tête */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Zones
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            {zones.length} zone{zones.length > 1 ? 's' : ''} surveillée{zones.length > 1 ? 's' : ''}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={refetch} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 16px',
            background: 'transparent',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-text-muted)',
            fontSize: '0.8rem', cursor: 'pointer',
          }}>
            <RefreshCw size={14} /> Actualiser
          </button>
          {can('create') && (
            <button onClick={() => setShowForm(s => !s)} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px',
              background: 'var(--color-primary)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              color: '#fff',
              fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
            }}>
              <Plus size={14} /> Nouvelle zone
            </button>
          )}
        </div>
      </div>

      {error && (
        <div style={{ padding: '12px 16px', background: 'rgba(232,48,58,0.1)', border: '1px solid var(--color-danger)', borderRadius: 'var(--radius-md)', color: 'var(--color-danger)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
          {error}
        </div>
      )}

      {showForm && (
        <ZoneForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      )}

      {/* Grille zones */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {zones.map(zone => (
          <ZoneCard
            key={zone.zone_id}
            zone={zone}
            selected={selectedId === zone.zone_id}
            onSelect={z => setSelectedId(s => s === z.zone_id ? null : z.zone_id)}
            onDelete={deleteZone}
          />
        ))}
      </div>
    </div>
  );
};

export default ZonesPage;