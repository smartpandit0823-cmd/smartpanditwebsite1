import { NextRequest, NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/jwt/user-session";
import connectDB from "@/lib/db/mongodb";
import Payment from "@/models/Payment";
import { createRazorpayOrder } from "@/lib/razorpay";
import { logApiError } from "@/lib/api-logger";
import { z } from "zod";

const ENTITY_TYPES = ["booking", "order", "astro"] as const;

const BodySchema = z.object({
  entityType: z.enum(ENTITY_TYPES),
  entityId: z.string(),
  amount: z.number().min(1),
  currency: z.string().default("INR"),
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

    const { entityType, entityId, amount, currency } = parsed.data;

    await connectDB();

    const existing = await Payment.findOne({
      entityType,
      entityId,
      status: { $in: ["created", "captured"] },
    });
    if (existing) {
      return NextResponse.json({
        orderId: existing.razorpayOrderId,
        amount: existing.amount,
      });
    }

    const order = await createRazorpayOrder(
      amount,
      currency,
      `sp_${entityType}_${entityId}`,
      { entityType, entityId }
    );

    await Payment.create({
      entityType,
      entityId,
      amount,
      currency,
      status: "created",
      razorpayOrderId: order.orderId,
      userId: session.userId,
    });

    return NextResponse.json({
      orderId: order.orderId,
      amount: amount,
      amountInPaise: order.amount,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (e) {
    logApiError("/api/payment/create", "POST", e);
    return NextResponse.json({ error: "Payment create failed" }, { status: 500 });
  }
}
