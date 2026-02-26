import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Blog from "@/models/Blog";
import { BlogForm } from "../BlogForm";
import { notFound } from "next/navigation";

export default async function EditBlogPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    await auth();
    const { id } = await params;
    await connectDB();
    const blog = await Blog.findById(id).lean();
    if (!blog) notFound();

    const blogData = JSON.parse(JSON.stringify(blog));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-heading text-3xl font-bold">Edit Blog Post</h1>
                <p className="mt-1 text-gray-600">Update &ldquo;{blogData.title}&rdquo;</p>
            </div>
            <BlogForm blog={blogData} />
        </div>
    );
}
