const express = require("express");
const router = express.Router();
const { getZones } = require("../controllers/zones.controller");

router.get("/", getZones);

module.exports = router;