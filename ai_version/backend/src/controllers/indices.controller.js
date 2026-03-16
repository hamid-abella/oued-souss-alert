// =============================================================
// Projet : Oued-Souss Alert
// Fichier : src/controllers/indices.controller.js
// =============================================================

const indicesService = require('../services/indices.service');
const { sanitizeId } = require('../utils/sanitize');

const calculate = async (req, res, next) => {
  try {
    const zoneId = sanitizeId(req.params.zoneId);
    const indice = await indicesService.calculateFloodRisk(zoneId);
    res.status(201).json(indice);
  } catch (err) { next(err); }
};

const getByZone = async (req, res, next) => {
  try {
    const zoneId  = sanitizeId(req.params.zoneId);
    const limit   = parseInt(req.query.limit) || 30;
    const indices = await indicesService.getIndicesByZone(zoneId, limit);
    res.json(indices);
  } catch (err) { next(err); }
};

const getTrend = async (req, res, next) => {
  try {
    const zoneId = sanitizeId(req.params.zoneId);
    const { date_debut, date_fin } = req.query;
    const trend  = await indicesService.getRiskTrend(zoneId, date_debut, date_fin);
    res.json(trend);
  } catch (err) { next(err); }
};

module.exports = { calculate, getByZone, getTrend };