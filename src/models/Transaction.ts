import mongoose, { Document, Model, Schema } from "mongoose";

export type TransactionStatus = "created" | "authorized" | "captured" | "refunded" | "failed";
export type TransactionType = "puja_booking" | "product_order" | "astrology_session" | "manual";

export interface ITransaction extends Document {
  _id: mongoose.Types.ObjectId;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  type: TransactionType;
  referenceId?: mongoose.Types.ObjectId;
  referenceModel?: string;
  customerId?: mongoose.Types.ObjectId;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  refundAmount?: number;
  refundReason?: string;
  refundId?: string;
  refundedAt?: Date;
  notes?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String, sparse: true },
    razorpaySignature: { type: String },
    type: {
      type: String,
      enum: ["puja_booking", "product_order", "astrology_session", "manual"],
      required: true,
    },
    referenceId: { type: Schema.Types.ObjectId },
    referenceModel: { type: String },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: ["created", "authorized", "captured", "refunded", "failed"],
      default: "created",
    },
    refundAmount: { type: Number },
    refundReason: { type: String },
    refundId: { type: String },
    refundedAt: { type: Date },
    notes: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

TransactionSchema.index({ razorpayOrderId: 1 });
TransactionSchema.index({ status: 1 });
TransactionSchema.index({ type: 1 });
TransactionSchema.index({ customerId: 1 });
TransactionSchema.index({ createdAt: -1 });

const Transaction: Model<ITransaction> =
  mongoose.models.Transaction || mongoose.model<ITransaction>("Transaction", TransactionSchema);

export default Transaction;
