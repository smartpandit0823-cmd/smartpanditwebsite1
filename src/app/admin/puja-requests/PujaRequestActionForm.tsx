"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, ExternalLink } from "lucide-react";

const STATUS_LABELS: Record<string, string> = {
    requested: "Requested",
    price_finalized: "Price Finalized",
    payment_pending: "Payment Pending",
    confirmed: "Confirmed",
    assigned: "Assigned",
    inprogress: "In Progress",
    completed: "Completed",
    submitted: "Submitted",
    cancelled: "Cancelled",
};

export function PujaRequestActionForm({
    requestId,
    currentStatus,
    currentAmount,
    currentPanditId,
    adminNotes,
    pandits,
}: {
    requestId: string;
    currentStatus: string;
    currentAmount: number;
    currentPanditId?: string;
    adminNotes?: string;
    pandits: { _id: string; name: string; phone: string }[];
}) {
    const router = useRouter();
    const [status, setStatus] = useState(currentStatus);
    const [panditId, setPanditId] = useState(currentPanditId || "");
    const [amount, setAmount] = useState(currentAmount.toString());
    const [note, setNote] = useState(adminNotes || "");
    const [loading, setLoading] = useState(false);

    async function handleUpdate() {
        setLoading(true);
        const res = await fetch(`/api/admin/puja-requests/${requestId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                status,
                amount: Number(amount),
                assignedPanditId: panditId || null,
                adminNotes: note
            }),
        });
        setLoading(false);
        if (res.ok) router.refresh();
    }

    return (
        <div className="rounded-xl border border-gold-200 bg-white p-6 space-y-6 mt-6">
            <h2 className="font-semibold text-lg">Admin Actions</h2>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4 rounded-lg bg-gray-50/50 p-4 border border-gray-100">
                    <div className="space-y-2">
                        <Label>Finalize Price (₹)</Label>
                        <Input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter final amount in INR"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Update Status</Label>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(STATUS_LABELS).map((s) => (
                                    <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-4 rounded-lg bg-gray-50/50 p-4 border border-gray-100">
                    <div className="space-y-2">
                        <Label>Assign Pandit</Label>
                        <div className="flex gap-2">
                            <Select value={panditId} onValueChange={setPanditId}>
                                <SelectTrigger className="flex-1">
                                    <SelectValue placeholder="Select pandit" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">-- None --</SelectItem>
                                    {pandits.map((p) => (
                                        <SelectItem key={p._id} value={p._id}>{p.name} ({p.phone})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {panditId && (
                        <div className="pt-2">
                            <Button
                                variant="outline"
                                className="w-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 border-[#25D366]/50"
                                onClick={() => {
                                    const p = pandits.find((x) => x._id === panditId);
                                    if (p) {
                                        const msg = encodeURIComponent(`Hari Om ${p.name} Ji,\n\nWe have a new Puja booking for you.\nRequest ID: #${requestId}\nPlease confirm your availability.`);
                                        window.open(`https://wa.me/91${p.phone.replace(/\D/g, "").slice(-10)}?text=${msg}`, "_blank");
                                    }
                                }}
                            >
                                <MessageCircle className="w-4 h-4 mr-2" />
                                WhatsApp Pandit
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label>Admin Notes (Internal)</Label>
                <Textarea
                    placeholder="Any notes for admins..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                />
            </div>

            <Button onClick={handleUpdate} disabled={loading} className="w-full md:w-auto bg-saffron-600 hover:bg-saffron-700">
                {loading ? "Saving..." : "Save Changes"}
            </Button>
        </div>
    );
}
