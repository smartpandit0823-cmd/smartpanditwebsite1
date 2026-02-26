import { NextRequest, NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/jwt/user-session";
import connectDB from "@/lib/db/mongodb";
import Payment from "@/models/Payment";
import Booking from "@/models/Booking";
import Order from "@/models/Order";
import AstroRequest from "@/models/AstroRequest";
import Notification from "@/models/Notification";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { logApiError } from "@/lib/api-logger";
import { z } from "zod";

const BodySchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
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
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

    const valid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!valid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    await connectDB();

    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
      userId: session.userId,
    });
    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }
    if (payment.status === "captured") {
      return NextResponse.json({ success: true, entityType: payment.entityType, entityId: payment.entityId.toString() });
    }

    await Payment.findByIdAndUpdate(payment._id, {
      status: "captured",
      razorpayPaymentId: razorpay_payment_id,
      gatewayData: { verifiedAt: new Date() },
    });

    if (payment.entityType === "booking") {
      const booking = await Booking.findById(payment.entityId);
      if (booking) {
        const newAmountPaid = (booking.amountPaid || 0) + payment.amount;
        const isFullyPaid = newAmountPaid >= booking.amount;

        await Booking.findByIdAndUpdate(payment.entityId, {
          status: "confirmed",
          paymentStatus: isFullyPaid ? "paid" : "partial",
          amountPaid: newAmountPaid,
          razorpayPaymentId: razorpay_payment_id,
          $push: {
            statusHistory: {
              status: "confirmed",
              at: new Date(),
              note: isFullyPaid ? "Full payment verified" : `Advance payment of ₹${payment.amount} verified`,
            },
          },
        });
      }
      await Notification.create({
        userId: payment.userId,
        title: "Booking Confirmed",
        message: "Your puja booking payment is confirmed. Our team will assign a pandit soon.",
        read: false,
      });
    } else if (payment.entityType === "order") {
      await Order.findByIdAndUpdate(payment.entityId, {
        status: "paid",
        paymentStatus: "paid",
        razorpayPaymentId: razorpay_payment_id,
      });
      await Notification.create({
        userId: payment.userId,
        title: "Order Placed",
        message: "Your order payment is confirmed. We will process it shortly.",
        read: false,
      });
    } else if (payment.entityType === "astro") {
      await AstroRequest.findByIdAndUpdate(payment.entityId, {
        status: "paid",
        paymentStatus: "paid",
        razorpayPaymentId: razorpay_payment_id,
        $push: { statusHistory: { status: "paid", at: new Date() } },
      });
      await Notification.create({
        userId: payment.userId,
        title: "Consultation Confirmed",
        message: "Your astrology consultation payment is confirmed. Our astrologer will be assigned soon.",
        read: false,
      });
    }

    return NextResponse.json({
      success: true,
      entityType: payment.entityType,
      entityId: payment.entityId.toString(),
    });
  } catch (e) {
    logApiError("/api/payment/verify", "POST", e);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
