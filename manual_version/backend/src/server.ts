import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import mesuresRouter from "./routes/mesures.js";
import alertesRouter from "./routes/alertes.js";
import zonesRouter from "./routes/zones.js";
import capteursRouter from "./routes/capteurs.js";
import dashboardRouter from "./routes/dashboard.js";
import { startWatchdog } from "./utils/capteurWatchdog.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/mesures", mesuresRouter);
app.use("/api/alertes", alertesRouter);
app.use("/api/zones", zonesRouter);
app.use("/api/capteurs", capteursRouter);
app.use("/api/dashboard", dashboardRouter);

const PORT = process.env.PORT || 3001;

connectDB().then(() => {
  startWatchdog();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
