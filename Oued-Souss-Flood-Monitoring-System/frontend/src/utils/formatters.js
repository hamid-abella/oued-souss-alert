import { format, formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';

// Dates
export const formatDate = (date) => {
  if (!date) return '—';
  try { return format(new Date(date), 'MMM dd yyyy HH:mm', { locale: enUS }); }
  catch { return '—'; }
};

export const formatDateShort = (date) => {
  if (!date) return '—';
  try { return format(new Date(date), 'MM/dd/yyyy', { locale: enUS }); }
  catch { return '—'; }
};

export const timeAgo = (date) => {
  if (!date) return '—';
  try { return formatDistanceToNow(new Date(date), { addSuffix: true, locale: enUS }); }
  catch { return '—'; }
};

// Risk levels — must match DB values: LOW / MEDIUM / HIGH / CRITICAL
export const riskColor = (level) => {
  const colors = {
    LOW:      'var(--color-faible)',
    MEDIUM:   'var(--color-moyen)',
    HIGH:     'var(--color-eleve)',
    CRITICAL: 'var(--color-critique)',
  };
  return colors[level] || 'var(--color-text-muted)';
};

export const riskIcon = (level) => {
  const icons = { LOW: '🟢', MEDIUM: '🟡', HIGH: '🟠', CRITICAL: '🔴' };
  return icons[level] || '⚪';
};

export const riskLabel = (level) => {
  const labels = { LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High', CRITICAL: 'Critical' };
  return labels[level] || 'Unknown';
};

// Numeric formatting
export const formatValue = (val, unit = '', decimals = 2) => {
  if (val == null || val === '' || isNaN(val)) return '—';
  return `${parseFloat(val).toFixed(decimals)}${unit ? ' ' + unit : ''}`;
};

export const formatPercent = (val) => {
  if (val == null || isNaN(val)) return '—';
  return `${(parseFloat(val) * 100).toFixed(1)}%`;
};

export const formatArea = (val) => {
  if (val == null || isNaN(val)) return '—';
  return `${parseFloat(val).toFixed(0)} ha`;
};

// Zone type — must match DB values: agricultural / urban / mixed
export const zoneTypeLabel = (type) => {
  const labels = { agricultural: 'Agricultural', urban: 'Urban', mixed: 'Mixed' };
  return labels[type] || type || '—';
};

// Alert type — must match DB values: FLOOD / HEAVY_RAIN / LEVEL_EXCEEDED
export const alertTypeLabel = (type) => {
  const labels = {
    FLOOD:          'Flood',
    HEAVY_RAIN:     'Heavy Rain',
    LEVEL_EXCEEDED: 'Level Exceeded',
  };
  return labels[type] || type || '—';
};

// Alert type border color for feed
export const alertTypeColor = (type) => {
  const colors = {
    FLOOD:          'var(--color-critique)',
    HEAVY_RAIN:     'var(--color-eleve)',
    LEVEL_EXCEEDED: 'var(--color-moyen)',
  };
  return colors[type] || 'var(--color-moyen)';
};

// Sensor status — must match DB values: active / maintenance / offline
export const sensorStatusLabel = (status) => {
  const labels = { active: 'Active', maintenance: 'Maintenance', offline: 'Offline' };
  return labels[status] || status || '—';
};

export const sensorStatusColor = (status) => {
  const colors = {
    active:      'var(--color-faible)',
    maintenance: 'var(--color-moyen)',
    offline:     'var(--color-critique)',
  };
  return colors[status] || 'var(--color-text-muted)';
};