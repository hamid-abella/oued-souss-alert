import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Tooltip,
  Polyline,
  useMap,
} from "react-leaflet";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.js";
import type { Zone } from "../types/index.js";
import { IconMap } from "@tabler/icons-react";
import "leaflet/dist/leaflet.css";

interface Props {
  zones: Zone[];
}

const zoneCoords: Record<string, [number, number]> = {
  "Zone Souss Aval": [30.4202, -9.5981],
  "Zone Souss Médian": [30.4788, -9.532],
  "Zone Souss Amont": [30.5341, -9.467],
  "Zone Massa Nord": [30.365, -9.641],
  "Zone Issen": [30.59, -9.385],
};

const ouedSoussPath: [number, number][] = [
  [30.41, -9.62],
  [30.4202, -9.5981],
  [30.45, -9.56],
  [30.4788, -9.532],
  [30.5, -9.5],
  [30.52, -9.48],
  [30.5341, -9.467],
  [30.56, -9.42],
  [30.58, -9.39],
  [30.59, -9.385],
];

const statusColor = {
  normal: { color: "#22c55e", fillColor: "#22c55e" },
  attention: { color: "#f97316", fillColor: "#f97316" },
  danger: { color: "#ef4444", fillColor: "#ef4444" },
};

function FitBounds({ zones }: { zones: Zone[] }) {
  const map = useMap();
  useEffect(() => {
    const coords = zones.map((z) => zoneCoords[z.nom]).filter(Boolean);
    if (coords.length > 0) map.fitBounds(coords, { padding: [60, 60] });
  }, [zones, map]);
  return null;
}

function ZoneMarker({ zone }: { zone: Zone }) {
  const pos = zoneCoords[zone.nom];
  if (!pos) return null;
  const colors = statusColor[zone.statut];
  const radius = zone.statut === "danger" ? 22 : 16;

  return (
    <>
      {zone.statut !== "normal" && (
        <CircleMarker
          center={pos}
          radius={radius + 12}
          pathOptions={{
            color: colors.color,
            fillColor: colors.fillColor,
            fillOpacity: 0.12,
            weight: 1,
            opacity: 0.3,
          }}
        />
      )}
      <CircleMarker
        center={pos}
        radius={radius}
        pathOptions={{
          color: colors.color,
          fillColor: colors.fillColor,
          fillOpacity: 0.85,
          weight: 2.5,
        }}
      >
        <Tooltip permanent direction="top" offset={[0, -radius - 4]}>
          <span
            style={{ fontSize: "11px", fontWeight: 700, color: colors.color }}
          >
            {zone.nom.replace("Zone ", "")}
          </span>
        </Tooltip>
        <Popup>
          <div style={{ minWidth: 180, padding: "4px 0" }}>
            <p
              style={{
                fontWeight: 700,
                fontSize: 14,
                marginBottom: 8,
                color: "#1e293b",
              }}
            >
              {zone.nom}
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 6,
              }}
            >
              <span style={{ fontSize: 12, color: "#64748b" }}>Statut :</span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color:
                    zone.statut === "danger"
                      ? "#ef4444"
                      : zone.statut === "attention"
                        ? "#f97316"
                        : "#22c55e",
                  textTransform: "uppercase",
                }}
              >
                {zone.statut}
              </span>
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: 99,
                background:
                  zone.statut === "danger"
                    ? "#fee2e2"
                    : zone.statut === "attention"
                      ? "#ffedd5"
                      : "#dcfce7",
                color:
                  zone.statut === "danger"
                    ? "#ef4444"
                    : zone.statut === "attention"
                      ? "#f97316"
                      : "#22c55e",
              }}
            >
              {zone.statut === "danger"
                ? "Zone inondée"
                : zone.statut === "attention"
                  ? "Surveillance renforcée"
                  : "Situation normale"}
            </span>
            <p
              style={{
                fontSize: 11,
                color: "#94a3b8",
                marginTop: 8,
                marginBottom: 0,
              }}
            >
              {zone.localisation.lat.toFixed(4)}°N &nbsp;
              {Math.abs(zone.localisation.lng).toFixed(4)}°O
            </p>
          </div>
        </Popup>
      </CircleMarker>
    </>
  );
}

export function MapZones({ zones }: Props) {
  return (
    <Card className="col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <IconMap size={18} />
          Carte interactive — Bassin versant du Souss-Massa
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 pb-4 px-4">
        <div
          className="rounded-lg overflow-hidden border border-border"
          style={{ height: 440 }}
        >
          <MapContainer
            center={[30.48, -9.53]}
            zoom={11}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <Polyline
              positions={ouedSoussPath}
              pathOptions={{ color: "#3b82f6", weight: 5, opacity: 0.75 }}
            />
            <FitBounds zones={zones} />
            {zones.map((zone) => (
              <ZoneMarker key={zone._id} zone={zone} />
            ))}
          </MapContainer>
        </div>
        <div className="flex items-center gap-6 mt-3 px-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-green-500 inline-block" />
            Normal
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-orange-500 inline-block" />
            Attention
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500 inline-block" />
            Danger
          </span>
          <span className="ml-auto flex items-center gap-1.5">
            <span className="h-1.5 w-6 rounded bg-blue-400 inline-block" />
            Oued Souss
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
