import mongoose, { Document, Model, Schema } from "mongoose";

export type OfferType = "puja" | "store" | "astrology" | "temple" | "global";

export interface IOffer extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  image?: string;
  type: OfferType;
  targetId?: mongoose.Types.ObjectId;
  targetSlug?: string; // used for redirection /puja/slug or /store/slug
  discount: number;
  discountType: "flat" | "percent";
  startDate?: Date;
  endDate?: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OfferSchema = new Schema<IOffer>(
  {
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    type: { type: String, enum: ["puja", "store", "astrology", "temple", "global"], default: "global" },
    targetId: { type: Schema.Types.ObjectId },
    targetSlug: { type: String },
    discount: { type: Number, required: true },
    discountType: { type: String, enum: ["flat", "percent"], default: "percent" },
    startDate: { type: Date },
    endDate: { type: Date },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Offer: Model<IOffer> =
  mongoose.models.Offer || mongoose.model<IOffer>("Offer", OfferSchema);

export default Offer;
