"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ORDER_STATUSES = ["created", "paid", "processing", "shipped", "delivered", "cancelled"];

export function OrderStatusForm({
    orderId,
    currentStatus,
}: {
    orderId: string;
    currentStatus: string;
}) {
    const router = useRouter();
    const [status, setStatus] = useState(currentStatus);
    const [trackingId, setTrackingId] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleUpdate() {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/orders/${orderId}/status`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status, trackingId: trackingId || undefined }),
            });
            if (res.ok) router.refresh();
        } catch {
            // handle silently
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Update Order</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap items-end gap-4">
                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {ORDER_STATUSES.map((s) => (
                                    <SelectItem key={s} value={s}>
                                        {s.charAt(0).toUpperCase() + s.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Tracking ID (Shiprocket/Manual)</Label>
                        <Input
                            value={trackingId}
                            onChange={(e) => setTrackingId(e.target.value)}
                            placeholder="e.g. SR12345678"
                            className="w-[220px]"
                        />
                    </div>
                    <Button onClick={handleUpdate} disabled={loading}>
                        {loading ? "Updating..." : "Update Order"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
