import { auth } from "@/auth";
import { ReviewRepository } from "@/repositories/review.repository";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/index";
import Link from "next/link";
import { ReviewsTable } from "./ReviewsTable";

export default async function ReviewsPage() {
  await auth();
  const repo = new ReviewRepository();
  const result = await repo.list({}, { page: 1, limit: 20 });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Reviews</h1>
        <p className="mt-1 text-gray-600">Moderate puja and product reviews</p>
      </div>
      <ReviewsTable initialReviews={JSON.parse(JSON.stringify(result.data))} />
    </div>
  );
}
