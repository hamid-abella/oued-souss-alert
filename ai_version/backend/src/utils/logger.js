// =============================================================
// Projet : Oued-Souss Alert
// Fichier : src/utils/logger.js
// Description : Logger Winston pour traçabilité complète
// Spec : Intégrité des logs (audit sécurité)
// =============================================================

const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()} : ${message}`;
    })
  ),
  transports: [
    // Logs dans la console
    new winston.transports.Console(),
    // Logs dans un fichier (pour audit sécurité)
    new winston.transports.File({ filename: 'logs/app.log' }),
    // Logs d'erreurs séparés
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' })
  ]
});

module.exports = logger;