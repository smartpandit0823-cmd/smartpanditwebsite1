import { NextRequest, NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/jwt/user-session";
import connectDB from "@/lib/db/mongodb";
import Booking from "@/models/Booking";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getUserFromCookie();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const booking = await Booking.findOne({ _id: id, userId: session.userId })
      .populate("pujaId", "name slug images category")
      .populate("assignedPanditId", "name phone")
      .lean();

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const puja = booking.pujaId as { name: string; slug: string; images: string[]; category: string } | null;
    const pandit = booking.assignedPanditId as { name: string; phone: string } | null;

    return NextResponse.json({
      id: booking._id.toString(),
      pujaName: puja?.name,
      pujaSlug: puja?.slug,
      pujaImages: puja?.images,
      category: puja?.category,
      package: booking.package,
      date: booking.date,
      time: booking.time,
      address: booking.address,
      notes: booking.notes,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      amount: booking.amount,
      assignedPandit: pandit ? { name: pandit.name, phone: pandit.phone } : null,
      statusHistory: booking.statusHistory,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 });
  }
}
