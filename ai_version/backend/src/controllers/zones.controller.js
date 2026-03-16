// =============================================================
// Projet : Oued-Souss Alert
// Fichier : src/controllers/zones.controller.js
// =============================================================

const zonesService   = require('../services/zones.service');
const { sanitizeId } = require('../utils/sanitize');

const getAll = async (req, res, next) => {
  try {
    const zones = await zonesService.getAllZones();
    res.json(zones);
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const id   = sanitizeId(req.params.id);
    const zone = await zonesService.getZoneById(id);
    if (!zone) return res.status(404).json({ error: 'Zone non trouvée.' });
    res.json(zone);
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const zone = await zonesService.createZone(req.body);
    res.status(201).json(zone);
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const id   = sanitizeId(req.params.id);
    const zone = await zonesService.updateZone(id, req.body);
    if (!zone) return res.status(404).json({ error: 'Zone non trouvée.' });
    res.json(zone);
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const id   = sanitizeId(req.params.id);
    const zone = await zonesService.deleteZone(id);
    if (!zone) return res.status(404).json({ error: 'Zone non trouvée.' });
    res.json({ message: 'Zone supprimée.', zone });
  } catch (err) { next(err); }
};

module.exports = { getAll, getById, create, update, remove };