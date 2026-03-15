const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

module.exports = app

const zoneRoutes = require("./routes/zone.routes")

app.use("/api/zones", zoneRoutes)