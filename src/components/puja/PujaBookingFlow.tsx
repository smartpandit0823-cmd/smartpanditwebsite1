"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import {
    Check,
    ChevronRight,
    ChevronLeft,
    MapPin,
    Plus,
    CreditCard,
    Loader2,
    Calendar as CalendarIcon,
    Clock,
    ShieldCheck,
    AlertTriangle,
    BadgeIndianRupee,
    Sparkles,
    Package,
    X,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

// ── Types ───────────────────────────────────────────────────────────────────

interface PujaPackage {
    id: string;
    name: string;
    price: number;
    duration: string;
    pandits: number;
    samagri: boolean;
    benefits: string[];
    popular: boolean;
    highlight: string;
    experience: string;
}

interface BookingSettings {
    advanceAmount?: number;
    fullPaymentRequired?: boolean;
}

interface Address {
    _id: string;
    label?: string;
    fullName: string;
    phone: string;
    line1: string;
    line2?: string;
    area?: string;
    city: string;
    state: string;
    pincode: string;
    isDefault?: boolean;
}

interface PujaBookingFlowProps {
    pujaId: string;
    pujaName: string;
    pujaSlug: string;
    packages: PujaPackage[];
    bookingSettings: BookingSettings;
    startingPrice: number;
}

// ── Steps (3-step flow) ─────────────────────────────────────────────────────

const STEPS = [
    { key: "package", label: "Package", icon: Package },
    { key: "schedule", label: "Schedule", icon: CalendarIcon },
    { key: "checkout", label: "Checkout", icon: CreditCard },
];

// ── Utility ─────────────────────────────────────────────────────────────────

function getCallbackMessage(): string {
    const now = new Date();
    const hours = now.getHours();
    if (hours >= 21 || hours < 8) {
        return "Our pandit will call you tomorrow by 8:00 AM 🙏";
    }
    return "Our pandit will call you within 20 minutes 🙏";
}

// ── Main Component ──────────────────────────────────────────────────────────

export function PujaBookingFlow({
    pujaId,
    pujaName,
    pujaSlug,
    packages,
    bookingSettings,
    startingPrice,
}: PujaBookingFlowProps) {
    const router = useRouter();
    const { user } = useUser();
    const [step, setStep] = useState(0);
    const [selectedPkg, setSelectedPkg] = useState<PujaPackage | null>(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [paymentType, setPaymentType] = useState<"advance" | "full">("full");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Payment state
    const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "failed" | "retry">("idle");
    const [bookingResult, setBookingResult] = useState<{
        bookingId: string;
        bookingDbId: string;
        orderId: string;
        amount: number;
        totalAmount: number;
        key: string;
        paymentType: string;
    } | null>(null);

    // New address form
    const [newAddr, setNewAddr] = useState({
        label: "Home",
        fullName: "",
        phone: "",
        line1: "",
        line2: "",
        area: "",
        city: "",
        state: "",
        pincode: "",
    });

    const advanceAmount = bookingSettings?.advanceAmount || 0;
    const fullRequired = bookingSettings?.fullPaymentRequired || false;
    const showPaymentChoice = !fullRequired && advanceAmount > 0 && selectedPkg && advanceAmount < selectedPkg.price;

    // Fetch addresses
    const fetchAddresses = useCallback(async () => {
        try {
            const res = await fetch("/api/user/addresses");
            if (res.ok) {
                const data = await res.json();
                setAddresses(data.addresses || []);
                if (data.addresses?.length) {
                    const def = data.addresses.find((a: Address) => a.isDefault) || data.addresses[0];
                    setSelectedAddress(def);
                }
            }
        } catch {
            // silent
        }
    }, []);

    useEffect(() => {
        if (user) fetchAddresses();
    }, [user, fetchAddresses]);

    // Time slots
    const timeSlots = [
        "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM",
        "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
        "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM",
    ];

    // Next 30 days
    const availableDates = Array.from({ length: 30 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i + 1);
        return d.toISOString().split("T")[0];
    });

    // ── Add address ─────────────────────────────────────────────────────────

    async function handleAddAddress() {
        if (!newAddr.fullName || !newAddr.phone || !newAddr.line1 || !newAddr.city || !newAddr.state || !newAddr.pincode) {
            setError("Please fill all required fields");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/user/addresses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...newAddr, isDefault: addresses.length === 0 }),
            });
            if (res.ok) {
                const data = await res.json();
                setAddresses(data.addresses || []);
                const latest = data.addresses?.[data.addresses.length - 1];
                if (latest) setSelectedAddress(latest);
                setShowAddForm(false);
                setError("");
            }
        } catch {
            setError("Failed to add address");
        }
        setLoading(false);
    }

    // ── Create booking + Pay ────────────────────────────────────────────────

    async function handlePayNow() {
        if (!user) {
            router.push(`/user/login?redirect=/puja/${pujaSlug}`);
            return;
        }
        if (!selectedPkg || !selectedDate || !selectedTime || !selectedAddress) {
            setError("Please select address before paying");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const addressLine = `${selectedAddress.fullName}, ${selectedAddress.line1}${selectedAddress.line2 ? `, ${selectedAddress.line2}` : ""}, ${selectedAddress.area || ""}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`;

            const res = await fetch("/api/bookings/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pujaId,
                    packageName: selectedPkg.name,
                    date: selectedDate,
                    time: selectedTime,
                    address: addressLine,
                    addressId: selectedAddress._id,
                    notes,
                    paymentType,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Booking failed");
                setLoading(false);
                return;
            }

            setBookingResult(data);
            setLoading(false);
            openRazorpay(data);
        } catch {
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    }

    // ── Razorpay ────────────────────────────────────────────────────────────

    function openRazorpay(data: {
        orderId: string;
        amount: number;
        key: string;
        bookingId: string;
        bookingDbId: string;
        paymentType: string;
    }) {
        setPaymentStatus("processing");

        const options = {
            key: data.key,
            amount: data.amount * 100,
            currency: "INR",
            name: "SmartPandit",
            description: `${pujaName} - ${selectedPkg?.name || "Puja"} Package`,
            order_id: data.orderId,
            handler: async function (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
                try {
                    const verifyRes = await fetch("/api/payment/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        }),
                    });
                    if (verifyRes.ok) {
                        setPaymentStatus("success");
                    } else {
                        setPaymentStatus("failed");
                    }
                } catch {
                    setPaymentStatus("failed");
                }
            },
            prefill: {
                name: user?.name || "",
                contact: user?.phone || "",
            },
            theme: { color: "#E97413" },
            modal: {
                ondismiss: function () {
                    setPaymentStatus("retry");
                },
            },
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", function () {
            setPaymentStatus("failed");
        });
        rzp.open();
    }

    // ── Can proceed ─────────────────────────────────────────────────────────

    function canProceed() {
        if (step === 0) return !!selectedPkg;
        if (step === 1) return !!selectedDate && !!selectedTime;
        return false;
    }

    // ── What pay amount ─────────────────────────────────────────────────────

    const payAmountDisplay = showPaymentChoice
        ? paymentType === "advance" ? advanceAmount : selectedPkg!.price
        : selectedPkg?.price || 0;

    // ── Render ──────────────────────────────────────────────────────────────

    return (
        <>
            {/* Razorpay Script */}
            <script src="https://checkout.razorpay.com/v1/checkout.js" />

            <div className="mx-auto max-w-4xl px-2 py-6 sm:px-4">

                {/* ── Step Indicator ── */}
                {paymentStatus === "idle" && (
                    <div className="mb-6 flex items-center gap-1 overflow-x-auto no-scrollbar pb-2">
                        {STEPS.map((s, i) => {
                            const Icon = s.icon;
                            const isActive = i === step;
                            const isDone = i < step;
                            return (
                                <div key={s.key} className="flex items-center gap-1 shrink-0">
                                    <div
                                        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${isDone
                                            ? "bg-green-100 text-green-700"
                                            : isActive
                                                ? "bg-saffron-500 text-white shadow-sm"
                                                : "bg-warm-100 text-warm-400"
                                            }`}
                                    >
                                        {isDone ? <Check size={12} /> : <Icon size={12} />}
                                        {s.label}
                                    </div>
                                    {i < STEPS.length - 1 && <ChevronRight size={14} className="text-warm-300 shrink-0" />}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ── Error ── */}
                {error && (
                    <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        <AlertTriangle size={16} className="shrink-0" />
                        {error}
                        <button onClick={() => setError("")} className="ml-auto">
                            <X size={14} />
                        </button>
                    </div>
                )}

                {/* ═══════════════════════ STEP 0: Package ═══════════════════════ */}
                {step === 0 && (
                    <div className="space-y-4">
                        <h2 className="flex items-center gap-2 text-lg font-bold text-warm-900 sm:text-xl">
                            <Package size={20} className="text-saffron-500" />
                            Choose Your Package
                        </h2>
                        <p className="text-sm text-warm-500">Select the best package for {pujaName}</p>

                        <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
                            {packages.map((pkg) => (
                                <button
                                    key={pkg.id}
                                    onClick={() => setSelectedPkg(pkg)}
                                    className={`relative flex w-full flex-col rounded-2xl border-2 p-4 sm:p-5 text-left transition-all ${selectedPkg?.id === pkg.id
                                        ? "border-saffron-500 bg-gradient-to-br from-saffron-50 to-gold-50 shadow-lg shadow-saffron-200/60 scale-[1.01]"
                                        : "border-warm-200 bg-white hover:border-saffron-300 hover:shadow-md"
                                        }`}
                                >
                                    {pkg.popular && (
                                        <span className="mb-2 w-fit rounded-full bg-gradient-to-r from-saffron-500 to-red-500 px-3 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                                            🔥 Most Popular
                                        </span>
                                    )}
                                    {selectedPkg?.id === pkg.id && (
                                        <div className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full bg-saffron-500">
                                            <Check size={14} className="text-white" />
                                        </div>
                                    )}
                                    <h4 className="text-lg font-bold text-warm-900 capitalize">{pkg.name}</h4>
                                    <p className="mt-1 text-2xl font-black text-saffron-600">{formatPrice(pkg.price)}</p>
                                    <p className="text-sm text-warm-500 mt-1">{pkg.duration} • {pkg.pandits} Pandit</p>
                                    {pkg.experience && <p className="text-xs text-warm-400 mt-0.5">👨‍🦳 {pkg.experience}</p>}
                                    {pkg.highlight && (
                                        <p className="mt-2 text-xs font-medium text-saffron-700 bg-saffron-50 px-2 py-1 rounded-lg">
                                            ✨ {pkg.highlight}
                                        </p>
                                    )}
                                    <p className="mt-1 text-xs font-medium text-warm-600">{pkg.samagri ? "✅ Samagri included" : "📦 Samagri not included"}</p>
                                    <ul className="mt-3 space-y-1.5">
                                        {pkg.benefits.slice(0, 5).map((b, i) => (
                                            <li key={i} className="flex items-start gap-2 text-xs text-warm-600">
                                                <Check size={12} className="mt-0.5 shrink-0 text-green-500" />
                                                {b}
                                            </li>
                                        ))}
                                    </ul>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* ═══════════════════════ STEP 1: Date & Time ═══════════════════════ */}
                {step === 1 && (
                    <div className="space-y-6">
                        <h2 className="flex items-center gap-2 text-lg font-bold text-warm-900 sm:text-xl">
                            <CalendarIcon size={20} className="text-saffron-500" />
                            Select Date & Time
                        </h2>

                        {/* Date Grid */}
                        <div>
                            <p className="mb-3 text-sm font-medium text-warm-600">Choose a date</p>
                            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-2">
                                {availableDates.map((d) => {
                                    const dt = new Date(d);
                                    const dayName = dt.toLocaleDateString("en-IN", { weekday: "short" });
                                    const dayNum = dt.getDate();
                                    const month = dt.toLocaleDateString("en-IN", { month: "short" });
                                    const isSelected = selectedDate === d;
                                    return (
                                        <button
                                            key={d}
                                            onClick={() => setSelectedDate(d)}
                                            className={`flex flex-col items-center rounded-xl py-2.5 px-1.5 sm:py-3 sm:px-2 text-center transition-all ${isSelected
                                                ? "bg-saffron-500 text-white shadow-lg shadow-saffron-200"
                                                : "bg-white border border-warm-200 text-warm-700 hover:border-saffron-300"
                                                }`}
                                        >
                                            <span className="text-[10px] font-medium opacity-75">{dayName}</span>
                                            <span className="text-base sm:text-lg font-bold">{dayNum}</span>
                                            <span className="text-[10px] font-medium opacity-75">{month}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Time Slots */}
                        <div>
                            <p className="mb-3 text-sm font-medium text-warm-600">Choose a time slot</p>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                                {timeSlots.map((t) => {
                                    const isSelected = selectedTime === t;
                                    return (
                                        <button
                                            key={t}
                                            onClick={() => setSelectedTime(t)}
                                            className={`flex items-center justify-center gap-1 rounded-xl py-2.5 px-2 text-xs sm:text-sm font-medium transition-all ${isSelected
                                                ? "bg-saffron-500 text-white shadow-sm"
                                                : "bg-white border border-warm-200 text-warm-600 hover:border-saffron-300"
                                                }`}
                                        >
                                            <Clock size={11} />
                                            {t}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="text-sm font-medium text-warm-600">Special instructions (optional)</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Any special request for the puja..."
                                className="mt-2 w-full rounded-xl border border-warm-200 bg-white px-4 py-3 text-sm placeholder:text-warm-300 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100"
                                rows={2}
                            />
                        </div>
                    </div>
                )}

                {/* ═══════════════════════ STEP 2: Checkout (Address + Payment) ═══════════════════════ */}
                {step === 2 && paymentStatus === "idle" && (
                    <div className="space-y-6">

                        {/* ── Booking Summary (compact) ── */}
                        <div className="rounded-2xl border border-saffron-200 bg-gradient-to-br from-saffron-50/60 to-gold-50/60 p-4">
                            <h3 className="text-sm font-bold text-warm-900 mb-3">📋 Booking Summary</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-warm-500">Puja</span>
                                    <span className="font-medium text-warm-900">{pujaName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-warm-500">Package</span>
                                    <span className="font-medium text-warm-900 capitalize">{selectedPkg?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-warm-500">Date & Time</span>
                                    <span className="font-medium text-warm-900">
                                        {selectedDate && new Date(selectedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} • {selectedTime}
                                    </span>
                                </div>
                                <hr className="border-saffron-200/60" />
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-warm-900">Total</span>
                                    <span className="text-xl font-black text-saffron-600">{formatPrice(selectedPkg?.price || 0)}</span>
                                </div>
                            </div>
                        </div>

                        {/* ── Address Selection ── */}
                        <div>
                            <h3 className="flex items-center gap-2 text-lg font-bold text-warm-900 mb-3">
                                <MapPin size={18} className="text-saffron-500" />
                                Delivery Address
                            </h3>

                            {addresses.length > 0 && !showAddForm && (
                                <div className="space-y-2">
                                    {addresses.map((addr) => (
                                        <button
                                            key={addr._id}
                                            onClick={() => setSelectedAddress(addr)}
                                            className={`relative flex w-full items-start gap-3 rounded-2xl border-2 p-3 sm:p-4 text-left transition-all ${selectedAddress?._id === addr._id
                                                ? "border-saffron-500 bg-saffron-50/50 shadow-sm"
                                                : "border-warm-200 bg-white hover:border-saffron-200"
                                                }`}
                                        >
                                            <div
                                                className={`mt-0.5 flex size-5 items-center justify-center rounded-full border-2 shrink-0 ${selectedAddress?._id === addr._id ? "border-saffron-500 bg-saffron-500" : "border-warm-300"
                                                    }`}
                                            >
                                                {selectedAddress?._id === addr._id && <Check size={12} className="text-white" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-sm font-bold text-warm-900">{addr.fullName}</span>
                                                    {addr.label && (
                                                        <span className="rounded-full bg-warm-100 px-2 py-0.5 text-[10px] font-medium text-warm-500">{addr.label}</span>
                                                    )}
                                                    {addr.isDefault && (
                                                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">Default</span>
                                                    )}
                                                </div>
                                                <p className="mt-1 text-xs text-warm-500 line-clamp-2">
                                                    {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}, {addr.area ? `${addr.area}, ` : ""}
                                                    {addr.city}, {addr.state} - {addr.pincode}
                                                </p>
                                                <p className="mt-0.5 text-xs text-warm-400">📞 {addr.phone}</p>
                                            </div>
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setShowAddForm(true)}
                                        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-warm-300 py-3 text-sm font-medium text-warm-500 transition hover:border-saffron-400 hover:text-saffron-600"
                                    >
                                        <Plus size={16} />
                                        Add New Address
                                    </button>
                                </div>
                            )}

                            {(addresses.length === 0 || showAddForm) && (
                                <div className="space-y-3 rounded-2xl border border-warm-200 bg-white p-4">
                                    <h4 className="font-semibold text-warm-900">
                                        {addresses.length === 0 ? "Add Your Address" : "Add New Address"}
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                        <input placeholder="Full Name *" value={newAddr.fullName} onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })} className="col-span-2 rounded-xl border border-warm-200 px-3 py-2.5 text-sm focus:border-saffron-400 focus:outline-none" />
                                        <input placeholder="Phone *" value={newAddr.phone} onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })} className="col-span-2 rounded-xl border border-warm-200 px-3 py-2.5 text-sm focus:border-saffron-400 focus:outline-none" />
                                        <input placeholder="Address Line 1 *" value={newAddr.line1} onChange={(e) => setNewAddr({ ...newAddr, line1: e.target.value })} className="col-span-2 rounded-xl border border-warm-200 px-3 py-2.5 text-sm focus:border-saffron-400 focus:outline-none" />
                                        <input placeholder="Address Line 2" value={newAddr.line2} onChange={(e) => setNewAddr({ ...newAddr, line2: e.target.value })} className="col-span-2 rounded-xl border border-warm-200 px-3 py-2.5 text-sm focus:border-saffron-400 focus:outline-none" />
                                        <input placeholder="Area / Landmark" value={newAddr.area} onChange={(e) => setNewAddr({ ...newAddr, area: e.target.value })} className="rounded-xl border border-warm-200 px-3 py-2.5 text-sm focus:border-saffron-400 focus:outline-none" />
                                        <input placeholder="City *" value={newAddr.city} onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })} className="rounded-xl border border-warm-200 px-3 py-2.5 text-sm focus:border-saffron-400 focus:outline-none" />
                                        <input placeholder="State *" value={newAddr.state} onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })} className="rounded-xl border border-warm-200 px-3 py-2.5 text-sm focus:border-saffron-400 focus:outline-none" />
                                        <input placeholder="Pincode *" value={newAddr.pincode} onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })} className="rounded-xl border border-warm-200 px-3 py-2.5 text-sm focus:border-saffron-400 focus:outline-none" />
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={handleAddAddress} disabled={loading} className="flex-1 rounded-xl bg-saffron-500 py-2.5 text-sm font-bold text-white transition hover:bg-saffron-600 disabled:opacity-50">
                                            {loading ? <Loader2 size={16} className="mx-auto animate-spin" /> : "Save Address"}
                                        </button>
                                        {addresses.length > 0 && (
                                            <button onClick={() => setShowAddForm(false)} className="rounded-xl border border-warm-200 px-4 py-2.5 text-sm font-medium text-warm-500">
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ── Payment Type Selection ── */}
                        {showPaymentChoice && (
                            <div>
                                <h3 className="flex items-center gap-2 text-lg font-bold text-warm-900 mb-3">
                                    <CreditCard size={18} className="text-saffron-500" />
                                    Payment Option
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setPaymentType("advance")}
                                        className={`rounded-2xl border-2 p-4 text-left transition-all ${paymentType === "advance"
                                            ? "border-saffron-500 bg-saffron-50 shadow-sm"
                                            : "border-warm-200 bg-white hover:border-saffron-200"
                                            }`}
                                    >
                                        <BadgeIndianRupee size={20} className="text-saffron-500 mb-1" />
                                        <p className="text-sm font-bold text-warm-900">Pay Advance</p>
                                        <p className="text-xl font-black text-saffron-600">{formatPrice(advanceAmount)}</p>
                                        <p className="text-[10px] text-warm-400 mt-1">Remaining {formatPrice(selectedPkg!.price - advanceAmount)} at puja time</p>
                                    </button>
                                    <button
                                        onClick={() => setPaymentType("full")}
                                        className={`rounded-2xl border-2 p-4 text-left transition-all ${paymentType === "full"
                                            ? "border-green-500 bg-green-50 shadow-sm"
                                            : "border-warm-200 bg-white hover:border-green-200"
                                            }`}
                                    >
                                        <Sparkles size={20} className="text-green-500 mb-1" />
                                        <p className="text-sm font-bold text-warm-900">Pay Full</p>
                                        <p className="text-xl font-black text-green-600">{formatPrice(selectedPkg!.price)}</p>
                                        <p className="text-[10px] text-green-600 font-medium mt-1">✅ No remaining dues</p>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── Security Badges ── */}
                        <div className="flex flex-wrap gap-2">
                            <span className="flex items-center gap-1 rounded-full bg-green-50 border border-green-200 px-3 py-1.5 text-xs font-medium text-green-700">
                                <ShieldCheck size={12} /> Secure Payment
                            </span>
                            <span className="flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-700">
                                <CreditCard size={12} /> Razorpay Protected
                            </span>
                        </div>

                        {/* ── Pay Now Button ── */}
                        <button
                            onClick={handlePayNow}
                            disabled={!selectedAddress || loading}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-saffron-500 to-red-500 py-4 text-base font-bold text-white shadow-xl shadow-saffron-200/60 transition hover:opacity-95 disabled:opacity-40 disabled:shadow-none active:scale-[0.98]"
                        >
                            {loading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <>
                                    <CreditCard size={18} />
                                    Pay {formatPrice(payAmountDisplay)} & Book Now
                                </>
                            )}
                        </button>
                    </div>
                )}

                {/* ═════ Payment Status Screens ═════ */}

                {/* Processing */}
                {paymentStatus === "processing" && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Loader2 size={48} className="animate-spin text-saffron-500 mb-4" />
                        <h3 className="text-lg font-bold text-warm-900">Processing Payment...</h3>
                        <p className="mt-1 text-sm text-warm-500">Please complete the payment in the Razorpay window</p>
                    </div>
                )}

                {/* Success */}
                {paymentStatus === "success" && bookingResult && (
                    <div className="flex flex-col items-center py-8 text-center">
                        <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-green-100">
                            <Check size={40} className="text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-warm-900">Booking Confirmed! 🎉</h3>
                        <p className="mt-2 text-sm text-warm-500">{pujaName} has been booked successfully</p>

                        <div className="mt-6 w-full max-w-sm space-y-3 rounded-2xl border border-green-200 bg-green-50 p-5 text-left">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-warm-500">Booking ID</span>
                                <span className="text-sm font-bold font-mono text-warm-900">{bookingResult.bookingId}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-warm-500">Amount Paid</span>
                                <span className="text-sm font-bold text-green-700">{formatPrice(bookingResult.amount)}</span>
                            </div>
                            {bookingResult.paymentType === "advance" && (
                                <>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-warm-500">Total Amount</span>
                                        <span className="text-sm text-warm-600">{formatPrice(bookingResult.totalAmount)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-warm-500">Remaining</span>
                                        <span className="text-sm font-medium text-orange-600">{formatPrice(bookingResult.totalAmount - bookingResult.amount)}</span>
                                    </div>
                                </>
                            )}
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-warm-500">Payment</span>
                                <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full capitalize">{bookingResult.paymentType} Paid</span>
                            </div>
                        </div>

                        <div className="mt-6 w-full max-w-sm rounded-2xl border border-saffron-200 bg-saffron-50 p-4 text-center">
                            <p className="text-sm font-medium text-saffron-800">{getCallbackMessage()}</p>
                            <p className="mt-1 text-xs text-saffron-600">Share your Booking ID with the Pandit for verification</p>
                        </div>

                        <div className="mt-6 flex gap-3 w-full max-w-sm">
                            <button
                                onClick={() => router.push("/user/bookings")}
                                className="flex-1 rounded-xl bg-saffron-500 py-3 text-sm font-bold text-white transition hover:bg-saffron-600"
                            >
                                My Bookings
                            </button>
                            <button
                                onClick={() => router.push("/")}
                                className="flex-1 rounded-xl border border-warm-200 py-3 text-sm font-medium text-warm-600 transition hover:bg-warm-50"
                            >
                                Go Home
                            </button>
                        </div>
                    </div>
                )}

                {/* Failed / Retry */}
                {(paymentStatus === "failed" || paymentStatus === "retry") && bookingResult && (
                    <div className="flex flex-col items-center py-8 text-center">
                        <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-red-100">
                            <AlertTriangle size={40} className="text-red-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-warm-900">
                            {paymentStatus === "failed" ? "Payment Failed" : "Payment Cancelled"}
                        </h3>
                        <p className="mt-2 text-sm text-warm-500">
                            {paymentStatus === "failed"
                                ? "Your payment could not be processed. No amount has been deducted."
                                : "You closed the payment window. Your booking is saved, you can retry."}
                        </p>
                        <div className="mt-6 flex gap-3 w-full max-w-sm">
                            <button
                                onClick={() => openRazorpay(bookingResult)}
                                className="flex-1 rounded-xl bg-saffron-500 py-3 text-sm font-bold text-white transition hover:bg-saffron-600"
                            >
                                🔄 Retry Payment
                            </button>
                            <button
                                onClick={() => setPaymentStatus("idle")}
                                className="flex-1 rounded-xl border border-warm-200 py-3 text-sm font-medium text-warm-600 transition hover:bg-warm-50"
                            >
                                ← Go Back
                            </button>
                        </div>
                    </div>
                )}


                {/* ═══════════════ Bottom Navigation ═══════════════ */}
                {paymentStatus === "idle" && step < 2 && (
                    <div className="mt-8 flex gap-3">
                        {step > 0 && (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="flex items-center gap-1 rounded-xl border border-warm-200 px-5 py-3 text-sm font-medium text-warm-600 transition hover:bg-warm-50"
                            >
                                <ChevronLeft size={16} />
                                Back
                            </button>
                        )}
                        <button
                            onClick={() => setStep(step + 1)}
                            disabled={!canProceed()}
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-saffron-500 py-3 text-sm font-bold text-white shadow-lg shadow-saffron-200 transition hover:bg-saffron-600 disabled:opacity-40 disabled:shadow-none"
                        >
                            Continue
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}

                {/* Back button on checkout page */}
                {paymentStatus === "idle" && step === 2 && (
                    <div className="mt-4">
                        <button
                            onClick={() => setStep(1)}
                            className="flex items-center gap-1 text-sm font-medium text-warm-500 transition hover:text-saffron-600"
                        >
                            <ChevronLeft size={16} />
                            Back to Schedule
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
