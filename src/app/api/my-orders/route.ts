import { NextRequest, NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/jwt/user-session";
import connectDB from "@/lib/db/mongodb";
import Order from "@/models/Order";

export async function GET(req: NextRequest) {
  try {
    const session = await getUserFromCookie();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "20"));

    await connectDB();

    // Only show orders that are not "created" with "pending" payment (incomplete checkouts)
    const filter = {
      userId: session.userId,
      $or: [
        { paymentStatus: "paid" },
        { paymentStatus: "refunded" },
        { status: { $ne: "created" } },
        // COD orders have status "paid" set by admin or "processing"
        { paymentStatus: "pending", status: { $in: ["paid", "processing", "shipped", "delivered"] } },
      ],
    };

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .select("items totalAmount shippingFee status paymentStatus shippingAddress trackingId delhiveryWaybill delhiveryStatus createdAt updatedAt")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Order.countDocuments(filter),
    ]);

    return NextResponse.json({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: orders.map((o: any) => ({
        id: o._id.toString(),
        totalAmount: o.totalAmount,
        shippingFee: o.shippingFee || 0,
        status: o.status,
        paymentStatus: o.paymentStatus,
        items: (o.items || []).map((item: { name: string; price: number; quantity: number; image?: string }) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || "",
        })),
        itemCount: o.items?.length ?? 0,
        shippingAddress: o.shippingAddress || null,
        trackingId: o.trackingId || null,
        delhiveryWaybill: o.delhiveryWaybill || null,
        delhiveryStatus: o.delhiveryStatus || null,
        createdAt: o.createdAt,
        updatedAt: o.updatedAt,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
