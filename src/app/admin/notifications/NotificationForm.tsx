"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Send, CheckCircle } from "lucide-react";

const TEMPLATES = [
    {
        key: "booking_confirmed",
        label: "Booking Confirmed",
        title: "Booking Confirmed! 🙏",
        message: "Your puja booking has been confirmed. Pandit ji will arrive on the scheduled date.",
    },
    {
        key: "call_scheduled",
        label: "Call Scheduled",
        title: "Astrology Call Scheduled 🔮",
        message: "Your astrology consultation is scheduled. Our astrologer will call you at the scheduled time.",
    },
    {
        key: "order_shipped",
        label: "Order Shipped",
        title: "Order Shipped! 📦",
        message: "Your order has been shipped and is on its way. Track your order for live updates.",
    },
    {
        key: "payment_reminder",
        label: "Payment Reminder",
        title: "Payment Pending ⏰",
        message: "Your booking is pending payment. Please complete the payment to confirm.",
    },
    {
        key: "custom",
        label: "Custom Message",
        title: "",
        message: "",
    },
];

export function NotificationForm() {
    const [template, setTemplate] = useState("booking_confirmed");
    const [title, setTitle] = useState(TEMPLATES[0].title);
    const [message, setMessage] = useState(TEMPLATES[0].message);
    const [userId, setUserId] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    function handleTemplateChange(key: string) {
        setTemplate(key);
        const t = TEMPLATES.find((t) => t.key === key);
        if (t && t.key !== "custom") {
            setTitle(t.title);
            setMessage(t.message);
        }
    }

    async function handleSend() {
        if (!title || !message) return;
        setLoading(true);
        setSent(false);

        try {
            const res = await fetch("/api/admin/notifications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: userId || undefined,
                    title,
                    message,
                    template,
                }),
            });
            if (res.ok) {
                setSent(true);
                setTimeout(() => setSent(false), 3000);
            }
        } catch {
            // handle error
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="max-w-2xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-saffron-600" />
                    Send Notification
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Template</Label>
                    <Select value={template} onValueChange={handleTemplateChange}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {TEMPLATES.map((t) => (
                                <SelectItem key={t.key} value={t.key}>
                                    {t.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>User ID (leave empty for broadcast)</Label>
                    <Input
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        placeholder="Enter user ID or leave empty for all"
                    />
                </div>

                <div className="space-y-2">
                    <Label>Title</Label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>

                <div className="space-y-2">
                    <Label>Message</Label>
                    <Textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} />
                </div>

                <div className="flex items-center gap-3">
                    <Button onClick={handleSend} disabled={loading || !title || !message}>
                        {loading ? (
                            "Sending..."
                        ) : (
                            <>
                                <Send className="mr-2 h-4 w-4" />
                                Send Notification
                            </>
                        )}
                    </Button>
                    {sent && (
                        <span className="flex items-center gap-1 text-sm text-emerald-600">
                            <CheckCircle className="h-4 w-4" />
                            Sent successfully!
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
