import { z } from "zod";

export const CreateBannerSchema = z.object({
  title: z.string().min(2, "Title is required"),
  subtitle: z.string().optional(),
  image: z.string().min(1, "Image is required"),
  mobileImage: z.string().optional(),
  link: z.string().optional(),
  position: z.enum(["home", "puja", "store", "astrology"]).default("home"),
  status: z.enum(["active", "inactive"]).default("active"),
  order: z.coerce.number().default(0),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
});

export const UpdateBannerSchema = CreateBannerSchema.partial();

export type CreateBannerInput = z.infer<typeof CreateBannerSchema>;
export type UpdateBannerInput = z.infer<typeof UpdateBannerSchema>;
