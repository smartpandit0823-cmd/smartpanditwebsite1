import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Booking from "@/models/Booking";
import Notification from "@/models/Notification";
import { z } from "zod";

const BodySchema = z.object({
  panditId: z.string(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    await connectDB();

    const booking = await Booking.findByIdAndUpdate(
      id,
      {
        assignedPanditId: parsed.data.panditId,
        status: "assigned",
        $push: { statusHistory: { status: "assigned", at: new Date(), note: "Pandit assigned by admin" } },
      },
      { new: true }
    );

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    await Notification.create({
      userId: booking.userId,
      title: "Pandit Assigned",
      message: "A pandit has been assigned to your booking. You will be contacted soon.",
      read: false,
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Assign failed" }, { status: 500 });
  }
}
