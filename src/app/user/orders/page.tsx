"use client";

import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    ShoppingBag,
    Loader2,
    Package,
    Clock,
    Truck,
    CheckCircle2,
    XCircle,
    CreditCard,
    ChevronRight,
    RefreshCw,
} from "lucide-react";

interface OrderItem {
    id: string;
    totalAmount: number;
    status: string;
    paymentStatus: string;
    itemCount: number;
    createdAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; icon: typeof Clock; color: string; bg: string }> = {
    created: { label: "Order Placed", icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
    paid: { label: "Payment Done", icon: CreditCard, color: "text-blue-600", bg: "bg-blue-50" },
    processing: { label: "Processing", icon: Package, color: "text-saffron-600", bg: "bg-saffron-50" },
    shipped: { label: "Shipped", icon: Truck, color: "text-purple-600", bg: "bg-purple-50" },
    delivered: { label: "Delivered", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
    cancelled: { label: "Cancelled", icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
};

export default function OrdersPage() {
    const { user, loading: authLoading } = useUser();
    const router = useRouter();
    const [orders, setOrders] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError(false);
        try {
            const res = await fetch("/api/my-orders");
            if (!res.ok) throw new Error("Failed");
            const data = await res.json();
            setOrders(data.data || []);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/user/login");
            return;
        }
        if (user) fetchOrders();
    }, [user, authLoading, router, fetchOrders]);

    if (authLoading || (loading && !error)) {
        return (
            <div className="flex min-h-[60dvh] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="size-8 animate-spin text-saffron-500" />
                    <p className="text-sm text-warm-500">Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-lg px-4 pb-28 pt-20 md:pb-12 md:pt-24">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm border border-warm-100 transition active:scale-95"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="font-serif text-xl font-bold text-warm-900">My Orders</h1>
                        <p className="text-xs text-warm-500">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>
                    </div>
                </div>
                <button
                    onClick={fetchOrders}
                    className="flex size-9 items-center justify-center rounded-full bg-saffron-50 text-saffron-600 transition active:scale-90"
                    aria-label="Refresh"
                >
                    <RefreshCw size={16} />
                </button>
            </div>

            {error ? (
                /* ── Error State ── */
                <div className="flex flex-col items-center py-16 text-center">
                    <XCircle className="mb-3 text-red-300" size={40} />
                    <p className="text-sm text-warm-600">Unable to load orders</p>
                    <button
                        onClick={fetchOrders}
                        className="mt-3 rounded-xl bg-saffron-500 px-5 py-2.5 text-sm font-bold text-white transition active:scale-95"
                    >
                        Try Again
                    </button>
                </div>
            ) : orders.length === 0 ? (
                /* ── Empty State ── */
                <div className="flex flex-col items-center py-16 text-center">
                    <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-saffron-50">
                        <ShoppingBag className="text-saffron-300" size={36} />
                    </div>
                    <h2 className="font-serif text-lg font-semibold text-warm-800">No orders yet</h2>
                    <p className="mt-1 max-w-[240px] text-sm text-warm-500">
                        Shop from our sacred collection and your orders will appear here
                    </p>
                    <Link
                        href="/store"
                        className="mt-6 flex items-center gap-2 rounded-xl bg-linear-to-r from-saffron-500 to-saffron-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition active:scale-95"
                    >
                        <ShoppingBag size={16} />
                        Visit Store
                    </Link>
                </div>
            ) : (
                /* ── Orders List ── */
                <div className="space-y-3">
                    {orders.map((order) => {
                        const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.created;
                        const StatusIcon = config.icon;
                        const date = new Date(order.createdAt);
                        const dateStr = date.toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        });

                        return (
                            <div
                                key={order.id}
                                className="rounded-2xl border border-gold-200/60 bg-white p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
                            >
                                {/* Top Row */}
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-[10px] font-medium text-warm-400">ORDER #{order.id.slice(-8).toUpperCase()}</p>
                                        <p className="mt-0.5 text-[11px] text-warm-500">{dateStr}</p>
                                    </div>
                                    <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 ${config.bg}`}>
                                        <StatusIcon size={12} className={config.color} />
                                        <span className={`text-[10px] font-semibold ${config.color}`}>{config.label}</span>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="mt-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="flex size-10 items-center justify-center rounded-xl bg-saffron-50">
                                            <Package size={18} className="text-saffron-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-warm-900">
                                                {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
                                            </p>
                                            <p className="text-xs text-warm-500">
                                                ₹{order.totalAmount.toLocaleString("en-IN")}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-saffron-600">
                                        <span className="text-xs font-semibold">Details</span>
                                        <ChevronRight size={14} />
                                    </div>
                                </div>

                                {/* Payment status */}
                                <div className="mt-2 flex items-center gap-2">
                                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${order.paymentStatus === "paid"
                                            ? "bg-green-50 text-green-600"
                                            : order.paymentStatus === "refunded"
                                                ? "bg-purple-50 text-purple-600"
                                                : "bg-yellow-50 text-yellow-600"
                                        }`}>
                                        {order.paymentStatus === "paid" ? "✓ Paid" : order.paymentStatus === "refunded" ? "↩ Refunded" : "⏳ Pending"}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
