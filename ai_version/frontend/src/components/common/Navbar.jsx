import { Bell, LogOut, Droplets } from 'lucide-react';
import { useAuth }   from '../../context/AuthContext';
import { useAlerts } from '../../context/AlertContext';
import AlertBadge    from './AlertBadge';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { alerts }       = useAlerts();
  const criticalCount    = alerts.filter(a => a.alert_type === 'FLOOD' || a.status === 'ACTIVE').length;

  return (
    <nav style={{
      position:       'fixed',
      top:            0, left: 0, right: 0,
      height:         '60px',
      background:     'rgba(8, 14, 26, 0.92)',
      backdropFilter: 'blur(16px)',
      borderBottom:   '1px solid var(--color-border)',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'space-between',
      padding:        '0 24px',
      zIndex:         1000,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Droplets size={22} color="var(--color-primary)" />
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
          Oued<span style={{ color: 'var(--color-primary)' }}>-Souss</span>
        </span>
        <span style={{
          fontSize: '0.65rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)',
          marginLeft: '4px', padding: '2px 6px', border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-sm)',
        }}>
          ALERT v1.0
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <Bell size={20} color={criticalCount > 0 ? 'var(--color-critique)' : 'var(--color-text-muted)'} />
          <AlertBadge count={criticalCount} />
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '4px 12px', border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)', background: 'var(--color-surface)',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'var(--color-primary-dim)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)',
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, lineHeight: 1.2 }}>{user?.name}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
              {user?.role}
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 12px', background: 'transparent',
            border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
            color: 'var(--color-text-muted)', fontSize: '0.8rem', transition: 'var(--transition)', cursor: 'pointer',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-danger)'; e.currentTarget.style.color = 'var(--color-danger)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
        >
          <LogOut size={14} /> Sign out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;