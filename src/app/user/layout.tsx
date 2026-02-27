"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import {
    User,
    CalendarCheck,
    ShoppingBag,
    Sparkles,
    MapPin,
    Bell,
    Heart,
    Settings,
    LogOut,
} from "lucide-react";

const SIDEBAR_LINKS = [
    { label: "My Profile", href: "/user/profile", icon: User },
    { label: "My Orders", href: "/user/orders", icon: ShoppingBag },
    { label: "Saved Addresses", href: "/user/addresses", icon: MapPin },
    { label: "Notifications", href: "/user/notifications", icon: Bell },
    { label: "Settings", href: "/user/settings", icon: Settings },
];

export default function UserLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { logout } = useUser();

    // Do not apply this layout to the login page
    if (pathname === "/user/login") {
        return <>{children}</>;
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 md:my-8">
            <div className="flex flex-col gap-8 md:flex-row">

                {/* ── Desktop Sidebar ── */}
                <aside className="hidden w-64 shrink-0 md:block">
                    <div className="sticky top-24 overflow-hidden rounded-2xl border border-saffron-200/50 bg-[#fffdf7] shadow-xl shadow-saffron-100">
                        <div className="p-4 bg-linear-to-r from-saffron-50 to-orange-50/50 border-b border-saffron-100">
                            <h2 className="font-heading text-lg font-bold text-warm-900">My Account</h2>
                        </div>
                        <nav className="flex flex-col p-2">
                            {SIDEBAR_LINKS.map((link) => {
                                const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${isActive
                                            ? "bg-linear-to-r from-saffron-500 to-saffron-600 text-white shadow-md shadow-saffron-200/50"
                                            : "text-warm-700 hover:bg-saffron-50 hover:text-saffron-700"
                                            }`}
                                    >
                                        <Icon size={18} className={isActive ? "text-white" : "text-saffron-500"} />
                                        {link.label}
                                    </Link>
                                );
                            })}
                            <div className="my-2 h-px bg-warm-100 mx-2" />
                            <button
                                onClick={() => {
                                    logout();
                                    window.location.href = "/";
                                }}
                                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                            >
                                <LogOut size={18} />
                                Logout
                            </button>
                        </nav>
                    </div>
                </aside>

                {/* ── Content Area ── */}
                <main className="flex-1">
                    <div className="md:rounded-3xl md:border md:border-saffron-200/50 md:bg-white md:p-8 md:shadow-2xl md:shadow-warm-100/50">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
