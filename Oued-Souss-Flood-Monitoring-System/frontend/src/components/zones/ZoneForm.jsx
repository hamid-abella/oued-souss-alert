import { useState } from 'react';
import { Plus, X } from 'lucide-react';

const FIELD_STYLE = {
  width: '100%', padding: '10px 12px',
  background: 'var(--color-surface-2)', border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)', color: 'var(--color-text)',
  fontSize: '0.875rem', fontFamily: 'var(--font-mono)', transition: 'var(--transition)',
};

const ZoneForm = ({ onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    name: '', zone_type: 'agricultural',
    area_ha: '', latitude: '', longitude: '', critical_level: ''
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await onSubmit({
        name:           form.name,
        zone_type:      form.zone_type,
        area_ha:        form.area_ha     ? parseFloat(form.area_ha)      : null,
        latitude:       form.latitude    ? parseFloat(form.latitude)     : null,
        longitude:      form.longitude   ? parseFloat(form.longitude)    : null,
        critical_level: parseFloat(form.critical_level),
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create zone.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '24px', animation: 'fadeInUp 0.3s ease both' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem' }}>New Zone</h3>
        <button onClick={onCancel} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
          <X size={18} />
        </button>
      </div>

      {error && (
        <div style={{ padding: '10px 14px', marginBottom: '16px', background: 'rgba(232,48,58,0.1)', border: '1px solid var(--color-danger)', borderRadius: 'var(--radius-md)', color: 'var(--color-danger)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Name *</label>
          <input style={FIELD_STYLE} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Ait Melloul Agricultural Zone" required />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Type *</label>
            <select style={FIELD_STYLE} value={form.zone_type} onChange={e => setForm(p => ({ ...p, zone_type: e.target.value }))}>
              <option value="agricultural">Agricultural</option>
              <option value="urban">Urban</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Area (ha)</label>
            <input style={FIELD_STYLE} type="number" value={form.area_ha} onChange={e => setForm(p => ({ ...p, area_ha: e.target.value }))} placeholder="450" />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Latitude</label>
            <input style={FIELD_STYLE} type="number" step="0.000001" value={form.latitude} onChange={e => setForm(p => ({ ...p, latitude: e.target.value }))} placeholder="30.3372" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Longitude</label>
            <input style={FIELD_STYLE} type="number" step="0.000001" value={form.longitude} onChange={e => setForm(p => ({ ...p, longitude: e.target.value }))} placeholder="-9.4988" />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Critical Level (m) *</label>
          <input style={FIELD_STYLE} type="number" step="0.01" min="0.01" value={form.critical_level} onChange={e => setForm(p => ({ ...p, critical_level: e.target.value }))} placeholder="3.50" required />
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '4px' }}>
          <button type="button" onClick={onCancel} style={{ padding: '8px 20px', background: 'transparent', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-muted)', fontSize: '0.875rem', cursor: 'pointer' }}>
            Cancel
          </button>
          <button type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 20px', background: loading ? 'var(--color-primary-dim)' : 'var(--color-primary)', border: 'none', borderRadius: 'var(--radius-md)', color: '#fff', fontSize: '0.875rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
            <Plus size={14} />
            {loading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ZoneForm;