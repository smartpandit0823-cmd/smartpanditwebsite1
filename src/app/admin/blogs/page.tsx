import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Blog from "@/models/Blog";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye } from "lucide-react";

function formatDate(d: string | Date) {
  return new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

export default async function BlogsPage() {
  await auth();
  await connectDB();
  const blogs = await Blog.find({ status: { $ne: "deleted" } })
    .sort({ createdAt: -1 })
    .limit(50)
    .select("title slug category author status views featuredImage createdAt publishedAt")
    .lean();

  const blogData = JSON.parse(JSON.stringify(blogs));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-3xl font-bold">Blog Posts</h1>
          <p className="mt-1 text-gray-600">Manage articles & content ({blogData.length} posts)</p>
        </div>
        <Button asChild>
          <Link href="/admin/blogs/new">
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-warm-500">
                    No blog posts yet. Click &ldquo;New Post&rdquo; to create your first article!
                  </TableCell>
                </TableRow>
              )}
              {blogData.map((b: any) => (
                <TableRow key={b._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {b.featuredImage && (
                        <img src={b.featuredImage} alt="" className="size-10 rounded-lg object-cover" />
                      )}
                      <Link href={`/admin/blogs/${b._id}`} className="font-medium hover:text-saffron-600 hover:underline">
                        {b.title}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{b.category}</Badge>
                  </TableCell>
                  <TableCell className="text-warm-600">{b.author}</TableCell>
                  <TableCell>
                    <Badge variant={b.status === "published" ? "success" : "secondary"}>
                      {b.status === "published" ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1 text-warm-500">
                      <Eye size={14} />
                      {b.views || 0}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-warm-500">
                    {formatDate(b.publishedAt || b.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
