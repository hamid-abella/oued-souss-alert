// Import du service zone
const zoneService = require("../services/zone.service");


// récupérer toutes les zones
exports.getAllZones = async (req, res, next) => {
  try {

    // appel du service
    const zones = await zoneService.getAllZones();

    // réponse JSON
    res.json(zones);

  } catch (error) {

    // envoyer erreur au middleware
    next(error);

  }
};



// récupérer zone par id
exports.getZoneById = async (req, res, next) => {

  try {

    const id = req.params.id;

    const zone = await zoneService.getZoneById(id);

    res.json(zone);

  } catch (error) {

    next(error);

  }

};



// créer zone
exports.createZone = async (req, res, next) => {

  try {

    const data = req.body;

    const zone = await zoneService.createZone(data);

    res.status(201).json(zone);

  } catch (error) {

    next(error);

  }

};



// modifier zone
exports.updateZone = async (req, res, next) => {

  try {

    const id = req.params.id;

    const zone = await zoneService.updateZone(id, req.body);

    res.json(zone);

  } catch (error) {

    next(error);

  }

};



// supprimer zone
exports.deleteZone = async (req, res, next) => {

  try {

    const id = req.params.id;

    await zoneService.deleteZone(id);

    res.json({ message: "Zone supprimée" });

  } catch (error) {

    next(error);

  }

};