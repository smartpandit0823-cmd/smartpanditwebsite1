import { NextRequest, NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/jwt/user-session";
import connectDB from "@/lib/db/mongodb";
import Cart from "@/models/Cart";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { logApiError } from "@/lib/api-logger";
import { z } from "zod";

const BodySchema = z.object({
  shippingAddress: z.object({
    name: z.string(),
    phone: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
  }),
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

    await connectDB();

    const cart = await Cart.findOne({ userId: session.userId }).populate("items.productId");
    if (!cart || !cart.items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const items: { productId: import("mongoose").Types.ObjectId; name: string; price: number; quantity: number; image?: string }[] = [];
    let totalAmount = 0;

    for (const ci of cart.items) {
      const p = ci.productId as { _id: import("mongoose").Types.ObjectId; name: string; mainImage?: string; pricing?: { sellingPrice: number } };
      const price = p?.pricing?.sellingPrice ?? 0;
      items.push({
        productId: p._id,
        name: p?.name ?? "",
        price,
        quantity: ci.quantity,
        image: p?.mainImage,
      });
      totalAmount += price * ci.quantity;
    }

    const order = await Order.create({
      userId: session.userId,
      items,
      totalAmount,
      status: "created",
      paymentStatus: "pending",
      shippingAddress: parsed.data.shippingAddress,
    });

    await Cart.findByIdAndUpdate(cart._id, { items: [] });

    return NextResponse.json({
      success: true,
      order: {
        id: order._id.toString(),
        totalAmount,
        status: "created",
      },
    });
  } catch (e) {
    logApiError("/api/order/create", "POST", e);
    return NextResponse.json({ error: "Order failed" }, { status: 500 });
  }
}
