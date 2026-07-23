import { Trash2, Activity, MapPin } from 'lucide-react';
import RiskIndicator from '../common/RiskIndicator';
import { formatValue, zoneTypeLabel } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';

// zone comes from risk_summary_view or zones table:
// { zone_id, name, zone_type, area_ha, critical_level,
//   last_water_level_m, last_risk_level, active_alert_id }
const ZoneCard = ({ zone, onDelete, onSelect, selected }) => {
  const { can } = useAuth();

  return (
    <div
      onClick={() => onSelect?.(zone)}
      style={{
        background:   'var(--color-surface)',
        border:       `1px solid ${selected ? 'var(--color-primary)' : 'var(--color-border)'}`,
        borderRadius: 'var(--radius-lg)',
        padding:      '20px',
        cursor:       'pointer',
        transition:   'var(--transition)',
        animation:    'fadeInUp 0.3s ease both',
        boxShadow:    selected ? 'var(--shadow-glow)' : 'none',
      }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.borderColor = 'var(--color-border-2)'; }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.borderColor = 'var(--color-border)'; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={14} color="var(--color-primary)" />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem' }}>
            {zone.name}
          </span>
        </div>
        {can('zones', 'delete') && (
          <button
            onClick={e => { e.stopPropagation(); onDelete?.(zone.zone_id); }}
            style={{ background: 'transparent', border: 'none', color: 'var(--color-text-dim)', padding: '2px', transition: 'var(--transition)', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-danger)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-dim)'}
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
        {[
          { label: 'Type',           value: zoneTypeLabel(zone.zone_type) },
          { label: 'Area',           value: formatValue(zone.area_ha, 'ha', 0) },
          { label: 'Critical level', value: formatValue(zone.critical_level, 'm') },
          { label: 'Current level',  value: formatValue(zone.last_water_level_m, 'm') },
        ].map(({ label, value }) => (
          <div key={label}>
            <div style={{ fontSize: '0.65rem', color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
              {label}
            </div>
            <div style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', fontWeight: 500, marginTop: '2px' }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <RiskIndicator level={zone.last_risk_level} size="sm" showPulse />
        {zone.active_alert_id && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--color-critique)' }}>
            <Activity size={12} /> Active alert
          </span>
        )}
      </div>
    </div>
  );
};

export default ZoneCard;