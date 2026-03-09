"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useUser } from "@/contexts/UserContext";
import { Trash2, CheckCircle2, Shield, Truck, RotateCcw, Loader2, ShoppingBag, ArrowLeft, Minus, Plus } from "lucide-react";

export default function CartPage() {
    const router = useRouter();
    const { items, count, total, loading, removeItem, updateQuantity } = useCart();
    const { user } = useUser();

    const [couponCode, setCouponCode] = useState("");
    const [couponStatus, setCouponStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponMessage, setCouponMessage] = useState("");

    const applyCoupon = async () => {
        if (!couponCode.trim()) return;
        setCouponStatus("loading");
        try {
            const res = await fetch(`/api/coupons/validate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: couponCode, cartTotal: total }),
            });
            if (res.ok) {
                const data = await res.json();
                setCouponStatus("success");
                setCouponDiscount(data.discount || 0);
                setCouponMessage(data.message || `You save ₹${data.discount}`);
            } else {
                // Fallback for simple coupon
                if (couponCode.toUpperCase() === "FIRST10") {
                    setCouponStatus("success");
                    setCouponDiscount(Math.round(total * 0.1));
                    setCouponMessage(`FIRST10 applied! You save ₹${Math.round(total * 0.1)}`);
                } else {
                    setCouponStatus("error");
                    setCouponDiscount(0);
                    setCouponMessage("Invalid or expired coupon code");
                }
            }
        } catch {
            // Fallback
            if (couponCode.toUpperCase() === "FIRST10") {
                setCouponStatus("success");
                setCouponDiscount(Math.round(total * 0.1));
                setCouponMessage(`FIRST10 applied! You save ₹${Math.round(total * 0.1)}`);
            } else {
                setCouponStatus("error");
                setCouponDiscount(0);
                setCouponMessage("Invalid or expired coupon code");
            }
        }
    };

    const removeCoupon = () => {
        setCouponCode("");
        setCouponStatus("idle");
        setCouponDiscount(0);
        setCouponMessage("");
    };

    const finalTotal = Math.max(total - couponDiscount, 0);
    const isFreeDelivery = finalTotal > 499;
    const deliveryCharge = isFreeDelivery ? 0 : "calculated-later";
    const grandTotal = finalTotal; // Don't add fake shipping cost to cart total

    const handleCheckout = () => {
        if (!user) {
            router.push("/user/login");
            return;
        }
        router.push("/checkout");
    };

    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
                <Loader2 className="size-8 animate-spin text-[#FF8C00]" />
                <p className="text-sm text-gray-500 font-medium">Loading your cart...</p>
            </div>
        );
    }

    if (count === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
                <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mb-6">
                    <ShoppingBag size={36} className="text-[#FF8C00]/50" />
                </div>
                <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2 font-heading">Your cart is empty</h1>
                <p className="text-gray-500 mb-8 max-w-sm">Explore our collection of authentic spiritual products and find your perfect remedy.</p>
                <Link
                    href="/shop"
                    className="bg-[#FF8C00] px-8 py-3.5 rounded-full text-white font-bold tracking-wide hover:bg-[#E67E00] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                    Start Shopping →
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-dvh bg-[#F9F9F9] pb-36 lg:pb-16 px-4 pt-4">
            <div className="max-w-6xl mx-auto">
                {/* Back Button + Title */}
                <div className="flex items-center gap-3 mb-6">
                    <button onClick={() => router.back()} className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold font-heading text-[#1A1A1A]">Your Cart</h1>
                        <p className="text-xs text-gray-500">{count} {count === 1 ? "item" : "items"}</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* LEFT: Items List */}
                    <div className="w-full lg:w-[62%]">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            {items.map((item, idx) => (
                                <div key={item.productId} className={`p-4 flex gap-3 sm:gap-4 relative ${idx !== items.length - 1 ? "border-b border-gray-100" : ""}`}>
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>

                                    <div className="flex flex-col flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 pr-6 sm:pr-8">
                                            <h3 className="font-bold text-[#1A1A1A] text-xs sm:text-sm leading-tight line-clamp-2">
                                                {item.name}
                                            </h3>
                                        </div>

                                        {/* Remove button absolutely positioned top-right on mobile so it doesn't squish title */}
                                        <button
                                            onClick={() => removeItem(item.productId)}
                                            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-red-500 transition-colors p-1.5 shrink-0 bg-white sm:bg-transparent rounded-full border sm:border-transparent border-gray-100 shadow-sm sm:shadow-none bg-opacity-80 backdrop-blur-sm"
                                            title="Remove item"
                                        >
                                            <Trash2 size={16} />
                                        </button>

                                        <div className="flex items-center justify-between mt-auto pt-3">
                                            {/* Price */}
                                            <div className="flex flex-col">
                                                <span className="font-bold text-[#FF8C00] text-base sm:text-lg">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                                                {item.quantity > 1 && (
                                                    <p className="text-[10px] text-gray-500">{item.quantity} × ₹{item.price.toLocaleString("en-IN")}</p>
                                                )}
                                            </div>

                                            {/* Qty Stepper */}
                                            <div className="flex items-center bg-[#FEFAF4] border border-orange-100 rounded-full h-8 sm:h-9">
                                                <button
                                                    onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                                                    disabled={item.quantity <= 1}
                                                    className="w-8 h-full flex items-center justify-center text-[#FF8C00] font-bold active:bg-orange-100 rounded-l-full disabled:opacity-40"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-7 text-center text-xs font-bold text-[#1A1A1A]">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                    className="w-8 h-full flex items-center justify-center text-[#FF8C00] font-bold active:bg-orange-100 rounded-r-full"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Coupon Section */}
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mt-4">
                            <h3 className="font-bold text-[#1A1A1A] text-sm uppercase tracking-wider mb-3">Apply Coupon Code</h3>
                            {couponStatus === "success" ? (
                                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-green-600" />
                                        <div>
                                            <p className="text-sm font-bold text-green-700">{couponCode}</p>
                                            <p className="text-xs text-green-600">{couponMessage}</p>
                                        </div>
                                    </div>
                                    <button onClick={removeCoupon} className="text-sm font-bold text-red-500 hover:text-red-700">Remove</button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter coupon code"
                                        value={couponCode}
                                        onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); if (couponStatus === "error") setCouponStatus("idle"); }}
                                        className={`flex-1 border-2 bg-[#FEFAF4] rounded-xl px-4 py-2.5 text-sm font-bold text-[#1A1A1A] uppercase focus:outline-none focus:border-[#FF8C00] transition-colors ${couponStatus === "error" ? "border-red-300" : "border-orange-100"}`}
                                    />
                                    <button
                                        onClick={applyCoupon}
                                        disabled={couponStatus === "loading" || !couponCode.trim()}
                                        className="bg-[#1A1A1A] text-white px-6 font-bold text-sm rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
                                    >
                                        {couponStatus === "loading" ? <Loader2 size={16} className="animate-spin" /> : "Apply"}
                                    </button>
                                </div>
                            )}
                            {couponStatus === "error" && (
                                <p className="text-xs font-medium text-red-500 mt-2">{couponMessage}</p>
                            )}
                        </div>

                        {/* Free Delivery Progress */}
                        {!isFreeDelivery && (
                            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mt-4">
                                <p className="text-xs font-medium text-blue-700">
                                    🚚 Add ₹{(499 - finalTotal).toLocaleString("en-IN")} more for <strong>FREE delivery!</strong>
                                </p>
                                <div className="mt-2 h-1.5 bg-blue-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${Math.min((finalTotal / 499) * 100, 100)}%` }} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Order Summary */}
                    <div className="hidden lg:block w-full lg:w-[38%]">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-[96px]">
                            <h2 className="text-lg font-bold text-[#1A1A1A] mb-4 font-heading border-b border-gray-100 pb-4">
                                Order Summary
                            </h2>

                            <div className="space-y-3 mb-6 font-medium text-sm text-gray-500">
                                <div className="flex justify-between">
                                    <span>Subtotal ({count} items)</span>
                                    <span className="text-[#1A1A1A] font-bold">₹{total.toLocaleString("en-IN")}</span>
                                </div>
                                {couponDiscount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Coupon ({couponCode})</span>
                                        <span className="font-bold">-₹{couponDiscount.toLocaleString("en-IN")}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span>Delivery</span>
                                    {isFreeDelivery ? (
                                        <span className="text-green-600 font-bold flex items-center gap-1">Free <CheckCircle2 size={12} /></span>
                                    ) : (
                                        <span className="text-gray-400 font-medium text-xs italic">
                                            Calculated at checkout
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="border-t border-dashed border-orange-200 pt-4 mb-6">
                                <div className="flex justify-between items-center bg-[#FEFAF4] p-3 rounded-lg border border-orange-100">
                                    <span className="font-bold text-[#1A1A1A]">Total Amount</span>
                                    <span className="text-2xl font-bold text-[#FF8C00]">₹{grandTotal.toLocaleString("en-IN")}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full bg-[#FF8C00] py-4 rounded-xl text-white font-bold tracking-wide shadow-md hover:bg-[#E67E00] hover:shadow-lg hover:-translate-y-0.5 transition-all"
                            >
                                {user ? "Proceed to Checkout →" : "Login to Checkout →"}
                            </button>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-6 mt-6">
                                <div className="flex flex-col items-center text-center gap-1.5">
                                    <Shield size={20} className="text-green-500" />
                                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider leading-tight">Secure Payment</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-1.5 border-x border-gray-100">
                                    <Truck size={20} className="text-[#FF8C00]" />
                                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider leading-tight">COD Available</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-1.5">
                                    <RotateCcw size={20} className="text-indigo-500" />
                                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider leading-tight">7 Day Returns</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* STICKY CHECKOUT BAR (Mobile) */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] px-4 py-3 flex items-center justify-between safe-bottom">
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Total Amount</span>
                    <span className="text-xl font-bold text-[#FF8C00] leading-none">₹{grandTotal.toLocaleString("en-IN")}</span>
                    {isFreeDelivery && <span className="text-[9px] text-green-600 font-medium">Free delivery ✓</span>}
                </div>
                <button
                    onClick={handleCheckout}
                    className="bg-[#FF8C00] text-white px-8 py-3 rounded-full font-bold shadow-md active:scale-95 transition-transform"
                >
                    {user ? "Checkout →" : "Login & Checkout →"}
                </button>
            </div>
        </div>
    );
}
