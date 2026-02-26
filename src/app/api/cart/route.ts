import { NextRequest, NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/jwt/user-session";
import connectDB from "@/lib/db/mongodb";
import Cart from "@/models/Cart";
import Product from "@/models/Product";

export async function GET() {
  try {
    const session = await getUserFromCookie();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const cart = await Cart.findOne({ userId: session.userId })
      .populate("items.productId", "name mainImage pricing inventory")
      .lean();

    const items = (cart?.items || []).map((item: { productId: unknown; quantity: number; price: number }) => {
      const p = item.productId as { _id: string; name: string; mainImage: string; pricing: { sellingPrice: number }; inventory?: { inStock: boolean } } | null;
      return {
        productId: p?._id,
        name: p?.name,
        image: p?.mainImage,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
        inStock: p?.inventory?.inStock ?? true,
      };
    });

    const total = items.reduce((s: number, i: { subtotal: number }) => s + i.subtotal, 0);

    return NextResponse.json({ items, total });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}
