"use client";

import Link from "next/link";
import { Flame, MessageCircle, Package, Crown } from "lucide-react";

const ACTIONS = [
    { id: "book_puja", label: "Book Puja", icon: Flame, href: "/puja", color: "text-saffron-500", bg: "bg-saffron-50" },
    { id: "expert", label: "Our Team", icon: MessageCircle, href: "/team", color: "text-blue-500", bg: "bg-blue-50" },
    { id: "packages", label: "View Packages", icon: Package, href: "/puja", color: "text-green-500", bg: "bg-green-50" },
    { id: "vip", label: "VIP Darshan", icon: Crown, href: "/", color: "text-purple-500", bg: "bg-purple-50" },
];

export function QuickActionBar() {
    return (
        <div className="relative z-40 w-full transition-all duration-300 -mt-6">
            <div className="section-wrap px-4">
                <div className="mx-auto max-w-4xl rounded-2xl bg-white shadow-xl shadow-warm-100/50 p-3 md:p-4 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar border border-gold-100">
                    {ACTIONS.map((action) => (
                        <Link
                            key={action.id}
                            href={action.href}
                            className="flex min-w-max flex-1 flex-col items-center justify-center gap-2 rounded-xl p-2 transition-transform hover:scale-105 hover:bg-warm-50"
                        >
                            <div className={`flex size-10 items-center justify-center rounded-full ${action.bg} ${action.color}`}>
                                <action.icon size={20} />
                            </div>
                            <span className="font-semibold text-warm-800 text-xs md:text-sm">
                                {action.label}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
