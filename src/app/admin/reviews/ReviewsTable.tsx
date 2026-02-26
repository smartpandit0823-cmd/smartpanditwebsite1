"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2 } from "lucide-react";

export function ReviewsTable({ initialReviews }: { initialReviews: any[] }) {
    const [reviews, setReviews] = useState(initialReviews);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    async function updateStatus(id: string, status: string) {
        setLoadingId(id);
        try {
            const res = await fetch(`/api/admin/reviews/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });
            const data = await res.json();
            if (data.success) {
                setReviews(prev => prev.map(r => r._id === id ? { ...r, status } : r));
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingId(null);
        }
    }

    return (
        <Card>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Target</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Comment</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reviews.map((r) => (
                            <TableRow key={r._id}>
                                <TableCell className="font-medium">{r.customerName}</TableCell>
                                <TableCell>{r.targetModel}</TableCell>
                                <TableCell className="text-amber-500">★ {r.rating}</TableCell>
                                <TableCell className="max-w-xs truncate text-gray-600">{r.comment}</TableCell>
                                <TableCell>
                                    <Badge variant={r.status === "approved" ? "success" : r.status === "rejected" ? "destructive" : "secondary"}>
                                        {r.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {r.status === "pending" && (
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-green-600 border-green-200 hover:bg-green-50"
                                                disabled={loadingId === r._id}
                                                onClick={() => updateStatus(r._id, "approved")}
                                            >
                                                {loadingId === r._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                                Approve
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-red-600 border-red-200 hover:bg-red-50"
                                                disabled={loadingId === r._id}
                                                onClick={() => updateStatus(r._id, "rejected")}
                                            >
                                                {loadingId === r._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                                                Reject
                                            </Button>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {reviews.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-gray-500">No reviews found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
