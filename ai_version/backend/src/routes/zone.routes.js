const express = require("express")
const router = express.Router()

const zoneController = require("../controllers/zone.controller")

router.get("/", zoneController.getZones)
router.post("/", zoneController.createZone)

module.exports = router