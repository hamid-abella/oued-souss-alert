import { Router, type Request, type Response } from "express";
import Mesure from "../models/Mesure.js";
import Capteur from "../models/Capteur.js";
import { validateMesure } from "../middleware/validate.js";
import { runAlertEngine } from "../utils/alertEngine.js";

const router = Router();

router.post("/", validateMesure, async (req: Request, res: Response) => {
  try {
    const { niveauEau, debit, capteurId } = req.body;

    // Save the measurement
    const mesure = await Mesure.create({ niveauEau, debit, capteurId });

    // Mark sensor as online and update last seen
    await Capteur.findByIdAndUpdate(capteurId, {
      statut: "online",
      derniereMesure: new Date(),
    });

    // Run the alert engine (equivalent of the MySQL trigger)
    await runAlertEngine(mesure);

    res.status(201).json({ message: "Measurement saved", mesure });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/", async (req: Request, res: Response) => {
  const mesures = await Mesure.find().sort({ dateMesure: -1 }).limit(200);
  res.json(mesures);
});

export default router;
