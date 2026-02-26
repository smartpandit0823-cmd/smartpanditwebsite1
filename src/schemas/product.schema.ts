import { z } from "zod";

export const ProductPricingSchema = z.object({
  sellingPrice: z.coerce.number().min(0, "Price must be positive"),
  mrp: z.coerce.number().min(0).default(0),
  discount: z.coerce.number().min(0).max(100).default(0),
  gst: z.coerce.number().min(0).default(0),
});

export const ProductInventorySchema = z.object({
  stock: z.coerce.number().min(0).default(0),
  sku: z.string().default(""),
  inStock: z.boolean().default(true),
  lowStockThreshold: z.coerce.number().min(0).default(5),
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

export const CreateProductSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2).optional(),
  shortDescription: z.string().min(10, "Short description required"),
  fullDescription: z.string().min(20, "Full description required"),
  category: z.string().min(1, "Category required"),
  brand: z.string().optional(),
  tags: z.array(z.string()).default([]),
  mainImage: z.string().min(1, "Main image required"),
  images: z.array(z.string()).default([]),
  video: z.string().url().optional().or(z.literal("")),
  pricing: ProductPricingSchema,
  inventory: ProductInventorySchema,
  shipping: ProductShippingSchema,
  seo: ProductSEOSchema,
  status: z.enum(["draft", "published", "deleted"]).default("draft"),
  featured: z.boolean().default(false),
  trending: z.boolean().default(false),
  showOnHome: z.boolean().default(false),
  spiritualBenefits: z.string().optional(),
  howToUse: z.string().optional(),
  authenticityCertificate: z.string().optional(),
  panditRecommended: z.boolean().default(false),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
