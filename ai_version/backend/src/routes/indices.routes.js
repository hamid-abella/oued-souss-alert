const router            = require('express').Router();
const indicesCtrl       = require('../controllers/indices.controller');
const { authorizeRole } = require('../middleware/auth');

// POST /api/indices/zone/:zoneId/calculate - Déclenche la procédure stockée
router.post('/zone/:zoneId/calculate', authorizeRole('indices', 'create'), indicesCtrl.calculate);
router.get('/zone/:zoneId',            authorizeRole('indices', 'read'),   indicesCtrl.getByZone);
router.get('/zone/:zoneId/trend',      authorizeRole('indices', 'read'),   indicesCtrl.getTrend);

module.exports = router;