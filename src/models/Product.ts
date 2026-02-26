import mongoose, { Document, Model, Schema } from "mongoose";

export type ProductStatus = "draft" | "published" | "deleted";

export interface IProductPricing {
  sellingPrice: number;
  mrp: number;
  discount: number;
  gst: number;
}

export interface IProductInventory {
  stock: number;
  sku: string;
  inStock: boolean;
  lowStockThreshold: number;
}

export interface IProductVariants {
  size?: string;
  weight?: string;
  color?: string;
  type?: string;
}

export interface IProductShipping {
  weight?: number;
  deliveryCharge: number;
  freeShipping: boolean;
  deliveryDays: number;
}

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  brand?: string;
  tags: string[];
  mainImage: string;
  images: string[];
  video?: string;
  pricing: IProductPricing;
  inventory: IProductInventory;
  variants: IProductVariants;
  shipping: IProductShipping;
  seo: { seoTitle: string; metaDescription: string; keywords: string[] };
  status: ProductStatus;
  featured: boolean;
  trending: boolean;
  showOnHome: boolean;
  spiritualBenefits?: string;
  howToUse?: string;
  authenticityCertificate?: string;
  panditRecommended: boolean;
  totalSold: number;
  averageRating: number;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    category: { type: String, required: true },
    brand: { type: String },
    tags: [{ type: String }],
    mainImage: { type: String, required: true },
    images: [{ type: String }],
    video: { type: String },
    pricing: {
      sellingPrice: { type: Number, required: true, min: 0 },
      mrp: { type: Number, required: true, min: 0 },
      discount: { type: Number, default: 0, min: 0, max: 100 },
      gst: { type: Number, default: 0, min: 0 },
    },
    inventory: {
      stock: { type: Number, default: 0, min: 0 },
      sku: { type: String, unique: true, sparse: true },
      inStock: { type: Boolean, default: true },
      lowStockThreshold: { type: Number, default: 5 },
    },
    variants: {
      size: { type: String },
      weight: { type: String },
      color: { type: String },
      type: { type: String },
    },
    shipping: {
      weight: { type: Number },
      deliveryCharge: { type: Number, default: 0 },
      freeShipping: { type: Boolean, default: false },
      deliveryDays: { type: Number, default: 7 },
    },
    seo: {
      seoTitle: { type: String, default: "" },
      metaDescription: { type: String, default: "" },
      keywords: [{ type: String }],
    },
    status: { type: String, enum: ["draft", "published", "deleted"], default: "draft" },
    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    showOnHome: { type: Boolean, default: false },
    spiritualBenefits: { type: String },
    howToUse: { type: String },
    authenticityCertificate: { type: String },
    panditRecommended: { type: Boolean, default: false },
    totalSold: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

ProductSchema.index({ slug: 1 });
ProductSchema.index({ status: 1, category: 1 });
ProductSchema.index({ "inventory.inStock": 1 });
ProductSchema.index({ name: "text", shortDescription: "text" });

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
