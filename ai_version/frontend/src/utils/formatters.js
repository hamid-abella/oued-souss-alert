// =============================================================
// Projet : Oued-Souss Alert
// Fichier : src/utils/formatters.js
// Description : Utilitaires de formatage des données
//               Utilisé dans tous les composants et pages
// =============================================================

import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

// -------------------------------------------------------------
// Dates
// -------------------------------------------------------------

// Formatage date complète lisible
// Ex: "16 mars 2026 14:30"
export const formatDate = (date) => {
  if (!date) return '—';
  try {
    return format(new Date(date), 'dd MMM yyyy HH:mm', { locale: fr });
  } catch {
    return '—';
  }
};

// Formatage date courte
// Ex: "16/03/2026"
export const formatDateShort = (date) => {
  if (!date) return '—';
  try {
    return format(new Date(date), 'dd/MM/yyyy', { locale: fr });
  } catch {
    return '—';
  }
};

// Temps relatif
// Ex: "il y a 3 minutes"
export const timeAgo = (date) => {
  if (!date) return '—';
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
  } catch {
    return '—';
  }
};

// -------------------------------------------------------------
// Niveaux de risque
// -------------------------------------------------------------

// Couleur CSS selon le niveau de risque
export const riskColor = (niveau) => {
  const colors = {
    FAIBLE:   'var(--color-faible)',
    MOYEN:    'var(--color-moyen)',
    ELEVE:    'var(--color-eleve)',
    CRITIQUE: 'var(--color-critique)',
  };
  return colors[niveau] || 'var(--color-text-muted)';
};

// Icône emoji selon le niveau de risque
export const riskIcon = (niveau) => {
  const icons = {
    FAIBLE:   '🟢',
    MOYEN:    '🟡',
    ELEVE:    '🟠',
    CRITIQUE: '🔴',
  };
  return icons[niveau] || '⚪';
};

// Label français du niveau de risque
export const riskLabel = (niveau) => {
  const labels = {
    FAIBLE:   'Faible',
    MOYEN:    'Modéré',
    ELEVE:    'Élevé',
    CRITIQUE: 'Critique',
  };
  return labels[niveau] || 'Inconnu';
};

// -------------------------------------------------------------
// Valeurs numériques
// -------------------------------------------------------------

// Formatage valeur avec unité
// Ex: formatValue(3.567, 'm') => "3.57 m"
export const formatValue = (val, unit = '', decimals = 2) => {
  if (val == null || val === '' || isNaN(val)) return '—';
  return `${parseFloat(val).toFixed(decimals)}${unit ? ' ' + unit : ''}`;
};

// Formatage pourcentage
// Ex: formatPercent(0.75) => "75%"
export const formatPercent = (val) => {
  if (val == null || isNaN(val)) return '—';
  return `${(parseFloat(val) * 100).toFixed(1)}%`;
};

// Formatage superficie
// Ex: formatSuperficie(450) => "450 ha"
export const formatSuperficie = (val) => {
  if (val == null || isNaN(val)) return '—';
  return `${parseFloat(val).toFixed(0)} ha`;
};

// -------------------------------------------------------------
// Types
// -------------------------------------------------------------

// Label français du type de zone
export const zoneTypeLabel = (type) => {
  const labels = {
    agricole: 'Agricole',
    urbaine:  'Urbaine',
    mixte:    'Mixte',
  };
  return labels[type] || type || '—';
};

// Label français du type d'alerte
export const alerteTypeLabel = (type) => {
  const labels = {
    CRUE:                  'Crue',
    PRECIPITATION_INTENSE: 'Précipitation intense',
    DEPASSEMENT_SEUIL:     'Dépassement de seuil',
  };
  return labels[type] || type || '—';
};

// Label français du statut capteur
export const capteurStatutLabel = (statut) => {
  const labels = {
    actif:        'Actif',
    maintenance:  'En maintenance',
    hors_service: 'Hors service',
  };
  return labels[statut] || statut || '—';
};

// Couleur du statut capteur
export const capteurStatutColor = (statut) => {
  const colors = {
    actif:        'var(--color-faible)',
    maintenance:  'var(--color-moyen)',
    hors_service: 'var(--color-critique)',
  };
  return colors[statut] || 'var(--color-text-muted)';
};