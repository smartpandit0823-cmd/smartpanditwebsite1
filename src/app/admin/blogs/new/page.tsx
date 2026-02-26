import { auth } from "@/auth";
import { BlogForm } from "../BlogForm";

export default async function NewBlogPage() {
    await auth();
    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-heading text-3xl font-bold">New Blog Post</h1>
                <p className="mt-1 text-gray-600">Create a new article for your readers</p>
            </div>
            <BlogForm />
        </div>
    );
}
