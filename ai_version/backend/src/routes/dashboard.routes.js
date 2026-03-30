const router            = require('express').Router();
const dashboardCtrl     = require('../controllers/dashboard.controller');
const { authorizeRole } = require('../middleware/auth');

router.get('/overview',          authorizeRole('dashboard', 'read'), dashboardCtrl.getOverview);
router.get('/stats',             authorizeRole('dashboard', 'read'), dashboardCtrl.getStats);
router.get('/trend/:zoneId',     authorizeRole('dashboard', 'read'), dashboardCtrl.getTrend);

module.exports = router;