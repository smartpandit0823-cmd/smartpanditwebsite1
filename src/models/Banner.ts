import mongoose, { Document, Model, Schema } from "mongoose";

export type BannerPosition = "home" | "puja" | "store" | "astrology";
export type BannerStatus = "active" | "inactive";

export interface IBanner extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  subtitle?: string;
  image: string;
  mobileImage?: string;
  link?: string;
  position: BannerPosition;
  status: BannerStatus;
  order: number;
  startsAt?: Date;
  endsAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new Schema<IBanner>(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    image: { type: String, required: true },
    mobileImage: { type: String },
    link: { type: String },
    position: {
      type: String,
      enum: ["home", "puja", "store", "astrology"],
      default: "home",
    },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    order: { type: Number, default: 0 },
    startsAt: { type: Date },
    endsAt: { type: Date },
  },
  { timestamps: true }
);

BannerSchema.index({ position: 1, status: 1, order: 1 });

const Banner: Model<IBanner> =
  mongoose.models.Banner || mongoose.model<IBanner>("Banner", BannerSchema);

export default Banner;
