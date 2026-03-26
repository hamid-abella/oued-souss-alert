// =============================================================
// Projet : Oued-Souss Alert
// Fichier : src/services/auth.service.js
// Description : Authentification depuis la base de données
//               Remplace la liste statique USERS
// =============================================================

const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const pool   = require('../config/db');
const { JWT_SECRET } = require('../config/env');

const login = async (email, password) => {

  // Étape 1 : Chercher l'utilisateur en base de données
  const result = await pool.query(
    `SELECT user_id, nom, email, password, role, actif
     FROM users
     WHERE email = $1`,
    [email]  // requête paramétrée → protégée contre injection SQL
  );

  const user = result.rows[0];

  // Étape 2 : Vérifier que l'utilisateur existe
  if (!user) {
    throw new Error('Email ou mot de passe incorrect.');
  }

  // Étape 3 : Vérifier que le compte est actif
  if (!user.actif) {
    throw new Error('Compte désactivé. Contactez l\'administrateur.');
  }

  // Étape 4 : Vérifier le mot de passe avec bcrypt
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new Error('Email ou mot de passe incorrect.');
  }

  // Étape 5 : Générer le token JWT
  const token = jwt.sign(
    {
      id:   user.user_id,
      nom:  user.nom,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  return {
    token,
    role: user.role,
    nom:  user.nom,
  };
};

// Récupérer tous les utilisateurs (admin seulement)
const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT user_id, nom, email, role, actif, created_at
     FROM users
     ORDER BY user_id`
  );
  return result.rows;
};

// Créer un utilisateur
const createUser = async (data) => {
  const { nom, email, password, role } = data;

  // Hasher le mot de passe avant stockage
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (nom, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING user_id, nom, email, role, actif, created_at`,
    [nom, email, hashedPassword, role]
  );
  return result.rows[0];
};

// Désactiver un utilisateur (ne pas supprimer)
const deactivateUser = async (userId) => {
  const result = await pool.query(
    `UPDATE users SET actif = FALSE, updated_at = NOW()
     WHERE user_id = $1
     RETURNING user_id, nom, email, role, actif`,
    [userId]
  );
  return result.rows[0] || null;
};

// Changer le mot de passe
const changePassword = async (userId, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const result = await pool.query(
    `UPDATE users
     SET password = $1, updated_at = NOW()
     WHERE user_id = $2
     RETURNING user_id, nom, email`,
    [hashedPassword, userId]
  );
  return result.rows[0] || null;
};

module.exports = { login, getAllUsers, createUser, deactivateUser, changePassword };