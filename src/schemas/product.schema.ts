import { z } from "zod";

export const ProductPricingSchema = z.object({
  sellingPrice: z.coerce.number().min(0, "Price must be positive"),
  mrp: z.coerce.number().min(0).default(0),
  discount: z.coerce.number().min(0).max(100).default(0),
  gst: z.coerce.number().min(0).default(0),
  costPrice: z.coerce.number().min(0).optional(),
  offerTag: z.string().optional(),
});

export const ProductInventorySchema = z.object({
  stock: z.coerce.number().min(0).default(0),
  sku: z.string().default(""),
  inStock: z.boolean().default(true),
  lowStockThreshold: z.coerce.number().min(0).default(5),
  weight: z.string().optional(),
  codAvailable: z.boolean().default(true),
  returnAllowed: z.boolean().default(false),
});

export const ProductShippingSchema = z.object({
  weight: z.coerce.number().min(0).optional(),
  deliveryCharge: z.coerce.number().min(0).default(0),
  freeShipping: z.boolean().default(false),
  deliveryDays: z.coerce.number().min(0).default(7),
});

export const ProductSEOSchema = z.object({
  seoTitle: z.string().default(""),
  metaDescription: z.string().default(""),
  keywords: z.array(z.string()).default([]),
});

export const ProductVisibilitySchema = z.object({
  showInBestSellers: z.boolean().default(false),
  showInTrending: z.boolean().default(false),
  showInCombos: z.boolean().default(false),
  showInZodiac: z.boolean().default(false),
  showInSiddh: z.boolean().default(false),
  showInFeaturedRudraksha: z.boolean().default(false),
  showInVastu: z.boolean().default(false),
  showInPyramids: z.boolean().default(false),
  showOnHome: z.boolean().default(false),
});

const PURPOSE_VALUES = ["wealth", "love", "protection", "health", "career", "rashi"] as const;
const ZODIAC_VALUES = ["aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"] as const;

export const CreateProductSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2).optional(),
  shortTitle: z.string().optional(),
  shortDescription: z.string().min(10, "Short description required"),
  fullDescription: z.string().min(20, "Full description required"),
  category: z.string().min(1, "Category required"),
  subCategory: z.string().optional(),
  brand: z.string().optional(),
  tags: z.array(z.string()).default([]),

  // Media
  mainImage: z.string().min(1, "Main image required"),
  images: z.array(z.string()).default([]),
  video: z.string().url().optional().or(z.literal("")),
  certificationImage: z.string().optional(),
  sizeChart: z.string().optional(),

  // Pricing
  pricing: ProductPricingSchema,

  // Inventory
  inventory: ProductInventorySchema,

  // Shipping
  shipping: ProductShippingSchema,

  // SEO
  seo: ProductSEOSchema,

  // Status
  status: z.enum(["draft", "published", "deleted"]).default("draft"),

  // Descriptions
  benefits: z.array(z.string()).default([]),
  howToUse: z.string().optional(),
  spiritualImportance: z.string().optional(),
  careInstructions: z.string().optional(),
  spiritualBenefits: z.string().optional(),

  // 🔥 Visibility Controls
  visibility: ProductVisibilitySchema.default({
    showInBestSellers: false,
    showInTrending: false,
    showInCombos: false,
    showInZodiac: false,
    showInSiddh: false,
    showInFeaturedRudraksha: false,
    showInVastu: false,
    showInPyramids: false,
    showOnHome: false,
  }),

  // Purpose Tags
  purposeTags: z.array(z.enum(PURPOSE_VALUES)).default([]),

  // Zodiac Signs
  zodiacSigns: z.array(z.enum(ZODIAC_VALUES)).default([]),

  // Legacy compat
  featured: z.boolean().default(false),
  trending: z.boolean().default(false),
  showOnHome: z.boolean().default(false),
  panditRecommended: z.boolean().default(false),
  authenticityCertificate: z.string().optional(),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
