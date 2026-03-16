const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth.controller");


/*
Login utilisateur
*/

router.post("/login", authController.login);


/*
Créer compte
*/

router.post("/register", authController.register);

module.exports = router;