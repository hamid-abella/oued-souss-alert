const router              = require('express').Router();
const measurementsCtrl    = require('../controllers/measurements.controller');
const { authorizeRole }   = require('../middleware/auth');
const { body }            = require('express-validator');
const validate            = require('../middleware/validate');

router.post('/water-level',
  authorizeRole('measurements', 'create'),
  body('sensor_id').isInt({ min: 1 }),
  body('water_level_m').isFloat({ min: 0, max: 20 }),
  validate,
  measurementsCtrl.insertWaterLevel
);

router.post('/rain',
  authorizeRole('measurements', 'create'),
  body('sensor_id').isInt({ min: 1 }),
  body('rain_mm').isFloat({ min: 0, max: 500 }),
  validate,
  measurementsCtrl.insertRain
);

router.get('/water-level/zone/:zoneId',
  authorizeRole('measurements', 'read'),
  measurementsCtrl.getWaterLevelByZone
);

router.get('/rain/zone/:zoneId',
  authorizeRole('measurements', 'read'),
  measurementsCtrl.getRainByZone
);

module.exports = router;