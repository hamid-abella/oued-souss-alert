import { useState, useEffect }  from 'react';
import { BarChart2, Play, RefreshCw, Clock } from 'lucide-react';
import RiskChart      from '../components/dashboard/RiskChart';
import RiskIndicator  from '../components/common/RiskIndicator';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useRisk }    from '../hooks/useRisk';
import { useAuth }    from '../context/AuthContext';
import { getZones }   from '../api/zones.api';
import { formatDate, formatValue } from '../utils/formatters';

const RiskPage = () => {
  const { can } = useAuth();
  const { riskIndices, loading, fetchRisk, calculateRisk } = useRisk();
  const [zones,          setZones]          = useState([]);
  const [selectedZoneId, setSelectedZoneId] = useState('');
  const [calculating,    setCalculating]    = useState(false);
  const [calcResult,     setCalcResult]     = useState(null);

  useEffect(() => {
    getZones().then(res => {
      setZones(res.data);
      if (res.data.length > 0) {
        const id = res.data[0].zone_id;
        setSelectedZoneId(id);
        fetchRisk(id);
      }
    }).catch(console.error);
  }, []);

  const handleZoneChange = (id) => {
    setSelectedZoneId(id);
    setCalcResult(null);
    fetchRisk(id);
  };

  const handleCalculate = async () => {
    if (!selectedZoneId) return;
    try {
      setCalculating(true);
      setCalcResult(null);
      const result = await calculateRisk(selectedZoneId);
      setCalcResult(result);
      fetchRisk(selectedZoneId);
    } catch (err) {
      console.error(err);
    } finally {
      setCalculating(false);
    }
  };

  const selectedZone = zones.find(z => String(z.zone_id) === String(selectedZoneId));

  return (
    <div className="page-stack">

      <div className="page-header">
        <div>
          <div className="page-title">Risk Indices</div>
          <div className="page-subtitle">Flood risk calculation — weighted water level + 7-day rainfall</div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select
            value={selectedZoneId}
            onChange={e => handleZoneChange(e.target.value)}
            style={{ padding: '8px 12px', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', minWidth: '200px' }}
          >
            {zones.map(z => <option key={z.zone_id} value={z.zone_id}>{z.name}</option>)}
          </select>
          <button onClick={() => fetchRisk(selectedZoneId)} className="btn-ghost">
            <RefreshCw size={14} />
          </button>
          {can('risk', 'create') && (
            <button onClick={handleCalculate} disabled={calculating} className="btn-primary">
              <Play size={14} /> {calculating ? 'Calculating...' : 'Calculate Risk'}
            </button>
          )}
        </div>
      </div>

      {/* Calculation result banner */}
      {calcResult && (
        <div className="animate-in" style={{ padding: '14px 20px', background: 'rgba(26,127,232,0.1)', border: '1px solid var(--color-primary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <BarChart2 size={18} color="var(--color-primary)" />
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              Risk calculated for {selectedZone?.name}
            </div>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              Index: <strong>{parseFloat(calcResult.index_value).toFixed(3)}</strong> · Level: <strong>{calcResult.risk_level}</strong> · {formatDate(calcResult.calculation_date)}
            </div>
          </div>
          <RiskIndicator level={calcResult.risk_level} style={{ marginLeft: 'auto' }} />
        </div>
      )}

      {/* Chart */}
      <div className="panel-card">
        <div className="section-title">
          <BarChart2 size={16} color="var(--color-primary)" />
          30-day Risk Evolution — {selectedZone?.name ?? '...'}
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '16px' }}>
          Dashed lines: Critical (0.9) · High (0.7) · Medium (0.4)
        </div>
        {loading
          ? <LoadingSpinner size={24} text="Loading risk data..." />
          : riskIndices.length === 0
            ? <div className="empty-state">No risk data yet. Click "Calculate Risk" to generate the first index.</div>
            : <RiskChart data={[...riskIndices].reverse()} />
        }
      </div>

      {/* History table */}
      {riskIndices.length > 0 && (
        <div className="panel-card">
          <div className="section-title">
            <Clock size={16} color="var(--color-text-muted)" />
            Risk History
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  {['Date', 'Index', 'Risk Level', 'Water Level', ''].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--color-text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {riskIndices.slice(0, 20).map(r => (
                  <tr key={r.index_id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '10px 12px', color: 'var(--color-text-muted)' }}>{formatDate(r.calculation_date)}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>{parseFloat(r.index_value).toFixed(3)}</td>
                    <td style={{ padding: '10px 12px' }}><RiskIndicator level={r.risk_level} size="sm" /></td>
                    <td style={{ padding: '10px 12px', color: 'var(--color-text-muted)' }}>—</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--color-text-dim)' }}>#{r.index_id}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {riskIndices.length > 20 && (
              <div style={{ textAlign: 'center', padding: '12px', fontSize: '0.75rem', color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)' }}>
                Showing 20 of {riskIndices.length} records
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskPage;