import mongoose from "mongoose";
import dotenv from "dotenv";
import Zone from "./models/Zone.js";
import Capteur from "./models/Capteur.js";
import Mesure from "./models/Mesure.js";
import SeuilCritique from "./models/SeuilCritique.js";
import Alerte from "./models/Alerte.js";
import PluieHistorique from "./models/PluieHistorique.js";

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
  console.log("\n🌊 Connected to MongoDB — seeding Oued-Souss Alert...\n");

  // ─── Wipe everything ────────────────────────────────────────────────────────
  await Promise.all([
    Zone.deleteMany({}),
    Capteur.deleteMany({}),
    Mesure.deleteMany({}),
    SeuilCritique.deleteMany({}),
    Alerte.deleteMany({}),
    PluieHistorique.deleteMany({}),
  ]);
  console.log("✓ Collections cleared");

  // ─── Zones ──────────────────────────────────────────────────────────────────
  const [zone1, zone2, zone3, zone4, zone5] = await Promise.all([
    Zone.create({
      nom: "Zone Souss Aval",
      localisation: { lat: 30.4202, lng: -9.5981 },
      statut: "danger",
    }),
    Zone.create({
      nom: "Zone Souss Médian",
      localisation: { lat: 30.4788, lng: -9.532 },
      statut: "attention",
    }),
    Zone.create({
      nom: "Zone Souss Amont",
      localisation: { lat: 30.5341, lng: -9.467 },
      statut: "normal",
    }),
    Zone.create({
      nom: "Zone Massa Nord",
      localisation: { lat: 30.365, lng: -9.641 },
      statut: "normal",
    }),
    Zone.create({
      nom: "Zone Issen",
      localisation: { lat: 30.59, lng: -9.385 },
      statut: "attention",
    }),
  ]);
  console.log("✓ 5 zones created");

  // ─── Seuils critiques ───────────────────────────────────────────────────────
  await Promise.all([
    SeuilCritique.create({ niveauMax: 8, zoneId: zone1._id }),
    SeuilCritique.create({ niveauMax: 10, zoneId: zone2._id }),
    SeuilCritique.create({ niveauMax: 12, zoneId: zone3._id }),
    SeuilCritique.create({ niveauMax: 9, zoneId: zone4._id }),
    SeuilCritique.create({ niveauMax: 11, zoneId: zone5._id }),
  ]);
  console.log("✓ 5 seuils critiques created");

  // ─── Capteurs ───────────────────────────────────────────────────────────────
  const now = new Date();
  const recent = (minsAgo: number) =>
    new Date(now.getTime() - minsAgo * 60 * 1000);

  const [c1, c2, c3, c4, c5, c6, c7] = await Promise.all([
    // Zone 1 — 2 capteurs, one offline
    Capteur.create({
      nom: "Capteur Aval-A",
      type: "niveau_eau",
      zoneId: zone1._id,
      statut: "online",
      derniereMesure: recent(2),
    }),
    Capteur.create({
      nom: "Capteur Aval-B",
      type: "debit",
      zoneId: zone1._id,
      statut: "offline",
      derniereMesure: recent(45),
    }),
    // Zone 2 — 2 capteurs
    Capteur.create({
      nom: "Capteur Médian-A",
      type: "niveau_eau",
      zoneId: zone2._id,
      statut: "online",
      derniereMesure: recent(1),
    }),
    Capteur.create({
      nom: "Capteur Médian-B",
      type: "debit",
      zoneId: zone2._id,
      statut: "online",
      derniereMesure: recent(3),
    }),
    // Zone 3 — 1 capteur
    Capteur.create({
      nom: "Capteur Amont-A",
      type: "niveau_eau",
      zoneId: zone3._id,
      statut: "online",
      derniereMesure: recent(5),
    }),
    // Zone 4 — 1 capteur
    Capteur.create({
      nom: "Capteur Massa-A",
      type: "niveau_eau",
      zoneId: zone4._id,
      statut: "online",
      derniereMesure: recent(8),
    }),
    // Zone 5 — 1 capteur
    Capteur.create({
      nom: "Capteur Issen-A",
      type: "niveau_eau",
      zoneId: zone5._id,
      statut: "online",
      derniereMesure: recent(6),
    }),
  ]);
  console.log("✓ 7 capteurs created (1 offline for QA demo)");

  // ─── Historique pluies — 30 jours ───────────────────────────────────────────
  const rainData = [
    // Calm period
    { daysAgo: 30, mm: 1.2 },
    { daysAgo: 29, mm: 0.0 },
    { daysAgo: 28, mm: 2.4 },
    { daysAgo: 27, mm: 0.0 },
    { daysAgo: 26, mm: 0.8 },
    { daysAgo: 25, mm: 3.1 },
    { daysAgo: 24, mm: 0.0 },
    { daysAgo: 23, mm: 1.5 },
    { daysAgo: 22, mm: 0.0 },
    { daysAgo: 21, mm: 0.6 },
    { daysAgo: 20, mm: 0.0 },
    { daysAgo: 19, mm: 2.2 },
    // Rising — first episode
    { daysAgo: 18, mm: 4.8 },
    { daysAgo: 17, mm: 7.3 },
    { daysAgo: 16, mm: 11.2 },
    { daysAgo: 15, mm: 6.5 },
    { daysAgo: 14, mm: 3.1 },
    { daysAgo: 13, mm: 1.8 },
    // Calm again
    { daysAgo: 12, mm: 0.0 },
    { daysAgo: 11, mm: 0.4 },
    { daysAgo: 10, mm: 0.0 },
    { daysAgo: 9, mm: 1.1 },
    { daysAgo: 8, mm: 0.0 },
    { daysAgo: 7, mm: 0.3 },
    // Heavy episode — triggers the current crisis
    { daysAgo: 6, mm: 9.4 },
    { daysAgo: 5, mm: 18.7 },
    { daysAgo: 4, mm: 22.3 },
    { daysAgo: 3, mm: 15.1 },
    { daysAgo: 2, mm: 8.6 },
    { daysAgo: 1, mm: 4.2 },
  ];

  const dayMs = 24 * 60 * 60 * 1000;
  await Promise.all(
    rainData.map(({ daysAgo, mm }) =>
      PluieHistorique.create({
        date: new Date(now.getTime() - daysAgo * dayMs),
        quantiteMm: mm,
      }),
    ),
  );
  console.log("✓ 30 days of rainfall history created");

  // ─── Mesures — historical readings per capteur ───────────────────────────────
  // Helper: generate a series of readings going back N hours, with a trend
  const makeMesures = async (
    capteurId: mongoose.Types.ObjectId,
    count: number,
    startHoursAgo: number,
    startLevel: number,
    endLevel: number,
    debitBase: number,
  ) => {
    const mesures = [];
    for (let i = 0; i < count; i++) {
      const progress = i / (count - 1);
      const hoursAgo = startHoursAgo * (1 - progress);
      const niveauEau = parseFloat(
        (
          startLevel +
          (endLevel - startLevel) * progress +
          (Math.random() - 0.5) * 0.4
        ).toFixed(2),
      );
      const debit = parseFloat(
        (debitBase + progress * 20 + (Math.random() - 0.5) * 5).toFixed(2),
      );
      mesures.push({
        niveauEau,
        debit,
        dateMesure: new Date(now.getTime() - hoursAgo * 60 * 60 * 1000),
        capteurId,
      });
    }
    return Mesure.insertMany(mesures);
  };

  // Zone 1 — Aval: level was rising, now above threshold (danger)
  const mesuresC1 = await makeMesures(c1._id, 48, 47, 4.2, 10.8, 35);
  // Zone 2 — Médian: rising but not yet at threshold (attention)
  const mesuresC3 = await makeMesures(c3._id, 48, 47, 3.1, 8.4, 28);
  // Zone 3 — Amont: stable and low (normal)
  const mesuresC5 = await makeMesures(c5._id, 48, 47, 2.0, 3.2, 15);
  // Zone 4 — Massa: stable (normal)
  const mesuresC6 = await makeMesures(c6._id, 48, 47, 1.8, 2.9, 12);
  // Zone 5 — Issen: slight rise (attention)
  const mesuresC7 = await makeMesures(c7._id, 48, 47, 3.5, 7.8, 22);

  console.log("✓ 48h of measurements created for 5 capteurs (rising trends)");

  // ─── Alertes — triggered from real mesures ──────────────────────────────────
  // Zone 1 triggered multiple alerts as level kept rising
  const dangerMesures1 = (mesuresC1 as any[])
    .filter((m: any) => m.niveauEau > 8)
    .slice(0, 6);

  await Promise.all(
    dangerMesures1.map((m: any, i: number) =>
      Alerte.create({
        dateAlerte: m.dateMesure,
        niveauRisque: m.niveauEau > 10 ? "danger" : "modéré",
        mesureId: m._id,
        zoneId: zone1._id,
      }),
    ),
  );

  // Zone 2 triggered a modéré alert recently
  const attentionMesures2 = (mesuresC3 as any[])
    .filter((m: any) => m.niveauEau > 7)
    .slice(0, 3);

  await Promise.all(
    attentionMesures2.map((m: any) =>
      Alerte.create({
        dateAlerte: m.dateMesure,
        niveauRisque: "modéré",
        mesureId: m._id,
        zoneId: zone2._id,
      }),
    ),
  );

  // Zone 5 triggered one alert
  const attentionMesures5 = (mesuresC7 as any[])
    .filter((m: any) => m.niveauEau > 7)
    .slice(0, 2);

  await Promise.all(
    attentionMesures5.map((m: any) =>
      Alerte.create({
        dateAlerte: m.dateMesure,
        niveauRisque: "modéré",
        mesureId: m._id,
        zoneId: zone5._id,
      }),
    ),
  );

  const totalAlertes = await Alerte.countDocuments();
  console.log(`✓ ${totalAlertes} alertes created across 3 zones`);

  // ─── Summary ────────────────────────────────────────────────────────────────
  console.log("\n─────────────────────────────────────────");
  console.log("  SEED COMPLETE — database state:");
  console.log("─────────────────────────────────────────");
  console.log("  Zones:");
  console.log(`    Zone Souss Aval    → 🔴 danger     (seuil: 8m)`);
  console.log(`    Zone Souss Médian  → 🟠 attention  (seuil: 10m)`);
  console.log(`    Zone Souss Amont   → 🟢 normal     (seuil: 12m)`);
  console.log(`    Zone Massa Nord    → 🟢 normal     (seuil: 9m)`);
  console.log(`    Zone Issen         → 🟠 attention  (seuil: 11m)`);
  console.log("\n  Capteurs:");
  console.log(`    Capteur Aval-A    → online  | ID: ${c1._id}`);
  console.log(`    Capteur Aval-B    → OFFLINE | ID: ${c2._id}  ← QA demo`);
  console.log(`    Capteur Médian-A  → online  | ID: ${c3._id}`);
  console.log(`    Capteur Médian-B  → online  | ID: ${c4._id}`);
  console.log(`    Capteur Amont-A   → online  | ID: ${c5._id}`);
  console.log(`    Capteur Massa-A   → online  | ID: ${c6._id}`);
  console.log(`    Capteur Issen-A   → online  | ID: ${c7._id}`);
  console.log("\n  Use these IDs in your curl test commands.");
  console.log("─────────────────────────────────────────\n");

  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
