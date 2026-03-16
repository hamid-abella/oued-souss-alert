import { useState } from 'react';
import { Send } from 'lucide-react';

const MesureForm = ({ capteurs = [], onSubmit }) => {
  const [type,      setType]      = useState('niveau');
  const [capteurId, setCapteurId] = useState('');
  const [valeur,    setValeur]    = useState('');
  const [status,    setStatus]    = useState(null); // 'success' | 'error'
  const [message,   setMessage]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setStatus(null);
      await onSubmit({ type, capteur_id: parseInt(capteurId), valeur: parseFloat(valeur) });
      setStatus('success');
      setMessage('Mesure insérée avec succès.');
      setValeur('');
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.error || 'Erreur lors de l\'insertion.');
    }
  };

  const capteursFiltres = capteurs.filter(c =>
    type === 'niveau' ? c.type_capteur === 'niveau_eau' : c.type_capteur === 'pluie'
  );

  return (
    <div style={{
      background:   'var(--color-surface)',
      border:       '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      padding:      '24px',
    }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: '20px' }}>
        Insérer une Mesure
      </h3>

      {status && (
        <div style={{
          padding:      '10px 14px',
          marginBottom: '16px',
          background:   status === 'success' ? 'rgba(0,196,140,0.1)' : 'rgba(232,48,58,0.1)',
          border:       `1px solid ${status === 'success' ? 'var(--color-faible)' : 'var(--color-danger)'}`,
          borderRadius: 'var(--radius-md)',
          color:        status === 'success' ? 'var(--color-faible)' : 'var(--color-danger)',
          fontSize:     '0.8rem',
          fontFamily:   'var(--font-mono)',
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Type de mesure */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['niveau', 'pluie'].map(t => (
            <button
              key={t}
              type="button"
              onClick={() => { setType(t); setCapteurId(''); }}
              style={{
                flex:         1,
                padding:      '8px',
                background:   type === t ? 'var(--color-primary-dim)' : 'var(--color-surface-2)',
                border:       `1px solid ${type === t ? 'var(--color-primary)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-md)',
                color:        type === t ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontSize:     '0.8rem',
                fontFamily:   'var(--font-mono)',
                cursor:       'pointer',
                transition:   'var(--transition)',
              }}
            >
              {t === 'niveau' ? '💧 Niveau eau' : '🌧️ Pluie'}
            </button>
          ))}
        </div>

        {/* Capteur */}
        <div>
          <label style={{ display: 'block', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
            Capteur *
          </label>
          <select
            style={{
              width: '100%', padding: '10px 12px',
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-text)',
              fontSize: '0.875rem', fontFamily: 'var(--font-mono)',
            }}
            value={capteurId}
            onChange={e => setCapteurId(e.target.value)}
            required
          >
            <option value="">Sélectionner un capteur...</option>
            {capteursFiltres.map(c => (
              <option key={c.capteur_id} value={c.capteur_id}>
                Capteur #{c.capteur_id} — {c.zone_nom || `Zone ${c.zone_id}`} [{c.statut}]
              </option>
            ))}
          </select>
        </div>

        {/* Valeur */}
        <div>
          <label style={{ display: 'block', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
            Valeur * {type === 'niveau' ? '(m — max 20m)' : '(mm — max 500mm)'}
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            max={type === 'niveau' ? 20 : 500}
            value={valeur}
            onChange={e => setValeur(e.target.value)}
            required
            style={{
              width: '100%', padding: '10px 12px',
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-text)',
              fontSize: '0.875rem', fontFamily: 'var(--font-mono)',
            }}
            placeholder={type === 'niveau' ? '0.00 — 20.00' : '0.00 — 500.00'}
          />
        </div>

        <button type="submit" style={{
          display:      'flex',
          alignItems:   'center',
          justifyContent:'center',
          gap:          '8px',
          padding:      '10px',
          background:   'var(--color-primary)',
          border:       'none',
          borderRadius: 'var(--radius-md)',
          color:        '#fff',
          fontSize:     '0.875rem',
          fontWeight:   600,
          cursor:       'pointer',
          transition:   'var(--transition)',
        }}>
          <Send size={14} /> Envoyer la mesure
        </button>
      </form>
    </div>
  );
};

export default MesureForm;