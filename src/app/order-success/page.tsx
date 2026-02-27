"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    CheckCircle2,
    Package,
    Home,
    ShoppingBag,
    ArrowRight,
    Sparkles,
    Truck,
    ShieldCheck,
} from "lucide-react";
import { Suspense } from "react";

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");

    return (
        <div className="mx-auto flex min-h-[80dvh] max-w-lg flex-col items-center justify-center px-4 py-12 text-center">
            {/* Success Animation */}
            <div className="relative mb-6">
                {/* Glow ring */}
                <div className="absolute inset-0 animate-ping rounded-full bg-green-400/20" style={{ animationDuration: "2s" }} />
                {/* Outer ring */}
                <div className="relative flex size-24 items-center justify-center rounded-full bg-linear-to-br from-green-400 to-emerald-500 shadow-xl shadow-green-200/50">
                    <CheckCircle2 size={48} className="text-white" strokeWidth={2} />
                </div>
                {/* Floating decorations */}
                <span className="absolute -left-4 -top-2 text-2xl animate-float" style={{ animationDelay: "0.2s" }}>🪷</span>
                <span className="absolute -right-3 top-0 text-xl animate-float" style={{ animationDelay: "0.5s" }}>✨</span>
                <span className="absolute -bottom-1 -left-2 text-lg animate-float" style={{ animationDelay: "0.8s" }}>🙏</span>
            </div>

            {/* Heading */}
            <h1 className="font-serif text-2xl font-bold text-warm-900 md:text-3xl">
                Order Placed Successfully!
            </h1>
            <p className="mt-2 max-w-sm text-sm text-warm-600">
                Thank you for your sacred purchase. Your spiritual products are being prepared with love and devotion.
            </p>

            {/* Order ID */}
            {orderId && (
                <div className="mt-5 rounded-2xl border border-gold-200/60 bg-white px-5 py-3 shadow-sm">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-warm-400">Order ID</p>
                    <p className="mt-0.5 font-mono text-sm font-semibold text-warm-800">{orderId}</p>
                </div>
            )}

            {/* Status Steps */}
            <div className="mt-6 w-full max-w-xs">
                <div className="flex items-center justify-between gap-2">
                    {[
                        { icon: CheckCircle2, label: "Placed", done: true },
                        { icon: Package, label: "Processing", done: false },
                        { icon: Truck, label: "Shipped", done: false },
                        { icon: ShieldCheck, label: "Delivered", done: false },
                    ].map((s, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                            <div className={`flex size-9 items-center justify-center rounded-full ${s.done ? "bg-green-500 text-white" : "bg-warm-100 text-warm-400"}`}>
                                <s.icon size={16} />
                            </div>
                            <span className={`text-[10px] font-medium ${s.done ? "text-green-600" : "text-warm-400"}`}>{s.label}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-2 flex items-center gap-1">
                    <div className="h-1 flex-1 rounded-full bg-green-500" />
                    <div className="h-1 flex-1 rounded-full bg-warm-200" />
                    <div className="h-1 flex-1 rounded-full bg-warm-200" />
                </div>
            </div>

            {/* Info Cards */}
            <div className="mt-8 grid w-full max-w-sm grid-cols-2 gap-3">
                <div className="rounded-2xl border border-gold-200/60 bg-white p-3 text-center">
                    <Truck size={20} className="mx-auto text-saffron-500" />
                    <p className="mt-1.5 text-xs font-semibold text-warm-800">Delivery in</p>
                    <p className="text-sm font-bold text-saffron-600">5–7 days</p>
                </div>
                <div className="rounded-2xl border border-gold-200/60 bg-white p-3 text-center">
                    <Sparkles size={20} className="mx-auto text-saffron-500" />
                    <p className="mt-1.5 text-xs font-semibold text-warm-800">Payment</p>
                    <p className="text-sm font-bold text-green-600">COD</p>
                </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex w-full max-w-sm flex-col gap-3">
                <Link
                    href="/user/orders"
                    className="flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-saffron-500 to-saffron-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all active:scale-95"
                >
                    <Package size={16} />
                    Track My Order
                    <ArrowRight size={14} />
                </Link>
                <Link
                    href="/store"
                    className="flex items-center justify-center gap-2 rounded-xl border-2 border-saffron-200 bg-saffron-50 px-6 py-3 text-sm font-bold text-saffron-700 transition-all active:scale-95 hover:bg-saffron-100"
                >
                    <ShoppingBag size={16} />
                    Continue Shopping
                </Link>
                <Link
                    href="/"
                    className="flex items-center justify-center gap-2 text-sm font-medium text-warm-500 transition hover:text-warm-700"
                >
                    <Home size={14} />
                    Back to Home
                </Link>
            </div>

            {/* Trust badge */}
            <div className="mt-8 flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-xs text-green-700">
                <ShieldCheck size={14} />
                <span className="font-medium">Every product is blessed & certified authentic</span>
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
