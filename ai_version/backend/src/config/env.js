/*
Chargement des variables d'environnement
Permet d'éviter d'écrire les informations sensibles dans le code
*/

require("dotenv").config();

module.exports = {

  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: process.env.DB_PORT || 5432,
  DB_USER: process.env.DB_USER || "postgres",
  DB_PASSWORD: process.env.DB_PASSWORD || "postgres",
  DB_NAME: process.env.DB_NAME || "oued_souss_alert",

  // Keep JWT secret consistent across app code and tests.
  // Jest typically sets NODE_ENV="test", while production/dev use "secret" by default.
  JWT_SECRET: process.env.JWT_SECRET || (process.env.NODE_ENV === 'test' ? 'test_secret' : 'secret'),

  PORT: process.env.PORT || 5000

};