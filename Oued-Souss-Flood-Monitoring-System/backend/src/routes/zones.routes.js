const router            = require('express').Router();
const zonesCtrl         = require('../controllers/zones.controller');
const { authorizeRole } = require('../middleware/auth');
const { body }          = require('express-validator');
const validate          = require('../middleware/validate');

const zoneValidation = [
  body('name').isString().trim().notEmpty(),
  body('zone_type').isIn(['agricultural', 'urban', 'mixed']),
  body('critical_level').isFloat({ min: 0.01 }),
  body('latitude').isFloat({ min: -90, max: 90 }),
  body('longitude').isFloat({ min: -180, max: 180 }),
  body('area_ha').optional().isFloat({ min: 0 }),
  validate
];

// Must be declared before /:id to avoid route conflict
router.get('/at-risk',  authorizeRole('zones', 'read'),   zonesCtrl.getAtRisk);

router.get('/',         authorizeRole('zones', 'read'),   zonesCtrl.getAll);
router.get('/:id',      authorizeRole('zones', 'read'),   zonesCtrl.getById);

router.post('/',
  authorizeRole('zones', 'create'),
  zoneValidation,
  zonesCtrl.create
);

router.put('/:id',
  authorizeRole('zones', 'update'),
  zoneValidation,
  zonesCtrl.update
);

router.delete('/:id',
  authorizeRole('zones', 'delete'),
  zonesCtrl.remove
);

module.exports = router;