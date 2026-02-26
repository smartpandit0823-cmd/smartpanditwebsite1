import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import AstroService from "@/models/AstroService";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "20");

    const services = await AstroService.find({ active: true })
      .sort({ createdAt: 1 })
      .limit(limit)
      .lean();

    return NextResponse.json({
      data: services.map((s) => ({
        id: s._id.toString(),
        name: s.name,
        slug: s.slug,
        description: s.description,
        sessionTypes: s.sessionTypes,
        image: s.image,
      })),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}
