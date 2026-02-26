import { NextRequest, NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/jwt/user-session";
import connectDB from "@/lib/db/mongodb";
import Notification from "@/models/Notification";

export async function GET(req: NextRequest) {
  try {
    const session = await getUserFromCookie();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "20"));
    const unreadOnly = searchParams.get("unread") === "true";

    await connectDB();

    const filter: Record<string, unknown> = { userId: session.userId };
    if (unreadOnly) filter.read = false;

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({
      data: notifications.map((n) => ({
        id: n._id.toString(),
        title: n.title,
        message: n.message,
        read: n.read,
        createdAt: n.createdAt,
      })),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}
