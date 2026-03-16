// Import des modules nécessaires
const express = require("express");
const cors = require("cors");

// Import des routes
const zoneRoutes = require("./routes/zone.routes");
const sensorRoutes = require("./routes/sensor.routes");
const alertRoutes = require("./routes/alert.routes");
const authRoutes = require("./routes/auth.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

// Import du middleware de gestion d'erreur
const errorMiddleware = require("./middleware/error.middleware");

// Création de l'application Express
const app = express();

// Autoriser les requêtes cross-origin (frontend React par exemple)
app.use(cors());

// Permet de lire JSON dans les requêtes
app.use(express.json());

// Définition des routes API
app.use("/api/zones", zoneRoutes);
app.use("/api/sensors", sensorRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Middleware global de gestion des erreurs
app.use(errorMiddleware);

// Export de l'application
module.exports = app;