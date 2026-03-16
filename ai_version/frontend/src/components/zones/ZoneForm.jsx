import { useState } from 'react';
import { Plus, X } from 'lucide-react';

const FIELD_STYLE = {
  width:        '100%',
  padding:      '10px 12px',
  background:   'var(--color-surface-2)',
  border:       '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  color:        'var(--color-text)',
  fontSize:     '0.875rem',
  fontFamily:   'var(--font-mono)',
  transition:   'var(--transition)',
};

const ZoneForm = ({ onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    nom: '', type_zone: 'agricole',
    superficie: '', latitude: '',
    longitude: '', seuil_critique: ''
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await onSubmit(form);
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la création.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background:   'var(--color-surface)',
      border:       '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      padding:      '24px',
      animation:    'fadeInUp 0.3s ease both',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem' }}>
          Nouvelle Zone
        </h3>
        <button onClick={onCancel} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
          <X size={18} />
        </button>
      </div>

      {error && (
        <div style={{
          padding:      '10px 14px',
          marginBottom: '16px',
          background:   'rgba(232,48,58,0.1)',
          border:       '1px solid var(--color-danger)',
          borderRadius: 'var(--radius-md)',
          color:        'var(--color-danger)',
          fontSize:     '0.8rem',
          fontFamily:   'var(--font-mono)',
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Nom */}
        <div>
          <label style={{ display: 'block', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
            Nom *
          </label>
          <input
            style={FIELD_STYLE}
            value={form.nom}
            onChange={e => setForm(p => ({ ...p, nom: e.target.value }))}
            placeholder="Ex: Zone Agricole Aït Melloul"
            required
          />
        </div>

        {/* Type + Superficie */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
              Type *
            </label>
            <select
              style={FIELD_STYLE}
              value={form.type_zone}
              onChange={e => setForm(p => ({ ...p, type_zone: e.target.value }))}
            >
              <option value="agricole">Agricole</option>
              <option value="urbaine">Urbaine</option>
              <option value="mixte">Mixte</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
              Superficie (ha)
            </label>
            <input
              style={FIELD_STYLE}
              type="number"
              value={form.superficie}
              onChange={e => setForm(p => ({ ...p, superficie: e.target.value }))}
              placeholder="450"
            />
          </div>
        </div>

        {/* Lat + Lon */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
              Latitude
            </label>
            <input
              style={FIELD_STYLE}
              type="number"
              step="0.000001"
              value={form.latitude}
              onChange={e => setForm(p => ({ ...p, latitude: e.target.value }))}
              placeholder="30.3372"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
              Longitude
            </label>
            <input
              style={FIELD_STYLE}
              type="number"
              step="0.000001"
              value={form.longitude}
              onChange={e => setForm(p => ({ ...p, longitude: e.target.value }))}
              placeholder="-9.4988"
            />
          </div>
        </div>

        {/* Seuil critique */}
        <div>
          <label style={{ display: 'block', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
            Seuil Critique (m) *
          </label>
          <input
            style={FIELD_STYLE}
            type="number"
            step="0.01"
            min="0.01"
            value={form.seuil_critique}
            onChange={e => setForm(p => ({ ...p, seuil_critique: e.target.value }))}
            placeholder="3.50"
            required
          />
        </div>

        {/* Boutons */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '4px' }}>
          <button type="button" onClick={onCancel} style={{
            padding:      '8px 20px',
            background:   'transparent',
            border:       '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            color:        'var(--color-text-muted)',
            fontSize:     '0.875rem',
            cursor:       'pointer',
          }}>
            Annuler
          </button>
          <button type="submit" disabled={loading} style={{
            display:      'flex',
            alignItems:   'center',
            gap:          '6px',
            padding:      '8px 20px',
            background:   loading ? 'var(--color-primary-dim)' : 'var(--color-primary)',
            border:       'none',
            borderRadius: 'var(--radius-md)',
            color:        '#fff',
            fontSize:     '0.875rem',
            fontWeight:   600,
            cursor:       loading ? 'not-allowed' : 'pointer',
          }}>
            <Plus size={14} />
            {loading ? 'Création...' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ZoneForm;