"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ShoppingBag,
    Trash2,
    Minus,
    Plus,
    ArrowLeft,
    ShieldCheck,
    Truck,
    Loader2,
    Package,
    Sparkles,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useUser } from "@/contexts/UserContext";

export default function CartPage() {
    const { items, total, count, loading, updateQuantity, removeItem } = useCart();
    const { user, loading: authLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/user/login");
        }
    }, [user, authLoading, router]);

    if (loading || authLoading) {
        return (
            <div className="flex min-h-[60dvh] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="size-8 animate-spin text-saffron-500" />
                    <p className="text-sm text-warm-500">Loading cart...</p>
                </div>
            </div>
        );
    }

    const deliveryCharge = total >= 499 ? 0 : 49;
    const grandTotal = total + deliveryCharge;

    return (
        <div className="mx-auto max-w-lg px-4 pb-44 pt-20 md:max-w-4xl md:pb-12 md:pt-24">
            {/* Header */}
            <div className="mb-6 flex items-center gap-3">
                <button
                    onClick={() => router.back()}
                    className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm border border-warm-100 transition active:scale-95"
                >
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <h1 className="font-serif text-xl font-bold text-warm-900">Shopping Cart</h1>
                    <p className="text-xs text-warm-500">{count} {count === 1 ? "item" : "items"}</p>
                </div>
            </div>

            {items.length === 0 ? (
                /* ── Empty State ── */
                <div className="flex flex-col items-center py-16 text-center">
                    <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-saffron-50">
                        <ShoppingBag className="text-saffron-300" size={36} />
                    </div>
                    <h2 className="font-serif text-lg font-semibold text-warm-800">Your cart is empty</h2>
                    <p className="mt-1 max-w-[240px] text-sm text-warm-500">
                        Browse our sacred collection and add spiritual products to your cart
                    </p>
                    <Link
                        href="/store"
                        className="mt-6 flex items-center gap-2 rounded-xl bg-linear-to-r from-saffron-500 to-saffron-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition active:scale-95"
                    >
                        <Sparkles size={16} />
                        Explore Store
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-[1fr_320px]">
                    {/* ── Cart Items ── */}
                    <div className="space-y-3">
                        {items.map((item) => (
                            <div
                                key={item.productId}
                                className="flex gap-3 rounded-2xl border border-gold-200/60 bg-white p-3 shadow-sm transition-all"
                            >
                                {/* Image */}
                                <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-warm-50">
                                    <Image
                                        src={item.image || "/placeholder-product.jpg"}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                        sizes="96px"
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex flex-1 flex-col justify-between">
                                    <div>
                                        <h3 className="line-clamp-2 text-sm font-semibold text-warm-900 leading-snug">
                                            {item.name}
                                        </h3>
                                        <p className="mt-0.5 text-lg font-bold text-warm-900">
                                            ₹{item.price.toLocaleString("en-IN")}
                                        </p>
                                    </div>

                                    {/* Quantity + Remove */}
                                    <div className="mt-2 flex items-center justify-between">
                                        <div className="flex items-center rounded-xl border border-gold-200 bg-warm-50/50">
                                            <button
                                                onClick={() => {
                                                    if (item.quantity <= 1) {
                                                        removeItem(item.productId);
                                                    } else {
                                                        updateQuantity(item.productId, item.quantity - 1);
                                                    }
                                                }}
                                                className="flex size-8 items-center justify-center text-warm-600 transition hover:text-warm-900"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="min-w-[28px] text-center text-sm font-semibold text-warm-900">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                className="flex size-8 items-center justify-center text-warm-600 transition hover:text-warm-900"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeItem(item.productId)}
                                            className="flex size-8 items-center justify-center rounded-lg text-warm-400 transition hover:bg-red-50 hover:text-red-500"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Free shipping progress */}
                        {total < 499 && (
                            <div className="rounded-2xl border border-gold-200/60 bg-saffron-50/50 p-3">
                                <div className="flex items-center gap-2 text-xs text-warm-700">
                                    <Truck size={14} className="text-saffron-500" />
                                    <span>
                                        Add <span className="font-bold text-saffron-600">₹{(499 - total).toLocaleString("en-IN")}</span> more for{" "}
                                        <span className="font-bold text-green-600">FREE shipping!</span>
                                    </span>
                                </div>
                                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-warm-200">
                                    <div
                                        className="h-full rounded-full bg-linear-to-r from-saffron-400 to-saffron-600 transition-all duration-500"
                                        style={{ width: `${Math.min(100, (total / 499) * 100)}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Order Summary (Desktop) ── */}
                    <div className="hidden md:block">
                        <div className="sticky top-24 rounded-2xl border border-gold-200/60 bg-white p-5 shadow-sm">
                            <h3 className="font-serif text-lg font-semibold text-warm-900">Order Summary</h3>

                            <div className="mt-4 space-y-2 text-sm">
                                <div className="flex justify-between text-warm-600">
                                    <span>Subtotal ({count} items)</span>
                                    <span className="font-medium text-warm-900">₹{total.toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex justify-between text-warm-600">
                                    <span>Delivery</span>
                                    <span className={`font-medium ${deliveryCharge === 0 ? "text-green-600" : "text-warm-900"}`}>
                                        {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                                    </span>
                                </div>
                                <div className="border-t border-gold-200/60 pt-2">
                                    <div className="flex justify-between">
                                        <span className="font-semibold text-warm-900">Total</span>
                                        <span className="text-lg font-bold text-warm-900">₹{grandTotal.toLocaleString("en-IN")}</span>
                                    </div>
                                </div>
                            </div>

                            <Link
                                href="/checkout"
                                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-saffron-500 to-saffron-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all active:scale-95 hover:shadow-xl"
                            >
                                <Package size={16} />
                                Proceed to Checkout
                            </Link>

                            <div className="mt-4 space-y-2">
                                <div className="flex items-center gap-2 text-[11px] text-warm-500">
                                    <ShieldCheck size={12} className="text-green-500" />
                                    Secure checkout with Razorpay
                                </div>
                                <div className="flex items-center gap-2 text-[11px] text-warm-500">
                                    <Truck size={12} className="text-saffron-500" />
                                    Free shipping on orders ₹499+
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Sticky Checkout Bar (Mobile) ── */}
            {items.length > 0 && (
                <div className="fixed bottom-[72px] left-0 right-0 z-40 md:hidden">
                    <div className="border-t border-gold-200/40 bg-white/95 px-4 py-3 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.08)] backdrop-blur-xl">
                        {/* Price summary */}
                        <div className="mb-2.5 flex items-center justify-between text-xs text-warm-500">
                            <span>{count} items · Delivery {deliveryCharge === 0 ? <span className="text-green-600 font-semibold">FREE</span> : `₹${deliveryCharge}`}</span>
                            <div className="flex items-center gap-1">
                                <ShieldCheck size={11} className="text-green-500" />
                                <span>Secure Pay</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <span className="text-xl font-bold text-warm-900 tracking-tight">
                                    ₹{grandTotal.toLocaleString("en-IN")}
                                </span>
                                <p className="text-[10px] text-warm-400">Total amount</p>
                            </div>
                            <Link
                                href="/checkout"
                                className="flex flex-1 max-w-[200px] items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-saffron-500 to-saffron-600 px-5 py-3.5 text-sm font-bold text-white shadow-[0_4px_14px_0_rgba(245,158,11,0.39)] transition-all active:scale-95"
                            >
                                Checkout →
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
