const express = require("express");

const router = express.Router();

const alertController = require("../controllers/alert.controller");


/*
Toutes les alertes
*/

router.get("/", alertController.getAlerts);


/*
Alertes actives
*/

router.get("/active", alertController.getActiveAlerts);


/*
Fermer alerte
*/

router.put("/:id/close", alertController.closeAlert);


module.exports = router;