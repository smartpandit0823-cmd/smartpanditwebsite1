import { NextRequest, NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/jwt/user-session";
import connectDB from "@/lib/db/mongodb";
import Booking from "@/models/Booking";

export async function GET(req: NextRequest) {
  try {
    const session = await getUserFromCookie();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "20"));

    await connectDB();

    const filter: Record<string, unknown> = { userId: session.userId };
    if (status) filter.status = status;

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate("pujaId", "name slug images category")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Booking.countDocuments(filter),
    ]);

    return NextResponse.json({
      data: bookings.map((b) => {
        const puja = b.pujaId as { name: string; slug: string; images: string[] } | null;
        return {
          id: b._id.toString(),
          pujaName: puja?.name,
          pujaSlug: puja?.slug,
          pujaImage: puja?.images?.[0],
          package: b.package,
          date: b.date,
          time: b.time,
          status: b.status,
          paymentStatus: b.paymentStatus,
          amount: b.amount,
        };
      }),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
