import { NextRequest, NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/jwt/user-session";
import connectDB from "@/lib/db/mongodb";
import Puja from "@/models/Puja";
import Booking from "@/models/Booking";
import Notification from "@/models/Notification";
import { logApiError } from "@/lib/api-logger";
import { z } from "zod";

const BodySchema = z.object({
  pujaId: z.string(),
  package: z.string(),
  date: z.string(),
  time: z.string(),
  address: z.string().min(10),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getUserFromCookie();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }

    const { pujaId, package: pkg, date, time, address, notes } = parsed.data;

    await connectDB();

    const puja = await Puja.findOne({ _id: pujaId, status: "active" });
    if (!puja) {
      return NextResponse.json({ error: "Puja not found" }, { status: 404 });
    }

    const pkgFound = puja.packages?.find((p: { name: string }) => p.name === pkg);
    if (!pkgFound) {
      return NextResponse.json({ error: "Invalid package" }, { status: 400 });
    }

    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const nextDay = new Date(d);
    nextDay.setDate(nextDay.getDate() + 1);

    const booked = await Booking.countDocuments({
      pujaId,
      date: { $gte: d, $lt: nextDay },
      status: { $nin: ["cancelled"] },
    });
    if (booked >= (puja.maxBookingsPerDay || 10)) {
      return NextResponse.json({ error: "No slots available for this date" }, { status: 400 });
    }

    const booking = await Booking.create({
      userId: session.userId,
      pujaId,
      package: pkg,
      date: d,
      time,
      address,
      notes,
      amount: pkgFound.price,
      status: "requested",
      paymentStatus: "pending",
      statusHistory: [{ status: "requested", at: new Date(), note: "Booking created" }],
    });

    await Notification.create({
      userId: session.userId,
      title: "Booking Requested",
      message: `Your ${puja.name} booking is requested. Complete payment to confirm.`,
      read: false,
    });

    return NextResponse.json({
      success: true,
      booking: {
        id: booking._id.toString(),
        pujaId,
        pujaName: puja.name,
        package: pkg,
        date: d.toISOString(),
        time,
        amount: pkgFound.price,
        status: "requested",
        paymentStatus: "pending",
      },
    });
  } catch (e) {
    logApiError("/api/puja/book", "POST", e);
    return NextResponse.json({ error: "Booking failed" }, { status: 500 });
  }
}
