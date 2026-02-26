import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Blog from "@/models/Blog";
import { UpdateBlogSchema } from "@/schemas/blog.schema";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await params;
        await connectDB();
        const blog = await Blog.findById(id).lean();
        if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 });

        return NextResponse.json({ data: JSON.parse(JSON.stringify(blog)) });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await params;
        const body = await req.json();
        const parsed = UpdateBlogSchema.safeParse(body);
        if (!parsed.success) return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });

        await connectDB();

        const update: Record<string, unknown> = { ...parsed.data };
        // If publishing for the first time, set publishedAt
        if (parsed.data.status === "published") {
            const existing = await Blog.findById(id).lean();
            if (existing && !existing.publishedAt) {
                update.publishedAt = new Date();
            }
        }

        const blog = await Blog.findByIdAndUpdate(id, update, { new: true });
        if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 });

        return NextResponse.json({ success: true, data: JSON.parse(JSON.stringify(blog)) });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
    }
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await params;
        await connectDB();
        const blog = await Blog.findByIdAndUpdate(id, { status: "deleted", deletedAt: new Date() }, { new: true });
        if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
    }
}
