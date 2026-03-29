export interface Zone {
  _id: string;
  nom: string;
  localisation: { lat: number; lng: number };
  statut: "normal" | "attention" | "danger";
}

export interface Capteur {
  _id: string;
  nom: string;
  type: string;
  zoneId: Zone | string;
  statut: "online" | "offline";
  derniereMesure: string;
}

export interface Mesure {
  _id: string;
  niveauEau: number;
  debit: number;
  dateMesure: string;
  capteurId: string;
}

export interface Alerte {
  _id: string;
  dateAlerte: string;
  niveauRisque: "modéré" | "danger";
  mesureId: Mesure;
  zoneId: Zone;
}

export interface DashboardData {
  totalAlertes: number;
  capteursOnline: number;
  zonesEnDanger: number;
  indiceRisque: {
    valeur: number;
    label: "normal" | "modéré" | "danger";
  };
}
