// =============================================================
// Projet : Oued-Souss Alert
// Fichier : src/server.js
// Description : Point d'entrée du serveur Express
// =============================================================

const app = require('./app');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Serveur Oued-Souss Alert démarré sur le port ${PORT}`);
});