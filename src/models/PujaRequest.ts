import mongoose, { Document, Model, Schema } from "mongoose";

export type PujaRequestStatus =
  | "requested"
  | "price_finalized"
  | "payment_pending"
  | "confirmed"
  | "assigned"
  | "inprogress"
  | "completed"
  | "submitted"
  | "cancelled";

export type PaymentStatus = "pending" | "partial" | "paid" | "refunded" | "failed";

export interface IUserInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface IPujaRequest extends Document {
  _id: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  pujaId: mongoose.Types.ObjectId;
  packageName: string;
  date: Date;
  time: string;
  userInfo: IUserInfo;
  paymentStatus: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  amount: number;
  advanceAmount?: number;
  status: PujaRequestStatus;
  assignedPanditId?: mongoose.Types.ObjectId;
  assignDateTime?: Date;
  adminNotes?: string;
  internalNotes?: string;
  statusHistory: { status: PujaRequestStatus; changedAt: Date; changedBy?: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const PujaRequestSchema = new Schema<IPujaRequest>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Customer" },
    pujaId: { type: Schema.Types.ObjectId, ref: "Puja", required: true },
    packageName: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    userInfo: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "partial", "paid", "refunded", "failed"],
      default: "pending",
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    amount: { type: Number, required: true, min: 0 },
    advanceAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["requested", "price_finalized", "payment_pending", "confirmed", "assigned", "inprogress", "completed", "submitted", "cancelled"],
      default: "requested",
    },
    assignedPanditId: { type: Schema.Types.ObjectId, ref: "Pandit" },
    assignDateTime: { type: Date },
    adminNotes: { type: String },
    internalNotes: { type: String },
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

PujaRequestSchema.index({ status: 1 });
PujaRequestSchema.index({ pujaId: 1 });
PujaRequestSchema.index({ userId: 1 });
PujaRequestSchema.index({ date: 1 });
PujaRequestSchema.index({ paymentStatus: 1 });

const PujaRequest: Model<IPujaRequest> =
  mongoose.models.PujaRequest || mongoose.model<IPujaRequest>("PujaRequest", PujaRequestSchema);

export default PujaRequest;
