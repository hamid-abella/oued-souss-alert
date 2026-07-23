import { useState }  from 'react';
import { Search, RefreshCw, Bell } from 'lucide-react';
import AlertCard     from './AlertCard';
import LoadingSpinner from '../common/LoadingSpinner';

const TYPE_FILTERS = [
  { value: 'ALL',            label: 'All'            },
  { value: 'FLOOD',          label: '🌊 Flood'       },
  { value: 'HEAVY_RAIN',     label: '🌧️ Heavy Rain' },
  { value: 'LEVEL_EXCEEDED', label: '⚠️ Level'       },
];

const AlertsList = ({ alerts = [], loading = false, onResolve, onRefresh }) => {
  const [search,     setSearch]     = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const filtered = alerts.filter(a => {
    const matchSearch = a.zone_name?.toLowerCase().includes(search.toLowerCase())
      || a.message?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'ALL' || a.alert_type === typeFilter;
    return matchSearch && matchType;
  });

  const countActive   = alerts.filter(a => a.status === 'ACTIVE').length;
  const countResolved = alerts.filter(a => a.status === 'RESOLVED').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-dim)', pointerEvents: 'none' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by zone or message..."
            style={{
              width: '100%', padding: '8px 12px 8px 34px',
              background: 'var(--color-surface)', border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)', color: 'var(--color-text)',
              fontSize: '0.8rem', fontFamily: 'var(--font-mono)', transition: 'var(--transition)',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
            onBlur={e  => e.target.style.borderColor = 'var(--color-border)'}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {TYPE_FILTERS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setTypeFilter(value)}
              style={{
                padding: '6px 12px',
                background: typeFilter === value ? 'var(--color-primary-dim)' : 'var(--color-surface)',
                border: `1px solid ${typeFilter === value ? 'var(--color-primary)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-md)',
                color: typeFilter === value ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontSize: '0.75rem', fontFamily: 'var(--font-mono)',
                cursor: 'pointer', transition: 'var(--transition)', whiteSpace: 'nowrap',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 14px', background: 'transparent',
              border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
              color: 'var(--color-text-muted)', fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)', cursor: 'pointer', transition: 'var(--transition)',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
          >
            <RefreshCw size={12} /> Refresh
          </button>
        )}
      </div>

      <div style={{
        display: 'flex', gap: '16px', padding: '12px 16px',
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Bell size={12} color="var(--color-text-muted)" />
          <span style={{ color: 'var(--color-text-muted)' }}>Total:</span>
          <strong>{alerts.length}</strong>
        </span>
        <span style={{ color: 'var(--color-border)' }}>|</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-critique)', display: 'inline-block' }} />
          <span style={{ color: 'var(--color-text-muted)' }}>Active:</span>
          <strong style={{ color: 'var(--color-critique)' }}>{countActive}</strong>
        </span>
        <span style={{ color: 'var(--color-border)' }}>|</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-faible)', display: 'inline-block' }} />
          <span style={{ color: 'var(--color-text-muted)' }}>Resolved:</span>
          <strong style={{ color: 'var(--color-faible)' }}>{countResolved}</strong>
        </span>
        {search && (
          <>
            <span style={{ color: 'var(--color-border)' }}>|</span>
            <span style={{ color: 'var(--color-text-muted)' }}>Results: <strong>{filtered.length}</strong></span>
          </>
        )}
      </div>

      {loading ? (
        <LoadingSpinner text="Loading alerts..." />
      ) : filtered.length === 0 ? (
        <div style={{
          padding: '48px 24px', textAlign: 'center',
          background: 'var(--color-surface)', border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)', color: 'var(--color-text-muted)',
          fontFamily: 'var(--font-mono)', fontSize: '0.85rem',
        }}>
          {search ? `No alerts matching "${search}"` : '✓ No alerts found'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map(alert => (
            <AlertCard key={alert.alert_id} alert={alert} onResolve={onResolve} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertsList;