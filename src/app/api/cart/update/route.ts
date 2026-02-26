import { NextRequest, NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/jwt/user-session";
import connectDB from "@/lib/db/mongodb";
import Cart from "@/models/Cart";
import { z } from "zod";

const BodySchema = z.object({
  productId: z.string(),
  quantity: z.number().min(0),
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

    const cart = await Cart.findOne({ userId: session.userId });
    if (!cart) {
      return NextResponse.json({ error: "Cart empty" }, { status: 400 });
    }

    if (parsed.data.quantity === 0) {
      cart.items = cart.items.filter((i) => i.productId.toString() !== parsed.data.productId);
    } else {
      const idx = cart.items.findIndex((i) => i.productId.toString() === parsed.data.productId);
      if (idx >= 0) cart.items[idx].quantity = parsed.data.quantity;
    }
    await cart.save();

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
