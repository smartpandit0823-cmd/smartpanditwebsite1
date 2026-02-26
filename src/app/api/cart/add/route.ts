import { NextRequest, NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/jwt/user-session";
import connectDB from "@/lib/db/mongodb";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { logApiError } from "@/lib/api-logger";
import { z } from "zod";

const BodySchema = z.object({
  productId: z.string(),
  quantity: z.number().min(1),
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

    const product = await Product.findOne({ _id: parsed.data.productId, status: "published" });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    if (!product.inventory?.inStock || (product.inventory?.stock ?? 0) < parsed.data.quantity) {
      return NextResponse.json({ error: "Out of stock" }, { status: 400 });
    }

    const price = product.pricing?.sellingPrice ?? product.pricing?.mrp ?? 0;

    let cart = await Cart.findOne({ userId: session.userId });
    if (!cart) {
      cart = await Cart.create({ userId: session.userId, items: [] });
    }

    const existingIdx = cart.items.findIndex(
      (i) => i.productId.toString() === parsed.data.productId
    );
    if (existingIdx >= 0) {
      cart.items[existingIdx].quantity += parsed.data.quantity;
    } else {
      cart.items.push({
        productId: product._id,
        quantity: parsed.data.quantity,
        price,
      });
    }
    await cart.save();

    return NextResponse.json({ success: true });
  } catch (e) {
    logApiError("/api/cart/add", "POST", e);
    return NextResponse.json({ error: "Add to cart failed" }, { status: 500 });
  }
}
