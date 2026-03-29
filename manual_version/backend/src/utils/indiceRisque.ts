import Mesure from "../models/Mesure.js";
import PluieHistorique from "../models/PluieHistorique.js";

interface IndiceResult {
  valeur: number;
  label: "normal" | "modéré" | "danger";
}

export const calculerIndiceRisque = async (): Promise<IndiceResult> => {
  // Average water level from last 10 measurements
  const mesures = await Mesure.find().sort({ dateMesure: -1 }).limit(10);
  const moyenneEau =
    mesures.length > 0
      ? mesures.reduce((sum, m) => sum + m.niveauEau, 0) / mesures.length
      : 0;

  // Average rainfall from last 10 rain records
  const pluies = await PluieHistorique.find().sort({ date: -1 }).limit(10);
  const moyennePluie =
    pluies.length > 0
      ? pluies.reduce((sum, p) => sum + p.quantiteMm, 0) / pluies.length
      : 0;

  const indice = moyenneEau + moyennePluie;

  let label: IndiceResult["label"];
  if (indice < 10) label = "normal";
  else if (indice < 16) label = "modéré";
  else label = "danger";

  return { valeur: Math.round(indice * 10) / 10, label };
};
