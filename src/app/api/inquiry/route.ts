import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Inquiry from "@/models/Inquiry";
import { z } from "zod";

const InquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Valid 10-digit phone required"),
  email: z
    .union([z.string().email(), z.literal("")])
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  service: z.string().min(1, "Please select a service"),
  message: z.string().min(5, "Message must be at least 5 characters"),
  city: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = InquirySchema.safeParse(body);

    if (!parsed.success) {
      const flat = parsed.error.flatten();
      const firstError = flat.fieldErrors
        ? Object.entries(flat.fieldErrors)
            .map(([k, v]) => (Array.isArray(v) ? v[0] : v))
            .find(Boolean)
        : flat.formErrors?.[0];
      return NextResponse.json(
        {
          error: firstError || "Invalid input",
          details: flat,
        },
        { status: 400 }
      );
    }

    await connectDB();

    const inquiry = await Inquiry.create({
      ...parsed.data,
      phone: parsed.data.phone.replace(/\D/g, ""),
    });

    return NextResponse.json({
      success: true,
      id: inquiry._id.toString(),
      message: "Enquiry submitted successfully! Our team will contact you shortly.",
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to submit enquiry. Please try again." },
      { status: 500 }
    );
  }
}
