const router            = require('express').Router();
const adminCtrl         = require('../controllers/admin.controller');
const { authorizeRole } = require('../middleware/auth');
const { body }          = require('express-validator');
const validate          = require('../middleware/validate');

// POST /api/admin/archive - Calls archive_old_measurements stored procedure
router.post('/archive',
  authorizeRole('admin', 'create'),
  body('cutoff_date').isISO8601().toDate(),
  validate,
  adminCtrl.archiveMeasurements
);

module.exports = router;