import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { formatDate, alertTypeLabel, alertTypeColor } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';

// Receives alert from backend alerts table joined with zones:
// { alert_id, zone_name, alert_type, message, status, alert_date, sensor_type }
const AlertCard = ({ alert, onResolve }) => {
  const { can }    = useAuth();
  const isActive   = alert.status === 'ACTIVE';

  return (
    <div style={{
      background:   'var(--color-surface)',
      border:       `1px solid ${isActive ? 'rgba(232,48,58,0.3)' : 'var(--color-border)'}`,
      borderRadius: 'var(--radius-lg)',
      padding:      '16px 20px',
      display:      'flex', alignItems: 'flex-start', gap: '14px',
      opacity:      isActive ? 1 : 0.6,
      animation:    'fadeInUp 0.3s ease both', transition: 'var(--transition)',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 'var(--radius-md)',
        background: isActive ? 'rgba(232,48,58,0.15)' : 'var(--color-surface-2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <AlertTriangle size={16} color={isActive ? 'var(--color-critique)' : 'var(--color-text-muted)'} />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem' }}>
            {alert.zone_name}
          </span>
          <span style={{
            padding: '1px 8px', borderRadius: '999px',
            background: `${alertTypeColor(alert.alert_type)}18`,
            border: `1px solid ${alertTypeColor(alert.alert_type)}`,
            fontSize: '0.65rem', fontFamily: 'var(--font-mono)',
            color: alertTypeColor(alert.alert_type), textTransform: 'uppercase',
          }}>
            {alertTypeLabel(alert.alert_type)}
          </span>
        </div>

        {alert.message && (
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '8px', lineHeight: 1.5 }}>
            {alert.message}
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)' }}>
            <Clock size={10} /> {formatDate(alert.alert_date)}
          </span>
          <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: isActive ? 'var(--color-critique)' : 'var(--color-faible)' }}>
            ● {alert.status}
          </span>
        </div>
      </div>

      {isActive && can('alerts', 'update') && (
        <button
          onClick={() => onResolve?.(alert.alert_id)}
          style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '6px 14px', background: 'transparent',
            border: '1px solid var(--color-faible)', borderRadius: 'var(--radius-md)',
            color: 'var(--color-faible)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)',
            cursor: 'pointer', flexShrink: 0, transition: 'var(--transition)',
          }}
        >
          <CheckCircle size={12} /> Resolve
        </button>
      )}
    </div>
  );
};

export default AlertCard;