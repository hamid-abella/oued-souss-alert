const express = require("express");
const cors = require("cors");

const zonesRoutes = require("./routes/zones.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/zones", zonesRoutes);

module.exports = app;