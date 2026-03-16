const router            = require('express').Router();
const alertesCtrl       = require('../controllers/alertes.controller');
const { authorizeRole } = require('../middleware/auth');

// GET /api/alertes/actives - Alertes actives pour le dashboard
router.get('/actives',        authorizeRole('alertes', 'read'),   alertesCtrl.getActives);
router.get('/',               authorizeRole('alertes', 'read'),   alertesCtrl.getAll);
router.get('/zone/:zoneId',   authorizeRole('alertes', 'read'),   alertesCtrl.getByZone);
router.patch('/:id/resolve',  authorizeRole('alertes', 'update'), alertesCtrl.resolve);

module.exports = router;