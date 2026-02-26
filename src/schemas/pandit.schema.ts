import { z } from "zod";

export const CreatePanditSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone required"),
  photo: z.string().optional(),
  dateOfBirth: z.string().optional(),
  specializations: z.array(z.string()).default([]),
  languagesSpoken: z.array(z.string()).default([]),
  experience: z.coerce.number().min(0).default(0),
  education: z.string().optional(),
  bio: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  address: z.string().optional(),
  pincode: z.string().optional(),
  verificationStatus: z.enum(["pending", "verified", "rejected"]).default("pending"),
  status: z.enum(["active", "inactive", "suspended"]).default("active"),
  availability: z.object({
    monday: z.boolean().default(true),
    tuesday: z.boolean().default(true),
    wednesday: z.boolean().default(true),
    thursday: z.boolean().default(true),
    friday: z.boolean().default(true),
    saturday: z.boolean().default(true),
    sunday: z.boolean().default(false),
  }),
  bankDetails: z.object({
    accountNumber: z.string().optional(),
    ifscCode: z.string().optional(),
    bankName: z.string().optional(),
    accountHolderName: z.string().optional(),
  }).optional(),
});

export const UpdatePanditSchema = CreatePanditSchema.partial();

export type CreatePanditInput = z.infer<typeof CreatePanditSchema>;
export type UpdatePanditInput = z.infer<typeof UpdatePanditSchema>;
