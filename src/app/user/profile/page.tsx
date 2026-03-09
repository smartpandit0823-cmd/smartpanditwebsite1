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
    Star,
    Phone,
    Mail,
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
            { label: "My Orders", href: "/user/orders", icon: ShoppingBag, desc: "Store orders & tracking", color: "bg-orange-50 text-[#FF8C00]" },
            { label: "My Bookings", href: "/user/bookings", icon: CalendarCheck, desc: "Puja & Temple bookings", color: "bg-blue-50 text-blue-600" },
            { label: "My Consultations", href: "/user/consultations", icon: Sparkles, desc: "Astrology sessions", color: "bg-purple-50 text-purple-600" },
        ],
    },
    {
        title: "Account Settings",
        items: [
            { label: "Personal Details", href: "/user/profile/edit", icon: Edit3, desc: "Name, DOB, Gotra, Gender", color: "bg-emerald-50 text-emerald-600" },
            { label: "Saved Addresses", href: "/user/addresses", icon: MapPin, desc: "Home, Office addresses", color: "bg-red-50 text-red-500" },
            { label: "Notifications", href: "/user/notifications", icon: Bell, desc: "Booking & payment updates", color: "bg-yellow-50 text-yellow-600" },
            { label: "Favorites", href: "/user/favorites", icon: Heart, desc: "Saved pujas & products", color: "bg-pink-50 text-pink-500" },
        ],
    },
    {
        title: "Support",
        items: [
            { label: "Help & Support", href: "/contact", icon: HelpCircle, desc: "Chat, call, FAQ", color: "bg-cyan-50 text-cyan-600" },
            { label: "App Settings", href: "/user/settings", icon: Settings, desc: "Language, security", color: "bg-gray-100 text-gray-600" },
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
                <Loader2 className="size-8 animate-spin text-[#FF8C00]" />
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
        <div className="mx-auto max-w-2xl pb-12 space-y-6">
            {/* ── Profile Hero Card ── */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FF8C00] via-[#E67E00] to-[#CC6600] p-6 text-white shadow-xl shadow-orange-200/30">
                {/* Decorative blobs */}
                <div className="absolute -right-8 -top-8 size-32 rounded-full bg-white/10" />
                <div className="absolute -bottom-6 -left-6 size-20 rounded-full bg-white/5" />
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-radial from-yellow-300/20 to-transparent rounded-full blur-xl" />

                <div className="relative flex items-center gap-5">
                    {/* Avatar */}
                    <div className="flex size-20 items-center justify-center rounded-2xl bg-white/20 text-3xl font-bold backdrop-blur-sm border-2 border-white/30 shadow-inner">
                        {profile.avatar ? (
                            <img src={profile.avatar} alt="" className="size-20 rounded-2xl object-cover" />
                        ) : (
                            profile.name?.[0]?.toUpperCase() || "U"
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl font-bold font-heading truncate">{profile.name || "User"}</h1>
                        <div className="flex items-center gap-2 mt-1.5 text-sm text-white/90 font-medium">
                            <Phone size={12} />
                            <span>+91 {profile.phone?.replace("google_", "")}</span>
                        </div>
                        {profile.email && (
                            <div className="flex items-center gap-2 mt-1 text-xs text-white/70">
                                <Mail size={12} />
                                <span className="truncate">{profile.email}</span>
                            </div>
                        )}
                    </div>
                    <Link href="/user/profile/edit"
                        className="flex size-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm border border-white/20 hover:bg-white/30 transition-colors shadow-sm"
                    >
                        <Edit3 size={16} />
                    </Link>
                </div>

                {/* Profile Completion Progress */}
                {completionPercent < 100 && (
                    <div className="relative mt-6 rounded-2xl bg-black/15 p-5 backdrop-blur-sm border border-white/10">
                        <div className="flex items-center justify-between mb-2.5">
                            <span className="text-xs uppercase tracking-wider font-bold opacity-90">Profile Completion</span>
                            <span className="text-sm font-bold bg-white/20 px-2.5 py-0.5 rounded-full">{completionPercent}%</span>
                        </div>
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/20">
                            <div
                                className="h-full bg-gradient-to-r from-[#00CEC9] to-[#00B894] rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(0,206,201,0.5)]"
                                style={{ width: `${completionPercent}%` }}
                            />
                        </div>
                        <p className="mt-2.5 text-xs text-white/80 font-medium leading-relaxed">
                            Complete your profile for personalized spiritual recommendations
                        </p>
                        <Link href="/user/profile/edit" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#00CEC9] hover:underline">
                            Complete Now <ChevronRight size={12} />
                        </Link>
                    </div>
                )}

                {/* Stats */}
                <div className="relative mt-6 grid grid-cols-3 gap-3">
                    {[
                        { value: profile.totalBookings, label: "Bookings", icon: CalendarCheck },
                        { value: profile.totalOrders, label: "Orders", icon: ShoppingBag },
                        { value: `₹${(profile.totalSpent || 0).toLocaleString("en-IN")}`, label: "Spent", icon: Star },
                    ].map((stat) => (
                        <div key={stat.label} className="rounded-2xl bg-black/15 p-4 text-center backdrop-blur-sm border border-white/10">
                            <stat.icon size={16} className="mx-auto mb-1.5 opacity-80" />
                            <p className="text-2xl font-bold font-heading">{stat.value}</p>
                            <p className="text-[10px] text-white/80 uppercase tracking-wider font-bold mt-0.5">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Quick Actions ── */}
            <div className="grid grid-cols-3 gap-3">
                <Link href="/user/orders" className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all active:scale-95">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-orange-50 text-[#FF8C00]">
                        <ShoppingBag size={22} />
                    </div>
                    <span className="text-xs font-bold text-[#1A1A1A]">My Orders</span>
                </Link>
                <Link href="/user/favorites" className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all active:scale-95">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-pink-50 text-pink-500">
                        <Heart size={22} />
                    </div>
                    <span className="text-xs font-bold text-[#1A1A1A]">Favorites</span>
                </Link>
                <Link href="/user/addresses" className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all active:scale-95">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <MapPin size={22} />
                    </div>
                    <span className="text-xs font-bold text-[#1A1A1A]">Addresses</span>
                </Link>
            </div>

            {/* ── Menu Sections ── */}
            <div className="space-y-6">
                {MENU_SECTIONS.map((section) => (
                    <div key={section.title}>
                        <p className="mb-3 px-1 text-xs font-bold uppercase tracking-[0.15em] text-[#888888]">{section.title}</p>
                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                            {section.items.map((item, i) => {
                                const Icon = item.icon;
                                return (
                                    <Link key={item.label} href={item.href}
                                        className={`flex items-center gap-4 px-5 py-4 transition-colors active:bg-gray-50 hover:bg-gray-50/70 ${i > 0 ? "border-t border-gray-100" : ""}`}
                                    >
                                        <div className={`flex size-11 items-center justify-center rounded-xl ${item.color}`}>
                                            <Icon size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-[#1A1A1A]">{item.label}</p>
                                            <p className="text-xs text-[#888888] font-medium mt-0.5">{item.desc}</p>
                                        </div>
                                        <ChevronRight size={18} className="text-gray-300 shrink-0" />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Logout */}
            <div className="pt-2">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-red-100 bg-red-50/50 px-4 py-4 text-base font-bold text-red-500 transition active:scale-[0.98] hover:bg-red-50"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>

            <p className="text-center text-[11px] font-medium text-[#888888] pb-4 tracking-wide uppercase">
                SanatanSetu Store v3.0 · Made with 🙏
            </p>
        </div>
    );
}
