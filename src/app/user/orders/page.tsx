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
    MapPin,
} from "lucide-react";

interface OrderItemDetail {
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface OrderData {
    id: string;
    totalAmount: number;
    status: string;
    paymentStatus: string;
    items: OrderItemDetail[];
    itemCount: number;
    shippingAddress: any;
    trackingId: string | null;
    createdAt: string;
    updatedAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; icon: typeof Clock; color: string; bg: string; border: string }> = {
    created: { label: "Placed", icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" },
    paid: { label: "Confirmed", icon: CreditCard, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
    processing: { label: "Processing", icon: Package, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
    shipped: { label: "Shipped", icon: Truck, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" },
    delivered: { label: "Delivered", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
    cancelled: { label: "Cancelled", icon: XCircle, color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
};

export default function OrdersPage() {
    const { user, loading: authLoading } = useUser();
    const router = useRouter();
    const [orders, setOrders] = useState<OrderData[]>([]);
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
                    <Loader2 className="size-8 animate-spin text-[#FF8C00]" />
                    <p className="text-sm text-[#888888] font-medium">Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-2xl pb-12">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm border border-gray-200 transition active:scale-95"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="font-heading text-2xl font-bold text-[#1A1A1A]">My Orders</h1>
                        <p className="text-xs text-[#888888] font-medium">{orders.length} order{orders.length !== 1 ? "s" : ""} placed</p>
                    </div>
                </div>
                <button
                    onClick={fetchOrders}
                    className="flex size-10 items-center justify-center rounded-full bg-orange-50 text-[#FF8C00] transition active:scale-90 border border-orange-100"
                    aria-label="Refresh"
                >
                    <RefreshCw size={16} />
                </button>
            </div>

            {error ? (
                <div className="flex flex-col items-center py-16 text-center">
                    <XCircle className="mb-3 text-red-300" size={48} />
                    <p className="text-base font-bold text-[#1A1A1A]">Unable to load orders</p>
                    <p className="text-sm text-[#888888] mt-1">Please check your connection and try again</p>
                    <button
                        onClick={fetchOrders}
                        className="mt-4 rounded-xl bg-[#FF8C00] px-6 py-3 text-sm font-bold text-white transition active:scale-95 shadow-md"
                    >
                        Try Again
                    </button>
                </div>
            ) : orders.length === 0 ? (
                <div className="flex flex-col items-center py-16 text-center">
                    <div className="mb-4 flex size-24 items-center justify-center rounded-full bg-orange-50 border border-orange-100">
                        <ShoppingBag className="text-[#FF8C00]" size={40} />
                    </div>
                    <h2 className="font-heading text-xl font-bold text-[#1A1A1A]">No orders yet</h2>
                    <p className="mt-2 max-w-[280px] text-sm text-[#888888] font-medium leading-relaxed">
                        Shop from our sacred collection and your orders will appear here
                    </p>
                    <Link
                        href="/shop"
                        className="mt-6 flex items-center gap-2 rounded-full bg-[#FF8C00] px-8 py-3.5 text-base font-bold text-white shadow-md hover:bg-[#E67E00] transition active:scale-95"
                    >
                        <ShoppingBag size={18} />
                        Visit Store
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
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
                            <Link
                                key={order.id}
                                href={`/user/orders/${order.id}`}
                                className="block rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all active:scale-[0.99] overflow-hidden"
                            >
                                {/* Status Bar */}
                                <div className={`flex items-center justify-between px-5 py-2.5 ${config.bg} border-b ${config.border}`}>
                                    <div className="flex items-center gap-2">
                                        <StatusIcon size={14} className={config.color} />
                                        <span className={`text-xs font-bold ${config.color}`}>{config.label}</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-[#888888] uppercase tracking-wider">{dateStr}</span>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    {/* Products Preview */}
                                    <div className="flex gap-3 mb-4">
                                        {order.items.slice(0, 3).map((item, idx) => (
                                            <div key={idx} className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package size={20} className="text-gray-300" />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        {order.items.length > 3 && (
                                            <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                                                <span className="text-xs font-bold text-[#888888]">+{order.items.length - 3}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Items List */}
                                    <div className="space-y-1 mb-4">
                                        {order.items.slice(0, 2).map((item, idx) => (
                                            <p key={idx} className="text-sm font-semibold text-[#1A1A1A] truncate">
                                                {item.name} <span className="text-[#888888] font-medium">× {item.quantity}</span>
                                            </p>
                                        ))}
                                        {order.items.length > 2 && (
                                            <p className="text-xs text-[#888888] font-medium">+{order.items.length - 2} more items</p>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <p className="text-[10px] font-bold text-[#888888] uppercase tracking-wider">Total</p>
                                                <p className="text-lg font-bold text-[#1A1A1A]">₹{order.totalAmount.toLocaleString("en-IN")}</p>
                                            </div>
                                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${order.paymentStatus === "paid"
                                                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                                : order.paymentStatus === "refunded"
                                                    ? "bg-purple-50 text-purple-600 border border-purple-100"
                                                    : "bg-yellow-50 text-yellow-600 border border-yellow-100"
                                                }`}>
                                                {order.paymentStatus === "paid" ? "✓ Paid" : order.paymentStatus === "refunded" ? "↩ Refunded" : "COD"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-[#FF8C00]">
                                            <span className="text-xs font-bold">View Details</span>
                                            <ChevronRight size={16} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
