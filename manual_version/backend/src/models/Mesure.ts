import mongoose, { Schema, Document } from "mongoose";

export interface IMesure extends Document {
  niveauEau: number;
  debit: number;
  dateMesure: Date;
  capteurId: mongoose.Types.ObjectId;
}

const MesureSchema = new Schema<IMesure>({
  niveauEau: { type: Number, required: true },
  debit: { type: Number, required: true },
  dateMesure: { type: Date, default: Date.now },
  capteurId: { type: Schema.Types.ObjectId, ref: "Capteur", required: true },
});

export default mongoose.model<IMesure>("Mesure", MesureSchema);
