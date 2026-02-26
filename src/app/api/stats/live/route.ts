import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Booking from "@/models/Booking";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
    try {
        await connectDB();

        const [totalBookings, todayBookings, activePandits] = await Promise.all([
            Booking.countDocuments({ status: { $nin: ["cancelled"] } }),
            Booking.countDocuments({
                createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
                status: { $nin: ["cancelled"] },
            }),
            Booking.distinct("assignedPanditId", { status: { $in: ["assigned", "inprogress"] } }).then((ids) => ids.length),
        ]);

        return NextResponse.json({
            totalBookings,
            todayBookings,
            activePandits,
        }, {
            headers: {
                "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
            },
        });
    } catch {
        return NextResponse.json({ totalBookings: 0, todayBookings: 0, activePandits: 0 });
    }
}
