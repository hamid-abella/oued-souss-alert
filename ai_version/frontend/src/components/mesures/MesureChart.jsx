import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const MesureChart = ({ data = [], dataKey, unit, color, title }) => {
  const chartData = [...data].reverse().map(d => ({
    date:  format(new Date(d.date_heure), 'dd/MM HH:mm', { locale: fr }),
    value: parseFloat(d[dataKey]),
  }));

  return (
    <div>
      <div style={{
        fontSize:   '0.7rem',
        fontFamily: 'var(--font-mono)',
        color:      'var(--color-text-muted)',
        textTransform:'uppercase',
        marginBottom:'12px',
      }}>
        {title}
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0}   />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="date" tick={{ fill: 'var(--color-text-muted)', fontSize: 9, fontFamily: 'var(--font-mono)' }} tickLine={false} />
          <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 9, fontFamily: 'var(--font-mono)' }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              background: 'var(--color-surface)',
              border:     '1px solid var(--color-border)',
              borderRadius:'var(--radius-md)',
              fontFamily: 'var(--font-mono)',
              fontSize:   '0.75rem',
            }}
            formatter={v => [`${v} ${unit}`, title]}
          />
          <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#grad-${dataKey})`} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MesureChart;