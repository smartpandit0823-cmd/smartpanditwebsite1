"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    MapPin,
    CreditCard,
    ShieldCheck,
    Truck,
    Loader2,
    Package,
    ChevronDown,
    ChevronUp,
    Check,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useUser } from "@/contexts/UserContext";

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Jammu & Kashmir", "Ladakh",
    "Chandigarh", "Puducherry", "Lakshadweep",
    "Andaman & Nicobar Islands", "Dadra & Nagar Haveli and Daman & Diu",
];

interface AddressForm {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
}

export default function CheckoutPage() {
    const { items, total, count, loading: cartLoading, clearCart } = useCart();
    const { user, loading: authLoading } = useUser();
    const router = useRouter();

    const [step, setStep] = useState<"address" | "review">("address");
    const [submitting, setSubmitting] = useState(false);
    const [showOrderSummary, setShowOrderSummary] = useState(false);
    const [addressForm, setAddressForm] = useState<AddressForm>({
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
    });
    const [errors, setErrors] = useState<Partial<AddressForm>>({});

    // Pre-fill from user
    useEffect(() => {
        if (user) {
            setAddressForm((prev) => ({
                ...prev,
                name: user.name || prev.name,
                phone: user.phone?.replace("google_", "") || prev.phone,
            }));
        }
    }, [user]);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/user/login");
        }
    }, [user, authLoading, router]);

    if (cartLoading || authLoading) {
        return (
            <div className="flex min-h-[60dvh] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="size-8 animate-spin text-saffron-500" />
                    <p className="text-sm text-warm-500">Loading checkout...</p>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="mx-auto max-w-lg px-4 pt-24 text-center">
                <Package className="mx-auto mb-3 text-warm-300" size={48} />
                <h1 className="font-serif text-xl font-semibold text-warm-800">Cart is empty</h1>
                <p className="mt-1 text-sm text-warm-500">Add products to proceed to checkout</p>
                <Link
                    href="/store"
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-saffron-500 px-5 py-2.5 text-sm font-bold text-white"
                >
                    Browse Store
                </Link>
            </div>
        );
    }

    const deliveryCharge = total >= 499 ? 0 : 49;
    const grandTotal = total + deliveryCharge;

    const validateAddress = (): boolean => {
        const e: Partial<AddressForm> = {};
        if (!addressForm.name.trim()) e.name = "Name is required";
        if (!addressForm.phone.trim() || addressForm.phone.replace(/\D/g, "").length < 10)
            e.phone = "Valid phone required";
        if (!addressForm.address.trim()) e.address = "Address is required";
        if (!addressForm.city.trim()) e.city = "City is required";
        if (!addressForm.state) e.state = "Select state";
        if (!addressForm.pincode.trim() || addressForm.pincode.length !== 6)
            e.pincode = "Valid 6-digit pincode";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleProceedToReview = () => {
        if (validateAddress()) {
            setStep("review");
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handlePlaceOrder = async () => {
        setSubmitting(true);
        try {
            const res = await fetch("/api/order/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ shippingAddress: addressForm }),
            });
            const data = await res.json();

            if (!res.ok) {
                alert(data.error || "Order failed. Please try again.");
                setSubmitting(false);
                return;
            }

            clearCart();
            router.push(`/order-success?orderId=${data.order.id}`);
        } catch {
            alert("Something went wrong. Please try again.");
            setSubmitting(false);
        }
    };

    const updateField = (field: keyof AddressForm, value: string) => {
        setAddressForm((p) => ({ ...p, [field]: value }));
        if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
    };

    return (
        <div className="mx-auto max-w-lg px-4 pb-44 pt-20 md:max-w-4xl md:pb-12 md:pt-24">
            {/* Header */}
            <div className="mb-6 flex items-center gap-3">
                <button
                    onClick={() => (step === "review" ? setStep("address") : router.back())}
                    className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm border border-warm-100 transition active:scale-95"
                >
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <h1 className="font-serif text-xl font-bold text-warm-900">Checkout</h1>
                    <p className="text-xs text-warm-500">
                        {step === "address" ? "Step 1 – Delivery Address" : "Step 2 – Review & Pay"}
                    </p>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="mb-6 flex items-center gap-2">
                <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${step === "address" ? "bg-saffron-500 text-white" : "bg-green-500 text-white"}`}>
                    {step === "review" ? <Check size={12} /> : <MapPin size={12} />}
                    Address
                </div>
                <div className="h-px flex-1 bg-gold-200" />
                <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${step === "review" ? "bg-saffron-500 text-white" : "bg-warm-200 text-warm-500"}`}>
                    <CreditCard size={12} />
                    Review & Pay
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-[1fr_320px]">
                {/* Main content */}
                <div>
                    {step === "address" ? (
                        /* ── Address Form ── */
                        <div className="rounded-2xl border border-gold-200/60 bg-white p-5 shadow-sm">
                            <h2 className="flex items-center gap-2 font-serif text-base font-semibold text-warm-900">
                                <MapPin size={16} className="text-saffron-500" />
                                Delivery Address
                            </h2>

                            <div className="mt-4 space-y-3">
                                {/* Name */}
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-warm-600">Full Name *</label>
                                    <input
                                        type="text"
                                        value={addressForm.name}
                                        onChange={(e) => updateField("name", e.target.value)}
                                        placeholder="Enter full name"
                                        className={`w-full rounded-xl border bg-warm-50/50 px-4 py-3 text-sm text-warm-900 outline-none transition focus:border-saffron-400 focus:ring-2 focus:ring-saffron-100 ${errors.name ? "border-red-300" : "border-gold-200"}`}
                                    />
                                    {errors.name && <p className="mt-0.5 text-[11px] text-red-500">{errors.name}</p>}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-warm-600">Phone Number *</label>
                                    <input
                                        type="tel"
                                        value={addressForm.phone}
                                        onChange={(e) => updateField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                                        placeholder="10-digit mobile number"
                                        className={`w-full rounded-xl border bg-warm-50/50 px-4 py-3 text-sm text-warm-900 outline-none transition focus:border-saffron-400 focus:ring-2 focus:ring-saffron-100 ${errors.phone ? "border-red-300" : "border-gold-200"}`}
                                    />
                                    {errors.phone && <p className="mt-0.5 text-[11px] text-red-500">{errors.phone}</p>}
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-warm-600">Full Address *</label>
                                    <textarea
                                        value={addressForm.address}
                                        onChange={(e) => updateField("address", e.target.value)}
                                        placeholder="House No, Colony, Street, Landmark"
                                        rows={3}
                                        className={`w-full rounded-xl border bg-warm-50/50 px-4 py-3 text-sm text-warm-900 outline-none transition focus:border-saffron-400 focus:ring-2 focus:ring-saffron-100 resize-none ${errors.address ? "border-red-300" : "border-gold-200"}`}
                                    />
                                    {errors.address && <p className="mt-0.5 text-[11px] text-red-500">{errors.address}</p>}
                                </div>

                                {/* City + Pincode row */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-warm-600">City *</label>
                                        <input
                                            type="text"
                                            value={addressForm.city}
                                            onChange={(e) => updateField("city", e.target.value)}
                                            placeholder="City"
                                            className={`w-full rounded-xl border bg-warm-50/50 px-4 py-3 text-sm text-warm-900 outline-none transition focus:border-saffron-400 focus:ring-2 focus:ring-saffron-100 ${errors.city ? "border-red-300" : "border-gold-200"}`}
                                        />
                                        {errors.city && <p className="mt-0.5 text-[11px] text-red-500">{errors.city}</p>}
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-warm-600">Pincode *</label>
                                        <input
                                            type="text"
                                            value={addressForm.pincode}
                                            onChange={(e) => updateField("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                                            placeholder="6-digit"
                                            className={`w-full rounded-xl border bg-warm-50/50 px-4 py-3 text-sm text-warm-900 outline-none transition focus:border-saffron-400 focus:ring-2 focus:ring-saffron-100 ${errors.pincode ? "border-red-300" : "border-gold-200"}`}
                                        />
                                        {errors.pincode && <p className="mt-0.5 text-[11px] text-red-500">{errors.pincode}</p>}
                                    </div>
                                </div>

                                {/* State */}
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-warm-600">State *</label>
                                    <select
                                        value={addressForm.state}
                                        onChange={(e) => updateField("state", e.target.value)}
                                        className={`w-full rounded-xl border bg-warm-50/50 px-4 py-3 text-sm text-warm-900 outline-none transition focus:border-saffron-400 focus:ring-2 focus:ring-saffron-100 appearance-none ${errors.state ? "border-red-300" : "border-gold-200"} ${!addressForm.state ? "text-warm-400" : ""}`}
                                    >
                                        <option value="">Select State</option>
                                        {INDIAN_STATES.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                    {errors.state && <p className="mt-0.5 text-[11px] text-red-500">{errors.state}</p>}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* ── Review Step ── */
                        <div className="space-y-4">
                            {/* Delivery Address Card */}
                            <div className="rounded-2xl border border-gold-200/60 bg-white p-4 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <h3 className="flex items-center gap-2 text-sm font-semibold text-warm-900">
                                        <MapPin size={14} className="text-saffron-500" />
                                        Delivery Address
                                    </h3>
                                    <button
                                        onClick={() => setStep("address")}
                                        className="rounded-lg bg-saffron-50 px-3 py-1 text-xs font-semibold text-saffron-600 transition hover:bg-saffron-100"
                                    >
                                        Edit
                                    </button>
                                </div>
                                <div className="mt-2 text-sm text-warm-700">
                                    <p className="font-semibold">{addressForm.name}</p>
                                    <p className="mt-0.5">{addressForm.address}</p>
                                    <p>{addressForm.city}, {addressForm.state} – {addressForm.pincode}</p>
                                    <p className="mt-0.5 text-warm-500">📞 +91 {addressForm.phone}</p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="rounded-2xl border border-gold-200/60 bg-white p-4 shadow-sm">
                                <h3 className="flex items-center gap-2 text-sm font-semibold text-warm-900">
                                    <Package size={14} className="text-saffron-500" />
                                    Items ({count})
                                </h3>
                                <div className="mt-3 space-y-3">
                                    {items.map((item) => (
                                        <div key={item.productId} className="flex items-center gap-3">
                                            <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-warm-50">
                                                <Image
                                                    src={item.image || "/placeholder-product.jpg"}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="56px"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="line-clamp-1 text-sm font-medium text-warm-900">{item.name}</p>
                                                <p className="text-xs text-warm-500">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="text-sm font-semibold text-warm-900">
                                                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="rounded-2xl border border-gold-200/60 bg-white p-4 shadow-sm">
                                <h3 className="flex items-center gap-2 text-sm font-semibold text-warm-900">
                                    <CreditCard size={14} className="text-saffron-500" />
                                    Payment
                                </h3>
                                <p className="mt-2 text-xs text-warm-500">
                                    Cash on Delivery (COD) · Pay when you receive your order
                                </p>
                                <div className="mt-2 flex items-center gap-2 rounded-xl bg-green-50 px-3 py-2 text-xs text-green-700">
                                    <Check size={12} />
                                    <span className="font-medium">COD Selected</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Order Summary Sidebar (Desktop) ── */}
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

                        {step === "address" ? (
                            <button
                                onClick={handleProceedToReview}
                                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-saffron-500 to-saffron-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all active:scale-95"
                            >
                                Continue to Review
                            </button>
                        ) : (
                            <button
                                onClick={handlePlaceOrder}
                                disabled={submitting}
                                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-green-500 to-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all active:scale-95 disabled:opacity-60"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Placing Order...
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck size={16} />
                                        Place Order · ₹{grandTotal.toLocaleString("en-IN")}
                                    </>
                                )}
                            </button>
                        )}

                        <div className="mt-3 flex items-center gap-2 text-[11px] text-warm-500">
                            <ShieldCheck size={12} className="text-green-500" />
                            100% Secure & Authenticated Products
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Mobile Order Summary Toggle ── */}
            <div className="md:hidden mt-4">
                <button
                    onClick={() => setShowOrderSummary(!showOrderSummary)}
                    className="flex w-full items-center justify-between rounded-2xl border border-gold-200/60 bg-white px-4 py-3 shadow-sm"
                >
                    <span className="text-sm font-semibold text-warm-900">
                        Order Summary ({count} items)
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-warm-900">₹{grandTotal.toLocaleString("en-IN")}</span>
                        {showOrderSummary ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                </button>
                {showOrderSummary && (
                    <div className="mt-1 rounded-2xl border border-gold-200/60 bg-white p-4 shadow-sm animate-in slide-in-from-top-2 duration-200">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-warm-600">
                                <span>Subtotal</span>
                                <span>₹{total.toLocaleString("en-IN")}</span>
                            </div>
                            <div className="flex justify-between text-warm-600">
                                <span>Delivery</span>
                                <span className={deliveryCharge === 0 ? "text-green-600 font-medium" : ""}>
                                    {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                                </span>
                            </div>
                            <div className="border-t border-gold-200/60 pt-2 flex justify-between font-semibold text-warm-900">
                                <span>Total</span>
                                <span>₹{grandTotal.toLocaleString("en-IN")}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Sticky Bottom Bar (Mobile) ── */}
            <div className="fixed bottom-[72px] left-0 right-0 z-40 md:hidden">
                <div className="border-t border-gold-200/40 bg-white/95 px-4 py-3 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.08)] backdrop-blur-xl">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <span className="text-xl font-bold text-warm-900 tracking-tight">
                                ₹{grandTotal.toLocaleString("en-IN")}
                            </span>
                            <p className="text-[10px] text-warm-400">
                                {deliveryCharge === 0 ? "Free delivery" : `+₹${deliveryCharge} delivery`}
                            </p>
                        </div>
                        {step === "address" ? (
                            <button
                                onClick={handleProceedToReview}
                                className="flex flex-1 max-w-[200px] items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-saffron-500 to-saffron-600 px-5 py-3.5 text-sm font-bold text-white shadow-[0_4px_14px_0_rgba(245,158,11,0.39)] transition-all active:scale-95"
                            >
                                Review Order →
                            </button>
                        ) : (
                            <button
                                onClick={handlePlaceOrder}
                                disabled={submitting}
                                className="flex flex-1 max-w-[220px] items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-green-500 to-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg transition-all active:scale-95 disabled:opacity-60"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 size={14} className="animate-spin" />
                                        Placing...
                                    </>
                                ) : (
                                    "Place Order ✓"
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
