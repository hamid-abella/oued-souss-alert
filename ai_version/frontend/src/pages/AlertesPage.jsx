// =============================================================
// Projet : Oued-Souss Alert
// Fichier : src/pages/AlertesPage.jsx
// Description : Page des alertes — utilise AlertesList
// =============================================================

import { useState }    from 'react';
import { useAlertes }  from '../hooks/useAlertes';
import AlertesList     from '../components/alertes/AlertesList';

const AlertesPage = () => {
  const { alertes, loading, resolveAlerte, refetch } = useAlertes();
  const [filter, setFilter] = useState('ALL'); // ALL | ACTIVE | RESOLUE

  // Filtrage par statut
  const filtered = alertes.filter(a =>
    filter === 'ALL' ? true : a.statut === filter
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* En-tête */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{
            fontFamily:    'var(--font-display)',
            fontSize:      '1.6rem',
            fontWeight:    800,
            letterSpacing: '-0.03em',
          }}>
            Alertes
          </h1>
          <p style={{
            color:      'var(--color-text-muted)',
            fontSize:   '0.85rem',
            fontFamily: 'var(--font-mono)',
            marginTop:  '4px',
          }}>
            {alertes.filter(a => a.statut === 'ACTIVE').length} active{alertes.filter(a => a.statut === 'ACTIVE').length > 1 ? 's' : ''} sur {alertes.length} total
          </p>
        </div>

        {/* Filtre par statut */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {['ALL', 'ACTIVE', 'RESOLUE'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding:      '6px 14px',
                background:   filter === f ? 'var(--color-primary-dim)' : 'var(--color-surface)',
                border:       `1px solid ${filter === f ? 'var(--color-primary)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-md)',
                color:        filter === f ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontSize:     '0.75rem',
                fontFamily:   'var(--font-mono)',
                cursor:       'pointer',
                transition:   'var(--transition)',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des alertes avec recherche + filtre par type */}
      <AlertesList
        alertes={filtered}
        loading={loading}
        onResolve={resolveAlerte}
        onRefresh={refetch}
      />

    </div>
  );
};

export default AlertesPage;