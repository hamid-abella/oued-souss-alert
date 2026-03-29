import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card.js";
import type { Mesure } from "../types/index.js";
import { IconChartLine } from "@tabler/icons-react";

interface Props {
  mesures: Mesure[];
  seuilMax?: number;
}

export function WaterLevelChart({ mesures, seuilMax = 10 }: Props) {
  // Group by hour, take last 24h, build chart data
  const last24 = mesures.slice(-48).map((m) => ({
    time: new Date(m.dateMesure).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    niveau: m.niveauEau,
    debit: m.debit,
  }));

  // Sample every 4th point to avoid crowding
  const chartData = last24.filter((_, i) => i % 2 === 0);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <IconChartLine size={18} />
          Niveau d'eau — 48h
        </CardTitle>
        <CardDescription>
          Évolution du niveau (m) — ligne rouge = seuil critique ({seuilMax}m)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart
            data={chartData}
            margin={{ top: 8, right: 12, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              opacity={0.5}
            />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickLine={false}
              axisLine={false}
              interval={Math.floor(chartData.length / 6)}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickLine={false}
              axisLine={false}
              domain={[
                0,
                Math.max(seuilMax + 4, ...chartData.map((d) => d.niveau)) + 1,
              ]}
            />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              labelStyle={{ color: "var(--muted-foreground)", marginBottom: 4 }}
              formatter={(val: number, name: string) => [
                `${val.toFixed(2)} ${name === "niveau" ? "m" : "m³/s"}`,
                name === "niveau" ? "Niveau eau" : "Débit",
              ]}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
              formatter={(value) =>
                value === "niveau" ? "Niveau (m)" : "Débit (m³/s)"
              }
            />
            <ReferenceLine
              y={seuilMax}
              stroke="#ef4444"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: `Seuil ${seuilMax}m`,
                position: "insideTopRight",
                fontSize: 11,
                fill: "#ef4444",
              }}
            />
            <Line
              type="monotone"
              dataKey="niveau"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="debit"
              stroke="#10b981"
              strokeWidth={1.5}
              dot={false}
              strokeDasharray="4 2"
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
