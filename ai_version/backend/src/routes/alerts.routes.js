const router            = require('express').Router();
const alertsCtrl        = require('../controllers/alerts.controller');
const { authorizeRole } = require('../middleware/auth');

// Must be declared before /:id to avoid route conflict
router.get('/active',         authorizeRole('alerts', 'read'),   alertsCtrl.getActive);

router.get('/',               authorizeRole('alerts', 'read'),   alertsCtrl.getAll);
router.get('/zone/:zoneId',   authorizeRole('alerts', 'read'),   alertsCtrl.getByZone);
router.get('/:id',            authorizeRole('alerts', 'read'),   alertsCtrl.getById);
router.patch('/:id/resolve',  authorizeRole('alerts', 'update'), alertsCtrl.resolve);

module.exports = router;