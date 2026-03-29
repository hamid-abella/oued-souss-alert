import Capteur from "../models/Capteur.js";

export const startWatchdog = (): void => {
  setInterval(async () => {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    await Capteur.updateMany(
      { derniereMesure: { $lt: tenMinutesAgo } },
      { statut: "offline" },
    );

    console.log(`[Watchdog] Checked sensors at ${new Date().toISOString()}`);
  }, 60 * 1000);
};
