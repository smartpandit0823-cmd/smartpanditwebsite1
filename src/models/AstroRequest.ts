import mongoose, { Document, Model, Schema } from "mongoose";

export type AstroStatus = "requested" | "paid" | "assigned" | "confirmed" | "completed" | "cancelled";

export interface IAstroRequest extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  serviceType: string;
  birthDate: Date;
  birthTime?: string;
  birthPlace: string;
  problemCategory: string;
  preferredDate?: Date;
  preferredTime?: string;
  sessionType: number;
  notes?: string;
  status: AstroStatus;
  paymentStatus: "pending" | "paid" | "refunded";
  assignedAstrologerId?: mongoose.Types.ObjectId;
  finalCallTime?: Date;
  amount: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  statusHistory: { status: AstroStatus; at: Date; note?: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const AstroRequestSchema = new Schema<IAstroRequest>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    serviceType: { type: String, required: true },
    birthDate: { type: Date, required: true },
    birthTime: { type: String },
    birthPlace: { type: String, required: true },
    problemCategory: { type: String, required: true },
    preferredDate: { type: Date },
    preferredTime: { type: String },
    sessionType: { type: Number, default: 30 },
    notes: { type: String },
    status: { type: String, enum: ["requested", "paid", "assigned", "confirmed", "completed", "cancelled"], default: "requested" },
    paymentStatus: { type: String, enum: ["pending", "paid", "refunded"], default: "pending" },
    assignedAstrologerId: { type: Schema.Types.ObjectId, ref: "Pandit" },
    finalCallTime: { type: Date },
    amount: { type: Number, required: true },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    statusHistory: [{ status: { type: String }, at: { type: Date, default: Date.now }, note: { type: String } }],
  },
  { timestamps: true }
);

AstroRequestSchema.index({ userId: 1 });
AstroRequestSchema.index({ status: 1 });

const AstroRequest: Model<IAstroRequest> =
  mongoose.models.AstroRequest || mongoose.model<IAstroRequest>("AstroRequest", AstroRequestSchema);

export default AstroRequest;
