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

    const [orders, total] = await Promise.all([
      Order.find({ userId: session.userId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Order.countDocuments({ userId: session.userId }),
    ]);

    return NextResponse.json({
      data: orders.map((o) => ({
        id: o._id.toString(),
        totalAmount: o.totalAmount,
        status: o.status,
        paymentStatus: o.paymentStatus,
        itemCount: o.items?.length ?? 0,
        createdAt: o.createdAt,
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
