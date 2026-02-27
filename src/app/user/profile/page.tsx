"use client";

import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
    User,
    MapPin,
    CalendarCheck,
    ShoppingBag,
    Sparkles,
    Bell,
    Heart,
    Settings,
    ChevronRight,
    LogOut,
    Edit3,
    Shield,
    HelpCircle,
    Loader2,
} from "lucide-react";

interface ProfileData {
    id: string;
    phone: string;
    name?: string;
    email?: string;
    avatar?: string;
    city?: string;
    dateOfBirth?: string;
    birthTime?: string;
    birthPlace?: string;
    gotra?: string;
    gender?: string;
    totalBookings: number;
    totalOrders: number;
    totalSpent: number;
}

const MENU_SECTIONS = [
    {
        title: "My Activity",
        items: [
            { label: "My Bookings", href: "/user/bookings", icon: CalendarCheck, desc: "Puja, Temple, Astrology" },
            { label: "My Orders", href: "/user/orders", icon: ShoppingBag, desc: "Store orders & tracking" },
            { label: "My Consultations", href: "/user/consultations", icon: Sparkles, desc: "Astrology sessions" },
        ],
    },
    {
        title: "Account",
        items: [
            { label: "Personal Details", href: "/user/profile/edit", icon: Edit3, desc: "Name, DOB, Gotra" },
            { label: "Saved Addresses", href: "/user/addresses", icon: MapPin, desc: "Home, Office, etc." },
            { label: "Notifications", href: "/user/notifications", icon: Bell, desc: "Booking & payment updates" },
            { label: "Favorites", href: "/user/favorites", icon: Heart, desc: "Saved pujas & products" },
        ],
    },
    {
        title: "Others",
        items: [
            { label: "Settings", href: "/user/settings", icon: Settings, desc: "Language, security" },
            { label: "Help & Support", href: "/contact", icon: HelpCircle, desc: "Chat, call, FAQ" },
            { label: "Security", href: "/user/settings", icon: Shield, desc: "Logout, delete account" },
        ],
    },
];

export default function UserProfilePage() {
    const { user, loading: authLoading, logout } = useUser();
    const router = useRouter();
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/user/login");
            return;
        }
        if (user) {
            fetch("/api/user/profile")
                .then((r) => r.json())
                .then((d) => { setProfile(d.user); setLoading(false); })
                .catch(() => setLoading(false));
        }
    }, [user, authLoading, router]);

    if (authLoading || loading) {
        return (
            <div className="flex min-h-[60dvh] items-center justify-center">
                <Loader2 className="size-8 animate-spin text-saffron-500" />
            </div>
        );
    }

    if (!user || !profile) return null;

    async function handleLogout() {
        await logout();
        router.push("/");
    }

    const completionFields = [
        profile.name,
        profile.email,
        profile.phone,
        profile.avatar,
        profile.dateOfBirth,
        profile.birthTime,
        profile.birthPlace,
        profile.city,
        profile.gotra,
        profile.gender,
    ];
    const filledFields = completionFields.filter(Boolean).length;
    const completionPercent = Math.round((filledFields / completionFields.length) * 100);

    return (
        <div className="mx-auto max-w-2xl px-4 py-6 space-y-6">
            {/* Profile Card */}
            <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-saffron-500 to-saffron-700 p-5 text-white shadow-xl shadow-saffron-200/40">
                <div className="absolute -right-6 -top-6 size-24 rounded-full bg-white/10" />
                <div className="absolute -bottom-4 -left-4 size-16 rounded-full bg-white/5" />

                <div className="relative flex items-center gap-4">
                    <div className="flex size-16 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold backdrop-blur-sm">
                        {profile.avatar ? (
                            <img src={profile.avatar} alt="" className="size-16 rounded-2xl object-cover" />
                        ) : (
                            profile.name?.[0]?.toUpperCase() || "U"
                        )}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-lg font-bold">{completionPercent === 100 ? profile.name : profile.name || "User"}</h1>
                        <p className="text-sm text-white/80">+91 {profile.phone?.replace("google_", "")}</p>
                        {profile.email && <p className="text-xs text-white/60">{profile.email}</p>}
                    </div>
                    <Link href="/user/profile/edit"
                        className="flex size-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
                    >
                        <Edit3 size={16} />
                    </Link>
                </div>

                {/* Profile Completion Progress */}
                {completionPercent < 100 && (
                    <div className="relative mt-5 rounded-xl bg-white/15 p-3 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold">Profile Completion</span>
                            <span className="text-xs font-bold">{completionPercent}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                            <div
                                className="h-full bg-white rounded-full transition-all duration-500"
                                style={{ width: `${completionPercent}%` }}
                            />
                        </div>
                        <p className="mt-2 text-[10px] text-white/80">Complete your profile to get the best astrological and puja experience.</p>
                    </div>
                )}

                {/* Stats */}
                <div className="relative mt-4 grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-white/15 p-2.5 text-center backdrop-blur-sm">
                        <p className="text-lg font-bold">{profile.totalBookings}</p>
                        <p className="text-[10px] text-white/70">Bookings</p>
                    </div>
                    <div className="rounded-xl bg-white/15 p-2.5 text-center backdrop-blur-sm">
                        <p className="text-lg font-bold">{profile.totalOrders}</p>
                        <p className="text-[10px] text-white/70">Orders</p>
                    </div>
                    <div className="rounded-xl bg-white/15 p-2.5 text-center backdrop-blur-sm">
                        <p className="text-lg font-bold">₹{(profile.totalSpent || 0).toLocaleString("en-IN")}</p>
                        <p className="text-[10px] text-white/70">Total Spent</p>
                    </div>
                </div>
            </div>

            {/* Menu Sections - Mobile Only */}
            <div className="md:hidden space-y-6">
                {MENU_SECTIONS.map((section) => (
                    <div key={section.title}>
                        <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-warm-400">{section.title}</p>
                        <div className="overflow-hidden rounded-2xl border border-gold-200/50 bg-white">
                            {section.items.map((item, i) => {
                                const Icon = item.icon;
                                return (
                                    <Link key={item.label} href={item.href}
                                        className={`flex items-center gap-3 px-4 py-3.5 transition-colors active:bg-saffron-50 ${i > 0 ? "border-t border-warm-100" : ""
                                            }`}
                                    >
                                        <div className="flex size-9 items-center justify-center rounded-xl bg-saffron-50 text-saffron-600">
                                            <Icon size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-warm-900">{item.label}</p>
                                            <p className="text-xs text-warm-400">{item.desc}</p>
                                        </div>
                                        <ChevronRight size={16} className="text-warm-300" />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* Logout */}
                <div className="md:hidden pb-24">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm font-medium text-red-600 transition active:scale-[0.98]"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </div>

            <p className="text-center text-xs text-warm-400 pb-12 md:pb-0">SmartPandit v1.0 · Made with 🙏</p>
        </div>
    );
}
