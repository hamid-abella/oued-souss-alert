const AlertBadge = ({ count }) => {
  if (!count) return null;
  return (
    <span style={{
      position:       'absolute',
      top:            '-6px',
      right:          '-6px',
      minWidth:       '18px',
      height:         '18px',
      padding:        '0 4px',
      borderRadius:   '999px',
      background:     'var(--color-critique)',
      color:          '#fff',
      fontSize:       '0.65rem',
      fontFamily:     'var(--font-mono)',
      fontWeight:     700,
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      animation:      'blink 2s ease-in-out infinite',
    }}>
      {count > 99 ? '99+' : count}
    </span>
  );
};

export default AlertBadge;