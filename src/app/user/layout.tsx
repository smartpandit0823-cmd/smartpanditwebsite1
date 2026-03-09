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
                    <div className="sticky top-24 overflow-hidden rounded-[12px] border border-orange-100 bg-[#FFFFFF] shadow-[0_2px_16px_rgba(255,140,0,0.08)]">
                        <div className="p-4 bg-[#FEFAF4] border-b border-orange-100">
                            <h2 className="font-heading text-lg font-bold text-[#1A1A1A]">My Account</h2>
                        </div>
                        <nav className="flex flex-col p-2">
                            {SIDEBAR_LINKS.map((link) => {
                                const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`flex items-center gap-3 rounded-[8px] px-4 py-3 text-sm font-bold transition-colors ${isActive
                                            ? "bg-[#FF8C00] text-white shadow-md shadow-[#FF8C00]/20"
                                            : "text-[#888888] hover:bg-[#FEFAF4] hover:text-[#1A1A1A]"
                                            }`}
                                    >
                                        <Icon size={18} className={isActive ? "text-white" : "text-[#888888] group-hover:text-[#FF8C00]"} />
                                        {link.label}
                                    </Link>
                                );
                            })}
                            <div className="my-2 h-px bg-gray-100 mx-2" />
                            <button
                                onClick={() => {
                                    logout();
                                    window.location.href = "/";
                                }}
                                className="flex items-center gap-3 rounded-[8px] px-4 py-3 text-sm font-bold text-red-500 transition-colors hover:bg-red-50"
                            >
                                <LogOut size={18} />
                                Logout
                            </button>
                        </nav>
                    </div>
                </aside>

                {/* ── Content Area ── */}
                <main className="flex-1">
                    <div className="md:rounded-[12px] md:border md:border-orange-100 md:bg-[#FFFFFF] md:p-8 md:shadow-[0_2px_16px_rgba(255,140,0,0.08)]">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
