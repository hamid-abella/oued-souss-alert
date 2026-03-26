// =============================================================
// Projet : Oued-Souss Alert
// Fichier : src/controllers/auth.controller.js
// =============================================================

const authService    = require('../services/auth.service');
const { sanitizeId } = require('../utils/sanitize');

// Connexion
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

// Liste des utilisateurs (admin)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await authService.getAllUsers();
    res.json(users);
  } catch (err) { next(err); }
};

// Créer un utilisateur (admin)
const createUser = async (req, res, next) => {
  try {
    const user = await authService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) { next(err); }
};

// Désactiver un utilisateur (admin)
const deactivateUser = async (req, res, next) => {
  try {
    const id   = sanitizeId(req.params.id);
    const user = await authService.deactivateUser(id);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    res.json({ message: 'Utilisateur désactivé.', user });
  } catch (err) { next(err); }
};

// Changer mot de passe
const changePassword = async (req, res, next) => {
  try {
    const id   = sanitizeId(req.params.id);
    const user = await authService.changePassword(id, req.body.password);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    res.json({ message: 'Mot de passe modifié.', user });
  } catch (err) { next(err); }
};

module.exports = { login, getAllUsers, createUser, deactivateUser, changePassword };