import { useState, useEffect } from "react";
import { getAlertes } from "../services/api.js";
import type { Alerte } from "../types/index.js";
import { AlertBadge } from "../components/AlertBadge.js";
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
import { IconBellRinging, IconAlertTriangle } from "@tabler/icons-react";

export default function Alertes() {
  const [alertes, setAlertes] = useState<Alerte[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAlertes()
      .then(setAlertes)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const dangerCount = alertes.filter((a) => a.niveauRisque === "danger").length;
  const moderéCount = alertes.filter((a) => a.niveauRisque === "modéré").length;

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        title="Alertes"
        description={`${alertes.length} alertes enregistrées`}
      />

      <div className="flex-1 p-6 space-y-4">
        {/* Summary badges */}
        {!loading && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900 px-3 py-2">
              <IconAlertTriangle size={15} className="text-red-500" />
              <span className="text-sm font-medium text-red-700 dark:text-red-400">
                {dangerCount} danger
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900 px-3 py-2">
              <IconBellRinging size={15} className="text-orange-500" />
              <span className="text-sm font-medium text-orange-700 dark:text-orange-400">
                {moderéCount} modéré
              </span>
            </div>
          </div>
        )}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <IconBellRinging size={18} />
              Historique des alertes
            </CardTitle>
            <CardDescription>
              Triées de la plus récente à la plus ancienne
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 rounded" />
                ))}
              </div>
            ) : alertes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <IconBellRinging size={36} opacity={0.3} />
                <p className="mt-2 text-sm">Aucune alerte enregistrée</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Zone</TableHead>
                    <TableHead>Niveau eau</TableHead>
                    <TableHead>Débit</TableHead>
                    <TableHead>Risque</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alertes.map((alerte) => {
                    const zoneName =
                      typeof alerte.zoneId === "object"
                        ? alerte.zoneId.nom
                        : alerte.zoneId;
                    const niveau = alerte.mesureId?.niveauEau;
                    const debit = alerte.mesureId?.debit;

                    return (
                      <TableRow
                        key={alerte._id}
                        className={
                          alerte.niveauRisque === "danger"
                            ? "bg-red-50/50 dark:bg-red-950/10"
                            : "bg-orange-50/50 dark:bg-orange-950/10"
                        }
                      >
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(alerte.dateAlerte).toLocaleString("fr-FR")}
                        </TableCell>
                        <TableCell className="font-medium text-sm">
                          {zoneName}
                        </TableCell>
                        <TableCell>
                          {niveau !== undefined ? (
                            <span
                              className={`text-sm font-mono font-medium ${niveau > 8 ? "text-red-600" : "text-foreground"}`}
                            >
                              {niveau.toFixed(2)} m
                            </span>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                        <TableCell className="text-sm font-mono text-muted-foreground">
                          {debit !== undefined
                            ? `${debit.toFixed(1)} m³/s`
                            : "—"}
                        </TableCell>
                        <TableCell>
                          <AlertBadge niveau={alerte.niveauRisque} />
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
