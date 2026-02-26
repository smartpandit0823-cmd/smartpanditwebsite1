import mongoose, { Document, Model, Schema } from "mongoose";

export type ReviewStatus = "pending" | "approved" | "rejected";
export type ReviewTargetModel = "Puja" | "Product";

export interface IReview extends Document {
  _id: mongoose.Types.ObjectId;
  targetId: mongoose.Types.ObjectId;
  targetModel: ReviewTargetModel;
  customerId?: mongoose.Types.ObjectId;
  customerName: string;
  customerEmail: string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  status: ReviewStatus;
  adminReply?: string;
  adminRepliedAt?: Date;
  isVerifiedPurchase: boolean;
  helpful: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    targetId: { type: Schema.Types.ObjectId, required: true },
    targetModel: { type: String, enum: ["Puja", "Product"], required: true },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String },
    comment: { type: String, required: true },
    images: [{ type: String }],
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    adminReply: { type: String },
    adminRepliedAt: { type: Date },
    isVerifiedPurchase: { type: Boolean, default: false },
    helpful: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ReviewSchema.index({ targetId: 1, targetModel: 1 });
ReviewSchema.index({ status: 1 });
ReviewSchema.index({ customerId: 1 });

const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);

export default Review;
