import mongoose, { Schema, Document } from "mongoose";

export interface IPluieHistorique extends Document {
  date: Date;
  quantiteMm: number;
}

const PluieHistoriqueSchema = new Schema<IPluieHistorique>({
  date: { type: Date, required: true },
  quantiteMm: { type: Number, required: true },
});

export default mongoose.model<IPluieHistorique>(
  "PluieHistorique",
  PluieHistoriqueSchema,
);
