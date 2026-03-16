const router            = require('express').Router();
const dashboardCtrl     = require('../controllers/dashboard.controller');
const { authorizeRole } = require('../middleware/auth');

router.get('/overview', authorizeRole('dashboard', 'read'), dashboardCtrl.getOverview);
router.get('/stats',    authorizeRole('dashboard', 'read'), dashboardCtrl.getStats);

module.exports = router;