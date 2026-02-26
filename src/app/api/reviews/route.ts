import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Review from "@/models/Review";

// GET /api/reviews?targetId=xxx&targetModel=Puja
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const targetId = searchParams.get("targetId");
        const targetModel = searchParams.get("targetModel");

        const filter: any = { status: "approved" };
        if (targetId) filter.targetId = targetId;
        if (targetModel) filter.targetModel = targetModel;

        const reviews = await Review.find(filter)
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();

        return NextResponse.json({ success: true, data: reviews });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST /api/reviews — User submits a review
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();

        const { targetId, targetModel, customerName, customerEmail, rating, title, comment } = body;

        if (!targetId || !targetModel || !customerName || !customerEmail || !rating || !comment) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json({ success: false, error: "Rating must be between 1 and 5" }, { status: 400 });
        }

        const review = await Review.create({
            targetId,
            targetModel,
            customerName,
            customerEmail,
            rating: Number(rating),
            title,
            comment,
            status: "pending", // Admin must approve
            isVerifiedPurchase: false,
        });

        return NextResponse.json({ success: true, data: review, message: "Review submitted! It will be visible after admin approval." }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
