import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Puja from "@/models/Puja";
import Booking from "@/models/Booking";
import { z } from "zod";

const BodySchema = z.object({
  pujaId: z.string(),
  date: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { pujaId, date } = parsed.data;
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const nextDay = new Date(d);
    nextDay.setDate(nextDay.getDate() + 1);

    await connectDB();

    const puja = await Puja.findById(pujaId);
    if (!puja || puja.status !== "active") {
      return NextResponse.json({ error: "Puja not found" }, { status: 404 });
    }

    const booked = await Booking.countDocuments({
      pujaId,
      date: { $gte: d, $lt: nextDay },
      status: { $nin: ["cancelled"] },
    });

    const available = booked < (puja.maxBookingsPerDay || 10);

    return NextResponse.json({
      available,
      booked,
      maxPerDay: puja.maxBookingsPerDay || 10,
      slotsLeft: Math.max(0, (puja.maxBookingsPerDay || 10) - booked),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Check failed" }, { status: 500 });
  }
}
