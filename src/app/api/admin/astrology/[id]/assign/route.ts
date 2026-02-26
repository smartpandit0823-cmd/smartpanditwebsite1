import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import AstroRequest from "@/models/AstroRequest";
import Notification from "@/models/Notification";
import { z } from "zod";

const BodySchema = z.object({
  astrologerId: z.string(),
  finalCallTime: z.string().optional(),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

    await connectDB();

    const update: Record<string, unknown> = {
      assignedAstrologerId: parsed.data.astrologerId,
      $push: { statusHistory: parsed.data.finalCallTime
        ? { status: "confirmed", at: new Date() }
        : { status: "assigned", at: new Date() } },
    };
    update.status = parsed.data.finalCallTime ? "confirmed" : "assigned";
    if (parsed.data.finalCallTime) update.finalCallTime = new Date(parsed.data.finalCallTime);

    const astroReq = await AstroRequest.findByIdAndUpdate(id, update, { new: true });
    if (!astroReq) return NextResponse.json({ error: "Request not found" }, { status: 404 });

    await Notification.create({
      userId: astroReq.userId,
      title: "Astrologer Assigned",
      message: parsed.data.finalCallTime
        ? `Your call is scheduled for ${new Date(parsed.data.finalCallTime).toLocaleString()}.`
        : "An astrologer has been assigned. Your call time will be confirmed soon.",
      read: false,
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Assign failed" }, { status: 500 });
  }
}
