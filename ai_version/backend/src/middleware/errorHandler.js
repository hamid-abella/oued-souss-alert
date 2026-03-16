// =============================================================
// Projet : Oued-Souss Alert
// Fichier : src/middleware/errorHandler.js
// Description : Gestionnaire global des erreurs Express
// =============================================================

const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(`${err.message} | URL: ${req.url} | Méthode: ${req.method}`);

  // Erreur PostgreSQL : violation de contrainte
  if (err.code === '23503') {
    return res.status(400).json({ error: 'Référence invalide (clé étrangère).' });
  }

  // Erreur PostgreSQL : violation CHECK
  if (err.code === '23514') {
    return res.status(400).json({ error: 'Valeur hors limites autorisées.' });
  }

  // Erreur PostgreSQL : valeur unique déjà existante
  if (err.code === '23505') {
    return res.status(409).json({ error: 'Entrée déjà existante.' });
  }

  // AJOUT : Erreur de validation (sanitizeId, sanitizeNumeric)
  if (err.message?.includes('ID invalide') ||
      err.message?.includes('hors intervalle')) {
    return res.status(400).json({ error: err.message });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Erreur interne du serveur.'
  });
};

module.exports = errorHandler;