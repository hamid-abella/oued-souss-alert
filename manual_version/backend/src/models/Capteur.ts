import mongoose, { Schema, Document } from "mongoose";

export interface ICapteur extends Document {
  nom: string;
  type: string;
  zoneId: mongoose.Types.ObjectId;
  statut: "online" | "offline";
  derniereMesure: Date;
}

const CapteurSchema = new Schema<ICapteur>({
  nom: { type: String, required: true },
  type: { type: String, required: true },
  zoneId: { type: Schema.Types.ObjectId, ref: "Zone", required: true },
  statut: {
    type: String,
    enum: ["online", "offline"],
    default: "online",
  },
  derniereMesure: { type: Date, default: Date.now },
});

export default mongoose.model<ICapteur>("Capteur", CapteurSchema);
