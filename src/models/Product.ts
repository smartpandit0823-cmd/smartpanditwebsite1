import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  shortTitle?: string;
  category: string;
  subCategory?: string;
  brandName?: string;
  sku: string;
  hsnCode?: string;
  status: 'active' | 'draft' | 'published' | 'outofstock' | 'deleted';

  // Descriptions
  shortDescription: string;
  fullDescription?: string;
  benefits?: string[];
  howToUse?: string;
  spiritualImportance?: string;
  careInstructions?: string;
  spiritualBenefits?: string;
  faqs?: { question: string; answer: string }[];

  // Media
  mainImage: string;
  galleryImages?: string[];
  images?: string[]; // alias used by actions
  zoomImage?: string;
  youtubeVideoLink?: string;
  video?: string; // alias
  sizeChart?: string;
  certificationImage?: string;
  authenticityCertificate?: string;

  // Pricing (flat fields)
  mrp: number;
  sellingPrice: number;
  discountPercentage?: number;
  costPrice?: number;
  gstPercentage?: number;
  offerTag?: string;
  bulkPriceOptions?: { minQuantity: number; discountPrice: number }[];

  // Pricing (nested — used by actions form)
  pricing?: {
    sellingPrice: number;
    mrp: number;
    discount: number;
    gst: number;
    costPrice?: number;
    offerTag?: string;
  };

  // Inventory (flat)
  stockQuantity: number;
  lowStockAlert: number;
  weight?: string;
  dimensions?: { length: string; width: string; height: string };
  codAvailable: boolean;
  returnAllowed: boolean;
  replacementDays?: number;

  // Inventory (nested - used by actions form)
  inventory?: {
    stock: number;
    sku: string;
    inStock: boolean;
    lowStockThreshold: number;
    weight?: string;
    codAvailable?: boolean;
    returnAllowed?: boolean;
  };

  // Variants
  variants?: {
    size?: string;
    weight?: string;
    color?: string;
    stoneType?: string;
    metalType?: string;
    price: number;
    stock: number;
    sku: string;
  }[];

  // SEO
  seo: {
    metaTitle?: string;
    seoTitle?: string; // alias
    metaDescription?: string;
    keywords?: string[];
    canonicalUrl?: string;
  };

  // Ratings
  averageRating: number;
  totalReviews: number;

  // Homepage Visibility Controls
  visibility: {
    showInBestSellers: boolean;
    showInTrending: boolean;
    showInCombos: boolean;
    showInZodiac: boolean;
    showInSiddh: boolean;
    showInFeaturedRudraksha: boolean;
    showInVastu: boolean;
    showInPyramids: boolean;
    showOnHome: boolean;
  };

  // Purpose & Zodiac
  purposeTags: string[];
  zodiacSigns: string[];

  // Marketing
  marketing: {
    isFlashSale: boolean;
    isFestivalOffer: boolean;
    applicableCoupons?: string[];
    relatedProductIds?: mongoose.Types.ObjectId[];
    upsellProductIds?: mongoose.Types.ObjectId[];
    crossSellProductIds?: mongoose.Types.ObjectId[];
  };

  // Shipping
  shipping: {
    dispatchTime?: string;
    estimatedDeliveryTime?: string;
    shippingCharge?: number;
    freeShippingAboveAmount?: number;
    // Action-compat aliases
    deliveryCharge?: number;
    freeShipping?: boolean;
    deliveryDays?: number;
    weight?: number;
  };

  // Authenticity
  authenticity: {
    energizedByPandit: boolean;
    mantraUsed?: string;
    pujaPerformed: boolean;
    certificateIncluded: boolean;
    panditName?: string;
  };

  // Legacy compat flags
  featured: boolean;
  trending: boolean;
  showOnHome: boolean;
  panditRecommended: boolean;

  totalSold: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortTitle: { type: String },
    category: { type: String, required: true },
    subCategory: { type: String },
    brandName: { type: String },
    sku: { type: String, required: true, unique: true },
    hsnCode: { type: String },
    status: { type: String, enum: ['active', 'draft', 'published', 'outofstock', 'deleted'], default: 'draft' },

    shortDescription: { type: String, required: true },
    fullDescription: { type: String },
    benefits: [{ type: String }],
    howToUse: { type: String },
    spiritualImportance: { type: String },
    careInstructions: { type: String },
    spiritualBenefits: { type: String },
    faqs: [{ question: { type: String }, answer: { type: String } }],

    mainImage: { type: String, required: true },
    galleryImages: [{ type: String }],
    images: [{ type: String }],
    zoomImage: { type: String },
    youtubeVideoLink: { type: String },
    video: { type: String },
    sizeChart: { type: String },
    certificationImage: { type: String },
    authenticityCertificate: { type: String },

    mrp: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    discountPercentage: { type: Number, default: 0 },
    costPrice: { type: Number, select: false },
    gstPercentage: { type: Number, default: 0 },
    offerTag: { type: String },
    bulkPriceOptions: [{ minQuantity: { type: Number }, discountPrice: { type: Number } }],

    // Nested pricing (from form actions)
    pricing: {
      sellingPrice: { type: Number },
      mrp: { type: Number },
      discount: { type: Number },
      gst: { type: Number },
      costPrice: { type: Number },
      offerTag: { type: String },
    },

    stockQuantity: { type: Number, default: 0 },
    lowStockAlert: { type: Number, default: 5 },
    weight: { type: String },
    dimensions: {
      length: { type: String },
      width: { type: String },
      height: { type: String },
    },
    codAvailable: { type: Boolean, default: true },
    returnAllowed: { type: Boolean, default: false },
    replacementDays: { type: Number, default: 0 },

    // Nested inventory (from form actions)
    inventory: {
      stock: { type: Number },
      sku: { type: String },
      inStock: { type: Boolean },
      lowStockThreshold: { type: Number },
      weight: { type: String },
      codAvailable: { type: Boolean },
      returnAllowed: { type: Boolean },
    },

    variants: [
      {
        size: { type: String },
        weight: { type: String },
        color: { type: String },
        stoneType: { type: String },
        metalType: { type: String },
        price: { type: Number },
        stock: { type: Number },
        sku: { type: String },
      },
    ],

    seo: {
      metaTitle: { type: String },
      seoTitle: { type: String },
      metaDescription: { type: String },
      keywords: [{ type: String }],
      canonicalUrl: { type: String },
    },

    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },

    visibility: {
      showInBestSellers: { type: Boolean, default: false },
      showInTrending: { type: Boolean, default: false },
      showInCombos: { type: Boolean, default: false },
      showInZodiac: { type: Boolean, default: false },
      showInSiddh: { type: Boolean, default: false },
      showInFeaturedRudraksha: { type: Boolean, default: false },
      showInVastu: { type: Boolean, default: false },
      showInPyramids: { type: Boolean, default: false },
      showOnHome: { type: Boolean, default: false },
    },

    purposeTags: [{ type: String, enum: ['wealth', 'love', 'protection', 'health', 'career', 'rashi'] }],
    zodiacSigns: [{ type: String, enum: ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'] }],

    marketing: {
      isFlashSale: { type: Boolean, default: false },
      isFestivalOffer: { type: Boolean, default: false },
      applicableCoupons: [{ type: String }],
      relatedProductIds: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
      upsellProductIds: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
      crossSellProductIds: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    },

    shipping: {
      dispatchTime: { type: String, default: '1-2 Business Days' },
      estimatedDeliveryTime: { type: String, default: '3-5 Business Days' },
      shippingCharge: { type: Number, default: 0 },
      freeShippingAboveAmount: { type: Number, default: 499 },
      deliveryCharge: { type: Number, default: 0 },
      freeShipping: { type: Boolean, default: false },
      deliveryDays: { type: Number, default: 7 },
      weight: { type: Number },
    },

    authenticity: {
      energizedByPandit: { type: Boolean, default: false },
      mantraUsed: { type: String },
      pujaPerformed: { type: Boolean, default: false },
      certificateIncluded: { type: Boolean, default: false },
      panditName: { type: String },
    },

    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    showOnHome: { type: Boolean, default: false },
    panditRecommended: { type: Boolean, default: false },

    totalSold: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Pre-validate hook to auto-calculate discount and sync visibility
// This must run before validation because fields like mrp, sellingPrice, sku are required.
ProductSchema.pre('validate', function () {
  const doc = this as any;

  // Sync flat pricing from nested pricing if available
  if (doc.pricing?.sellingPrice !== undefined) {
    doc.sellingPrice = doc.pricing.sellingPrice;
  }
  if (doc.pricing?.mrp !== undefined) {
    doc.mrp = doc.pricing.mrp;
  }

  // Auto calculate discount
  if (doc.mrp && doc.sellingPrice) {
    const diff = doc.mrp - doc.sellingPrice;
    doc.discountPercentage = Math.round((diff / doc.mrp) * 100);
  } else {
    doc.discountPercentage = 0;
  }

  // Sync SKU from inventory if available
  if (doc.inventory?.sku && !doc.sku) {
    doc.sku = doc.inventory.sku;
  }

  // Sync stock
  if (doc.inventory?.stock != null) {
    doc.stockQuantity = doc.inventory.stock;
  }

  // Sync visibility to legacy
  if (doc.visibility) {
    doc.featured = doc.visibility.showInBestSellers;
    doc.trending = doc.visibility.showInTrending;
    doc.showOnHome = doc.visibility.showOnHome;
  }
});

ProductSchema.index({ category: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ 'visibility.showInBestSellers': 1 });
ProductSchema.index({ 'visibility.showInTrending': 1 });
ProductSchema.index({ 'visibility.showInSiddh': 1 });
ProductSchema.index({ purposeTags: 1 });
ProductSchema.index({ zodiacSigns: 1 });

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
