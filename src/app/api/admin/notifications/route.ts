import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Notification from "@/models/Notification";
import User from "@/models/User";

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await req.json();
    const { userId, title, message } = body;

    try {
        if (userId) {
            // Send to specific user
            await Notification.create({ userId, title, message });
            return NextResponse.json({ success: true, sent: 1 });
        } else {
            // Broadcast to all users
            const users = await User.find().select("_id").lean();
            const notifications = users.map((u) => ({
                userId: u._id,
                title,
                message,
            }));
            if (notifications.length > 0) {
                await Notification.insertMany(notifications);
            }
            return NextResponse.json({ success: true, sent: notifications.length });
        }
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to send";
        return NextResponse.json({ error: msg }, { status: 400 });
    }
}
