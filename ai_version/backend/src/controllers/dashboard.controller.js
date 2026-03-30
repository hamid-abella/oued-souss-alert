const dashboardService = require('../services/dashboard.service');

// GET /api/dashboard/overview
const getOverview = async (req, res, next) => {
  try {
    const overview = await dashboardService.getOverview();
    res.json(overview);
  } catch (err) {
    next(err);
  }
};

// GET /api/dashboard/stats
const getStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
};

// GET /api/dashboard/trend/:zoneId
const getTrend = async (req, res, next) => {
  try {
    const trend = await dashboardService.getTrend(req.params.zoneId);

    if (!trend)
      return res.status(404).json({ error: 'Zone not found' });

    res.json(trend);
  } catch (err) {
    next(err);
  }
};

module.exports = { getOverview, getStats, getTrend };