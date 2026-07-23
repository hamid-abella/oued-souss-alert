// Entry point — kept separate from app.js so Jest can import
// app without binding to a port during tests.
require('dotenv').config();

const http   = require('http');
const app    = require('./app');
const logger = require('./utils/logger');
const { PORT } = require('./config/env');

const server = http.createServer(app);

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

// Graceful shutdown on SIGTERM (Docker / PM2)
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Closing server...');
  server.close(() => {
    logger.info('Server closed.');
    process.exit(0);
  });
});

module.exports = server;