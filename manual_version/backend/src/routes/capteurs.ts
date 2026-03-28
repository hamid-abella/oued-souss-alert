import { Router, type Request, type Response } from "express";
import Capteur from "../models/Capteur.js";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const capteurs = await Capteur.find().populate("zoneId", "nom");
    res.json(capteurs);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
