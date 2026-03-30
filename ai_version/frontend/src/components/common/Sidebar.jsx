import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MapPin, Bell, Activity, BarChart2, Shield } from 'lucide-react';
import { useAlerts } from '../../context/AlertContext';

const NAV_ITEMS = [
  { to: '/',             icon: LayoutDashboard, label: 'Dashboard'    },
  { to: '/zones',        icon: MapPin,          label: 'Zones'        },
  { to: '/alerts',       icon: Bell,            label: 'Alerts',  badge: true },
  { to: '/measurements', icon: Activity,        label: 'Measurements' },
  { to: '/risk',         icon: BarChart2,       label: 'Risk Indices' },
];

const Sidebar = () => {
  const { alerts }   = useAlerts();
  const activeCount  = alerts.filter(a => a.status === 'ACTIVE').length;

  return (
    <aside style={{
      position: 'fixed', top: '60px', left: 0,
      width: '220px', height: 'calc(100vh - 60px)',
      background: 'var(--color-surface)', borderRight: '1px solid var(--color-border)',
      padding: '24px 0', display: 'flex', flexDirection: 'column',
      gap: '4px', zIndex: 999, overflowY: 'auto',
    }}>
      <div style={{
        padding: '0 20px 12px', fontSize: '0.6rem', fontFamily: 'var(--font-mono)',
        color: 'var(--color-text-dim)', letterSpacing: '0.1em', textTransform: 'uppercase',
      }}>
        Navigation
      </div>

      {NAV_ITEMS.map(({ to, icon: Icon, label, badge }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 20px', margin: '0 8px',
            borderRadius: 'var(--radius-md)',
            color:      isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
            background: isActive ? 'var(--color-surface-2)' : 'transparent',
            borderLeft: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
            fontSize: '0.875rem', fontWeight: isActive ? 600 : 400,
            textDecoration: 'none', transition: 'var(--transition)', position: 'relative',
          })}
        >
          <Icon size={16} />
          {label}
          {badge && activeCount > 0 && (
            <span style={{
              marginLeft: 'auto', padding: '1px 6px', borderRadius: '999px',
              background: 'var(--color-critique)', color: '#fff',
              fontSize: '0.65rem', fontFamily: 'var(--font-mono)', fontWeight: 700,
            }}>
              {activeCount}
            </span>
          )}
        </NavLink>
      ))}

      <div style={{
        marginTop: 'auto', padding: '16px 20px',
        borderTop: '1px solid var(--color-border)',
        fontSize: '0.7rem', fontFamily: 'var(--font-mono)',
        color: 'var(--color-text-dim)', lineHeight: 1.6,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <Shield size={12} color="var(--color-faible)" />
          <span style={{ color: 'var(--color-faible)' }}>System active</span>
        </div>
        ENSIASD Taroudant<br />
        SIBD Project 2025-2026
      </div>
    </aside>
  );
};

export default Sidebar;