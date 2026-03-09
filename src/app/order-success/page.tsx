"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    CheckCircle2,
    Package,
    Home,
    ShoppingBag,
    ArrowRight,
    Truck,
    ShieldCheck,
    IndianRupee,
    Clock,
    Sparkles,
} from "lucide-react";
import { Suspense } from "react";

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");
    const paymentMethod = searchParams.get("payment") || "cod";
    const isPaid = paymentMethod === "online" || paymentMethod === "razorpay" || paymentMethod === "paid";

    return (
        <div className="mx-auto flex min-h-[80dvh] max-w-lg flex-col items-center justify-center px-4 py-12 text-center">
            {/* Success Animation */}
            <div className="relative mb-8">
                <div className="absolute inset-0 animate-ping rounded-full bg-green-400/20" style={{ animationDuration: "2s" }} />
                <div className="relative flex size-28 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-xl shadow-green-200/50">
                    <CheckCircle2 size={52} className="text-white" strokeWidth={2} />
                </div>
                <span className="absolute -left-4 -top-2 text-2xl animate-float" style={{ animationDelay: "0.2s" }}>🪷</span>
                <span className="absolute -right-3 top-0 text-xl animate-float" style={{ animationDelay: "0.5s" }}>✨</span>
                <span className="absolute -bottom-1 -left-2 text-lg animate-float" style={{ animationDelay: "0.8s" }}>🙏</span>
            </div>

            {/* Heading */}
            <h1 className="font-heading text-3xl font-bold text-[#1A1A1A]">
                Order Placed Successfully!
            </h1>
            <p className="mt-3 max-w-sm text-base text-[#888888] font-medium leading-relaxed">
                Thank you for your sacred purchase. Your spiritual products are being prepared with love and devotion.
            </p>

            {/* Order ID */}
            {orderId && (
                <div className="mt-6 w-full max-w-xs rounded-2xl border border-gray-200 bg-white px-6 py-4 shadow-sm">
                    <p className="text-[10px] font-bold text-[#888888] uppercase tracking-[0.15em] mb-1">Order ID</p>
                    <p className="font-mono text-base font-bold text-[#1A1A1A] break-all">
                        #{orderId.slice(-8).toUpperCase()}
                    </p>
                </div>
            )}

            {/* Status Steps */}
            <div className="mt-8 w-full max-w-sm">
                <div className="flex items-center justify-between">
                    {[
                        { icon: CheckCircle2, label: "Placed", done: true },
                        { icon: Package, label: "Processing", done: false },
                        { icon: Truck, label: "Shipped", done: false },
                        { icon: ShieldCheck, label: "Delivered", done: false },
                    ].map((s, i) => (
                        <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                            <div className={`flex size-11 items-center justify-center rounded-full ${s.done ? "bg-green-500 text-white shadow-md shadow-green-200" : "bg-gray-100 text-gray-400"}`}>
                                <s.icon size={18} />
                            </div>
                            <span className={`text-[10px] font-bold ${s.done ? "text-green-600" : "text-gray-400"}`}>{s.label}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-3 flex items-center gap-1 px-6">
                    <div className="h-1.5 flex-1 rounded-full bg-green-500 shadow-sm" />
                    <div className="h-1.5 flex-1 rounded-full bg-gray-200" />
                    <div className="h-1.5 flex-1 rounded-full bg-gray-200" />
                </div>
            </div>

            {/* Info Cards */}
            <div className="mt-8 grid w-full max-w-sm grid-cols-2 gap-4">
                <div className="rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-sm">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-blue-50 mb-2">
                        <Truck size={22} className="text-blue-500" />
                    </div>
                    <p className="text-xs font-bold text-[#888888] uppercase tracking-wider">Estimated Delivery</p>
                    <p className="text-lg font-bold text-[#1A1A1A] mt-0.5">
                        {(() => {
                            const now = new Date();
                            const addBizDays = (start: Date, days: number) => {
                                const r = new Date(start);
                                let a = 0;
                                while (a < days) { r.setDate(r.getDate() + 1); if (r.getDay() !== 0) a++; }
                                return r;
                            };
                            const s = addBizDays(now, 3);
                            const e = addBizDays(now, 5);
                            return `${s.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – ${e.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`;
                        })()}
                    </p>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-4 text-center shadow-sm">
                    <div className={`mx-auto flex size-12 items-center justify-center rounded-full mb-2 ${isPaid ? "bg-emerald-50" : "bg-amber-50"}`}>
                        {isPaid
                            ? <IndianRupee size={22} className="text-emerald-500" />
                            : <Clock size={22} className="text-amber-500" />
                        }
                    </div>
                    <p className="text-xs font-bold text-[#888888] uppercase tracking-wider">Payment</p>
                    <p className={`text-lg font-bold mt-0.5 ${isPaid ? "text-emerald-600" : "text-amber-600"}`}>
                        {isPaid ? "Paid ✓" : "COD"}
                    </p>
                </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-10 flex w-full max-w-sm flex-col gap-3">
                <Link
                    href={orderId ? `/user/orders/${orderId}` : "/user/orders"}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-[#1A1A1A] px-6 py-4 text-base font-bold text-white shadow-lg transition-all active:scale-95 hover:bg-[#333]"
                >
                    <Package size={18} />
                    Track My Order
                    <ArrowRight size={16} />
                </Link>
                <Link
                    href="/shop"
                    className="flex items-center justify-center gap-2 rounded-2xl border-2 border-[#FF8C00] bg-orange-50 px-6 py-3.5 text-base font-bold text-[#FF8C00] transition-all active:scale-95 hover:bg-orange-100"
                >
                    <ShoppingBag size={18} />
                    Continue Shopping
                </Link>
                <Link
                    href="/"
                    className="flex items-center justify-center gap-2 text-sm font-bold text-[#888888] transition hover:text-[#1A1A1A] py-2"
                >
                    <Home size={14} />
                    Back to Home
                </Link>
            </div>

            {/* Trust badge */}
            <div className="mt-8 flex items-center gap-2 rounded-full bg-green-50 px-5 py-2.5 text-xs text-green-700 font-semibold border border-green-100">
                <ShieldCheck size={14} />
                Every product is blessed & certified authentic
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-[60dvh] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="size-8 animate-spin rounded-full border-2 border-saffron-200 border-t-saffron-500" />
                    <p className="text-sm text-warm-500">Loading...</p>
                </div>
            </div>
        }>
            <OrderSuccessContent />
        </Suspense>
    );
}
