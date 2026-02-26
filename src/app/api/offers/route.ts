import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Offer from "@/models/Offer";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const now = new Date();

    const filter: Record<string, unknown> = { active: true };
    if (type) filter.type = type;

    const offers = await Offer.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      data: offers.map((o) => ({
        id: o._id.toString(),
        title: o.title,
        description: o.description,
        image: o.image,
        type: o.type,
        discount: o.discount,
        discountType: o.discountType,
      })),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 });
  }
}
