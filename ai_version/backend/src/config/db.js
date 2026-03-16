// =============================================================
// Projet : Oued-Souss Alert
// Fichier : src/config/db.js
// Description : Pool de connexion PostgreSQL
// =============================================================

const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     process.env.DB_PORT     || 5432,
  database: process.env.DB_NAME     || 'oued_souss_alert',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || '',
  max:      20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test de connexion uniquement en dehors des tests
if (process.env.NODE_ENV !== 'test') {
  pool.connect((err, client, release) => {
    if (err) {
      console.error('Erreur connexion PostgreSQL:', err.message);
    } else {
      console.log('PostgreSQL connecté avec succès.');
      release();
    }
  });
}

module.exports = pool;