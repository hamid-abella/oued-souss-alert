// =============================================================
// Projet : Oued-Souss Alert
// Fichier : src/components/dashboard/AlertsFeed.jsx
// Description : Flux des alertes actives en temps réel
// =============================================================

import { AlertTriangle, CheckCircle } from 'lucide-react';
import { useAlerts }     from '../../context/AlertContext';
import { useAuth }       from '../../context/AuthContext';
import { alertesApi }    from '../../api/alertes.api';
import RiskIndicator     from '../common/RiskIndicator';
import { timeAgo }       from '../../utils/formatters';

const AlertsFeed = () => {
  const { alertes, refresh } = useAlerts();
  const { can }              = useAuth();

  const handleResolve = async (id) => {
    try {
      await alertesApi.resolve(id);
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  if (!alertes.length) return (
    <div style={{
      padding:    '32px',
      textAlign:  'center',
      color:      'var(--color-faible)',
      fontFamily: 'var(--font-mono)',
      fontSize:   '0.8rem',
    }}>
      ✓ Aucune alerte active
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '400px', overflowY: 'auto' }}>
      {alertes.map((alerte) => (
        <div key={alerte.alerte_id} style={{
          display:      'flex',
          alignItems:   'flex-start',
          gap:          '12px',
          padding:      '12px 16px',
          background:   'var(--color-surface-2)',
          borderRadius: 'var(--radius-md)',
          borderLeft:   `3px solid ${alerte.type_alerte === 'CRUE' ? 'var(--color-critique)' : 'var(--color-moyen)'}`,
          animation:    'fadeInUp 0.3s ease both',
        }}>
          <AlertTriangle
            size={16}
            color="var(--color-critique)"
            style={{ marginTop: '2px', flexShrink: 0 }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              display:    'flex',
              alignItems: 'center',
              gap:        '8px',
              flexWrap:   'wrap',
              marginBottom:'4px',
            }}>
              <span style={{
                fontSize:   '0.8rem',
                fontWeight: 600,
                fontFamily: 'var(--font-display)',
              }}>
                {alerte.zone_nom}
              </span>
              <RiskIndicator niveau={alerte.niveau_risque} size="sm" showPulse />
            </div>
            <div style={{
              fontSize:   '0.75rem',
              color:      'var(--color-text-muted)',
              fontFamily: 'var(--font-mono)',
            }}>
              {alerte.type_alerte} · {timeAgo(alerte.date_alerte)}
            </div>
            {alerte.message && (
              <div style={{
                fontSize:   '0.75rem',
                color:      'var(--color-text-muted)',
                marginTop:  '4px',
                overflow:   'hidden',
                textOverflow:'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {alerte.message}
              </div>
            )}
          </div>

          {/* Bouton résoudre (opérateur/admin/securite) */}
          {can('resolve') && (
            <button
              onClick={() => handleResolve(alerte.alerte_id)}
              title="Marquer comme résolue"
              style={{
                display:      'flex',
                alignItems:   'center',
                padding:      '4px 10px',
                background:   'transparent',
                border:       '1px solid var(--color-faible)',
                borderRadius: 'var(--radius-sm)',
                color:        'var(--color-faible)',
                fontSize:     '0.7rem',
                fontFamily:   'var(--font-mono)',
                flexShrink:   0,
                transition:   'var(--transition)',
                cursor:       'pointer',
              }}
            >
              <CheckCircle size={12} style={{ marginRight: '4px' }} />
              Résoudre
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default AlertsFeed;