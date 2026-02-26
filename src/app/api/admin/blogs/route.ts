import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Blog from "@/models/Blog";
import { CreateBlogSchema } from "@/schemas/blog.schema";

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
}

export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const search = searchParams.get("search") || "";
        const status = searchParams.get("status") || "";
        const category = searchParams.get("category") || "";

        await connectDB();

        const query: Record<string, unknown> = {};
        if (status && status !== "all") query.status = status;
        if (category) query.category = category;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } },
            ];
        }

        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            Blog.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            Blog.countDocuments(query),
        ]);

        return NextResponse.json({
            data: JSON.parse(JSON.stringify(data)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const parsed = CreateBlogSchema.safeParse(body);
        if (!parsed.success) return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });

        await connectDB();

        // Auto-generate slug if not provided
        let slug = parsed.data.slug || generateSlug(parsed.data.title);
        // Check uniqueness
        const existing = await Blog.findOne({ slug });
        if (existing) {
            slug = `${slug}-${Date.now().toString(36)}`;
        }

        const blog = await Blog.create({
            ...parsed.data,
            slug,
            authorId: session.user.id,
            publishedAt: parsed.data.status === "published" ? new Date() : undefined,
        });

        return NextResponse.json({ success: true, id: blog._id.toString() });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
    }
}
