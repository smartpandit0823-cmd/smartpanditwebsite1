import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Booking from "@/models/Booking";
import Notification from "@/models/Notification";
import { z } from "zod";

const BOOKING_STATUSES = ["requested", "paid", "assigned", "inprogress", "completed", "submitted", "cancelled"] as const;

const BodySchema = z.object({
  status: z.enum(BOOKING_STATUSES),
  note: z.string().optional(),
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
        status: parsed.data.status,
        $push: { statusHistory: { status: parsed.data.status, at: new Date(), note: parsed.data.note } },
      },
      { new: true }
    );

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const msg: Record<string, string> = {
      completed: "Your puja has been completed. Thank you!",
      assigned: "A pandit has been assigned to your booking.",
      inprogress: "Your puja is in progress.",
    };
    if (msg[parsed.data.status]) {
      await Notification.create({
        userId: booking.userId,
        title: "Booking Update",
        message: msg[parsed.data.status],
        read: false,
      });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Status update failed" }, { status: 500 });
  }
}
