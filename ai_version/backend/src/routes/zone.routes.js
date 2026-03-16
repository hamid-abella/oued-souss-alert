const express = require("express");

// Création du router
const router = express.Router();

// Import du controller
const zoneController = require("../controllers/zone.controller");

// Route : récupérer toutes les zones
router.get("/", zoneController.getAllZones);

// Route : récupérer une zone par id
router.get("/:id", zoneController.getZoneById);

// Route : créer une zone
router.post("/", zoneController.createZone);

// Route : modifier une zone
router.put("/:id", zoneController.updateZone);

// Route : supprimer une zone
router.delete("/:id", zoneController.deleteZone);

// Export
module.exports = router;