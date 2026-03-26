// =============================================================
// Projet : Oued-Souss Alert
// Fichier : src/middleware/auth.js
// Description : Middleware d'authentification JWT + RBAC
// Spec : RBAC obligatoire + protection anti-injection SQL
// =============================================================

const jwt = require('jsonwebtoken');
const { PERMISSIONS } = require('../config/roles');
const { JWT_SECRET } = require('../config/env');

// ---------------------------------------------------------------
// Vérification du token JWT
// ---------------------------------------------------------------
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant ou invalide.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, role, nom }
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token expiré ou invalide.' });
  }
};

// ---------------------------------------------------------------
// Vérification des permissions RBAC
// Usage : authorizeRole('zones', 'create')
// ---------------------------------------------------------------
const authorizeRole = (resource, action) => {
  return (req, res, next) => {
    const role = req.user?.role;

    if (!role) {
      return res.status(403).json({ error: 'Rôle utilisateur non défini.' });
    }

    const allowed = PERMISSIONS[resource]?.[role]?.includes(action);

    if (!allowed) {
      return res.status(403).json({
        error: `Accès refusé. Rôle '${role}' non autorisé pour '${action}' sur '${resource}'.`
      });
    }

    next();
  };
};

module.exports = { authenticateJWT, authorizeRole };