// =============================================================
// Projet : Oued-Souss Alert
// Fichier : src/routes/auth.routes.js
// Description : Routes authentification + gestion utilisateurs
// =============================================================

const router            = require('express').Router();
const authCtrl          = require('../controllers/auth.controller');
const { authenticateJWT, authorizeRole } = require('../middleware/auth');
const { body }          = require('express-validator');
const validate          = require('../middleware/validate');

// Validation login
const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  validate
];

// Validation création utilisateur
const userValidation = [
  body('nom').isString().trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['admin', 'operateur', 'lecteur', 'securite']),
  validate
];

// Route publique
router.post('/login', loginValidation, authCtrl.login);

// Routes protégées (admin seulement)
router.get('/users',
  authenticateJWT,
  authorizeRole('users', 'read'),
  authCtrl.getAllUsers
);

router.post('/users',
  authenticateJWT,
  authorizeRole('users', 'create'),
  userValidation,
  authCtrl.createUser
);

router.patch('/users/:id/deactivate',
  authenticateJWT,
  authorizeRole('users', 'delete'),
  authCtrl.deactivateUser
);

router.patch('/users/:id/password',
  authenticateJWT,
  authorizeRole('users', 'update'),
  body('password').isLength({ min: 6 }),
  validate,
  authCtrl.changePassword
);

module.exports = router;