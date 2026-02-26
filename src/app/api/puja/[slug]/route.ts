import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Puja from "@/models/Puja";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connectDB();
    const puja = await Puja.findOne({ slug, status: "active" }).lean();
    if (!puja) {
      return NextResponse.json({ error: "Puja not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: puja._id.toString(),
      name: puja.name,
      slug: puja.slug,
      shortDescription: puja.shortDescription,
      longDescription: puja.longDescription,
      images: puja.images,
      videoUrl: puja.videoUrl,
      benefits: puja.benefits,
      packages: puja.packages,
      category: puja.category,
      pujaType: puja.pujaType,
      duration: puja.duration,
      maxBookingsPerDay: puja.maxBookingsPerDay,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch puja" }, { status: 500 });
  }
}
