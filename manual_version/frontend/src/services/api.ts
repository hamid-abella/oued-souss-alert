import axios from "axios";
import type {
  Zone,
  Capteur,
  Alerte,
  DashboardData,
  Mesure,
} from "../types/index.js";

const BASE_URL = "http://localhost:3001/api";

export const getZones = async (): Promise<Zone[]> => {
  const res = await axios.get(`${BASE_URL}/zones`);
  return res.data;
};

export const getAlertes = async (): Promise<Alerte[]> => {
  const res = await axios.get(`${BASE_URL}/alertes`);
  return res.data;
};

export const getCapteurs = async (): Promise<Capteur[]> => {
  const res = await axios.get(`${BASE_URL}/capteurs`);
  return res.data;
};

export const getDashboard = async (): Promise<DashboardData> => {
  const res = await axios.get(`${BASE_URL}/dashboard`);
  return res.data;
};

export const getMesures = async (): Promise<Mesure[]> => {
  const res = await axios.get(`${BASE_URL}/mesures`);
  return res.data;
};

export const postMesure = async (data: {
  niveauEau: number;
  debit: number;
  capteurId: string;
}): Promise<void> => {
  await axios.post(`${BASE_URL}/mesures`, data);
};
