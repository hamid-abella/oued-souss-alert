// =============================================================
// Project: Oued-Souss Alert
// File: src/services/auth.service.js
// Description: Database access layer for users
// =============================================================

const pool = require('../config/db');

const getUserByEmail = async (email) => {
  const { rows } = await pool.query(
    'SELECT * FROM users WHERE email = $1 AND active = TRUE',
    [email]
  );
  return rows[0] || null;
};

const getUserById = async (userId) => {
  const { rows } = await pool.query(
    'SELECT user_id, name, email, role, active, created_at FROM users WHERE user_id = $1',
    [userId]
  );
  return rows[0] || null;
};

const getAllUsers = async () => {
  const { rows } = await pool.query(
    'SELECT user_id, name, email, role, active, created_at FROM users ORDER BY created_at DESC'
  );
  return rows;
};

const createUser = async (name, email, hashedPassword, role) => {
  const { rows } = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING user_id, name, email, role, created_at`,
    [name, email, hashedPassword, role]
  );
  return rows[0];
};

const deactivateUser = async (userId) => {
  const { rows } = await pool.query(
    `UPDATE users SET active = FALSE, updated_at = NOW()
     WHERE user_id = $1
     RETURNING user_id, name, active`,
    [userId]
  );
  return rows[0] || null;
};

const changePassword = async (userId, hashedPassword) => {
  const { rows } = await pool.query(
    `UPDATE users SET password = $1, updated_at = NOW()
     WHERE user_id = $2
     RETURNING user_id, name`,
    [hashedPassword, userId]
  );
  return rows[0] || null;
};

const changeRole = async (userId, role) => {
  const { rows } = await pool.query(
    `UPDATE users SET role = $1, updated_at = NOW()
     WHERE user_id = $2
     RETURNING user_id, name, role`,
    [role, userId]
  );
  return rows[0] || null;
};

module.exports = {
  getUserByEmail,
  getUserById,
  getAllUsers,
  createUser,
  deactivateUser,
  changePassword,
  changeRole
};