import { NextRequest, NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/jwt/user-session";
import connectDB from "@/lib/db/mongodb";
import Cart from "@/models/Cart";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { logApiError } from "@/lib/api-logger";
import { z } from "zod";
import { createShipment } from "@/lib/shipping/delhivery";

const BodySchema = z.object({
  paymentMethod: z.enum(["razorpay", "cod"]).default("razorpay"),
  shippingAddress: z.object({
    name: z.string(),
    phone: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
  }),
  // Buy Now: skip cart, use a single product directly
  buyNow: z.object({
    productId: z.string(),
    quantity: z.number().int().min(1).max(10),
  }).optional(),
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

    const items: { productId: import("mongoose").Types.ObjectId; name: string; price: number; quantity: number; image?: string }[] = [];
    let itemsSubtotal = 0;
    let totalWeightGrams = 0;

    if (parsed.data.buyNow) {
      // ── Buy Now flow: single product, skip cart ──
      const product = await Product.findById(parsed.data.buyNow.productId)
        .select("name mainImage pricing inventory")
        .lean();

      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }

      const price = (product as any)?.pricing?.sellingPrice ?? 0;
      const qty = parsed.data.buyNow.quantity;
      items.push({
        productId: (product as any)._id,
        name: (product as any)?.name ?? "",
        price,
        quantity: qty,
        image: (product as any)?.mainImage,
      });
      itemsSubtotal = price * qty;
      totalWeightGrams = 500 * qty;
    } else {
      // ── Cart flow ──
      const cart = await Cart.findOne({ userId: session.userId }).populate("items.productId");
      if (!cart || !cart.items?.length) {
        return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
      }

      for (const ci of cart.items) {
        const p = ci.productId as unknown as { _id: import("mongoose").Types.ObjectId; name: string; mainImage?: string; pricing?: { sellingPrice: number } };
        const price = p?.pricing?.sellingPrice ?? 0;
        items.push({
          productId: p._id,
          name: p?.name ?? "",
          price,
          quantity: ci.quantity,
          image: p?.mainImage,
        });
        itemsSubtotal += price * ci.quantity;
        totalWeightGrams += 500 * ci.quantity;
      }

      // Clear cart after building items
      await Cart.findByIdAndUpdate(cart._id, { items: [] });
    }

    let shippingFee = 0;
    if (itemsSubtotal < 499) {
      // Calculate dynamic dispatch cost via Delhivery
      const pincodeRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/shipping/pincode?pincode=${parsed.data.shippingAddress.pincode}&weight=${totalWeightGrams}`);
      if (pincodeRes.ok) {
        const data = await pincodeRes.json();
        if (data.serviceable && data.shippingCharge) {
          shippingFee = data.shippingCharge;
        } else {
          shippingFee = 49; // Fallback
        }
      } else {
        shippingFee = 49; // Network fallback
      }
    }

    const totalAmount = itemsSubtotal + shippingFee;

    const order = await Order.create({
      userId: session.userId,
      items,
      totalAmount,
      shippingFee,
      status: "created",
      paymentStatus: "pending",
      shippingAddress: parsed.data.shippingAddress,
    });

    if (parsed.data.paymentMethod === "cod") {
      const shipmentRes = await createShipment({
        orderId: order._id.toString(),
        customerName: parsed.data.shippingAddress.name,
        customerPhone: parsed.data.shippingAddress.phone,
        customerAddress: parsed.data.shippingAddress.address,
        customerCity: parsed.data.shippingAddress.city,
        customerState: parsed.data.shippingAddress.state,
        customerPincode: parsed.data.shippingAddress.pincode,
        paymentMode: "COD",
        codAmount: totalAmount,
        totalAmount: totalAmount,
        productDesc: items.map((i) => i.name).join(", "),
        weight: totalWeightGrams,
        quantity: items.reduce((acc, i) => acc + i.quantity, 0),
      });

      if (shipmentRes.success && shipmentRes.waybill) {
        order.delhiveryWaybill = shipmentRes.waybill;
        order.delhiveryStatus = "Manifested";
        order.status = "processing";
        await order.save();
      }
    }

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
