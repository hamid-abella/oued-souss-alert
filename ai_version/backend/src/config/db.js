// Import du package pg pour se connecter à PostgreSQL
const { Pool } = require("pg");

// Import des variables d'environnement
const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = require("./env");

// Création d'un pool de connexions
// Pool = gestion automatique des connexions à la base
const pool = new Pool({
  host: DB_HOST,        // adresse du serveur postgres
  port: DB_PORT,        // port postgres (5432 généralement)
  user: DB_USER,        // utilisateur de la base
  password: DB_PASSWORD,// mot de passe
  database: DB_NAME     // nom de la base
});

// Fonction pour exécuter une requête SQL
const query = (text, params) => {
  // text = requête SQL
  // params = paramètres sécurisés
  return pool.query(text, params);
};

// Export de la fonction query
module.exports = {
  query,
  pool
};