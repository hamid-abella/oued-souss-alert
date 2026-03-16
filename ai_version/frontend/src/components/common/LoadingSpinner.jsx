// =============================================================
// Projet : Oued-Souss Alert
// Fichier : src/components/common/LoadingSpinner.jsx
// =============================================================

const LoadingSpinner = ({ size = 32, text = 'Chargement...' }) => (
  <div style={{
    display:        'flex',
    flexDirection:  'column',
    alignItems:     'center',
    justifyContent: 'center',
    gap:            '12px',
    padding:        '40px',
    color:          'var(--color-text-muted)',
    fontFamily:     'var(--font-mono)',
    fontSize:       '0.8rem',
  }}>
    <div style={{
      width:        size,
      height:       size,
      border:       `2px solid var(--color-border)`,
      borderTop:    `2px solid var(--color-primary)`,
      borderRadius: '50%',
      animation:    'spin 0.8s linear infinite',
    }} />
    {text}
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export default LoadingSpinner;