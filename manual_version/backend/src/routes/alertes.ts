import { Router, type Request, type Response } from "express";
import Alerte from "../models/Alerte.js";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const alertes = await Alerte.find()
      .sort({ dateAlerte: -1 })
      .populate("zoneId", "nom statut")
      .populate("mesureId", "niveauEau debit dateMesure");

    res.json(alertes);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
