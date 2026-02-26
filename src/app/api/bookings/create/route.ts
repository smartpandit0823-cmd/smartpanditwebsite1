import { NextRequest, NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/jwt/user-session";
import connectDB from "@/lib/db/mongodb";
import Booking from "@/models/Booking";
import Puja from "@/models/Puja";
import Payment from "@/models/Payment";
import { createRazorpayOrder } from "@/lib/razorpay";
import { logApiError } from "@/lib/api-logger";
import { z } from "zod";

const BodySchema = z.object({
    pujaId: z.string(),
    packageName: z.string(),
    date: z.string(), // ISO date
    time: z.string(),
    address: z.string(),
    addressId: z.string().optional(),
    notes: z.string().optional(),
    paymentType: z.enum(["advance", "full"]),
});

export async function POST(req: NextRequest) {
    try {
        const session = await getUserFromCookie();
        if (!session) {
            return NextResponse.json({ error: "Please login to book" }, { status: 401 });
        }

        const body = await req.json();
        const parsed = BodySchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid booking data", details: parsed.error.flatten() }, { status: 400 });
        }

        const { pujaId, packageName, date, time, address, addressId, notes, paymentType } = parsed.data;

        await connectDB();

        // Get puja details for pricing
        const puja = await Puja.findById(pujaId).lean();
        if (!puja) {
            return NextResponse.json({ error: "Puja not found" }, { status: 404 });
        }

        // Find package
        const pkg = puja.packages?.find((p: { name: string }) => p.name.toLowerCase() === packageName.toLowerCase());
        if (!pkg) {
            return NextResponse.json({ error: "Package not found" }, { status: 404 });
        }

        const totalAmount = pkg.price;
        const advanceAmount = puja.bookingSettings?.advanceAmount || 0;
        const fullPaymentRequired = puja.bookingSettings?.fullPaymentRequired || false;

        // Determine payment amount
        let payAmount: number;
        let finalPaymentType: "advance" | "full";

        if (fullPaymentRequired || advanceAmount <= 0) {
            payAmount = totalAmount;
            finalPaymentType = "full";
        } else if (paymentType === "advance" && advanceAmount > 0) {
            payAmount = advanceAmount;
            finalPaymentType = "advance";
        } else {
            payAmount = totalAmount;
            finalPaymentType = "full";
        }

        // Create booking
        const booking = await Booking.create({
            userId: session.userId,
            pujaId,
            package: packageName,
            date: new Date(date),
            time,
            address,
            addressId: addressId || undefined,
            notes,
            status: "payment_pending",
            paymentStatus: "pending",
            paymentType: finalPaymentType,
            amount: totalAmount,
            advanceAmount: advanceAmount,
            amountPaid: 0,
            statusHistory: [{ status: "payment_pending", at: new Date(), note: "Booking created, awaiting payment" }],
        });

        // Create Razorpay order
        const rzpOrder = await createRazorpayOrder(
            payAmount,
            "INR",
            `sp_booking_${booking._id}`,
            {
                entityType: "booking",
                entityId: booking._id.toString(),
                bookingId: booking.bookingId,
            }
        );

        // Create payment record
        await Payment.create({
            entityType: "booking",
            entityId: booking._id,
            amount: payAmount,
            currency: "INR",
            status: "created",
            razorpayOrderId: rzpOrder.orderId,
            userId: session.userId,
        });

        // Update booking with razorpay order
        await Booking.findByIdAndUpdate(booking._id, {
            razorpayOrderId: rzpOrder.orderId,
        });

        return NextResponse.json({
            success: true,
            bookingId: booking.bookingId,
            bookingDbId: booking._id.toString(),
            orderId: rzpOrder.orderId,
            amount: payAmount,
            totalAmount,
            advanceAmount,
            paymentType: finalPaymentType,
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            pujaName: puja.name,
        });
    } catch (e) {
        logApiError("/api/bookings/create", "POST", e);
        return NextResponse.json({ error: "Booking creation failed" }, { status: 500 });
    }
}
