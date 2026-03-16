// =============================================================
// Projet : Oued-Souss Alert
// Fichier : src/controllers/alertes.controller.js
// =============================================================

const alertesService = require('../services/alertes.service');
const { sanitizeId } = require('../utils/sanitize');

const getActives = async (req, res, next) => {
  try {
    const alertes = await alertesService.getAlertesActives();
    res.json(alertes);
  } catch (err) { next(err); }
};

const getAll = async (req, res, next) => {
  try {
    const limit   = parseInt(req.query.limit) || 100;
    const alertes = await alertesService.getAllAlertes(limit);
    res.json(alertes);
  } catch (err) { next(err); }
};

const getByZone = async (req, res, next) => {
  try {
    const zoneId  = sanitizeId(req.params.zoneId);
    const alertes = await alertesService.getAlertesByZone(zoneId);
    res.json(alertes);
  } catch (err) { next(err); }
};

const resolve = async (req, res, next) => {
  try {
    const id     = sanitizeId(req.params.id);
    const alerte = await alertesService.resolveAlerte(id);
    if (!alerte) return res.status(404).json({ error: 'Alerte non trouvée.' });
    res.json({ message: 'Alerte résolue.', alerte });
  } catch (err) { next(err); }
};

module.exports = { getActives, getAll, getByZone, resolve };