import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Booking from "@/models/Booking";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const { payoutAmount, utrNumber, note } = body;

        await connectDB();

        const booking = await Booking.findById(id);
        if (!booking) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        const razorpayFee = booking.amountPaid * 0.02; // Roughly 2% gateway fee
        const platformFee = booking.amountPaid - razorpayFee - payoutAmount;

        booking.panditPayoutStatus = "paid";
        booking.panditPayoutAmount = payoutAmount;
        booking.panditPayoutUtr = utrNumber;
        booking.panditPayoutDate = new Date();
        booking.platformFee = Math.max(0, platformFee);
        booking.razorpayFee = razorpayFee;

        if (note) {
            booking.statusHistory.push({
                status: booking.status,
                note: `Payout: ${note}`,
                at: new Date()
            });
        }

        await booking.save();

        return NextResponse.json({ success: true, booking });
    } catch (error) {
        console.error("Error updating pandit payout:", error);
        return NextResponse.json({ error: "Failed to update payout" }, { status: 500 });
    }
}
