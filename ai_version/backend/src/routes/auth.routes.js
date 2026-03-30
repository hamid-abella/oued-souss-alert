const router            = require('express').Router();
const authCtrl          = require('../controllers/auth.controller');
const { authenticateJWT, authorizeRole } = require('../middleware/auth');
const { body }          = require('express-validator');
const validate          = require('../middleware/validate');

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  validate
];

const userValidation = [
  body('name').isString().trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['admin', 'operator', 'reader', 'security']),
  validate
];

// Public route
router.post('/login', loginValidation, authCtrl.login);

// Current authenticated user info (all roles)
router.get('/me',
  authenticateJWT,
  authCtrl.getMe
);

// Admin: user management
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

// Admin: change user role
router.patch('/users/:id/role',
  authenticateJWT,
  authorizeRole('users', 'update'),
  body('role').isIn(['admin', 'operator', 'reader', 'security']),
  validate,
  authCtrl.changeRole
);

module.exports = router;