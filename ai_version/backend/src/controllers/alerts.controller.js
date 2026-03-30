const alertsService = require('../services/alerts.service');

// GET /api/alerts/active
const getActive = async (req, res, next) => {
  try {
    const alerts = await alertsService.getActiveAlerts();
    res.json(alerts);
  } catch (err) {
    next(err);
  }
};

// GET /api/alerts
const getAll = async (req, res, next) => {
  try {
    const page  = Math.max(parseInt(req.query.page)  || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);

    const result = await alertsService.getAllAlerts(page, limit);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// GET /api/alerts/zone/:zoneId
const getByZone = async (req, res, next) => {
  try {
    const alerts = await alertsService.getAlertsByZone(req.params.zoneId);
    res.json(alerts);
  } catch (err) {
    next(err);
  }
};

// GET /api/alerts/:id
const getById = async (req, res, next) => {
  try {
    const alert = await alertsService.getAlertById(req.params.id);

    if (!alert)
      return res.status(404).json({ error: 'Alert not found' });

    res.json(alert);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/alerts/:id/resolve
const resolve = async (req, res, next) => {
  try {
    const alert = await alertsService.resolveAlert(
      req.params.id,
      req.user.user_id,
      req.body.comment
    );

    if (!alert)
      return res.status(404).json({ error: 'Active alert not found or already resolved' });

    res.json(alert);
  } catch (err) {
    next(err);
  }
};

module.exports = { getActive, getAll, getByZone, getById, resolve };