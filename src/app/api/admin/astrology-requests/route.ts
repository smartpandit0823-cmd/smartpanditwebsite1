import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import AstrologyRequest from "@/models/AstrologyRequest";
import { auth } from "@/auth";
import { logApiError } from "@/lib/api-logger";

export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const limit = parseInt(req.nextUrl.searchParams.get("limit") || "50");

        const requests = await AstrologyRequest.find({})
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

        return NextResponse.json({ requests });
    } catch (error) {
        logApiError("/api/admin/astrology-requests", "GET", error);
        return NextResponse.json(
            { error: "Failed to fetch astrology requests" },
            { status: 500 }
        );
    }
}
