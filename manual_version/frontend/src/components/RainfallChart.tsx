import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card.js";
import { IconCloudRain } from "@tabler/icons-react";

interface RainPoint {
  date: string;
  quantiteMm: number;
}

interface Props {
  data: RainPoint[];
}

export function RainfallChart({ data }: Props) {
  const chartData = data.slice(-14).map((d) => ({
    day: new Date(d.date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
    }),
    mm: d.quantiteMm,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <IconCloudRain size={18} />
          Précipitations — 14 derniers jours
        </CardTitle>
        <CardDescription>Pluviométrie quotidienne en mm</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={chartData}
            margin={{ top: 4, right: 8, left: -14, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              opacity={0.5}
              vertical={false}
            />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
              tickLine={false}
              axisLine={false}
              unit="mm"
            />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(val: number) => [`${val} mm`, "Pluie"]}
            />
            <Bar dataKey="mm" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    entry.mm > 15
                      ? "#ef4444"
                      : entry.mm > 8
                        ? "#f97316"
                        : "#60a5fa"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
