import { z } from "zod";

export const CreateCouponSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 chars").toUpperCase(),
  description: z.string().optional(),
  type: z.enum(["flat", "percent"]),
  value: z.coerce.number().min(1, "Value must be positive"),
  minOrderAmount: z.coerce.number().min(0).default(0),
  maxDiscountAmount: z.coerce.number().optional(),
  usageLimit: z.coerce.number().min(1).default(100),
  perUserLimit: z.coerce.number().min(1).default(1),
  applicableTo: z.enum(["all", "pujas", "products", "astrology"]).default("all"),
  applicableIds: z.array(z.string()).default([]),
  startsAt: z.string().optional(),
  expiresAt: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});

export const UpdateCouponSchema = CreateCouponSchema.partial();

export type CreateCouponInput = z.infer<typeof CreateCouponSchema>;
export type UpdateCouponInput = z.infer<typeof UpdateCouponSchema>;
