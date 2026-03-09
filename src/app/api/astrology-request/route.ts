import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import AstrologyRequest from "@/models/AstrologyRequest";
import { z } from "zod";

const FormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Valid phone number required"),
    birthDate: z.string().min(1, "Birth date is required"),
    birthTime: z.string().optional(),
    birthPlace: z.string().min(2, "Birth place is required"),
    problemCategory: z.string().min(1, "Please select a category"),
    notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsed = FormSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid input data", details: parsed.error.issues },
                { status: 400 }
            );
        }

        await connectDB();

        const requestData = {
            ...parsed.data,
            status: "requested",
            priority: "normal",
            sessionType: 30 as const, // Default fallback
            paymentStatus: "pending",
        };

        const newRequest = await AstrologyRequest.create(requestData);

        return NextResponse.json({
            success: true,
            message: "Request submitted successfully. Our astrologer will contact you in 1 hours.",
            data: newRequest,
        });
    } catch (error) {
        console.error("Astrology Request Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
