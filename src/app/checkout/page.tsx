"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
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
    Wallet,
    Banknote,
    Trash2,
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

type PaymentMethod = "razorpay" | "cod";

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Razorpay: any;
    }
}

function CheckoutInner() {
    const { items: cartItems, total: cartTotal, count: cartCount, loading: cartLoading, clearCart, removeItem } = useCart();
    const { user, loading: authLoading } = useUser();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Buy Now mode: single product checkout
    const buyNowProductId = searchParams.get("buyNow");
    const buyNowQty = parseInt(searchParams.get("qty") || "1") || 1;
    const [buyNowProduct, setBuyNowProduct] = useState<{
        productId: string; name: string; image: string; price: number; quantity: number; codAvailable?: boolean;
    } | null>(null);
    const [buyNowLoading, setBuyNowLoading] = useState(!!buyNowProductId);

    // Fetch single product info for Buy Now
    useEffect(() => {
        if (!buyNowProductId) return;
        setBuyNowLoading(true);
        fetch(`/api/products/${buyNowProductId}`)
            .then(r => r.json())
            .then(data => {
                if (data && (data.product || data.name)) {
                    const p = data.product || data;
                    setBuyNowProduct({
                        productId: buyNowProductId,
                        name: p.name,
                        image: p.images?.[0] || p.mainImage || "/placeholder-product.jpg",
                        price: p.pricing?.sellingPrice ?? p.price ?? 0,
                        quantity: buyNowQty,
                        codAvailable: p.codAvailable ?? p.inventory?.codAvailable ?? true,
                    });
                }
            })
            .catch(() => { })
            .finally(() => setBuyNowLoading(false));
    }, [buyNowProductId, buyNowQty]);

    // Determine which items/totals to use
    const isBuyNow = !!buyNowProductId;
    const items = useMemo(() => {
        if (isBuyNow && buyNowProduct) {
            return [buyNowProduct];
        }
        return cartItems;
    }, [isBuyNow, buyNowProduct, cartItems]);

    const total = useMemo(() => {
        if (isBuyNow && buyNowProduct) {
            return buyNowProduct.price * buyNowProduct.quantity;
        }
        return cartTotal;
    }, [isBuyNow, buyNowProduct, cartTotal]);

    const count = useMemo(() => {
        if (isBuyNow && buyNowProduct) {
            return buyNowProduct.quantity;
        }
        return cartCount;
    }, [isBuyNow, buyNowProduct, cartCount]);

    const isLoading = cartLoading || buyNowLoading;

    const [step, setStep] = useState<"address" | "review">("address");
    const [submitting, setSubmitting] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("razorpay");
    const [showOrderSummary, setShowOrderSummary] = useState(false);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [selectedAddressIndex, setSelectedAddressIndex] = useState<number | null>(null);
    const [pincodeCheck, setPincodeCheck] = useState<{ checking: boolean; result: any }>({
        checking: false,
        result: null,
    });

    const [addressForm, setAddressForm] = useState<AddressForm>({
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
    });
    const [errors, setErrors] = useState<Partial<AddressForm>>({});

    useEffect(() => {
        if (!user) return;

        if (user.addresses && user.addresses.length > 0 && !isAddingNew) {
            // Pre-select first address if none selected
            if (selectedAddressIndex === null) {
                const defaultIdx = user.addresses.findIndex((a: any) => a.isDefault);
                setSelectedAddressIndex(defaultIdx >= 0 ? defaultIdx : 0);
            }
        } else if (!user.addresses || user.addresses.length === 0) {
            setIsAddingNew(true);
        }

        // Prefill basic info if adding new (only once when becoming true)
        if (isAddingNew) {
            setAddressForm((prev) => {
                // Prevent infinite updates if already set
                if (prev.name || prev.phone) return prev;
                return {
                    ...prev,
                    name: user.name || "",
                    phone: user.phone?.replace("google_", "") || "",
                };
            });
        }
    }, [user, isAddingNew, selectedAddressIndex]);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/user/login");
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (!isAddingNew && selectedAddressIndex !== null && user?.addresses && user.addresses[selectedAddressIndex]) {
            const addr = user.addresses[selectedAddressIndex];
            if (addr.pincode?.length === 6 && count > 0) {
                setPincodeCheck({ checking: true, result: null });
                const totalWeight = count * 500;
                fetch(`/api/shipping/pincode?pincode=${addr.pincode}&weight=${totalWeight}`)
                    .then((r) => r.json())
                    .then((data) => setPincodeCheck({ checking: false, result: data }))
                    .catch(() => setPincodeCheck({ checking: false, result: null }));
            }
        }
    }, [selectedAddressIndex, isAddingNew, count, user?.addresses]);

    if (isLoading || authLoading) {
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
                    href="/shop"
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-saffron-500 px-5 py-2.5 text-sm font-bold text-white"
                >
                    Browse Store
                </Link>
            </div>
        );
    }



    const calcDeliveryCharge = () => {
        if (total >= 499) return 0;
        if (pincodeCheck.result?.shippingCharge !== undefined && pincodeCheck.result?.shippingCharge !== null) {
            return Math.ceil(pincodeCheck.result.shippingCharge);
        }
        return null; // Don't default to 49 anymore
    };
    const deliveryCharge = calcDeliveryCharge();
    const grandTotal = total + (deliveryCharge || 0);

    // Check if COD is allowed for all items
    const isCodAllowed = items.every((item) => item.codAvailable !== false);

    const validateAddress = (): boolean => {
        if (!isAddingNew && selectedAddressIndex !== null && user?.addresses) {
            return true;
        }

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

    const handleProceedToReview = async () => {
        if (!validateAddress()) return;

        // Get the active pincode
        let activePincode = addressForm.pincode;
        if (!isAddingNew && selectedAddressIndex !== null && user?.addresses) {
            activePincode = user.addresses[selectedAddressIndex].pincode;
        }

        // Check pincode serviceability before proceeding
        setSubmitting(true);
        try {
            const totalWeight = count * 500;
            const res = await fetch(`/api/shipping/pincode?pincode=${activePincode}&weight=${totalWeight}`);
            const data = await res.json();

            if (!data.serviceable) {
                alert(`Sorry, delivery is currently not available for pincode ${activePincode}.`);
                setSubmitting(false);
                return;
            }

            // Check COD availability if required later
            setPincodeCheck({ checking: false, result: data });

            setStep("review");
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch {
            alert("Delivery check failed. Please check your internet connection.");
        } finally {
            setSubmitting(false);
        }
    };

    const handlePlaceOrder = async () => {
        setSubmitting(true);
        try {
            // Determine final address obj to send
            let finalAddress = addressForm;
            if (!isAddingNew && selectedAddressIndex !== null && user?.addresses) {
                const addr = user.addresses[selectedAddressIndex];
                finalAddress = {
                    name: addr.fullName || user.name || "",
                    phone: addr.phone || user.phone || "",
                    address: `${addr.line1} ${addr.line2 || ""} ${addr.area || ""}`.trim(),
                    city: addr.city,
                    state: addr.state,
                    pincode: addr.pincode,
                };
            }

            // Step 1: Create the order on server
            const res = await fetch("/api/order/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    shippingAddress: finalAddress,
                    paymentMethod,
                    ...(isBuyNow && buyNowProduct ? {
                        buyNow: {
                            productId: buyNowProduct.productId,
                            quantity: buyNowProduct.quantity,
                        },
                    } : {}),
                }),
            });
            const data = await res.json();

            if (!res.ok) {
                alert(data.error || "Order failed. Please try again.");
                setSubmitting(false);
                return;
            }

            const orderId = data.order.id;

            if (paymentMethod === "razorpay") {
                // Step 2: Create Razorpay order
                const payRes = await fetch("/api/payment/create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        entityType: "order",
                        entityId: orderId,
                        amount: grandTotal,
                        currency: "INR",
                    }),
                });
                const payData = await payRes.json();

                if (!payRes.ok) {
                    alert(payData.error || "Payment initiation failed");
                    setSubmitting(false);
                    return;
                }

                // Step 3: Open Razorpay checkout
                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    amount: payData.amountInPaise,
                    currency: "INR",
                    name: "SanatanSetu",
                    description: `Order #${orderId.slice(-8)}`,
                    order_id: payData.orderId,
                    prefill: {
                        name: addressForm.name,
                        contact: addressForm.phone,
                    },
                    theme: {
                        color: "#F97316",
                        backdrop_color: "rgba(0,0,0,0.5)",
                    },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    handler: async function (response: any) {
                        // Step 4: Verify payment
                        const verifyRes = await fetch("/api/payment/verify", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            }),
                        });
                        const verifyData = await verifyRes.json();

                        if (verifyData.success) {
                            if (!isBuyNow) clearCart();
                            router.push(`/order-success?orderId=${orderId}&payment=online`);
                        } else {
                            alert("Payment verification failed. Contact support.");
                        }
                    },
                    modal: {
                        ondismiss: function () {
                            setSubmitting(false);
                        },
                    },
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
                return; // Don't clear submitting state yet
            }

            // COD flow
            if (!isBuyNow) clearCart();
            router.push(`/order-success?orderId=${orderId}&payment=cod`);
        } catch {
            alert("Something went wrong. Please try again.");
            setSubmitting(false);
        }
    };

    const updateField = (field: keyof AddressForm, value: string) => {
        setAddressForm((p) => ({ ...p, [field]: value }));
        if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));

        // Auto-check pincode serviceability
        if (field === "pincode" && value.length === 6) {
            setPincodeCheck({ checking: true, result: null });
            const totalWeight = count * 500;
            fetch(`/api/shipping/pincode?pincode=${value}&weight=${totalWeight}`)
                .then((r) => r.json())
                .then((data) => {
                    setPincodeCheck({ checking: false, result: data });
                    // Auto-fill city if available
                    if (data.city && !addressForm.city) {
                        setAddressForm((p) => ({ ...p, city: data.city }));
                    }
                })
                .catch(() => setPincodeCheck({ checking: false, result: null }));
        } else if (field === "pincode") {
            setPincodeCheck({ checking: false, result: null });
        }
    };

    return (
        <>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

            {/* Removed top padding because SiteShell already applies pt-[86px] */}
            <div className="mx-auto max-w-lg px-4 pb-44 pt-6 md:max-w-4xl md:pb-12 md:pt-8">
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
                    <div>
                        {step === "address" ? (
                            /* ── Address Form ── */
                            <div className="rounded-2xl border border-gold-200/60 bg-white p-5 shadow-sm">
                                <h2 className="flex items-center justify-between font-serif text-base font-semibold text-warm-900">
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} className="text-saffron-500" />
                                        Delivery Address
                                    </div>
                                    {!isAddingNew && user?.addresses && user.addresses.length > 0 && (
                                        <button
                                            onClick={() => setIsAddingNew(true)}
                                            className="text-xs font-semibold text-saffron-600 hover:underline"
                                        >
                                            + Add New
                                        </button>
                                    )}
                                </h2>

                                {/* Saved Addresses Selection */}
                                {!isAddingNew && user?.addresses && user.addresses.length > 0 ? (
                                    <div className="mt-4 space-y-3">
                                        {user.addresses.map((addr: any, idx: number) => (
                                            <div
                                                key={addr._id || idx}
                                                onClick={() => setSelectedAddressIndex(idx)}
                                                className={`relative cursor-pointer rounded-xl border p-4 transition-all ${selectedAddressIndex === idx
                                                    ? "border-saffron-500 bg-saffron-50/30"
                                                    : "border-warm-200 hover:border-saffron-300"
                                                    }`}
                                            >
                                                {selectedAddressIndex === idx && (
                                                    <div className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-saffron-500">
                                                        <Check size={12} className="text-white" />
                                                    </div>
                                                )}
                                                <div className="pr-8">
                                                    <p className="font-semibold text-warm-900 flex items-center gap-2">
                                                        {addr.fullName || user.name}
                                                        {addr.isDefault && (
                                                            <span className="bg-warm-100 text-warm-600 text-[10px] px-2 py-0.5 rounded-full">Default</span>
                                                        )}
                                                    </p>
                                                    <p className="mt-1 text-sm text-warm-600 line-clamp-2">
                                                        {addr.line1}, {addr.area && `${addr.area}, `}{addr.city}, {addr.state} - {addr.pincode}
                                                    </p>
                                                    <p className="mt-1 text-xs font-medium text-warm-500">
                                                        +91 {addr.phone || user.phone}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    /* ── Address Form (New Edit Mode) ── */
                                    <div className="mt-4 space-y-3">
                                        {user?.addresses && user.addresses.length > 0 && (
                                            <button
                                                onClick={() => setIsAddingNew(false)}
                                                className="mb-2 text-xs font-semibold text-saffron-600 hover:underline"
                                            >
                                                ← Back to Saved Addresses
                                            </button>
                                        )}

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
                                                {pincodeCheck.checking && (
                                                    <p className="mt-1 text-[11px] text-saffron-500 font-medium flex items-center gap-1">
                                                        <Loader2 size={10} className="animate-spin" /> Checking delivery...
                                                    </p>
                                                )}
                                                {pincodeCheck.result && (
                                                    <div className={`mt-1 text-[11px] font-medium flex items-center gap-1 ${pincodeCheck.result.serviceable ? "text-green-600" : "text-red-500"}`}>
                                                        {pincodeCheck.result.serviceable ? (
                                                            <>
                                                                <Check size={10} /> Delivery available{pincodeCheck.result.cod ? " · COD ✓" : " · Prepaid only"}
                                                                {pincodeCheck.result.estimatedDays && (
                                                                    <span className="ml-1 text-blue-600">
                                                                        · Est. {(() => {
                                                                            const now = new Date();
                                                                            const addBiz = (s: Date, d: number) => { const r = new Date(s); let a = 0; while (a < d) { r.setDate(r.getDate() + 1); if (r.getDay() !== 0) a++; } return r; };
                                                                            const s = addBiz(now, pincodeCheck.result.estimatedDays.min);
                                                                            const e = addBiz(now, pincodeCheck.result.estimatedDays.max);
                                                                            return `${s.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – ${e.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`;
                                                                        })()}
                                                                    </span>
                                                                )}
                                                            </>
                                                        ) : (
                                                            "❌ Delivery not available at this pincode"
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

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
                                )}
                            </div>
                        ) : (
                            /* ── Review Step ── */
                            <div className="space-y-4">
                                {/* Delivery Address */}
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
                                        {!isAddingNew && selectedAddressIndex !== null && user?.addresses ? (
                                            <>
                                                <p className="font-semibold">{user.addresses[selectedAddressIndex].fullName || user.name}</p>
                                                <p className="mt-0.5">{user.addresses[selectedAddressIndex].line1} {user.addresses[selectedAddressIndex].line2} {user.addresses[selectedAddressIndex].area}</p>
                                                <p>{user.addresses[selectedAddressIndex].city}, {user.addresses[selectedAddressIndex].state} – {user.addresses[selectedAddressIndex].pincode}</p>
                                                <p className="mt-0.5 text-warm-500">📞 +91 {user.addresses[selectedAddressIndex].phone || user.phone}</p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="font-semibold">{addressForm.name}</p>
                                                <p className="mt-0.5">{addressForm.address}</p>
                                                <p>{addressForm.city}, {addressForm.state} – {addressForm.pincode}</p>
                                                <p className="mt-0.5 text-warm-500">📞 +91 {addressForm.phone}</p>
                                            </>
                                        )}
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

                                {/* Payment Method Selection */}
                                <div className="rounded-2xl border border-gold-200/60 bg-white p-4 shadow-sm">
                                    <h3 className="flex items-center gap-2 text-sm font-semibold text-warm-900 mb-3">
                                        <CreditCard size={14} className="text-saffron-500" />
                                        Payment Method
                                    </h3>
                                    <div className="space-y-2">
                                        {/* Razorpay Option */}
                                        <button
                                            onClick={() => setPaymentMethod("razorpay")}
                                            className={`flex w-full items-center gap-3 rounded-xl border-2 p-3.5 text-left transition-all ${paymentMethod === "razorpay"
                                                ? "border-saffron-500 bg-saffron-50/60"
                                                : "border-gold-200 bg-white hover:border-warm-300"
                                                }`}
                                        >
                                            <div className={`flex size-10 items-center justify-center rounded-xl ${paymentMethod === "razorpay" ? "bg-saffron-500 text-white" : "bg-warm-100 text-warm-600"
                                                }`}>
                                                <Wallet size={18} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-warm-900">Online Payment</p>
                                                <p className="text-[11px] text-warm-500">UPI, Cards, Net Banking, Wallets</p>
                                            </div>
                                            <div className={`flex size-5 items-center justify-center rounded-full border-2 ${paymentMethod === "razorpay" ? "border-saffron-500 bg-saffron-500" : "border-warm-300"
                                                }`}>
                                                {paymentMethod === "razorpay" && <Check size={12} className="text-white" />}
                                            </div>
                                        </button>

                                        {/* COD Option - ONLY show if all products allow COD */}
                                        {isCodAllowed && (
                                            <button
                                                onClick={() => (!pincodeCheck.result || pincodeCheck.result.cod) && setPaymentMethod("cod")}
                                                disabled={pincodeCheck.result && !pincodeCheck.result.cod}
                                                className={`flex w-full items-center gap-3 rounded-xl border-2 p-3.5 text-left transition-all ${paymentMethod === "cod"
                                                    ? "border-saffron-500 bg-saffron-50/60"
                                                    : pincodeCheck.result && !pincodeCheck.result.cod
                                                        ? "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
                                                        : "border-gold-200 bg-white hover:border-warm-300"
                                                    }`}
                                            >
                                                <div className={`flex size-10 items-center justify-center rounded-xl ${paymentMethod === "cod" ? "bg-saffron-500 text-white" : "bg-warm-100 text-warm-600"
                                                    }`}>
                                                    <Banknote size={18} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className={`text-sm font-semibold ${pincodeCheck.result && !pincodeCheck.result.cod ? "text-gray-500" : "text-warm-900"}`}>Cash on Delivery</p>
                                                    <p className="text-[11px] text-warm-500">
                                                        {pincodeCheck.result && !pincodeCheck.result.cod
                                                            ? "COD not available at your delivery pincode"
                                                            : "Pay when you receive your order"
                                                        }
                                                    </p>
                                                </div>
                                                <div className={`flex size-5 items-center justify-center rounded-full border-2 ${paymentMethod === "cod" ? "border-saffron-500 bg-saffron-500" : "border-warm-300"
                                                    }`}>
                                                    {paymentMethod === "cod" && <Check size={12} className="text-white" />}
                                                </div>
                                            </button>
                                        )}
                                    </div>

                                    {paymentMethod === "razorpay" && (
                                        <div className="mt-3 flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-xs text-blue-700">
                                            <ShieldCheck size={12} />
                                            <span className="font-medium">Secured by Razorpay — 100% safe payment</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Order Summary Sidebar (Desktop) ── */}
                    <div className="hidden md:block">
                        <div className="sticky top-24 rounded-2xl border border-gold-200/60 bg-white p-5 shadow-sm">
                            <h3 className="font-serif text-lg font-semibold text-warm-900">Order Summary</h3>

                            <div className="mt-4 border-b border-gold-200/60 pb-3">
                                {items.map((item, i) => (
                                    <div key={item.productId || i} className="flex gap-3 text-sm py-2">
                                        <div className="relative h-12 w-12 shrink-0 rounded-lg bg-warm-100 overflow-hidden border border-gold-200/50">
                                            <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                                        </div>
                                        <div className="flex flex-1 flex-col justify-center gap-1">
                                            <div className="flex justify-between items-start">
                                                <p className="font-semibold text-warm-900 leading-tight line-clamp-1 pr-2">{item.name}</p>
                                                <p className="font-bold text-warm-900">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <p className="text-xs text-warm-500">Qty: {item.quantity} × ₹{item.price}</p>
                                                <button
                                                    onClick={async () => {
                                                        if (isBuyNow) router.push("/");
                                                        else await removeItem(item.productId);
                                                    }}
                                                    className="text-red-500 hover:text-red-700 text-[11px] font-semibold flex items-center gap-1 pr-1"
                                                >
                                                    <Trash2 size={12} /> Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 space-y-2 text-sm">
                                <div className="flex justify-between text-warm-600">
                                    <span>Subtotal ({count} items)</span>
                                    <span className="font-medium text-warm-900">₹{total.toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex justify-between text-warm-600">
                                    <span>Delivery</span>
                                    <span className={`font-medium ${deliveryCharge === 0 ? "text-green-600" : deliveryCharge === null ? "text-gray-400 text-xs italic" : "text-warm-900"}`}>
                                        {deliveryCharge === 0 ? "FREE" : deliveryCharge === null ? "Calculated next step" : `₹${deliveryCharge}`}
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
                                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-saffron-500 to-saffron-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all active:scale-95"
                                >
                                    Continue to Review
                                </button>
                            ) : (
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={submitting}
                                    className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all active:scale-95 disabled:opacity-60 ${paymentMethod === "razorpay"
                                        ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                                        : "bg-gradient-to-r from-green-500 to-emerald-600"
                                        }`}
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Processing...
                                        </>
                                    ) : paymentMethod === "razorpay" ? (
                                        <>
                                            <Wallet size={16} />
                                            Pay ₹{grandTotal.toLocaleString("en-IN")}
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
                            <div className="border-b border-gold-200/60 pb-3 mb-3">
                                {items.map((item, i) => (
                                    <div key={item.productId || i} className="flex gap-3 text-sm py-2">
                                        <div className="relative h-12 w-12 shrink-0 rounded-lg bg-warm-100 overflow-hidden border border-gold-200/50">
                                            <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                                        </div>
                                        <div className="flex flex-1 flex-col justify-center gap-1">
                                            <div className="flex justify-between items-start">
                                                <p className="font-semibold text-warm-900 leading-tight line-clamp-1 pr-2 max-w-[150px]">{item.name}</p>
                                                <p className="font-bold text-warm-900">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <p className="text-[11px] text-warm-500">Qty: {item.quantity} × ₹{item.price}</p>
                                                <button
                                                    onClick={async () => {
                                                        if (isBuyNow) router.push("/");
                                                        else await removeItem(item.productId);
                                                    }}
                                                    className="text-red-500 hover:text-red-700 text-[11px] font-semibold flex items-center gap-1 pr-1"
                                                >
                                                    <Trash2 size={12} /> Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between text-warm-600">
                                    <span>Subtotal</span>
                                    <span>₹{total.toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex justify-between text-warm-600">
                                    <span>Delivery</span>
                                    <span className={deliveryCharge === 0 ? "text-green-600 font-medium" : deliveryCharge === null ? "text-gray-400 text-xs italic" : ""}>
                                        {deliveryCharge === 0 ? "FREE" : deliveryCharge === null ? "Calculated next step" : `₹${deliveryCharge}`}
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
                                    {deliveryCharge === 0 ? "Free delivery" : deliveryCharge === null ? "Shipping added next step" : `+₹${deliveryCharge} delivery`}
                                </p>
                            </div>
                            {step === "address" ? (
                                <button
                                    onClick={handleProceedToReview}
                                    className="flex flex-1 max-w-[200px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-saffron-500 to-saffron-600 px-5 py-3.5 text-sm font-bold text-white shadow-[0_4px_14px_0_rgba(245,158,11,0.39)] transition-all active:scale-95"
                                >
                                    Review Order →
                                </button>
                            ) : (
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={submitting}
                                    className={`flex flex-1 max-w-[220px] items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold text-white shadow-lg transition-all active:scale-95 disabled:opacity-60 ${paymentMethod === "razorpay"
                                        ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                                        : "bg-gradient-to-r from-green-500 to-emerald-600"
                                        }`}
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 size={14} className="animate-spin" />
                                            Processing...
                                        </>
                                    ) : paymentMethod === "razorpay" ? (
                                        `Pay ₹${grandTotal.toLocaleString("en-IN")}`
                                    ) : (
                                        "Place Order ✓"
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-[60dvh] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="size-8 animate-spin text-saffron-500" />
                    <p className="text-sm text-warm-500">Loading checkout...</p>
                </div>
            </div>
        }>
            <CheckoutInner />
        </Suspense>
    );
}
