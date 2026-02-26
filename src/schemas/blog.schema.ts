import { z } from "zod";

export const CreateBlogSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().min(20, "Content is required"),
  featuredImage: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).default([]),
  author: z.string().min(1, "Author is required"),
  status: z.enum(["draft", "published"]).default("draft"),
  seo: z.object({
    seoTitle: z.string().default(""),
    metaDescription: z.string().default(""),
    keywords: z.array(z.string()).default([]),
  }),
  relatedPujas: z.array(z.string()).default([]),
});

export const UpdateBlogSchema = CreateBlogSchema.partial();

export type CreateBlogInput = z.infer<typeof CreateBlogSchema>;
export type UpdateBlogInput = z.infer<typeof UpdateBlogSchema>;
