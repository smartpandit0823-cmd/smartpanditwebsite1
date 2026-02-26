import { NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/jwt/user-session";
import connectDB from "@/lib/db/mongodb";
import Booking from "@/models/Booking";
import PujaRequest from "@/models/PujaRequest";

// GET /api/user/bookings — all bookings for the logged-in user
export async function GET() {
    const session = await getUserFromCookie();
    if (!session) {
        return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    await connectDB();

    // Fetch puja bookings (only legitimate ones that are actually paid/partially paid)
    const pujaBookings = await Booking.find({ userId: session.userId, amountPaid: { $gt: 0 } })
        .populate("pujaId", "name slug")
        .sort({ createdAt: -1 })
        .lean();

    // Fetch puja requests (from request form)
    const pujaRequests = await PujaRequest.find({ "userInfo.phone": { $exists: true } })
        .populate("pujaId", "name slug")
        .sort({ createdAt: -1 })
        .lean();

    // Merge and normalize
    type BookingItem = {
        _id: string;
        bookingId?: string;
        type: string;
        title: string;
        date: string | undefined;
        status: string;
        amount: number;
        amountPaid: number;
        advanceAmount: number;
        paymentStatus: string;
        paymentType: string;
        packageName: string;
        createdAt: string | Date;
    };

    const bookings: BookingItem[] = [];

    for (const b of pujaBookings) {
        const puja = b.pujaId as unknown as { name?: string } | null;
        bookings.push({
            _id: b._id.toString(),
            bookingId: (b as unknown as { bookingId?: string }).bookingId || "",
            type: "puja",
            title: puja?.name || "Puja Booking",
            date: b.date ? new Date(b.date).toISOString() : undefined,
            status: b.status,
            amount: b.amount || 0,
            amountPaid: (b as unknown as { amountPaid?: number }).amountPaid || 0,
            advanceAmount: (b as unknown as { advanceAmount?: number }).advanceAmount || 0,
            paymentStatus: b.paymentStatus,
            paymentType: (b as unknown as { paymentType?: string }).paymentType || "full",
            packageName: (b as unknown as { package?: string }).package || "",
            createdAt: b.createdAt,
        });
    }

    // Sort by date
    bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ bookings });
}
