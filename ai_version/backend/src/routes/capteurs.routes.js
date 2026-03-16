const router            = require('express').Router();
const capteursCtrl      = require('../controllers/capteurs.controller');
const { authorizeRole } = require('../middleware/auth');
const { body }          = require('express-validator');
const validate          = require('../middleware/validate');

const capteurValidation = [
  body('zone_id').isInt({ min: 1 }),
  body('type_capteur').isIn(['niveau_eau', 'pluie']),
  body('statut').optional().isIn(['actif', 'maintenance', 'hors_service']),
  validate
];

router.get('/',      authorizeRole('capteurs', 'read'),   capteursCtrl.getAll);
router.get('/zone/:zoneId', authorizeRole('capteurs', 'read'), capteursCtrl.getByZone);
router.get('/:id',   authorizeRole('capteurs', 'read'),   capteursCtrl.getById);
router.post('/',     authorizeRole('capteurs', 'create'), capteurValidation, capteursCtrl.create);
router.patch('/:id/statut', authorizeRole('capteurs', 'update'),
  body('statut').isIn(['actif', 'maintenance', 'hors_service']),
  validate,
  capteursCtrl.updateStatut
);

module.exports = router;