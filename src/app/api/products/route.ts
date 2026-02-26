import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Product from "@/models/Product";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "20"));
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));

    const filter: Record<string, unknown> = { status: "published" };
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
      ];
    }

    const [products, total] = await Promise.all([
      Product.find(filter).skip((page - 1) * limit).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);

    return NextResponse.json({
      data: products.map((p) => ({
        id: p._id.toString(),
        name: p.name,
        slug: p.slug,
        shortDescription: p.shortDescription,
        mainImage: p.mainImage,
        images: p.images,
        pricing: p.pricing,
        category: p.category,
        inStock: p.inventory?.inStock,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
