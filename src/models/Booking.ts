import mongoose, { Document, Model, Schema } from "mongoose";

export type BookingStatus =
  | "requested"
  | "price_finalized"
  | "payment_pending"
  | "confirmed"
  | "assigned"
  | "inprogress"
  | "completed"
  | "submitted"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "partial" | "refunded" | "failed";
export type PaymentType = "advance" | "full";

export interface IBooking extends Document {
  _id: mongoose.Types.ObjectId;
  bookingId: string; // Human-readable e.g. SP-A1B2C3
  userId: mongoose.Types.ObjectId;
  pujaId: mongoose.Types.ObjectId;
  package: string;
  date: Date;
  time: string;
  address: string;
  addressId?: mongoose.Types.ObjectId;
  notes?: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentType: PaymentType;
  assignedPanditId?: mongoose.Types.ObjectId;
  amount: number; // Total puja amount
  advanceAmount: number; // Advance amount (set by admin in puja settings)
  amountPaid: number; // Actual amount paid so far
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  panditPayoutStatus: "pending" | "paid";
  panditPayoutAmount: number;
  panditPayoutUtr?: string;
  panditPayoutDate?: Date;
  platformFee?: number; // Our profit margin
  razorpayFee?: number; // Gateway fee
  statusHistory: { status: BookingStatus; at: Date; note?: string }[];
  createdAt: Date;
  updatedAt: Date;
}

function generateBookingId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return `SP-${code}`;
}

const BookingSchema = new Schema<IBooking>(
  {
    bookingId: { type: String, unique: true, default: generateBookingId },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    pujaId: { type: Schema.Types.ObjectId, ref: "Puja", required: true },
    package: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    address: { type: String, required: true },
    addressId: { type: Schema.Types.ObjectId },
    notes: { type: String },
    status: {
      type: String,
      enum: ["requested", "price_finalized", "payment_pending", "confirmed", "assigned", "inprogress", "completed", "submitted", "cancelled"],
      default: "requested",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "partial", "refunded", "failed"],
      default: "pending",
    },
    paymentType: {
      type: String,
      enum: ["advance", "full"],
      default: "full",
    },
    assignedPanditId: { type: Schema.Types.ObjectId, ref: "Pandit" },
    amount: { type: Number, required: true, min: 0 },
    advanceAmount: { type: Number, default: 0 },
    amountPaid: { type: Number, default: 0 },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    panditPayoutStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
    panditPayoutAmount: { type: Number, default: 0 },
    panditPayoutUtr: { type: String },
    panditPayoutDate: { type: Date },
    platformFee: { type: Number, default: 0 },
    razorpayFee: { type: Number, default: 0 },
    statusHistory: [
      { status: { type: String }, at: { type: Date, default: Date.now }, note: { type: String } },
    ],
  },
  { timestamps: true }
);

BookingSchema.index({ bookingId: 1 });
BookingSchema.index({ userId: 1 });
BookingSchema.index({ pujaId: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ date: 1 });

const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
