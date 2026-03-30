require('dotenv').config();

module.exports = {
  DB_HOST:     process.env.DB_HOST     || 'localhost',
  DB_PORT:     process.env.DB_PORT     || 5432,
  DB_USER:     process.env.DB_USER     || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || 'postgres',
  DB_NAME:     process.env.DB_NAME     || 'oued_souss_alert',

  // In test env (Jest sets NODE_ENV=test), use a fixed secret for deterministic token signing.
  JWT_SECRET:  process.env.JWT_SECRET  || (process.env.NODE_ENV === 'test' ? 'test_secret' : 'secret'),

  PORT:        process.env.PORT        || 5000,
};