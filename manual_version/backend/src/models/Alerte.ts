import mongoose, { Schema, Document } from "mongoose";

export interface IAlerte extends Document {
  dateAlerte: Date;
  niveauRisque: "modéré" | "danger";
  mesureId: mongoose.Types.ObjectId;
  zoneId: mongoose.Types.ObjectId;
}

const AlerteSchema = new Schema<IAlerte>({
  dateAlerte: { type: Date, default: Date.now },
  niveauRisque: {
    type: String,
    enum: ["modéré", "danger"],
    required: true,
  },
  mesureId: { type: Schema.Types.ObjectId, ref: "Mesure", required: true },
  zoneId: { type: Schema.Types.ObjectId, ref: "Zone", required: true },
});

export default mongoose.model<IAlerte>("Alerte", AlerteSchema);
