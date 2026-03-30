import { AlertTriangle, CheckCircle } from 'lucide-react';
import { useAlerts }    from '../../context/AlertContext';
import { useAuth }      from '../../context/AuthContext';
import { resolveAlert } from '../../api/alerts.api';
import RiskIndicator    from '../common/RiskIndicator';
import { timeAgo, alertTypeColor, alertTypeLabel } from '../../utils/formatters';

const AlertsFeed = () => {
  const { alerts, refresh } = useAlerts();
  const { can }             = useAuth();

  const handleResolve = async (id) => {
    try { await resolveAlert(id); refresh(); }
    catch (err) { console.error(err); }
  };

  if (!alerts.length) return (
    <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-faible)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
      ✓ No active alerts
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '400px', overflowY: 'auto' }}>
      {alerts.map((alert) => (
        <div key={alert.alert_id} style={{
          display: 'flex', alignItems: 'flex-start', gap: '12px',
          padding: '12px 16px', background: 'var(--color-surface-2)',
          borderRadius: 'var(--radius-md)',
          borderLeft: `3px solid ${alertTypeColor(alert.alert_type)}`,
          animation: 'fadeInUp 0.3s ease both',
        }}>
          <AlertTriangle size={16} color="var(--color-critique)" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, fontFamily: 'var(--font-display)' }}>
                {alert.zone_name}
              </span>
              <RiskIndicator level={alert.last_risk_level} size="sm" showPulse />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
              {alertTypeLabel(alert.alert_type)} · {timeAgo(alert.alert_date)}
            </div>
            {alert.message && (
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {alert.message}
              </div>
            )}
          </div>
          {can('alerts', 'update') && (
            <button
              onClick={() => handleResolve(alert.alert_id)}
              title="Mark as resolved"
              style={{
                display: 'flex', alignItems: 'center', padding: '4px 10px',
                background: 'transparent', border: '1px solid var(--color-faible)',
                borderRadius: 'var(--radius-sm)', color: 'var(--color-faible)',
                fontSize: '0.7rem', fontFamily: 'var(--font-mono)',
                flexShrink: 0, transition: 'var(--transition)', cursor: 'pointer',
              }}
            >
              <CheckCircle size={12} style={{ marginRight: '4px' }} />
              Resolve
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default AlertsFeed;