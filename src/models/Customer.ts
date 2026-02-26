import mongoose, { Document, Model, Schema } from "mongoose";

export type CustomerStatus = "active" | "blocked" | "deleted";

export interface ICustomer extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: Date;
  gender?: "male" | "female" | "other";
  address?: {
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
  status: CustomerStatus;
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
  lastOrderAt?: Date;
  notes?: string;
  source?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String },
    avatar: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["male", "female", "other"] },
    address: {
      line1: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
    },
    status: { type: String, enum: ["active", "blocked", "deleted"], default: "active" },
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    loyaltyPoints: { type: Number, default: 0 },
    lastOrderAt: { type: Date },
    notes: { type: String },
    source: { type: String, default: "website" },
  },
  { timestamps: true }
);

CustomerSchema.index({ email: 1 });
CustomerSchema.index({ status: 1 });
CustomerSchema.index({ name: "text", email: "text" });

const Customer: Model<ICustomer> =
  mongoose.models.Customer || mongoose.model<ICustomer>("Customer", CustomerSchema);

export default Customer;
