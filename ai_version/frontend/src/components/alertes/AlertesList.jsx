// =============================================================
// Projet : Oued-Souss Alert
// Fichier : src/components/alertes/AlertesList.jsx
// Description : Liste complète des alertes avec filtres
//               Utilisé dans AlertesPage.jsx
// =============================================================

import { useState }   from 'react';
import { Search, RefreshCw, Bell } from 'lucide-react';
import AlerteCard      from './AlerteCard';
import LoadingSpinner  from '../common/LoadingSpinner';

const AlertesList = ({ alertes = [], loading = false, onResolve, onRefresh }) => {
  const [search,    setSearch]    = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL'); // ALL | CRUE | PRECIPITATION_INTENSE | DEPASSEMENT_SEUIL

  // Filtrage par recherche (nom zone) + type
  const filtered = alertes.filter(a => {
    const matchSearch = a.zone_nom?.toLowerCase().includes(search.toLowerCase())
      || a.message?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'ALL' || a.type_alerte === typeFilter;
    return matchSearch && matchType;
  });

  // Compteurs par statut
  const countActive  = alertes.filter(a => a.statut === 'ACTIVE').length;
  const countResolue = alertes.filter(a => a.statut === 'RESOLUE').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Barre d'outils */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>

        {/* Champ de recherche */}
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={14} style={{
            position:  'absolute',
            left:      '12px',
            top:       '50%',
            transform: 'translateY(-50%)',
            color:     'var(--color-text-dim)',
            pointerEvents: 'none',
          }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par zone ou message..."
            style={{
              width:        '100%',
              padding:      '8px 12px 8px 34px',
              background:   'var(--color-surface)',
              border:       '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              color:        'var(--color-text)',
              fontSize:     '0.8rem',
              fontFamily:   'var(--font-mono)',
              transition:   'var(--transition)',
            }}
            onFocus={e  => e.target.style.borderColor = 'var(--color-primary)'}
            onBlur={e   => e.target.style.borderColor = 'var(--color-border)'}
          />
        </div>

        {/* Filtres par type */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {[
            { value: 'ALL',                   label: 'Tous'        },
            { value: 'CRUE',                  label: '🌊 Crue'     },
            { value: 'PRECIPITATION_INTENSE', label: '🌧️ Pluie'   },
            { value: 'DEPASSEMENT_SEUIL',     label: '⚠️ Seuil'   },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setTypeFilter(value)}
              style={{
                padding:      '6px 12px',
                background:   typeFilter === value ? 'var(--color-primary-dim)' : 'var(--color-surface)',
                border:       `1px solid ${typeFilter === value ? 'var(--color-primary)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-md)',
                color:        typeFilter === value ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontSize:     '0.75rem',
                fontFamily:   'var(--font-mono)',
                cursor:       'pointer',
                transition:   'var(--transition)',
                whiteSpace:   'nowrap',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Bouton actualiser */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            style={{
              display:      'flex',
              alignItems:   'center',
              gap:          '6px',
              padding:      '6px 14px',
              background:   'transparent',
              border:       '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              color:        'var(--color-text-muted)',
              fontSize:     '0.75rem',
              fontFamily:   'var(--font-mono)',
              cursor:       'pointer',
              transition:   'var(--transition)',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
          >
            <RefreshCw size={12} /> Actualiser
          </button>
        )}
      </div>

      {/* Résumé compteurs */}
      <div style={{
        display:      'flex',
        gap:          '16px',
        padding:      '12px 16px',
        background:   'var(--color-surface)',
        border:       '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        fontSize:     '0.75rem',
        fontFamily:   'var(--font-mono)',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Bell size={12} color="var(--color-text-muted)" />
          <span style={{ color: 'var(--color-text-muted)' }}>Total :</span>
          <strong>{alertes.length}</strong>
        </span>
        <span style={{ color: 'var(--color-border)' }}>|</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-critique)', display: 'inline-block' }} />
          <span style={{ color: 'var(--color-text-muted)' }}>Actives :</span>
          <strong style={{ color: 'var(--color-critique)' }}>{countActive}</strong>
        </span>
        <span style={{ color: 'var(--color-border)' }}>|</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-faible)', display: 'inline-block' }} />
          <span style={{ color: 'var(--color-text-muted)' }}>Résolues :</span>
          <strong style={{ color: 'var(--color-faible)' }}>{countResolue}</strong>
        </span>
        {search && (
          <>
            <span style={{ color: 'var(--color-border)' }}>|</span>
            <span style={{ color: 'var(--color-text-muted)' }}>
              Résultats : <strong>{filtered.length}</strong>
            </span>
          </>
        )}
      </div>

      {/* Contenu */}
      {loading ? (
        <LoadingSpinner text="Chargement des alertes..." />
      ) : filtered.length === 0 ? (
        <div style={{
          padding:      '48px 24px',
          textAlign:    'center',
          background:   'var(--color-surface)',
          border:       '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          color:        'var(--color-text-muted)',
          fontFamily:   'var(--font-mono)',
          fontSize:     '0.85rem',
        }}>
          {search
            ? `Aucune alerte pour "${search}"`
            : '✓ Aucune alerte correspondante'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map(alerte => (
            <AlerteCard
              key={alerte.alerte_id}
              alerte={alerte}
              onResolve={onResolve}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertesList;