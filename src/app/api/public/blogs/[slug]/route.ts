import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Blog from "@/models/Blog";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        await connectDB();

        // Find & increment views atomically
        const blog = await Blog.findOneAndUpdate(
            { slug, status: "published" },
            { $inc: { views: 1 } },
            { new: true }
        ).lean();

        if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });

        // Fetch related posts (same category, excluding current)
        const related = await Blog.find({
            status: "published",
            category: blog.category,
            _id: { $ne: blog._id },
        })
            .select("title slug excerpt featuredImage category publishedAt")
            .sort({ publishedAt: -1 })
            .limit(3)
            .lean();

        return NextResponse.json({
            success: true,
            data: JSON.parse(JSON.stringify(blog)),
            related: JSON.parse(JSON.stringify(related)),
        });
    } catch (error) {
        console.error("Error fetching blog by slug:", error);
        return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 });
    }
}
