const express        = require('express');
const helmet         = require('helmet');
const cors           = require('cors');
const { authenticateJWT } = require('./middleware/auth');
const errorHandler   = require('./middleware/errorHandler');
const logger         = require('./utils/logger');

const app = express();

// ---------------------------------------------------------------
// Security & parsing middleware
// ---------------------------------------------------------------
app.use(helmet());
app.use(cors({
  origin:      process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// ---------------------------------------------------------------
// Request logging
// ---------------------------------------------------------------
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// ---------------------------------------------------------------
// Public routes (no JWT required)
// ---------------------------------------------------------------
app.use('/api/auth', require('./routes/auth.routes'));

// ---------------------------------------------------------------
// Protected routes (JWT verified on every request)
// ---------------------------------------------------------------
app.use('/api', authenticateJWT);

app.use('/api/zones',        require('./routes/zones.routes'));
app.use('/api/sensors',      require('./routes/sensors.routes'));
app.use('/api/measurements', require('./routes/measurements.routes'));
app.use('/api/alerts',       require('./routes/alerts.routes'));
app.use('/api/risk',         require('./routes/risk-indices.routes'));
app.use('/api/dashboard',    require('./routes/dashboard.routes'));
app.use('/api/admin',        require('./routes/admin.routes'));

// ---------------------------------------------------------------
// 404 handler
// ---------------------------------------------------------------
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// ---------------------------------------------------------------
// Global error handler (must be last)
// ---------------------------------------------------------------
app.use(errorHandler);

module.exports = app;