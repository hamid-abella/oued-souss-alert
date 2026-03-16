// =============================================================
// Projet : Oued-Souss Alert
// Fichier : src/components/dashboard/RiskChart.jsx
// Description : Graphique d'évolution des indices de risque
// =============================================================

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { format } from 'date-fns';
import { fr }     from 'date-fns/locale';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background:   'var(--color-surface)',
      border:       '1px solid var(--color-border)',
      borderRadius: 'var(--radius-md)',
      padding:      '10px 14px',
      fontFamily:   'var(--font-mono)',
      fontSize:     '0.75rem',
    }}>
      <div style={{ color: 'var(--color-text-muted)', marginBottom: '4px' }}>{label}</div>
      <div style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
        Indice : {payload[0]?.value?.toFixed(3)}
      </div>
      <div style={{ color: 'var(--color-text-muted)' }}>
        Niveau : {payload[0]?.payload?.niveau_risque}
      </div>
    </div>
  );
};

const RiskChart = ({ data = [] }) => {
  const chartData = data.map(d => ({
    ...d,
    date:  format(new Date(d.date_calcul), 'dd/MM HH:mm', { locale: fr }),
    value: parseFloat(d.valeur_indice),
  })).reverse();

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
        {/* Seuil critique */}
        <ReferenceLine y={0.9} stroke="var(--color-critique)" strokeDasharray="4 4" label="" />
        <ReferenceLine y={0.7} stroke="var(--color-eleve)"    strokeDasharray="4 4" />
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