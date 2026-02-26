import { z } from "zod";

export const PujaPackageSchema = z.object({
  name: z.enum(["basic", "medium", "premium"]),
  price: z.coerce.number().min(0, "Price must be positive"),
  includedList: z.array(z.string()).default([]),
  duration: z.string().default(""),
  panditExperience: z.string().default(""),
  extras: z.string().default(""),
  highlightDifference: z.string().default(""),
});

export const PujaFAQSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const PujaDiscountSchema = z.object({
  discountPercent: z.coerce.number().min(0).max(100).default(0),
  discountPrice: z.coerce.number().min(0).default(0),
  offerStart: z.string().optional(),
  offerEnd: z.string().optional(),
});

export const PujaBookingSettingsSchema = z.object({
  advanceAmount: z.coerce.number().min(0).default(0),
  fullPaymentRequired: z.boolean().default(false),
  rescheduleAllowed: z.boolean().default(true),
  cancellationAllowed: z.boolean().default(true),
  cancellationPolicy: z.string().default(""),
  rescheduleCutoffHours: z.coerce.number().default(24),
  cancellationCutoffHours: z.coerce.number().default(24),
});

export const PujaSEOSchema = z.object({
  seoTitle: z.string().default(""),
  metaDescription: z.string().default(""),
  keywords: z.array(z.string()).default([]),
});

export const CreatePujaSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().optional(),
  shortDescription: z.string().min(10, "Short description must be at least 10 characters"),
  longDescription: z.string().min(20, "Long description must be at least 20 characters"),
  videoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  images: z.array(z.string()).default([]),

  // Content sections
  benefits: z.array(z.string()).default([]),
  whenToDo: z.string().default(""),
  whoShouldDo: z.string().default(""),
  process: z.array(z.string()).default([]),
  samagriList: z.array(z.string()).default([]),
  samagriIncluded: z.boolean().default(false),
  faqs: z.array(PujaFAQSchema).default([]),
  locationDetails: z.string().default(""),
  importantNotes: z.array(z.string()).default([]),
  trustBadges: z.array(z.object({ icon: z.string().default("✅"), label: z.string() })).default([]),
  eligibility: z.string().default(""),
  resultTimeline: z.string().default(""),
  preparationSteps: z.array(z.string()).default([]),
  dosAndDonts: z.object({
    dos: z.array(z.string()).default([]),
    donts: z.array(z.string()).default([]),
  }).default({ dos: [], donts: [] }),
  muhuratGuidance: z.string().default(""),
  panditDetails: z.string().default(""),
  reportIncluded: z.boolean().default(false),
  videoRecordingIncluded: z.boolean().default(false),

  // Meta
  duration: z.string().default(""),
  bestMuhurat: z.string().optional(),
  pujaType: z.enum(["online", "offline", "temple"]).default("online"),
  category: z.string().min(1, "Category is required"),
  difficultyLevel: z.enum(["easy", "moderate", "complex"]).default("easy"),
  languagesAvailable: z.array(z.string()).default([]),
  maxPeopleAllowed: z.coerce.number().min(0).default(0),
  maxBookingsPerDay: z.coerce.number().min(1).default(10),

  // Packages
  packages: z.array(PujaPackageSchema).min(1, "At least one package is required"),
  discount: PujaDiscountSchema.optional(),

  // Flags
  popular: z.boolean().default(false),
  featured: z.boolean().default(false),
  trending: z.boolean().default(false),
  panditRecommended: z.boolean().default(false),
  templeName: z.string().default(""),
  templeLocation: z.string().optional(),
  googleMapsUrl: z.string().url().optional().or(z.literal("")),

  // Booking settings
  bookingSettings: PujaBookingSettingsSchema,

  // SEO
  seo: PujaSEOSchema,

  status: z.enum(["draft", "active"]).default("draft"),
});

export const UpdatePujaSchema = CreatePujaSchema.partial();

export type CreatePujaInput = z.infer<typeof CreatePujaSchema>;
export type UpdatePujaInput = z.infer<typeof UpdatePujaSchema>;
