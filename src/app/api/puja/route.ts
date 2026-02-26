import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Puja from "@/models/Puja";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "20"));
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));

    const filter: Record<string, unknown> = { status: "active" };
    if (category) filter.category = category;
    if (featured === "true") filter.featured = true;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
      ];
    }

    const [pujas, total] = await Promise.all([
      Puja.find(filter).skip((page - 1) * limit).limit(limit).lean(),
      Puja.countDocuments(filter),
    ]);

    return NextResponse.json({
      data: pujas.map((p) => ({
        id: p._id.toString(),
        name: p.name,
        slug: p.slug,
        shortDescription: p.shortDescription,
        images: p.images,
        category: p.category,
        packages: p.packages,
        status: p.status,
        featured: p.featured,
        popular: p.popular,
        priceFrom: p.packages?.length ? Math.min(...p.packages.map((pk: { price: number }) => pk.price)) : 0,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch pujas" }, { status: 500 });
  }
}
