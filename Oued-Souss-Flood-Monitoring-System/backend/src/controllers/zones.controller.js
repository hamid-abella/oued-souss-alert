const zonesService = require('../services/zones.service');

// GET /api/zones
const getAll = async (req, res, next) => {
  try {
    const zones = await zonesService.getAllZones();
    res.json(zones);
  } catch (err) {
    next(err);
  }
};

// GET /api/zones/at-risk
const getAtRisk = async (req, res, next) => {
  try {
    const zones = await zonesService.getZonesAtRisk();
    res.json(zones);
  } catch (err) {
    next(err);
  }
};

// GET /api/zones/:id
const getById = async (req, res, next) => {
  try {
    const zone = await zonesService.getZoneById(req.params.id);

    if (!zone)
      return res.status(404).json({ error: 'Zone not found' });

    res.json(zone);
  } catch (err) {
    next(err);
  }
};

// POST /api/zones
const create = async (req, res, next) => {
  try {
    const zone = await zonesService.createZone(req.body);
    res.status(201).json(zone);
  } catch (err) {
    next(err);
  }
};

// PUT /api/zones/:id
const update = async (req, res, next) => {
  try {
    const zone = await zonesService.updateZone(req.params.id, req.body);

    if (!zone)
      return res.status(404).json({ error: 'Zone not found' });

    res.json(zone);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/zones/:id
const remove = async (req, res, next) => {
  try {
    const zone = await zonesService.deleteZone(req.params.id);

    if (!zone)
      return res.status(404).json({ error: 'Zone not found' });

    res.json({ message: 'Zone deleted', zone });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getAtRisk, getById, create, update, remove };