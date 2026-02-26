import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Blog from "@/models/Blog";

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "12");
        const search = searchParams.get("search") || "";
        const category = searchParams.get("category") || "";

        const query: Record<string, unknown> = { status: "published" };
        if (category) query.category = category;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { excerpt: { $regex: search, $options: "i" } },
                { tags: { $regex: search, $options: "i" } },
            ];
        }

        const skip = (page - 1) * limit;
        const [data, total, categories] = await Promise.all([
            Blog.find(query)
                .select("title slug excerpt featuredImage category tags author publishedAt views createdAt")
                .sort({ publishedAt: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Blog.countDocuments(query),
            Blog.distinct("category", { status: "published" }),
        ]);

        return NextResponse.json({
            success: true,
            data: JSON.parse(JSON.stringify(data)),
            categories,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasMore: page * limit < total,
        });
    } catch (error) {
        console.error("Error fetching public blogs:", error);
        return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
    }
}
