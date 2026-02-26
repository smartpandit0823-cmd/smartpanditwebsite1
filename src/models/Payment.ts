import mongoose, { Document, Model, Schema } from "mongoose";

export type PaymentStatus = "created" | "authorized" | "captured" | "refunded" | "failed";

export interface IPayment extends Document {
  _id: mongoose.Types.ObjectId;
  entityType: "booking" | "order" | "astro";
  entityId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  gatewayData?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    entityType: { type: String, enum: ["booking", "order", "astro"], required: true },
    entityId: { type: Schema.Types.ObjectId, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: { type: String, enum: ["created", "authorized", "captured", "refunded", "failed"], default: "created" },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    gatewayData: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

PaymentSchema.index({ entityType: 1, entityId: 1 });
PaymentSchema.index({ razorpayOrderId: 1 });

const Payment: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);

export default Payment;
