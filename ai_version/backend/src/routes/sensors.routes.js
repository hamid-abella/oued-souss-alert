const router            = require('express').Router();
const sensorsCtrl       = require('../controllers/sensors.controller');
const { authorizeRole } = require('../middleware/auth');
const { body }          = require('express-validator');
const validate          = require('../middleware/validate');

const sensorValidation = [
  body('zone_id').isInt({ min: 1 }),
  body('sensor_type').isIn(['water_level', 'rain']),
  body('status').optional().isIn(['active', 'maintenance', 'offline']),
  body('installation_date').optional().isDate(),
  validate
];

router.get('/',                authorizeRole('sensors', 'read'),   sensorsCtrl.getAll);
router.get('/zone/:zoneId',    authorizeRole('sensors', 'read'),   sensorsCtrl.getByZone);
router.get('/:id',             authorizeRole('sensors', 'read'),   sensorsCtrl.getById);

// Audit trail: measurements history per sensor (security role)
router.get('/:id/history',     authorizeRole('sensors', 'read'),   sensorsCtrl.getHistory);

router.post('/',
  authorizeRole('sensors', 'create'),
  sensorValidation,
  sensorsCtrl.create
);

router.patch('/:id/status',
  authorizeRole('sensors', 'update'),
  body('status').isIn(['active', 'maintenance', 'offline']),
  validate,
  sensorsCtrl.updateStatus
);

module.exports = router;