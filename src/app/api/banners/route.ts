import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Banner from "@/models/Banner";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const position = searchParams.get("position");

    const filter: Record<string, unknown> = { status: "active" };
    if (position) filter.position = position;

    const banners = await Banner.find(filter).sort({ order: 1 }).lean();

    return NextResponse.json({
      data: banners.map((b) => ({
        id: b._id.toString(),
        title: b.title,
        image: b.image,
        link: b.link,
        position: b.position,
      })),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
  }
}
