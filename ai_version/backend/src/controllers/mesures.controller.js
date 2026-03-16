// =============================================================
// Projet : Oued-Souss Alert
// Fichier : src/controllers/mesures.controller.js
// =============================================================

const mesuresService = require('../services/mesures.service');
const { sanitizeId } = require('../utils/sanitize');

const insertNiveauEau = async (req, res, next) => {
  try {
    const { capteur_id, niveau_eau } = req.body;
    // Les triggers PostgreSQL valident automatiquement les valeurs aberrantes
    const mesure = await mesuresService.insertMesureNiveauEau(capteur_id, niveau_eau);
    res.status(201).json(mesure);
  } catch (err) { next(err); }
};

const insertPluie = async (req, res, next) => {
  try {
    const { capteur_id, pluie_mm } = req.body;
    const mesure = await mesuresService.insertMesurePluie(capteur_id, pluie_mm);
    res.status(201).json(mesure);
  } catch (err) { next(err); }
};

const getNiveauByZone = async (req, res, next) => {
  try {
    const zoneId  = sanitizeId(req.params.zoneId);
    const limit   = parseInt(req.query.limit) || 50;
    const mesures = await mesuresService.getMesuresNiveauByZone(zoneId, limit);
    res.json(mesures);
  } catch (err) { next(err); }
};

const getPluieByZone = async (req, res, next) => {
  try {
    const zoneId  = sanitizeId(req.params.zoneId);
    const limit   = parseInt(req.query.limit) || 50;
    const mesures = await mesuresService.getMesuresPluieByZone(zoneId, limit);
    res.json(mesures);
  } catch (err) { next(err); }
};

module.exports = { insertNiveauEau, insertPluie, getNiveauByZone, getPluieByZone };