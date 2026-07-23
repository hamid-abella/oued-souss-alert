const sensorsService = require('../services/sensors.service');

// GET /api/sensors
const getAll = async (req, res, next) => {
  try {
    const sensors = await sensorsService.getAllSensors();
    res.json(sensors);
  } catch (err) {
    next(err);
  }
};

// GET /api/sensors/zone/:zoneId
const getByZone = async (req, res, next) => {
  try {
    const sensors = await sensorsService.getSensorsByZone(req.params.zoneId);
    res.json(sensors);
  } catch (err) {
    next(err);
  }
};

// GET /api/sensors/:id
const getById = async (req, res, next) => {
  try {
    const sensor = await sensorsService.getSensorById(req.params.id);

    if (!sensor)
      return res.status(404).json({ error: 'Sensor not found' });

    res.json(sensor);
  } catch (err) {
    next(err);
  }
};

// GET /api/sensors/:id/history
const getHistory = async (req, res, next) => {
  try {
    const history = await sensorsService.getSensorHistory(req.params.id);

    if (!history)
      return res.status(404).json({ error: 'Sensor not found' });

    res.json(history);
  } catch (err) {
    next(err);
  }
};

// POST /api/sensors
const create = async (req, res, next) => {
  try {
    const sensor = await sensorsService.createSensor(req.body);
    res.status(201).json(sensor);
  } catch (err) {
    if (err.code === '23503')
      return res.status(404).json({ error: 'Zone not found' });
    next(err);
  }
};

// PATCH /api/sensors/:id/status
const updateStatus = async (req, res, next) => {
  try {
    const sensor = await sensorsService.updateSensorStatus(req.params.id, req.body.status);

    if (!sensor)
      return res.status(404).json({ error: 'Sensor not found' });

    res.json(sensor);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getByZone, getById, getHistory, create, updateStatus };