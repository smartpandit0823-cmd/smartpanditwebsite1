import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Testimonial from "@/models/Testimonial";

// GET /api/admin/testimonials
export async function GET() {
    try {
        await connectDB();
        const testimonials = await Testimonial.find({}).sort({ createdAt: -1 }).lean();
        return NextResponse.json({ success: true, data: testimonials });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST /api/admin/testimonials — Admin adds a video testimonial
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();

        const { name, title, type, videoUrl, thumbnailUrl, text, rating, status, featured } = body;

        if (!name || !title) {
            return NextResponse.json({ success: false, error: "Name and title are required" }, { status: 400 });
        }

        const testimonial = await Testimonial.create({
            name,
            title,
            type: type || "video",
            videoUrl,
            thumbnailUrl,
            text,
            rating: rating || 5,
            status: status || "active",
            featured: featured || false,
        });

        return NextResponse.json({ success: true, data: testimonial }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
