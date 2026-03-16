// =============================================================
// Projet : Oued-Souss Alert
// Fichier : src/components/dashboard/StatsCard.jsx
// Description : Carte statistique pour le dashboard
// =============================================================

const StatsCard = ({ title, value, unit, icon: Icon, color, subtitle }) => (
  <div style={{
    background:   'var(--color-surface)',
    border:       `1px solid var(--color-border)`,
    borderRadius: 'var(--radius-lg)',
    padding:      '20px 24px',
    display:      'flex',
    flexDirection:'column',
    gap:          '12px',
    position:     'relative',
    overflow:     'hidden',
    animation:    'fadeInUp 0.4s ease both',
    transition:   'var(--transition)',
  }}
  onMouseEnter={e => {
    e.currentTarget.style.borderColor = color || 'var(--color-primary)';
    e.currentTarget.style.boxShadow = `0 0 20px ${color || 'var(--color-primary-glow)'}30`;
  }}
  onMouseLeave={e => {
    e.currentTarget.style.borderColor = 'var(--color-border)';
    e.currentTarget.style.boxShadow = 'none';
  }}
  >
    {/* Fond décoratif */}
    <div style={{
      position:   'absolute',
      top:        '-20px',
      right:      '-20px',
      width:      '80px',
      height:     '80px',
      borderRadius:'50%',
      background: `${color || 'var(--color-primary)'}12`,
      pointerEvents:'none',
    }} />

    {/* En-tête */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <span style={{
        fontSize:   '0.75rem',
        color:      'var(--color-text-muted)',
        fontFamily: 'var(--font-mono)',
        textTransform:'uppercase',
        letterSpacing:'0.05em',
      }}>
        {title}
      </span>
      {Icon && (
        <Icon size={18} color={color || 'var(--color-primary)'} />
      )}
    </div>

    {/* Valeur */}
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
      <span style={{
        fontSize:   '2.2rem',
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        color:      color || 'var(--color-text)',
        lineHeight: 1,
      }}>
        {value ?? '—'}
      </span>
      {unit && (
        <span style={{
          fontSize:   '0.8rem',
          color:      'var(--color-text-muted)',
          fontFamily: 'var(--font-mono)',
        }}>
          {unit}
        </span>
      )}
    </div>

    {subtitle && (
      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
        {subtitle}
      </span>
    )}
  </div>
);

export default StatsCard;