const express = require("express");

const router = express.Router();

const dashboardController = require("../controllers/dashboard.controller");


/*
Statistiques globales
*/

router.get("/stats", dashboardController.getDashboardStats);


/*
Dernières alertes
*/

router.get("/alerts", dashboardController.getRecentAlerts);

module.exports = router;