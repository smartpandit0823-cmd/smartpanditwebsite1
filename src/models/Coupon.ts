import mongoose, { Document, Model, Schema } from "mongoose";

export type CouponType = "flat" | "percent";
export type CouponStatus = "active" | "inactive" | "expired";

export interface ICoupon extends Document {
  _id: mongoose.Types.ObjectId;
  code: string;
  description?: string;
  type: CouponType;
  value: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  usageLimit: number;
  usageCount: number;
  perUserLimit: number;
  applicableTo: "all" | "pujas" | "products" | "astrology";
  applicableIds: mongoose.Types.ObjectId[];
  expiresAt?: Date;
  startsAt?: Date;
  status: CouponStatus;
  usedBy: { userId: mongoose.Types.ObjectId; usedAt: Date }[];
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String },
    type: { type: String, enum: ["flat", "percent"], required: true },
    value: { type: Number, required: true, min: 0 },
    minOrderAmount: { type: Number, default: 0 },
    maxDiscountAmount: { type: Number },
    usageLimit: { type: Number, default: 100 },
    usageCount: { type: Number, default: 0 },
    perUserLimit: { type: Number, default: 1 },
    applicableTo: {
      type: String,
      enum: ["all", "pujas", "products", "astrology"],
      default: "all",
    },
    applicableIds: [{ type: Schema.Types.ObjectId }],
    expiresAt: { type: Date },
    startsAt: { type: Date },
    status: { type: String, enum: ["active", "inactive", "expired"], default: "active" },
    usedBy: [
      {
        userId: { type: Schema.Types.ObjectId },
        usedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

CouponSchema.index({ code: 1 });
CouponSchema.index({ status: 1 });

const Coupon: Model<ICoupon> =
  mongoose.models.Coupon || mongoose.model<ICoupon>("Coupon", CouponSchema);

export default Coupon;
