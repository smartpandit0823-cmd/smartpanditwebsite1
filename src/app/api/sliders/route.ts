import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Slider from "@/models/Slider";

export async function GET() {
  try {
    await connectDB();
    const sliders = await Slider.find({ active: true }).sort({ order: 1 }).lean();

    return NextResponse.json({
      data: sliders.map((s) => ({
        id: s._id.toString(),
        title: s.title,
        image: s.image,
        link: s.link,
      })),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch sliders" }, { status: 500 });
  }
}
