import { useEffect, useState } from 'react';
import { AlertTriangle, Droplets, Wifi, WifiOff, TrendingUp } from 'lucide-react';
import StatsCard    from '../components/dashboard/StatsCard';
import RiskMap      from '../components/dashboard/RiskMap';
import AlertsFeed   from '../components/dashboard/AlertsFeed';
import RiskChart    from '../components/dashboard/RiskChart';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getDashboardOverview, getDashboardStats, getDashboardTrend } from '../api/dashboard.api';
import { formatValue } from '../utils/formatters';

const DashboardPage = () => {
  const [overview,    setOverview]    = useState([]);
  const [stats,       setStats]       = useState(null);
  const [trend,       setTrend]       = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [ovRes, stRes] = await Promise.all([
          getDashboardOverview(),
          getDashboardStats(),
        ]);
        setOverview(ovRes.data);
        setStats(stRes.data);
        // Auto-select the highest risk zone for the chart
        if (ovRes.data.length > 0) {
          const top = ovRes.data[0];
          setSelectedZone(top);
          const tRes = await getDashboardTrend(top.zone_id);
          setTrend(tRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleZoneSelect = async (zone) => {
    setSelectedZone(zone);
    try {
      const res = await getDashboardTrend(zone.zone_id);
      setTrend(res.data);
    } catch (err) { console.error(err); }
  };

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;

  return (
    <div className="page-stack">

      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-subtitle">Real-time flood monitoring — Souss-Massa Region</div>
        </div>
      </div>

      {/* Stats row */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
          <StatsCard title="Zones monitored" value={stats.total_zones}    icon={Droplets}      color="var(--color-primary)" />
          <StatsCard title="Active alerts"   value={stats.active_alerts}  icon={AlertTriangle}  color="var(--color-critique)"
            subtitle={`${stats.flood_alerts ?? 0} flood alert${stats.flood_alerts !== 1 ? 's' : ''}`} />
          <StatsCard title="Critical zones"  value={stats.critical_zones} icon={TrendingUp}     color="var(--color-critique)"
            subtitle={`${stats.high_zones ?? 0} high risk`} />
          <StatsCard title="Active sensors"  value={stats.active_sensors} icon={Wifi}          color="var(--color-faible)"
            subtitle={`${stats.offline_sensors ?? 0} offline`} />
          <StatsCard title="Avg risk index"  value={formatValue(stats.avg_risk_index, '', 3)} icon={TrendingUp} color="var(--color-moyen)" />
        </div>
      )}

      {/* Map + Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px' }}>
        <div className="panel-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)' }}>
            <div className="section-title" style={{ marginBottom: 0 }}>
              <Droplets size={16} color="var(--color-primary)" />
              Interactive Risk Map
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
              Click a zone to view its risk trend
            </div>
          </div>
          <div onClick={e => {
            // Leaflet popup triggers — zone selection handled by RiskMap's onZoneClick prop
          }}>
            <RiskMap zones={overview} onZoneClick={handleZoneSelect} />
          </div>
        </div>

        <div className="panel-card">
          <div className="section-title">
            <AlertTriangle size={16} color="var(--color-critique)" />
            Active Alerts
          </div>
          <AlertsFeed />
        </div>
      </div>

      {/* Risk trend chart */}
      <div className="panel-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div className="section-title" style={{ marginBottom: 0 }}>
            <TrendingUp size={16} color="var(--color-primary)" />
            Risk Trend — {selectedZone?.zone_name ?? 'Select a zone'}
          </div>
          {selectedZone && (
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
              Last 30 days
            </div>
          )}
        </div>
        {trend?.data?.length > 0
          ? <RiskChart data={trend.data} />
          : <div className="empty-state">No risk data available for this zone yet.</div>
        }

        {/* Zone selector pills */}
        {overview.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
            {overview.map(z => (
              <button
                key={z.zone_id}
                onClick={() => handleZoneSelect(z)}
                className={`btn-filter ${selectedZone?.zone_id === z.zone_id ? 'active' : ''}`}
              >
                {z.zone_name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;