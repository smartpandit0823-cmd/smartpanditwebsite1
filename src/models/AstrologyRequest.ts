import mongoose, { Document, Model, Schema } from "mongoose";

export type AstrologyStatus = "requested" | "assigned" | "confirmed" | "completed" | "cancelled";
export type AstrologyPriority = "normal" | "urgent" | "vip";
export type SessionType = 15 | 30 | 60;

export interface IAstrologyRequest extends Document {
  _id: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  name: string;
  phone: string;
  email: string;
  birthDate: Date;
  birthTime?: string;
  birthPlace: string;
  problemCategory: string;
  preferredDate?: Date;
  preferredTime?: string;
  notes?: string;
  priority: AstrologyPriority;
  sessionType: SessionType;
  assignedAstrologerId?: mongoose.Types.ObjectId;
  finalCallTime?: Date;
  adminNotes?: string;
  recording?: string;
  priceOverride?: number;
  followUpRequired: boolean;
  paymentStatus: "pending" | "partial" | "paid" | "refunded" | "failed";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  amount: number;
  status: AstrologyStatus;
  statusHistory: { status: AstrologyStatus; changedAt: Date; changedBy?: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const AstrologyRequestSchema = new Schema<IAstrologyRequest>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Customer" },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    birthDate: { type: Date, required: true },
    birthTime: { type: String },
    birthPlace: { type: String, required: true },
    problemCategory: { type: String, required: true },
    preferredDate: { type: Date },
    preferredTime: { type: String },
    notes: { type: String },
    priority: { type: String, enum: ["normal", "urgent", "vip"], default: "normal" },
    sessionType: { type: Number, enum: [15, 30, 60], default: 30 },
    assignedAstrologerId: { type: Schema.Types.ObjectId, ref: "Pandit" },
    finalCallTime: { type: Date },
    adminNotes: { type: String },
    recording: { type: String },
    priceOverride: { type: Number },
    followUpRequired: { type: Boolean, default: false },
    paymentStatus: {
      type: String,
      enum: ["pending", "partial", "paid", "refunded", "failed"],
      default: "pending",
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    amount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["requested", "assigned", "confirmed", "completed", "cancelled"],
      default: "requested",
    },
    statusHistory: [
      {
        status: { type: String },
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: String },
      },
    ],
  },
  { timestamps: true }
);

AstrologyRequestSchema.index({ status: 1, priority: 1 });
AstrologyRequestSchema.index({ userId: 1 });

const AstrologyRequest: Model<IAstrologyRequest> =
  mongoose.models.AstrologyRequest ||
  mongoose.model<IAstrologyRequest>("AstrologyRequest", AstrologyRequestSchema);

export default AstrologyRequest;
