import { NextRequest, NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/jwt/user-session";
import connectDB from "@/lib/db/mongodb";
import AstroRequest from "@/models/AstroRequest";

export async function GET(req: NextRequest) {
  try {
    const session = await getUserFromCookie();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "20"));

    await connectDB();

    const filter: Record<string, unknown> = { userId: session.userId };
    if (status) filter.status = status;

    const [requests, total] = await Promise.all([
      AstroRequest.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      AstroRequest.countDocuments(filter),
    ]);

    return NextResponse.json({
      data: requests.map((r) => ({
        id: r._id.toString(),
        serviceType: r.serviceType,
        problemCategory: r.problemCategory,
        status: r.status,
        paymentStatus: r.paymentStatus,
        amount: r.amount,
        finalCallTime: r.finalCallTime,
        createdAt: r.createdAt,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch consultations" }, { status: 500 });
  }
}
