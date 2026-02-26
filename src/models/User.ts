import mongoose, { Document, Model, Schema } from "mongoose";

export type CustomerStatus = "active" | "blocked" | "deleted";

export interface IAddress {
  _id?: mongoose.Types.ObjectId;
  label: string;          // "Home", "Office", "Other"
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  area?: string;
  city: string;
  state: string;
  pincode: string;
  lat?: number;
  lng?: number;
  isDefault: boolean;
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  phone: string;
  name?: string;
  email?: string;
  avatar?: string;
  city?: string;

  // Personal details (astrology useful)
  dateOfBirth?: Date;
  birthTime?: string;
  birthPlace?: string;
  gotra?: string;
  gender?: "male" | "female" | "other";
  language?: string;

  // Auth
  googleId?: string;
  authProvider: "phone" | "google";

  // Addresses
  addresses: IAddress[];

  // Stats
  totalBookings: number;
  totalOrders: number;
  totalSpent: number;

  // Status
  status: CustomerStatus;

  // Favorites
  favoritePujas: mongoose.Types.ObjectId[];
  favoriteProducts: mongoose.Types.ObjectId[];
  savedPandits: mongoose.Types.ObjectId[];
  referralCode?: string;

  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<IAddress>(
  {
    label: { type: String, default: "Home" },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String },
    area: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    lat: { type: Number },
    lng: { type: Number },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const UserSchema = new Schema<IUser>(
  {
    phone: { type: String, required: true, unique: true, trim: true },
    name: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true, sparse: true },
    avatar: { type: String },
    city: { type: String, trim: true },

    // Personal details
    dateOfBirth: { type: Date },
    birthTime: { type: String },
    birthPlace: { type: String },
    gotra: { type: String },
    gender: { type: String, enum: ["male", "female", "other"] },
    language: { type: String, default: "hi" },

    // Auth
    googleId: { type: String, sparse: true },
    authProvider: { type: String, enum: ["phone", "google"], default: "phone" },

    // Addresses
    addresses: [AddressSchema],

    // Stats
    totalBookings: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },

    // Status
    status: { type: String, enum: ["active", "blocked", "deleted"], default: "active" },

    // Favorites
    favoritePujas: [{ type: Schema.Types.ObjectId, ref: "Puja" }],
    favoriteProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    savedPandits: [{ type: Schema.Types.ObjectId, ref: "Pandit" }],
    referralCode: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

UserSchema.index({ phone: 1 });
UserSchema.index({ email: 1 }, { sparse: true });
UserSchema.index({ googleId: 1 }, { sparse: true });
UserSchema.index({ status: 1 });

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
