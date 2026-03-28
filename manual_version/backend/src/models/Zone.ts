import mongoose, { Schema, Document } from "mongoose";

export interface IZone extends Document {
  nom: string;
  localisation: { lat: number; lng: number };
  statut: "normal" | "attention" | "danger";
}

const ZoneSchema = new Schema<IZone>({
  nom: { type: String, required: true },
  localisation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  statut: {
    type: String,
    enum: ["normal", "attention", "danger"],
    default: "normal",
  },
});

export default mongoose.model<IZone>("Zone", ZoneSchema);
