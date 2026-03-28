import { Router, type Request, type Response } from "express";
import Alerte from "../models/Alerte.js";
import Capteur from "../models/Capteur.js";
import Zone from "../models/Zone.js";
import { calculerIndiceRisque } from "../utils/indiceRisque.js";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const [totalAlertes, capteursOnline, zonesEnDanger, indice] =
      await Promise.all([
        Alerte.countDocuments(),
        Capteur.countDocuments({ statut: "online" }),
        Zone.countDocuments({ statut: "danger" }),
        calculerIndiceRisque(),
      ]);

    res.json({
      totalAlertes,
      capteursOnline,
      zonesEnDanger,
      indiceRisque: indice,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
