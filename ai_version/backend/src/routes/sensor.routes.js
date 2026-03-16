const express = require("express");
const router = express.Router();

const sensorController = require("../controllers/sensor.controller");

/*
Récupérer tous les capteurs
*/

router.get("/", sensorController.getAllSensors);

/*
Capteurs d'une zone
*/

router.get("/zone/:zoneId", sensorController.getSensorsByZone);

/*
Créer capteur
*/

router.post("/", sensorController.createSensor);

/*
Supprimer capteur
*/

router.delete("/:id", sensorController.deleteSensor);

module.exports = router;
