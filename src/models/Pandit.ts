import mongoose, { Document, Model, Schema } from "mongoose";

export type PanditStatus = "active" | "inactive" | "suspended";
export type PanditVerificationStatus = "pending" | "verified" | "rejected";

export interface IPanditPayout {
  totalEarned: number;
  totalPaid: number;
  pendingAmount: number;
  lastPayoutDate?: Date;
}

export interface IPandit extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  photo?: string;
  dateOfBirth?: Date;
  specializations: string[];
  languagesSpoken: string[];
  experience: number;
  education?: string;
  bio?: string;

  // Address
  address?: string;
  city: string;
  state: string;
  pincode?: string;
  lat?: number;
  lng?: number;

  // Astrology
  providesAstrology: boolean;

  // Certifications
  certifications: string[];

  verificationStatus: PanditVerificationStatus;
  verificationDocuments: string[];
  status: PanditStatus;
  averageRating: number;
  totalRatings: number;
  totalPujasCompleted: number;
  totalAstrologyCompleted: number;
  availability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  payout: IPanditPayout;
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    accountHolderName: string;
  };
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PanditSchema = new Schema<IPandit>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    photo: { type: String },
    dateOfBirth: { type: Date },
    specializations: [{ type: String }],
    languagesSpoken: [{ type: String }],
    experience: { type: Number, default: 0 },
    education: { type: String },
    bio: { type: String },

    // Address
    address: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String },
    lat: { type: Number },
    lng: { type: Number },

    // Astrology toggle
    providesAstrology: { type: Boolean, default: false },

    // Certifications (URLs)
    certifications: [{ type: String }],

    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    verificationDocuments: [{ type: String }],
    status: { type: String, enum: ["active", "inactive", "suspended"], default: "active" },
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    totalPujasCompleted: { type: Number, default: 0 },
    totalAstrologyCompleted: { type: Number, default: 0 },
    availability: {
      monday: { type: Boolean, default: true },
      tuesday: { type: Boolean, default: true },
      wednesday: { type: Boolean, default: true },
      thursday: { type: Boolean, default: true },
      friday: { type: Boolean, default: true },
      saturday: { type: Boolean, default: true },
      sunday: { type: Boolean, default: false },
    },
    payout: {
      totalEarned: { type: Number, default: 0 },
      totalPaid: { type: Number, default: 0 },
      pendingAmount: { type: Number, default: 0 },
      lastPayoutDate: { type: Date },
    },
    bankDetails: {
      accountNumber: { type: String },
      ifscCode: { type: String },
      bankName: { type: String },
      accountHolderName: { type: String },
    },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

PanditSchema.index({ status: 1, verificationStatus: 1 });
PanditSchema.index({ name: "text" });
PanditSchema.index({ lat: 1, lng: 1 });
PanditSchema.index({ city: 1, state: 1 });

const Pandit: Model<IPandit> =
  mongoose.models.Pandit || mongoose.model<IPandit>("Pandit", PanditSchema);

export default Pandit;
