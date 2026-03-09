import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Inquiry from "@/models/Inquiry";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");

    const filter: Record<string, string> = {};
    if (status && status !== "all") filter.status = status;

    const [inquiries, total] = await Promise.all([
      Inquiry.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Inquiry.countDocuments(filter),
    ]);

    return NextResponse.json({
      inquiries,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 });
  }
}
