import Capteur from "../models/Capteur.js";
import SeuilCritique from "../models/SeuilCritique.js";
import Alerte from "../models/Alerte.js";
import Zone from "../models/Zone.js";
import type { IMesure } from "../models/Mesure.js";

export const runAlertEngine = async (mesure: IMesure): Promise<void> => {
  // Step 1 — find which zone the sensor belongs to
  const capteur = await Capteur.findById(mesure.capteurId);
  if (!capteur) return;

  // Step 2 — get the critical threshold for that zone
  const seuil = await SeuilCritique.findOne({ zoneId: capteur.zoneId });
  if (!seuil) return;

  // Step 3 — compare and trigger alert if threshold exceeded
  if (mesure.niveauEau > seuil.niveauMax) {
    await Alerte.create({
      niveauRisque: "danger",
      mesureId: mesure._id,
      zoneId: capteur.zoneId,
    });

    await Zone.findByIdAndUpdate(capteur.zoneId, { statut: "danger" });
  }
};
