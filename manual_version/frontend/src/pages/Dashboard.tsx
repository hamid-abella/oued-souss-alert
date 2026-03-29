import { useState, useEffect } from "react";
import { getDashboard, getZones, getMesures } from "../services/api.js";
import type { DashboardData, Zone, Mesure } from "../types/index.js";
import { StatCard } from "../components/StatCard.js";
import { MapZones } from "../components/MapZones.js";
import { WaterLevelChart } from "../components/WaterLevelChart.js";
import { RainfallChart } from "../components/RainfallChart.js";
import { AlertBadge } from "../components/AlertBadge.js";
import { PageHeader } from "../components/PageHeader.js";
import { Skeleton } from "../components/ui/skeleton.js";
import {
  IconBellRinging,
  IconRouter,
  IconAlertTriangle,
  IconDroplet,
  IconRefresh,
} from "@tabler/icons-react";
import { Button } from "../components/ui/button.js";

// Temporary: rainfall mock until you expose the route
const mockRain = Array.from({ length: 14 }, (_, i) => ({
  date: new Date(Date.now() - (13 - i) * 86400000).toISOString(),
  quantiteMm: [1.2, 0, 2.4, 0, 0.8, 3.1, 0, 4.8, 7.3, 11.2, 0, 9.4, 18.7, 22.3][
    i
  ],
}));

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [zones, setZones] = useState<Zone[]>([]);
  const [mesures, setMesures] = useState<Mesure[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchAll = async () => {
    try {
      const [dashboard, zoneList, mesureList] = await Promise.all([
        getDashboard(),
        getZones(),
        getMesures(),
      ]);
      setData(dashboard);
      setZones(zoneList);
      setMesures(mesureList);
      setLastRefresh(new Date());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading)
    return (
      <div className="flex flex-col">
        <PageHeader title="Dashboard" description="Vue d'ensemble du système" />
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-64 rounded-xl" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </div>
      </div>
    );

  if (!data)
    return (
      <div className="flex flex-col">
        <PageHeader title="Dashboard" />
        <p className="p-6 text-destructive text-sm">
          Erreur de chargement des données.
        </p>
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Dashboard"
        description={`Dernière mise à jour : ${lastRefresh.toLocaleTimeString("fr-FR")}`}
      />

      <div className="flex-1 p-6 space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Alertes totales"
            value={data.totalAlertes}
            icon={IconBellRinging}
            color="danger"
            trend="Depuis la mise en service"
          />
          <StatCard
            label="Capteurs en ligne"
            value={data.capteursOnline}
            icon={IconRouter}
            color="success"
            trend="Actifs en ce moment"
          />
          <StatCard
            label="Zones en danger"
            value={data.zonesEnDanger}
            icon={IconAlertTriangle}
            color={data.zonesEnDanger > 0 ? "danger" : "success"}
            trend="Dépassement de seuil"
          />
          <StatCard
            label="Indice de risque"
            value={data.indiceRisque.valeur}
            icon={IconDroplet}
            color={
              data.indiceRisque.label === "danger"
                ? "danger"
                : data.indiceRisque.label === "modéré"
                  ? "warning"
                  : "success"
            }
            trend={`Niveau : ${data.indiceRisque.label}`}
          />
        </div>

        {/* Risk banner if danger */}
        {data.indiceRisque.label === "danger" && (
          <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800 px-4 py-3">
            <IconAlertTriangle size={18} className="text-red-500 shrink-0" />
            <p className="text-sm font-medium text-red-700 dark:text-red-400">
              Niveau de risque critique détecté — vérifiez les zones en rouge
              sur la carte
            </p>
            <AlertBadge niveau="danger" />
          </div>
        )}

        {/* Map — full width */}
        <MapZones zones={zones} />

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <WaterLevelChart mesures={mesures} seuilMax={8} />
          <RainfallChart data={mockRain} />
        </div>

        {/* Refresh button */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAll}
            className="gap-2 text-xs"
          >
            <IconRefresh size={14} />
            Rafraîchir
          </Button>
        </div>
      </div>
    </div>
  );
}
