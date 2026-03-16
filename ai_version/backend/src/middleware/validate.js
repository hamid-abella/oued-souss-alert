// =============================================================
// Projet : Oued-Souss Alert
// Fichier : src/middleware/validate.js
// Description : Middleware de validation des requêtes entrantes
// Spec : Protection anti-injection SQL via validation stricte
// =============================================================

const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = validate;