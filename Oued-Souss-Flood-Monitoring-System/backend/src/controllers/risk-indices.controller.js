const riskIndicesService = require('../services/risk-indices.service');

// POST /api/risk/zone/:zoneId/calculate
const calculate = async (req, res, next) => {
  try {
    const result = await riskIndicesService.calculateRisk(parseInt(req.params.zoneId));

    if (!result)
      return res.status(404).json({ error: 'Zone not found' });

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

// GET /api/risk/zone/:zoneId
const getByZone = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 30, 200);
    const indices = await riskIndicesService.getByZone(req.params.zoneId, limit);
    res.json(indices);
  } catch (err) {
    next(err);
  }
};

// GET /api/risk/zone/:zoneId/trend
const getTrend = async (req, res, next) => {
  try {
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date)
      return res.status(400).json({ error: 'start_date and end_date are required' });

    const trend = await riskIndicesService.getTrend(req.params.zoneId, start_date, end_date);
    res.json(trend);
  } catch (err) {
    next(err);
  }
};

module.exports = { calculate, getByZone, getTrend };