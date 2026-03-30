import { useState } from 'react';
import { Send } from 'lucide-react';
import { sensorStatusLabel } from '../../utils/formatters';

// sensors: array from GET /api/sensors (sensor_id, sensor_type, zone_name, status)
// onSubmit: called with { sensor_id, water_level_m } or { sensor_id, rain_mm }
const MeasurementForm = ({ sensors = [], onSubmit }) => {
  const [type,     setType]     = useState('water_level');
  const [sensorId, setSensorId] = useState('');
  const [value,    setValue]    = useState('');
  const [status,   setStatus]   = useState(null);
  const [message,  setMessage]  = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setStatus(null);
      const payload = type === 'water_level'
        ? { sensor_id: parseInt(sensorId), water_level_m: parseFloat(value) }
        : { sensor_id: parseInt(sensorId), rain_mm: parseFloat(value) };
      await onSubmit({ type, ...payload });
      setStatus('success');
      setMessage('Measurement inserted successfully.');
      setValue('');
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.error || 'Failed to insert measurement.');
    }
  };

  const filteredSensors = sensors.filter(s => s.sensor_type === type && s.status === 'active');

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: '20px' }}>
        Insert Measurement
      </h3>

      {status && (
        <div style={{
          padding: '10px 14px', marginBottom: '16px',
          background: status === 'success' ? 'rgba(0,196,140,0.1)' : 'rgba(232,48,58,0.1)',
          border: `1px solid ${status === 'success' ? 'var(--color-faible)' : 'var(--color-danger)'}`,
          borderRadius: 'var(--radius-md)',
          color: status === 'success' ? 'var(--color-faible)' : 'var(--color-danger)',
          fontSize: '0.8rem', fontFamily: 'var(--font-mono)',
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { value: 'water_level', label: '💧 Water Level' },
            { value: 'rain',        label: '🌧️ Rain'        },
          ].map(t => (
            <button
              key={t.value}
              type="button"
              onClick={() => { setType(t.value); setSensorId(''); }}
              style={{
                flex: 1, padding: '8px',
                background:   type === t.value ? 'var(--color-primary-dim)' : 'var(--color-surface-2)',
                border:       `1px solid ${type === t.value ? 'var(--color-primary)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-md)',
                color:        type === t.value ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontSize: '0.8rem', fontFamily: 'var(--font-mono)', cursor: 'pointer', transition: 'var(--transition)',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
            Sensor *
          </label>
          <select
            style={{ width: '100%', padding: '10px 12px', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text)', fontSize: '0.875rem', fontFamily: 'var(--font-mono)' }}
            value={sensorId}
            onChange={e => setSensorId(e.target.value)}
            required
          >
            <option value="">Select a sensor...</option>
            {filteredSensors.map(s => (
              <option key={s.sensor_id} value={s.sensor_id}>
                Sensor #{s.sensor_id} — {s.zone_name || `Zone ${s.zone_id}`} [{sensorStatusLabel(s.status)}]
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
            Value * {type === 'water_level' ? '(m — max 20m)' : '(mm — max 500mm)'}
          </label>
          <input
            type="number" step="0.01" min="0"
            max={type === 'water_level' ? 20 : 500}
            value={value}
            onChange={e => setValue(e.target.value)}
            required
            style={{ width: '100%', padding: '10px 12px', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text)', fontSize: '0.875rem', fontFamily: 'var(--font-mono)' }}
            placeholder={type === 'water_level' ? '0.00 — 20.00' : '0.00 — 500.00'}
          />
        </div>

        <button type="submit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', background: 'var(--color-primary)', border: 'none', borderRadius: 'var(--radius-md)', color: '#fff', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', transition: 'var(--transition)' }}>
          <Send size={14} /> Send measurement
        </button>
      </form>
    </div>
  );
};

export default MeasurementForm;