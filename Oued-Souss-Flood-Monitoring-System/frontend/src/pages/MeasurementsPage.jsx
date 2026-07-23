import { useState, useEffect }     from 'react';
import { Activity, RefreshCw }     from 'lucide-react';
import MeasurementForm   from '../components/measurements/MeasurementForm';
import MeasurementChart  from '../components/measurements/MeasurementChart';
import LoadingSpinner    from '../components/common/LoadingSpinner';
import { useMeasurements } from '../hooks/useMeasurements';
import { useAuth }         from '../context/AuthContext';
import { getZones }        from '../api/zones.api';
import { getSensors }      from '../api/sensors.api';

const MeasurementsPage = () => {
  const { can } = useAuth();
  const { waterLevels, rainMeasurements, loading, fetchWaterLevel, fetchRain, insertWaterLevel, insertRain } = useMeasurements();
  const [zones,          setZones]          = useState([]);
  const [sensors,        setSensors]        = useState([]);
  const [selectedZoneId, setSelectedZoneId] = useState('');

  useEffect(() => {
    const load = async () => {
      const [zRes, sRes] = await Promise.all([getZones(), getSensors()]);
      setZones(zRes.data);
      setSensors(sRes.data);
      if (zRes.data.length > 0) {
        const id = zRes.data[0].zone_id;
        setSelectedZoneId(id);
        fetchWaterLevel(id);
        fetchRain(id);
      }
    };
    load().catch(console.error);
  }, []);

  const handleZoneChange = (id) => {
    setSelectedZoneId(id);
    fetchWaterLevel(id);
    fetchRain(id);
  };

  const handleRefresh = () => {
    if (selectedZoneId) {
      fetchWaterLevel(selectedZoneId);
      fetchRain(selectedZoneId);
    }
  };

  const handleSubmit = async ({ type, sensor_id, water_level_m, rain_mm }) => {
    if (type === 'water_level') {
      await insertWaterLevel(sensor_id, water_level_m);
    } else {
      await insertRain(sensor_id, rain_mm);
    }
    handleRefresh();
  };

  const zoneSensors = sensors.filter(s => String(s.zone_id) === String(selectedZoneId));

  return (
    <div className="page-stack">

      <div className="page-header">
        <div>
          <div className="page-title">Measurements</div>
          <div className="page-subtitle">Last 48 hours — water level & rainfall</div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select
            value={selectedZoneId}
            onChange={e => handleZoneChange(e.target.value)}
            style={{ padding: '8px 12px', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', minWidth: '200px' }}
          >
            {zones.map(z => <option key={z.zone_id} value={z.zone_id}>{z.name}</option>)}
          </select>
          <button onClick={handleRefresh} className="btn-ghost"><RefreshCw size={14} /></button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: can('measurements', 'create') ? '1fr 320px' : '1fr', gap: '20px' }}>

        {/* Charts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="panel-card">
            <div className="section-title">
              <Activity size={16} color="var(--color-primary)" /> Water Level
            </div>
            {loading
              ? <LoadingSpinner size={24} text="Loading..." />
              : waterLevels.length === 0
                ? <div className="empty-state">No water level data for this zone in the last 48h.</div>
                : <MeasurementChart data={waterLevels} dataKey="water_level_m" unit="m"  color="var(--color-primary)" title="Water level (m)" />
            }
          </div>

          <div className="panel-card">
            <div className="section-title">
              <Activity size={16} color="var(--color-eleve)" /> Rainfall
            </div>
            {loading
              ? <LoadingSpinner size={24} text="Loading..." />
              : rainMeasurements.length === 0
                ? <div className="empty-state">No rainfall data for this zone in the last 48h.</div>
                : <MeasurementChart data={rainMeasurements} dataKey="rain_mm" unit="mm" color="var(--color-eleve)" title="Rainfall (mm)" />
            }
          </div>

          {/* Active sensors info */}
          {zoneSensors.length > 0 && (
            <div className="panel-card">
              <div className="section-title" style={{ marginBottom: '12px' }}>Zone Sensors</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {zoneSensors.map(s => (
                  <div key={s.sensor_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)' }}>
                    <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                      Sensor #{s.sensor_id} — {s.sensor_type === 'water_level' ? 'Water Level' : 'Rain'}
                    </span>
                    <span className={`badge ${s.status === 'active' ? 'badge-active' : s.status === 'maintenance' ? 'badge-maint' : 'badge-offline'}`}>
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Insert form */}
        {can('measurements', 'create') && (
          <div style={{ height: 'fit-content', position: 'sticky', top: '80px' }}>
            <MeasurementForm sensors={zoneSensors} onSubmit={handleSubmit} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MeasurementsPage;