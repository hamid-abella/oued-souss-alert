import { useState, useEffect } from "react";
import { getCapteurs } from "../services/api.js";
import type { Capteur } from "../types/index.js";
import { PageHeader } from "../components/PageHeader.js";
import { Skeleton } from "../components/ui/skeleton.js";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card.js";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table.js";
import { Badge } from "../components/ui/badge.js";
import { IconRouter, IconWifi, IconWifiOff } from "@tabler/icons-react";

export default function Capteurs() {
  const [capteurs, setCapteurs] = useState<Capteur[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCapteurs()
      .then(setCapteurs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const onlineCount = capteurs.filter((c) => c.statut === "online").length;
  const offlineCount = capteurs.filter((c) => c.statut === "offline").length;

  const minutesAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "À l'instant";
    if (mins < 60) return `Il y a ${mins} min`;
    return `Il y a ${Math.floor(mins / 60)}h`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Capteurs"
        description={`${onlineCount} en ligne · ${offlineCount} hors ligne`}
      />

      <div className="flex-1 p-6 space-y-4">
        {/* Status summary */}
        {!loading && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900 px-3 py-2">
              <IconWifi size={15} className="text-green-500" />
              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                {onlineCount} en ligne
              </span>
            </div>
            {offlineCount > 0 && (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900 px-3 py-2">
                <IconWifiOff size={15} className="text-red-500" />
                <span className="text-sm font-medium text-red-700 dark:text-red-400">
                  {offlineCount} hors ligne
                </span>
              </div>
            )}
          </div>
        )}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <IconRouter size={18} />
              Liste des capteurs
            </CardTitle>
            <CardDescription>
              Statut mis à jour toutes les 60 secondes par le watchdog
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 rounded" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Capteur</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Zone</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Dernière mesure</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {capteurs.map((capteur) => {
                    const isOffline = capteur.statut === "offline";
                    const zoneName =
                      typeof capteur.zoneId === "object"
                        ? capteur.zoneId.nom
                        : capteur.zoneId;

                    return (
                      <TableRow
                        key={capteur._id}
                        className={
                          isOffline ? "bg-red-50/60 dark:bg-red-950/10" : ""
                        }
                      >
                        <TableCell className="font-medium text-sm">
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-2 w-2 rounded-full ${isOffline ? "bg-red-500" : "bg-green-500 animate-pulse"}`}
                            />
                            {capteur.nom}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="text-xs font-mono"
                          >
                            {capteur.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {zoneName}
                        </TableCell>
                        <TableCell>
                          <div
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                              isOffline
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            }`}
                          >
                            {isOffline ? (
                              <IconWifiOff size={12} />
                            ) : (
                              <IconWifi size={12} />
                            )}
                            {capteur.statut}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          <span
                            title={new Date(
                              capteur.derniereMesure,
                            ).toLocaleString("fr-FR")}
                          >
                            {minutesAgo(capteur.derniereMesure)}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
