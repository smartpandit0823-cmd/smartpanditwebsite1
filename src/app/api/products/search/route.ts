import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Product from "@/models/Product";

export async function GET(req: NextRequest) {
    try {
        const q = req.nextUrl.searchParams.get("q");
        if (!q || !q.trim()) {
            return NextResponse.json({ products: [] });
        }

        await connectDB();

        const regex = new RegExp(q.trim(), "i");
        const products = await Product.find({
            status: "published",
            $or: [
                { name: regex },
                { category: regex },
                { shortDescription: regex },
                { "tags": regex },
            ],
        })
            .sort({ featured: -1, totalSold: -1, createdAt: -1 })
            .limit(30)
            .lean();

        const results = products.map((p) => ({
            id: p._id.toString(),
            slug: p.slug,
            name: p.name,
            category: p.category,
            images: p.images?.length ? p.images : [p.mainImage].filter(Boolean),
            price: p.pricing?.sellingPrice ?? 0,
            originalPrice:
                p.pricing?.mrp && p.pricing.mrp > (p.pricing?.sellingPrice ?? 0)
                    ? p.pricing.mrp
                    : undefined,
            discount: p.pricing?.discount ?? 0,
            rating: p.averageRating ?? 4.5,
        }));

        return NextResponse.json({ products: results });
    } catch (error) {
        console.error("Search API error:", error);
        return NextResponse.json({ products: [] }, { status: 500 });
    }
}
