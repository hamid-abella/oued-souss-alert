import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { format } from 'date-fns';
import { enUS }   from 'date-fns/locale';
import { riskColor } from '../../utils/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const riskLevel = payload[0]?.payload?.risk_level;
  return (
    <div style={{
      background: 'var(--color-surface)', border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-md)', padding: '10px 14px',
      fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
    }}>
      <div style={{ color: 'var(--color-text-muted)', marginBottom: '4px' }}>{label}</div>
      <div style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
        Index: {payload[0]?.value?.toFixed(3)}
      </div>
      <div style={{ color: riskColor(riskLevel), fontWeight: 600 }}>
        Level: {riskLevel}
      </div>
    </div>
  );
};

// Receives data from GET /api/dashboard/trend/:zoneId
// Shape: [{ index_id, calculation_date, index_value, risk_level }]
const RiskChart = ({ data = [] }) => {
  const chartData = [...data].reverse().map(d => ({
    ...d,
    date:  format(new Date(d.calculation_date), 'MM/dd HH:mm', { locale: enUS }),
    value: parseFloat(d.index_value),
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis
          dataKey="date"
          tick={{ fill: 'var(--color-text-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
          tickLine={false}
          axisLine={{ stroke: 'var(--color-border)' }}
        />
        <YAxis
          domain={[0, 1]}
          tick={{ fill: 'var(--color-text-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={0.9} stroke="var(--color-critique)" strokeDasharray="4 4" />
        <ReferenceLine y={0.7} stroke="var(--color-eleve)"    strokeDasharray="4 4" />
        <ReferenceLine y={0.4} stroke="var(--color-moyen)"    strokeDasharray="4 4" />
        <Line
          type="monotone"
          dataKey="value"
          stroke="var(--color-primary)"
          strokeWidth={2}
          dot={{ fill: 'var(--color-primary)', r: 3 }}
          activeDot={{ r: 5, fill: 'var(--color-primary)' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RiskChart;