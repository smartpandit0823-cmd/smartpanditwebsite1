import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import AstroService from "@/models/AstroService";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connectDB();
    const service = await AstroService.findOne({ slug, active: true }).lean();
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: service._id.toString(),
      name: service.name,
      slug: service.slug,
      description: service.description,
      sessionTypes: service.sessionTypes,
      image: service.image,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch service" }, { status: 500 });
  }
}
