import { z } from "zod";

export const CreateFestivalSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  endDate: z.string().optional(),
  type: z.enum(["festival", "muhurat", "auspicious", "ekadashi", "purnima", "amavasya"]).default("festival"),
  isRecurring: z.boolean().default(false),
  recurrencePattern: z.string().optional(),
  suggestedPujas: z.array(z.string()).default([]),
  isAuspicious: z.boolean().default(true),
  timing: z.string().optional(),
  nakshatra: z.string().optional(),
  tithi: z.string().optional(),
  importance: z.string().optional(),
});

export const UpdateFestivalSchema = CreateFestivalSchema.partial();

export type CreateFestivalInput = z.infer<typeof CreateFestivalSchema>;
export type UpdateFestivalInput = z.infer<typeof UpdateFestivalSchema>;
