import mongoose, { Schema, Document } from "mongoose";

export interface ISeuilCritique extends Document {
  niveauMax: number;
  zoneId: mongoose.Types.ObjectId;
}

const SeuilCritiqueSchema = new Schema<ISeuilCritique>({
  niveauMax: { type: Number, required: true },
  zoneId: {
    type: Schema.Types.ObjectId,
    ref: "Zone",
    required: true,
    unique: true,
  },
});

export default mongoose.model<ISeuilCritique>(
  "SeuilCritique",
  SeuilCritiqueSchema,
);
