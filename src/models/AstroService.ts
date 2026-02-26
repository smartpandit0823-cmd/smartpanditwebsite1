import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAstroService extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  sessionTypes: { minutes: number; price: number }[];
  image?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AstroServiceSchema = new Schema<IAstroService>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    sessionTypes: [{ minutes: { type: Number }, price: { type: Number } }],
    image: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const AstroService: Model<IAstroService> =
  mongoose.models.AstroService || mongoose.model<IAstroService>("AstroService", AstroServiceSchema);

export default AstroService;
