import mongoose, { Document, Model, Schema } from "mongoose";

export type CouponType = "percentage" | "flat" | "free_shipping";
export type CouponStatus = "active" | "expired" | "disabled";
export type ApplicableType = "all" | "products" | "categories" | "purpose" | "zodiac";

export interface ICoupon extends Document {
  _id: mongoose.Types.ObjectId;
  code: string;
  name: string;
  description?: string;

  // Discount Config
  type: CouponType;
  discountValue: number; // For flat or percentage
  maxDiscountAmount?: number; // Optional cap for percentage

  // Order Conditions
  minOrderAmount: number;
  maxOrderAmount?: number;
  applicableOn: ApplicableType;

  // Restrictions
  includedProducts: mongoose.Types.ObjectId[];
  includedCategories: string[];
  excludedProducts: mongoose.Types.ObjectId[];

  // User Restrictions
  applyFor: "all" | "first_time" | "specific";
  specificUsers: mongoose.Types.ObjectId[];
  perUserLimit: number;

  // Validity
  startsAt: Date;
  expiresAt: Date;
  autoExpire: boolean;

  // Usage Control
  usageLimit: number;
  usageCount: number;
  showLeftCount: boolean;

  // Auto Apply & Promotion
  autoApply: boolean;
  showBanner: boolean;
  showOnHome: boolean;
  marketingTag?: "Festival" | "Clearance" | "Influencer" | "Referral" | "WhatsApp Campaign" | "Other";

  status: CouponStatus;

  usedBy: { userId: mongoose.Types.ObjectId; usedAt: Date }[];

  // Analytics
  totalRevenueGenerated: number;

  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: String, required: true, default: "Promo Code" },
    description: { type: String },

    type: { type: String, enum: ["percentage", "flat", "free_shipping"], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    maxDiscountAmount: { type: Number },

    minOrderAmount: { type: Number, default: 0 },
    maxOrderAmount: { type: Number },
    applicableOn: { type: String, enum: ["all", "products", "categories", "purpose", "zodiac"], default: "all" },

    includedProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    includedCategories: [{ type: String }],
    excludedProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],

    applyFor: { type: String, enum: ["all", "first_time", "specific"], default: "all" },
    specificUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    perUserLimit: { type: Number, default: 1 },

    startsAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    autoExpire: { type: Boolean, default: true },

    usageLimit: { type: Number, default: 500 },
    usageCount: { type: Number, default: 0 },
    showLeftCount: { type: Boolean, default: false },

    autoApply: { type: Boolean, default: false },
    showBanner: { type: Boolean, default: false },
    showOnHome: { type: Boolean, default: false },
    marketingTag: { type: String, enum: ["Festival", "Clearance", "Influencer", "Referral", "WhatsApp Campaign", "Other"] },

    status: { type: String, enum: ["active", "expired", "disabled"], default: "active" },

    usedBy: [
      {
        userId: { type: Schema.Types.ObjectId },
        usedAt: { type: Date, default: Date.now },
      },
    ],

    totalRevenueGenerated: { type: Number, default: 0 }
  },
  { timestamps: true }
);

CouponSchema.index({ code: 1 });
CouponSchema.index({ status: 1 });

// Fix Next.js HMR (Hot Module Replacement) caching old schema definitions
if (process.env.NODE_ENV !== "production") {
  delete mongoose.models.Coupon;
}

const Coupon: Model<ICoupon> =
  mongoose.models.Coupon || mongoose.model<ICoupon>("Coupon", CouponSchema);

export default Coupon;
