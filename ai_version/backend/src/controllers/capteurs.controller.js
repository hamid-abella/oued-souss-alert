const capteursService = require('../services/capteurs.service');
const { sanitizeId }  = require('../utils/sanitize');

const getAll = async (req, res, next) => {
  try { res.json(await capteursService.getAllCapteurs()); }
  catch (err) { next(err); }
};

const getByZone = async (req, res, next) => {
  try {
    const zoneId = sanitizeId(req.params.zoneId);
    res.json(await capteursService.getCapteursByZone(zoneId));
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const id      = sanitizeId(req.params.id);
    const capteur = await capteursService.getCapteurById(id);
    if (!capteur) return res.status(404).json({ error: 'Capteur non trouvé.' });
    res.json(capteur);
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try { res.status(201).json(await capteursService.createCapteur(req.body)); }
  catch (err) { next(err); }
};

const updateStatut = async (req, res, next) => {
  try {
    const id      = sanitizeId(req.params.id);
    const capteur = await capteursService.updateStatutCapteur(id, req.body.statut);
    if (!capteur) return res.status(404).json({ error: 'Capteur non trouvé.' });
    res.json(capteur);
  } catch (err) { next(err); }
};

module.exports = { getAll, getByZone, getById, create, updateStatut };