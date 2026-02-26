import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import AnalyticsEvent from "@/models/AnalyticsEvent";

// POST - Track analytics event (public, no auth required)
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();

        const { event, sessionId, userId, page, referrer, device, browser, metadata, revenue, revenueSource } = body;

        if (!event || !sessionId) {
            return NextResponse.json({ error: "event and sessionId required" }, { status: 400 });
        }

        // Get IP from headers
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

        await AnalyticsEvent.create({
            event,
            sessionId,
            userId: userId || undefined,
            page,
            referrer,
            device,
            browser,
            ip,
            metadata,
            revenue,
            revenueSource,
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to track";
        return NextResponse.json({ error: message }, { status: 400 });
    }
}
