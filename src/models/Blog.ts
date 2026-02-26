import mongoose, { Document, Model, Schema } from "mongoose";

export type BlogStatus = "draft" | "published" | "deleted";

export interface IBlog extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  author: string;
  authorId?: mongoose.Types.ObjectId;
  status: BlogStatus;
  publishedAt?: Date;
  seo: { seoTitle: string; metaDescription: string; keywords: string[] };
  views: number;
  relatedPujas: mongoose.Types.ObjectId[];
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    excerpt: { type: String },
    content: { type: String, required: true },
    featuredImage: { type: String },
    category: { type: String, required: true },
    tags: [{ type: String }],
    author: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: "AdminUser" },
    status: { type: String, enum: ["draft", "published", "deleted"], default: "draft" },
    publishedAt: { type: Date },
    seo: {
      seoTitle: { type: String, default: "" },
      metaDescription: { type: String, default: "" },
      keywords: [{ type: String }],
    },
    views: { type: Number, default: 0 },
    relatedPujas: [{ type: Schema.Types.ObjectId, ref: "Puja" }],
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

BlogSchema.index({ slug: 1 });
BlogSchema.index({ status: 1 });
BlogSchema.index({ category: 1 });
BlogSchema.index({ title: "text" });

const Blog: Model<IBlog> = mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;
