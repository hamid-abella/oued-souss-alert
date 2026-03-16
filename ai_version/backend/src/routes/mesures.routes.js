const router            = require('express').Router();
const mesuresCtrl       = require('../controllers/mesures.controller');
const { authorizeRole } = require('../middleware/auth');
const { body }          = require('express-validator');
const validate          = require('../middleware/validate');

router.post('/niveau',
  authorizeRole('mesures', 'create'),
  body('capteur_id').isInt({ min: 1 }),
  body('niveau_eau').isFloat({ min: 0, max: 20 }),
  validate,
  mesuresCtrl.insertNiveauEau
);

router.post('/pluie',
  authorizeRole('mesures', 'create'),
  body('capteur_id').isInt({ min: 1 }),
  body('pluie_mm').isFloat({ min: 0, max: 500 }),
  validate,
  mesuresCtrl.insertPluie
);

router.get('/niveau/zone/:zoneId', authorizeRole('mesures', 'read'), mesuresCtrl.getNiveauByZone);
router.get('/pluie/zone/:zoneId',  authorizeRole('mesures', 'read'), mesuresCtrl.getPluieByZone);

module.exports = router;