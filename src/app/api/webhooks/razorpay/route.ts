import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db/mongodb";
import Transaction from "@/models/Transaction";

const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || "";

function verifyWebhookSignature(body: string, signature: string): boolean {
  const expected = crypto.createHmac("sha256", WEBHOOK_SECRET).update(body).digest("hex");
  return expected === signature;
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature") || "";

    if (WEBHOOK_SECRET && !verifyWebhookSignature(rawBody, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    if (event === "payment.captured") {
      const payment = payload.payload.payment.entity;
      await connectDB();

      await Transaction.findOneAndUpdate(
        { razorpayOrderId: payment.order_id },
        {
          razorpayPaymentId: payment.id,
          status: "captured",
          $unset: { razorpaySignature: 1 },
        }
      );
    }

    if (event === "refund.created") {
      const refund = payload.payload.refund.entity;
      await connectDB();

      await Transaction.findOneAndUpdate(
        { razorpayPaymentId: refund.payment_id },
        {
          status: "refunded",
          refundId: refund.id,
          refundAmount: refund.amount / 100,
          refundedAt: new Date(),
        }
      );
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Razorpay webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
