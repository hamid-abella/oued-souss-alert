// =============================================================
// Projet : Oued-Souss Alert
// Fichier : src/components/common/RiskIndicator.jsx
// Description : Badge visuel du niveau de risque
// =============================================================

import { riskColor, riskIcon } from '../../utils/formatters';

const RiskIndicator = ({ niveau, size = 'md', showPulse = false }) => {
  const sizes = { sm: '0.7rem', md: '0.8rem', lg: '1rem' };
  const color = riskColor(niveau);

  return (
    <span style={{
      display:        'inline-flex',
      alignItems:     'center',
      gap:            '6px',
      padding:        size === 'sm' ? '2px 8px' : '4px 12px',
      borderRadius:   '999px',
      border:         `1px solid ${color}`,
      background:     `${color}18`,
      color:          color,
      fontSize:       sizes[size],
      fontFamily:     'var(--font-mono)',
      fontWeight:     600,
      letterSpacing:  '0.05em',
      textTransform:  'uppercase',
      position:       'relative',
    }}>
      {/* Point pulsant pour les alertes critiques */}
      {showPulse && niveau === 'CRITIQUE' && (
        <span style={{
          width:        8,
          height:       8,
          borderRadius: '50%',
          background:   color,
          position:     'relative',
          display:      'inline-block',
        }}>
          <span style={{
            position:     'absolute',
            inset:        0,
            borderRadius: '50%',
            background:   color,
            animation:    'pulse-ring 1.5s ease-out infinite',
          }} />
        </span>
      )}
      {riskIcon(niveau)} {niveau || 'N/A'}
    </span>
  );
};

export default RiskIndicator;