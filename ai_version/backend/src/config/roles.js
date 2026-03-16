// =============================================================
// Projet : Oued-Souss Alert
// Fichier : src/config/roles.js
// Description : Définition du RBAC (Role Based Access Control)
// Spec : Implémentation du RBAC obligatoire
// =============================================================

const ROLES = {
  ADMIN:      'admin',       // accès total
  OPERATEUR:  'operateur',   // lecture + insertion mesures
  LECTEUR:    'lecteur',     // lecture seule (dashboard)
  SECURITE:   'securite',    // accès audit + logs
};

// Permissions par rôle et par ressource
const PERMISSIONS = {
  zones: {
    admin:      ['read', 'create', 'update', 'delete'],
    operateur:  ['read'],
    lecteur:    ['read'],
    securite:   ['read'],
  },
  capteurs: {
    admin:      ['read', 'create', 'update', 'delete'],
    operateur:  ['read', 'update'],
    lecteur:    ['read'],
    securite:   ['read'],
  },
  mesures: {
    admin:      ['read', 'create', 'delete'],
    operateur:  ['read', 'create'],  // peut insérer des mesures
    lecteur:    ['read'],
    securite:   ['read'],
  },
  alertes: {
    admin:      ['read', 'create', 'update', 'delete'],
    operateur:  ['read', 'update'],  // peut résoudre une alerte
    lecteur:    ['read'],
    securite:   ['read', 'update'],
  },
  indices: {
    admin:      ['read', 'create'],
    operateur:  ['read', 'create'],
    lecteur:    ['read'],
    securite:   ['read'],
  },
  dashboard: {
    admin:      ['read'],
    operateur:  ['read'],
    lecteur:    ['read'],
    securite:   ['read'],
  },
};

module.exports = { ROLES, PERMISSIONS };