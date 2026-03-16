// =============================================================
// Projet : Oued-Souss Alert
// Fichier : src/app.js
// Description : Configuration Express, middlewares globaux, routes
// =============================================================

require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const rateLimit  = require('express-rate-limit');

const zonesRoutes        = require('./routes/zones.routes');
const capteursRoutes     = require('./routes/capteurs.routes');
const mesuresRoutes      = require('./routes/mesures.routes');
const alertesRoutes      = require('./routes/alertes.routes');
const indicesRoutes      = require('./routes/indices.routes');
const authRoutes         = require('./routes/auth.routes');
const dashboardRoutes    = require('./routes/dashboard.routes');

const errorHandler       = require('./middleware/errorHandler');
const { authenticateJWT } = require('./middleware/auth');
const logger             = require('./utils/logger');

const app = express();

// ---------------------------------------------------------------
// Sécurité : Helmet protège les headers HTTP
// Spec : protection anti-injection SQL + RBAC
// ---------------------------------------------------------------
app.use(helmet());

// ---------------------------------------------------------------
// CORS : autorise le frontend à accéder à l'API
// ---------------------------------------------------------------
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ---------------------------------------------------------------
// Rate Limiting : protection contre les attaques DoS
// Spec : le système doit rester accessible sous forte charge
// ---------------------------------------------------------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,                  // max 500 requêtes par IP par fenêtre
  message: { error: 'Trop de requêtes, veuillez réessayer plus tard.' }
});
app.use(limiter);

// Limiter plus strict pour les alertes critiques (priorité haute)
const alerteLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,  // 1 minute
  max: 1000,                 // 1000 requêtes/min pour les alertes
  message: { error: 'Limite atteinte sur les alertes.' }
});

// ---------------------------------------------------------------
// Parsing JSON
// ---------------------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------------------------------------------------------
// Logger des requêtes entrantes
// ---------------------------------------------------------------
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url} - IP: ${req.ip}`);
  next();
});

// ---------------------------------------------------------------
// Routes publiques (pas d'authentification requise)
// ---------------------------------------------------------------
app.use('/api/auth', authRoutes);

// ---------------------------------------------------------------
// Routes protégées (JWT requis)
// Spec : RBAC - Role Based Access Control
// ---------------------------------------------------------------
app.use('/api/zones',      authenticateJWT, zonesRoutes);
app.use('/api/capteurs',   authenticateJWT, capteursRoutes);
app.use('/api/mesures',    authenticateJWT, mesuresRoutes);
app.use('/api/alertes',    alerteLimiter, authenticateJWT, alertesRoutes);
app.use('/api/indices',    authenticateJWT, indicesRoutes);
app.use('/api/dashboard',  authenticateJWT, dashboardRoutes);

// ---------------------------------------------------------------
// Route de santé (health check)
// ---------------------------------------------------------------
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ---------------------------------------------------------------
// Gestion globale des erreurs
// ---------------------------------------------------------------
app.use(errorHandler);

module.exports = app;