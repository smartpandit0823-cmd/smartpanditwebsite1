"use client";

import { useUser } from "@/contexts/UserContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Flame,
    ShoppingBag,
    Sparkles,
    Landmark,
    Waves,
    Loader2,
    CalendarCheck,
    ChevronRight,
} from "lucide-react";

interface Booking {
    _id: string;
    bookingId?: string;
    type: "puja" | "store" | "astrology" | "temple" | "kumbh";
    title: string;
    date?: string;
    status: string;
    amount?: number;
    amountPaid?: number;
    paymentStatus?: string;
    paymentType?: string;
    packageName?: string;
}

const TABS = [
    { key: "all", label: "All", icon: CalendarCheck },
    { key: "puja", label: "Puja", icon: Flame },
    { key: "store", label: "Store", icon: ShoppingBag },
    { key: "astrology", label: "Astro", icon: Sparkles },
    { key: "temple", label: "Temple", icon: Landmark },
    { key: "kumbh", label: "Kumbh", icon: Waves },
];

const STATUS_COLORS: Record<string, string> = {
    requested: "bg-amber-100 text-amber-700",
    price_finalized: "bg-blue-100 text-blue-700",
    payment_pending: "bg-orange-100 text-orange-700",
    confirmed: "bg-green-100 text-green-700",
    assigned: "bg-indigo-100 text-indigo-700",
    inprogress: "bg-purple-100 text-purple-700",
    completed: "bg-emerald-100 text-emerald-800",
    submitted: "bg-teal-100 text-teal-700",
    cancelled: "bg-red-100 text-red-700",
    pending: "bg-yellow-100 text-yellow-700",
    paid: "bg-green-100 text-green-700",
    shipped: "bg-blue-100 text-blue-700",
    delivered: "bg-emerald-100 text-emerald-700",
};

function BookingsContent() {
    const { user, loading: authLoading } = useUser();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [tab, setTab] = useState(searchParams.get("tab") || "all");
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) { router.push("/user/login"); return; }
        if (user) fetchBookings();
    }, [user, authLoading, router]);

    async function fetchBookings() {
        try {
            const res = await fetch("/api/user/bookings");
            const data = await res.json();
            setBookings(data.bookings || []);
        } catch {
            // empty
        }
        setLoading(false);
    }

    const filteredBookings = tab === "all" ? bookings : bookings.filter((b) => b.type === tab);

    if (authLoading || loading) {
        return <div className="flex min-h-[60dvh] items-center justify-center"><Loader2 className="size-8 animate-spin text-saffron-500" /></div>;
    }

    return (
        <div className="mx-auto max-w-lg px-4 py-6 space-y-5">
            {/* Top bar */}
            <div className="flex items-center gap-3">
                <Link href="/user/profile" className="flex size-9 items-center justify-center rounded-full bg-white shadow-sm border border-warm-100">
                    <ArrowLeft size={18} />
                </Link>
                <h1 className="text-lg font-semibold text-warm-900">My Bookings</h1>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {TABS.map((t) => {
                    const Icon = t.icon;
                    const isActive = tab === t.key;
                    return (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium transition ${isActive
                                ? "bg-saffron-600 text-white shadow-sm"
                                : "bg-white text-warm-600 border border-warm-200"
                                }`}
                        >
                            <Icon size={14} />
                            {t.label}
                        </button>
                    );
                })}
            </div>

            {/* Bookings List */}
            {filteredBookings.length === 0 ? (
                <div className="py-16 text-center">
                    <CalendarCheck className="mx-auto mb-3 text-warm-300" size={40} />
                    <p className="text-sm text-warm-500">No bookings yet</p>
                    <Link href="/puja" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-saffron-600 px-4 py-2 text-sm font-medium text-white">
                        <Flame size={14} /> Book a Puja
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredBookings.map((b) => {
                        const typeIcon: Record<string, typeof Flame> = {
                            puja: Flame,
                            store: ShoppingBag,
                            astrology: Sparkles,
                            temple: Landmark,
                            kumbh: Waves,
                        };
                        const Icon = typeIcon[b.type] || CalendarCheck;

                        return (
                            <Link
                                key={b._id}
                                href={`/user/bookings/${b._id}`}
                                className="flex items-center gap-3 rounded-2xl border border-gold-200/50 bg-white p-4 transition active:scale-[0.99]"
                            >
                                <div className="flex size-10 items-center justify-center rounded-xl bg-saffron-50 text-saffron-600">
                                    <Icon size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-warm-900 truncate">{b.title}</p>
                                    <div className="mt-1 flex items-center gap-2">
                                        {b.bookingId && <span className="text-[10px] font-mono font-bold text-saffron-700 bg-saffron-50 px-1.5 py-0.5 rounded">{b.bookingId}</span>}
                                        {b.date && <span className="text-[11px] text-warm-400">{new Date(b.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>}
                                        {b.packageName && <span className="text-[11px] text-warm-400">· {b.packageName}</span>}
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_COLORS[b.status] || "bg-gray-100 text-gray-700"}`}>
                                        {b.status?.replace(/_/g, " ")}
                                    </span>
                                    {b.amount !== undefined && (
                                        <p className="mt-1 text-xs font-semibold text-warm-800">₹{b.amount?.toLocaleString("en-IN")}</p>
                                    )}
                                    {b.paymentType && (
                                        <span className={`inline-block mt-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase ${b.paymentType === "full" && b.paymentStatus === "paid" ? "bg-green-100 text-green-700"
                                                : b.paymentType === "advance" ? "bg-orange-100 text-orange-700"
                                                    : "bg-gray-100 text-gray-600"
                                            }`}>
                                            {b.paymentType === "advance" ? "Advance Paid" : "Full Paid"}
                                        </span>
                                    )}
                                </div>
                                <ChevronRight size={14} className="text-warm-300" />
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default function BookingsPage() {
    return (
        <Suspense fallback={<div className="flex min-h-[60dvh] items-center justify-center"><Loader2 className="size-8 animate-spin text-saffron-500" /></div>}>
            <BookingsContent />
        </Suspense>
    );
}
