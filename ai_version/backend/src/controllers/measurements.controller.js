const measurementsService = require('../services/measurements.service');

// POST /api/measurements/water-level
const insertWaterLevel = async (req, res, next) => {
  try {
    const { sensor_id, water_level_m } = req.body;
    const measurement = await measurementsService.insertWaterLevel(sensor_id, water_level_m);
    res.status(201).json(measurement);
  } catch (err) {
    if (err.code === 'P0001') return res.status(422).json({ error: err.message });
    next(err);
  }
};

// POST /api/measurements/rain
const insertRain = async (req, res, next) => {
  try {
    const { sensor_id, rain_mm } = req.body;
    const measurement = await measurementsService.insertRain(sensor_id, rain_mm);
    res.status(201).json(measurement);
  } catch (err) {
    if (err.code === 'P0001') return res.status(422).json({ error: err.message });
    next(err);
  }
};

// GET /api/measurements/water-level/zone/:zoneId
const getWaterLevelByZone = async (req, res, next) => {
  try {
    const measurements = await measurementsService.getWaterLevelByZone(req.params.zoneId);
    res.json(measurements);
  } catch (err) {
    next(err);
  }
};

// GET /api/measurements/rain/zone/:zoneId
const getRainByZone = async (req, res, next) => {
  try {
    const measurements = await measurementsService.getRainByZone(req.params.zoneId);
    res.json(measurements);
  } catch (err) {
    next(err);
  }
};

module.exports = { insertWaterLevel, insertRain, getWaterLevelByZone, getRainByZone };