import mongoose, { Document, Model, Schema } from "mongoose";

export type PujaStatus = "draft" | "active" | "deleted";
export type PujaType = "online" | "offline" | "temple";
export type DifficultyLevel = "easy" | "moderate" | "complex";
export type PackageName = "basic" | "medium" | "premium";

export interface IPujaPackage {
  name: PackageName;
  price: number;
  includedList: string[];
  duration: string;
  panditExperience: string;
  extras: string;
  highlightDifference: string;
}

export interface IPujaFAQ {
  question: string;
  answer: string;
}

export interface IPujaTrustBadge {
  icon: string;   // emoji or lucide name
  label: string;
}

export interface IPujaDiscount {
  discountPercent: number;
  discountPrice: number;
  offerStart?: Date;
  offerEnd?: Date;
}

export interface IPujaBookingSettings {
  advanceAmount: number;
  fullPaymentRequired: boolean;
  rescheduleAllowed: boolean;
  cancellationAllowed: boolean;
  cancellationPolicy: string;
  rescheduleCutoffHours: number;
  cancellationCutoffHours: number;
}

export interface IPujaSEO {
  seoTitle: string;
  metaDescription: string;
  keywords: string[];
}

export interface IPuja extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  videoUrl?: string;
  images: string[];

  // Content sections
  benefits: string[];
  whenToDo: string;
  whoShouldDo: string;
  process: string[];             // step-by-step how puja works
  samagriList: string[];
  samagriIncluded: boolean;
  faqs: IPujaFAQ[];
  locationDetails: string;       // temple/offline location info
  importantNotes: string[];
  trustBadges: IPujaTrustBadge[];
  eligibility: string;
  resultTimeline: string;
  preparationSteps: string[];    // what to do before puja
  dosAndDonts: { dos: string[]; donts: string[] };
  muhuratGuidance: string;
  panditDetails: string;         // info about the pandit(s)
  reportIncluded: boolean;       // puja report/certificate provided
  videoRecordingIncluded: boolean;

  // Meta
  duration: string;
  bestMuhurat?: string;
  pujaType: PujaType;
  category: string;
  difficultyLevel: DifficultyLevel;
  languagesAvailable: string[];
  maxPeopleAllowed: number;
  maxBookingsPerDay: number;

  // Packages & pricing
  packages: IPujaPackage[];
  discount?: IPujaDiscount;

  // Flags
  popular: boolean;
  featured: boolean;
  trending: boolean;
  panditRecommended: boolean;
  templeName?: string;          // e.g. "Trimbakeshwar Temple"
  templeLocation?: string;      // address / area
  googleMapsUrl?: string;       // Google Maps link for Get Direction

  // Booking settings
  bookingSettings: IPujaBookingSettings;

  // SEO
  seo: IPujaSEO;

  // Stats
  status: PujaStatus;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PujaPackageSchema = new Schema<IPujaPackage>({
  name: { type: String, enum: ["basic", "medium", "premium"], required: true },
  price: { type: Number, required: true, min: 0 },
  includedList: [{ type: String }],
  duration: { type: String, default: "" },
  panditExperience: { type: String, default: "" },
  extras: { type: String, default: "" },
  highlightDifference: { type: String, default: "" },
});

const PujaFAQSchema = new Schema<IPujaFAQ>({
  question: { type: String, required: true },
  answer: { type: String, required: true },
}, { _id: false });

const PujaTrustBadgeSchema = new Schema<IPujaTrustBadge>({
  icon: { type: String, default: "✅" },
  label: { type: String, required: true },
}, { _id: false });

const PujaSchema = new Schema<IPuja>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    shortDescription: { type: String, required: true },
    longDescription: { type: String, required: true },
    videoUrl: { type: String },
    images: [{ type: String }],

    // Content fields
    benefits: [{ type: String }],
    whenToDo: { type: String, default: "" },
    whoShouldDo: { type: String, default: "" },
    process: [{ type: String }],
    samagriList: [{ type: String }],
    samagriIncluded: { type: Boolean, default: false },
    faqs: [PujaFAQSchema],
    locationDetails: { type: String, default: "" },
    importantNotes: [{ type: String }],
    trustBadges: [PujaTrustBadgeSchema],
    eligibility: { type: String, default: "" },
    resultTimeline: { type: String, default: "" },
    preparationSteps: [{ type: String }],
    dosAndDonts: {
      dos: [{ type: String }],
      donts: [{ type: String }],
    },
    muhuratGuidance: { type: String, default: "" },
    panditDetails: { type: String, default: "" },
    reportIncluded: { type: Boolean, default: false },
    videoRecordingIncluded: { type: Boolean, default: false },

    // Meta
    duration: { type: String, default: "" },
    bestMuhurat: { type: String },
    pujaType: { type: String, enum: ["online", "offline", "temple"], default: "online" },
    category: { type: String, required: true },
    difficultyLevel: { type: String, enum: ["easy", "moderate", "complex"], default: "easy" },
    languagesAvailable: [{ type: String }],
    maxPeopleAllowed: { type: Number, default: 0 },
    maxBookingsPerDay: { type: Number, default: 10 },

    // Packages
    packages: [PujaPackageSchema],
    discount: {
      discountPercent: { type: Number, default: 0 },
      discountPrice: { type: Number, default: 0 },
      offerStart: { type: Date },
      offerEnd: { type: Date },
    },

    // Flags
    popular: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    panditRecommended: { type: Boolean, default: false },
    templeName: { type: String, default: "" },
    templeLocation: { type: String },
    googleMapsUrl: { type: String, default: "" },

    // Booking settings
    bookingSettings: {
      advanceAmount: { type: Number, default: 0 },
      fullPaymentRequired: { type: Boolean, default: false },
      rescheduleAllowed: { type: Boolean, default: true },
      cancellationAllowed: { type: Boolean, default: true },
      cancellationPolicy: { type: String, default: "" },
      rescheduleCutoffHours: { type: Number, default: 24 },
      cancellationCutoffHours: { type: Number, default: 24 },
    },

    // SEO
    seo: {
      seoTitle: { type: String, default: "" },
      metaDescription: { type: String, default: "" },
      keywords: [{ type: String }],
    },

    // Stats
    status: { type: String, enum: ["draft", "active", "deleted"], default: "draft" },
    totalBookings: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

PujaSchema.index({ slug: 1 });
PujaSchema.index({ status: 1 });
PujaSchema.index({ category: 1 });
PujaSchema.index({ featured: 1, trending: 1, popular: 1 });
PujaSchema.index({ name: "text", shortDescription: "text" });

const Puja: Model<IPuja> =
  mongoose.models.Puja || mongoose.model<IPuja>("Puja", PujaSchema);

export default Puja;
