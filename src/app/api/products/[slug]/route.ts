import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Product from "@/models/Product";
import mongoose from "mongoose";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connectDB();

    // Support both slug lookup and ObjectId lookup (for Buy Now checkout)
    const isObjectId = mongoose.Types.ObjectId.isValid(slug);
    const product = isObjectId
      ? await Product.findById(slug).select("name slug shortDescription fullDescription mainImage images pricing category inventory codAvailable").lean()
      : await Product.findOne({ slug, status: "published" }).select("name slug shortDescription fullDescription mainImage images pricing category inventory codAvailable").lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const res = NextResponse.json({
      id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      shortDescription: product.shortDescription,
      fullDescription: product.fullDescription,
      mainImage: product.mainImage,
      images: product.images,
      pricing: product.pricing,
      category: product.category,
      inventory: product.inventory,
      codAvailable: product.codAvailable,
    });

    // Cache for 60s on CDN, revalidate in background
    res.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}
