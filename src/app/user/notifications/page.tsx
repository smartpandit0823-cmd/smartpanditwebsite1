"use client";

import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Bell,
    Flame,
    ShoppingBag,
    CreditCard,
    Phone,
    Truck,
    Loader2,
    CheckCircle2,
} from "lucide-react";

interface Notification {
    _id: string;
    type: "booking" | "payment" | "order" | "call" | "general";
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
}

const TYPE_ICON: Record<string, typeof Bell> = {
    booking: Flame,
    payment: CreditCard,
    order: Truck,
    call: Phone,
    general: Bell,
};

const TYPE_COLOR: Record<string, string> = {
    booking: "bg-saffron-50 text-saffron-600",
    payment: "bg-green-50 text-green-600",
    order: "bg-blue-50 text-blue-600",
    call: "bg-purple-50 text-purple-600",
    general: "bg-warm-100 text-warm-600",
};

// Mock notifications for now
const MOCK_NOTIFICATIONS: Notification[] = [
    {
        _id: "1",
        type: "booking",
        title: "Booking Confirmed",
        message: "Your Satyanarayan Puja booking has been confirmed for 25 Feb 2026.",
        read: false,
        createdAt: new Date().toISOString(),
    },
    {
        _id: "2",
        type: "payment",
        title: "Payment Received",
        message: "₹2,499 payment received for booking #1234. Thank you!",
        read: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        _id: "3",
        type: "order",
        title: "Order Shipped",
        message: "Your pooja samagri order has been shipped. Track delivery →",
        read: true,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
];

export default function NotificationsPage() {
    const { user, loading: authLoading } = useUser();
    const router = useRouter();
    const [notifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

    useEffect(() => {
        if (!authLoading && !user) router.push("/user/login");
    }, [user, authLoading, router]);

    if (authLoading) {
        return <div className="flex min-h-[60dvh] items-center justify-center"><Loader2 className="size-8 animate-spin text-saffron-500" /></div>;
    }

    return (
        <div className="mx-auto max-w-lg px-4 py-6 space-y-5">
            <div className="flex items-center gap-3">
                <Link href="/user/profile" className="flex size-9 items-center justify-center rounded-full bg-white shadow-sm border border-warm-100">
                    <ArrowLeft size={18} />
                </Link>
                <h1 className="text-lg font-semibold text-warm-900">Notifications</h1>
            </div>

            {notifications.length === 0 ? (
                <div className="py-16 text-center">
                    <Bell className="mx-auto mb-3 text-warm-300" size={40} />
                    <p className="text-sm text-warm-500">No notifications yet</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {notifications.map((n) => {
                        const Icon = TYPE_ICON[n.type] || Bell;
                        const color = TYPE_COLOR[n.type] || TYPE_COLOR.general;
                        return (
                            <div key={n._id}
                                className={`rounded-2xl border bg-white p-4 transition ${n.read ? "border-warm-100" : "border-saffron-200 bg-saffron-50/30"
                                    }`}
                            >
                                <div className="flex gap-3">
                                    <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${color}`}>
                                        <Icon size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-semibold text-warm-900">{n.title}</p>
                                            {!n.read && <span className="size-2 rounded-full bg-saffron-500" />}
                                        </div>
                                        <p className="mt-1 text-xs text-warm-600 leading-relaxed">{n.message}</p>
                                        <p className="mt-2 text-[10px] text-warm-400">
                                            {new Date(n.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                                        </p>
                                    </div>
                                    {n.read && <CheckCircle2 size={14} className="shrink-0 text-warm-300 mt-1" />}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
