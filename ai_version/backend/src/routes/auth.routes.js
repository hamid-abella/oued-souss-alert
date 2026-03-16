const router     = require('express').Router();
const authCtrl   = require('../controllers/auth.controller');
const { body }   = require('express-validator');
const validate   = require('../middleware/validate');

router.post('/login',
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  validate,
  authCtrl.login
);

module.exports = router;