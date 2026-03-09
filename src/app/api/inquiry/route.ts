import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Inquiry from "@/models/Inquiry";
import { z } from "zod";

const InquirySchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email().optional().or(z.literal("")),
  service: z.string().min(1, "Please select a service"),
  message: z.string().min(5, "Message is required"),
  city: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = InquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
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
