import { useState } from 'react';
import { Bell, RefreshCw } from 'lucide-react';
import AlertsList     from '../components/alerts/AlertsList';
import { useAlerts }  from '../hooks/useAlerts';

const AlertsPage = () => {
  const { alerts, total, loading, error, refetch, resolveAlert } = useAlerts();
  const [page, setPage] = useState(1);
  const LIMIT = 20;

  const handleResolve = async (id) => {
    await resolveAlert(id);
  };

  return (
    <div className="page-stack">

      <div className="page-header">
        <div>
          <div className="page-title">Alerts</div>
          <div className="page-subtitle">
            {total > 0 ? `${total} alert${total !== 1 ? 's' : ''} total` : 'No alerts recorded'}
          </div>
        </div>
        <button onClick={() => refetch(page)} className="btn-ghost">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {error && (
        <div style={{ padding: '12px 16px', background: 'rgba(232,48,58,0.1)', border: '1px solid var(--color-danger)', borderRadius: 'var(--radius-md)', color: 'var(--color-danger)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
          {error}
        </div>
      )}

      <AlertsList
        alerts={alerts}
        loading={loading}
        onResolve={handleResolve}
        onRefresh={() => refetch(page)}
      />

      {/* Pagination */}
      {total > LIMIT && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', paddingTop: '8px' }}>
          <button
            onClick={() => { const p = Math.max(1, page - 1); setPage(p); refetch(p); }}
            disabled={page === 1}
            className="btn-ghost"
            style={{ opacity: page === 1 ? 0.4 : 1 }}
          >
            ← Previous
          </button>
          <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
            Page {page} of {Math.ceil(total / LIMIT)}
          </span>
          <button
            onClick={() => { const p = page + 1; setPage(p); refetch(p); }}
            disabled={page >= Math.ceil(total / LIMIT)}
            className="btn-ghost"
            style={{ opacity: page >= Math.ceil(total / LIMIT) ? 0.4 : 1 }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default AlertsPage;