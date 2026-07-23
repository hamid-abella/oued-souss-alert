const router            = require('express').Router();
const riskCtrl          = require('../controllers/risk-indices.controller');
const { authorizeRole } = require('../middleware/auth');

router.post('/zone/:zoneId/calculate',
  authorizeRole('risk', 'create'),
  riskCtrl.calculate
);

router.get('/zone/:zoneId',
  authorizeRole('risk', 'read'),
  riskCtrl.getByZone
);

router.get('/zone/:zoneId/trend',
  authorizeRole('risk', 'read'),
  riskCtrl.getTrend
);

module.exports = router;