"use client";

import { useUser } from "@/contexts/UserContext";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Loader2,
    Package,
    Clock,
    Truck,
    CheckCircle2,
    XCircle,
    CreditCard,
    MapPin,
    Phone,
    Copy,
    ShoppingBag,
    ShieldCheck,
    Box,
    RefreshCw,
    ExternalLink,
} from "lucide-react";

interface OrderItemDetail {
    name: string;
    price: number;
    quantity: number;
    image: string;
    productId: string;
}

interface OrderDetail {
    id: string;
    totalAmount: number;
    shippingFee: number;
    status: string;
    paymentStatus: string;
    razorpayPaymentId: string | null;
    trackingId: string | null;
    delhiveryWaybill: string | null;
    delhiveryStatus: string | null;
    items: OrderItemDetail[];
    shippingAddress: {
        name: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        pincode: string;
    } | null;
    createdAt: string;
    updatedAt: string;
}

interface TrackingScan {
    date: string;
    status: string;
    location: string;
    remarks: string;
}

const TRACKING_STEPS = [
    { key: "created", label: "Order Placed", desc: "Your order has been placed successfully", icon: CheckCircle2 },
    { key: "paid", label: "Confirmed", desc: "Payment received & order confirmed", icon: CreditCard },
    { key: "processing", label: "Processing", desc: "Your order is being prepared with care", icon: Package },
    { key: "shipped", label: "Shipped", desc: "Your order is on its way", icon: Truck },
    { key: "delivered", label: "Delivered", desc: "Your order has been delivered", icon: Box },
];

const STATUS_ORDER: Record<string, number> = {
    created: 0,
    paid: 1,
    processing: 2,
    shipped: 3,
    delivered: 4,
    cancelled: -1,
};

export default function OrderDetailPage() {
    const { user, loading: authLoading } = useUser();
    const router = useRouter();
    const params = useParams();
    const orderId = params.id as string;

    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [liveTracking, setLiveTracking] = useState<any>(null);
    const [trackingLoading, setTrackingLoading] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/user/login");
            return;
        }
        if (user && orderId) {
            fetch(`/api/my-orders/${orderId}`)
                .then((r) => r.json())
                .then((d) => {
                    if (d.order) {
                        setOrder(d.order);
                        // Auto-fetch Delhivery tracking if waybill exists
                        const waybill = d.order.delhiveryWaybill || d.order.trackingId;
                        if (waybill && d.order.status !== "delivered" && d.order.status !== "cancelled") {
                            fetch(`/api/shipping/track?waybill=${waybill}`)
                                .then((r2) => r2.json())
                                .then((t) => { setLiveTracking(t); })
                                .catch(() => { });
                        }
                    }
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [user, authLoading, router, orderId]);

    const copyId = () => {
        navigator.clipboard.writeText(orderId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const fetchLiveTracking = async () => {
        const waybill = order?.delhiveryWaybill || order?.trackingId;
        if (!waybill) return;
        setTrackingLoading(true);
        try {
            const res = await fetch(`/api/shipping/track?waybill=${waybill}`);
            const data = await res.json();
            setLiveTracking(data);
        } catch { /* silent */ }
        setTrackingLoading(false);
    };

    if (authLoading || loading) {
        return (
            <div className="flex min-h-[60dvh] items-center justify-center">
                <Loader2 className="size-8 animate-spin text-[#FF8C00]" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex min-h-[60dvh] flex-col items-center justify-center px-4 text-center">
                <Package className="text-gray-300 mb-3" size={48} />
                <p className="font-bold text-[#1A1A1A] text-lg">Order not found</p>
                <Link href="/user/orders" className="mt-4 text-[#FF8C00] font-bold text-sm">← Back to Orders</Link>
            </div>
        );
    }

    const currentStep = STATUS_ORDER[order.status] ?? 0;
    const isCancelled = order.status === "cancelled";
    const date = new Date(order.createdAt);
    const dateStr = date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    const timeStr = date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    const hasWaybill = order.delhiveryWaybill || order.trackingId;

    // Estimated delivery: calculate actual business days (skip Sundays)
    function addBusinessDays(startDate: Date, days: number) {
        const result = new Date(startDate);
        let added = 0;
        while (added < days) {
            result.setDate(result.getDate() + 1);
            if (result.getDay() !== 0) added++; // skip Sunday
        }
        return result;
    }
    const estDeliveryStart = addBusinessDays(date, 3);
    const estDeliveryEnd = addBusinessDays(date, 5);
    const estStartStr = estDeliveryStart.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    const estEndStr = estDeliveryEnd.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

    return (
        <div className="mx-auto max-w-2xl pb-12 space-y-5">
            {/* Header */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => router.back()}
                    className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm border border-gray-200 transition active:scale-95"
                >
                    <ArrowLeft size={18} />
                </button>
                <div className="flex-1">
                    <h1 className="font-heading text-xl font-bold text-[#1A1A1A]">Order Details</h1>
                    <p className="text-xs text-[#888888] font-medium">{dateStr} · {timeStr}</p>
                </div>
            </div>

            {/* Order ID Card */}
            <div className="rounded-2xl bg-white border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-bold text-[#888888] uppercase tracking-wider">Order ID</p>
                        <p className="font-mono text-sm font-bold text-[#1A1A1A] mt-0.5">#{orderId.slice(-8).toUpperCase()}</p>
                    </div>
                    <button onClick={copyId} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-xs font-bold text-[#888888] hover:bg-gray-100 transition-colors">
                        <Copy size={12} />
                        {copied ? "Copied!" : "Copy"}
                    </button>
                </div>
                {hasWaybill && (
                    <div className="mt-3 flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                        <Truck size={14} className="text-blue-500" />
                        <span className="text-xs font-bold text-blue-700">AWB: {hasWaybill}</span>
                    </div>
                )}
            </div>

            {/* ── TRACKING TIMELINE ── */}
            <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-base font-bold text-[#1A1A1A] flex items-center gap-2">
                        <Truck size={18} className="text-[#FF8C00]" />
                        Order Tracking
                    </h2>
                    {hasWaybill && (
                        <button
                            onClick={fetchLiveTracking}
                            disabled={trackingLoading}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-100 text-xs font-bold text-blue-600 hover:bg-blue-100 transition-colors disabled:opacity-50"
                        >
                            {trackingLoading ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                            Live Track
                        </button>
                    )}
                </div>

                {isCancelled ? (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100">
                        <XCircle className="text-red-500 shrink-0" size={24} />
                        <div>
                            <p className="font-bold text-red-700">Order Cancelled</p>
                            <p className="text-xs text-red-500 mt-0.5">This order has been cancelled</p>
                        </div>
                    </div>
                ) : (
                    <div className="relative">
                        {TRACKING_STEPS.map((step, idx) => {
                            const isCompleted = idx <= currentStep;
                            const isCurrent = idx === currentStep;
                            const StepIcon = step.icon;
                            const isLast = idx === TRACKING_STEPS.length - 1;

                            return (
                                <div key={step.key} className="flex gap-4 relative">
                                    {!isLast && (
                                        <div className="absolute left-[19px] top-[40px] w-[2px] h-[calc(100%-16px)]">
                                            <div className={`w-full h-full ${isCompleted && idx < currentStep ? "bg-emerald-400" : "bg-gray-200"}`} />
                                        </div>
                                    )}

                                    <div className={`relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2 transition-all ${isCompleted
                                        ? isCurrent
                                            ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-200 scale-110"
                                            : "bg-emerald-500 border-emerald-500 text-white"
                                        : "bg-white border-gray-200 text-gray-400"
                                        }`}>
                                        <StepIcon size={16} />
                                    </div>

                                    <div className={`flex-1 pb-6 ${isLast ? "pb-0" : ""}`}>
                                        <p className={`text-sm font-bold ${isCompleted ? "text-[#1A1A1A]" : "text-gray-400"}`}>
                                            {step.label}
                                            {isCurrent && (
                                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100">
                                                    Current
                                                </span>
                                            )}
                                        </p>
                                        <p className={`text-xs mt-0.5 ${isCompleted ? "text-[#888888]" : "text-gray-400"}`}>
                                            {step.desc}
                                        </p>
                                        {isCurrent && order.status === "shipped" && hasWaybill && (
                                            <div className="mt-2 flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                                                <Truck size={14} className="text-blue-500" />
                                                <span className="text-xs font-bold text-blue-700">Tracking: {hasWaybill}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Estimated Delivery */}
                {!isCancelled && order.status !== "delivered" && (
                    <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-[#FEFAF4] border border-orange-100">
                        <Clock size={16} className="text-[#FF8C00] shrink-0" />
                        <div>
                            <p className="text-xs font-bold text-[#1A1A1A]">Estimated Delivery</p>
                            <p className="text-xs text-[#888888]">By <span className="font-bold text-[#FF8C00]">{liveTracking?.estimatedDelivery || `${estStartStr} – ${estEndStr}`}</span></p>
                        </div>
                    </div>
                )}
            </div>

            {/* ── LIVE TRACKING SCANS ── */}
            {liveTracking && (
                <div className="rounded-2xl bg-white border border-blue-200 p-5 shadow-sm">
                    <h2 className="text-base font-bold text-[#1A1A1A] mb-4 flex items-center gap-2">
                        <MapPin size={18} className="text-blue-500" />
                        Live Shipment Updates
                        {liveTracking.currentStatus && (
                            <span className="ml-auto text-xs font-bold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full border border-blue-100">
                                {liveTracking.currentStatus}
                            </span>
                        )}
                    </h2>

                    {liveTracking.scans && liveTracking.scans.length > 0 ? (
                        <div className="space-y-0 relative">
                            {liveTracking.scans.map((scan: TrackingScan, idx: number) => {
                                const isFirst = idx === 0;
                                const isLast = idx === liveTracking.scans.length - 1;
                                return (
                                    <div key={idx} className="flex gap-3 relative pb-4">
                                        {/* Line */}
                                        {!isLast && (
                                            <div className="absolute left-[7px] top-[20px] w-[2px] h-[calc(100%)] bg-blue-100" />
                                        )}
                                        {/* Dot */}
                                        <div className={`relative z-10 mt-1 w-4 h-4 shrink-0 rounded-full border-2 ${isFirst ? "bg-blue-500 border-blue-500" : "bg-white border-blue-200"}`} />
                                        {/* Content */}
                                        <div className={`flex-1 ${isLast ? "pb-0" : ""}`}>
                                            <span className="text-[10px] text-[#888888] font-medium block mb-0.5">
                                                {scan.date ? new Date(scan.date).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true }) : ""}
                                            </span>
                                            <p className={`text-xs font-bold ${isFirst ? "text-blue-700" : "text-[#1A1A1A]"}`}>
                                                {scan.status} {scan.location ? `at ${scan.location}` : ""}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100">
                            ⏳ No scan updates yet. Shipment is manifested. Tracking will appear after pickup.
                        </p>
                    )}
                </div>
            )}

            {/* ── ITEMS ── */}
            <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
                <h2 className="text-base font-bold text-[#1A1A1A] mb-4 flex items-center gap-2">
                    <ShoppingBag size={18} className="text-[#FF8C00]" />
                    Items ({order.items.length})
                </h2>
                <div className="space-y-3">
                    {order.items.map((item, idx) => (
                        <div key={idx} className="flex gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                            <div className="w-16 h-16 rounded-xl bg-white border border-gray-200 overflow-hidden shrink-0">
                                {item.image ? (
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Package size={20} className="text-gray-300" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-[#1A1A1A] truncate">{item.name}</p>
                                <p className="text-xs text-[#888888] font-medium mt-0.5">Qty: {item.quantity}</p>
                                <p className="text-sm font-bold text-[#FF8C00] mt-1">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-[#888888] font-medium">Subtotal</span>
                        <span className="font-bold text-[#1A1A1A]">₹{(order.totalAmount - (order.shippingFee || 0)).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-[#888888] font-medium">Shipping</span>
                        <span className={`font-bold ${order.shippingFee === 0 ? "text-green-600" : "text-[#1A1A1A]"}`}>
                            {order.shippingFee === 0 ? "FREE" : `₹${order.shippingFee.toLocaleString("en-IN")}`}
                        </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="text-sm font-bold text-[#888888]">Order Total</span>
                        <span className="text-xl font-bold text-[#1A1A1A]">₹{order.totalAmount.toLocaleString("en-IN")}</span>
                    </div>
                </div>
            </div>

            {/* ── PAYMENT ── */}
            <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
                <h2 className="text-base font-bold text-[#1A1A1A] mb-3 flex items-center gap-2">
                    <CreditCard size={18} className="text-[#FF8C00]" />
                    Payment
                </h2>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-[#888888]">
                            {order.paymentStatus === "paid" ? "Online Payment" : order.paymentStatus === "refunded" ? "Refunded" : "Cash on Delivery"}
                        </p>
                        {order.razorpayPaymentId && (
                            <p className="text-[10px] text-[#888888] mt-0.5 font-mono">ID: {order.razorpayPaymentId}</p>
                        )}
                    </div>
                    <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${order.paymentStatus === "paid"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        : order.paymentStatus === "refunded"
                            ? "bg-purple-50 text-purple-600 border border-purple-100"
                            : "bg-amber-50 text-amber-600 border border-amber-100"
                        }`}>
                        {order.paymentStatus === "paid" ? <><CheckCircle2 size={12} /> Paid</> : order.paymentStatus === "refunded" ? "Refunded" : "COD"}
                    </span>
                </div>
            </div>

            {/* ── SHIPPING ADDRESS ── */}
            {order.shippingAddress && (
                <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
                    <h2 className="text-base font-bold text-[#1A1A1A] mb-3 flex items-center gap-2">
                        <MapPin size={18} className="text-[#FF8C00]" />
                        Delivery Address
                    </h2>
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-[#1A1A1A]">{order.shippingAddress.name}</p>
                        <p className="text-sm text-[#888888]">{order.shippingAddress.address}</p>
                        <p className="text-sm text-[#888888]">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                        <div className="flex items-center gap-1.5 mt-2 text-sm text-[#888888]">
                            <Phone size={12} />
                            <span>{order.shippingAddress.phone}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Trust Badge */}
            <div className="flex items-center justify-center gap-2 py-4 text-xs text-[#888888] font-medium">
                <ShieldCheck size={14} className="text-emerald-500" />
                Every product is blessed & certified authentic
            </div>
        </div>
    );
}
