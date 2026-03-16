const dashboardService = require('../services/dashboard.service');

const getOverview = async (req, res, next) => {
  try {
    const data = await dashboardService.getDashboardOverview();
    res.json(data);
  } catch (err) { next(err); }
};

const getStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getDashboardStats();
    res.json(stats);
  } catch (err) { next(err); }
};

module.exports = { getOverview, getStats };