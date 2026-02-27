"use client";

import { STORE_USP_BADGES } from "@/lib/store-constants";

export function StoreUSPBar() {
    return (
        <section className="border-y border-gold-200/40 bg-linear-to-r from-saffron-50/50 via-white to-gold-50/50 py-3">
            <div className="no-scrollbar flex items-center gap-6 overflow-x-auto px-4 md:justify-center md:gap-10">
                {STORE_USP_BADGES.map((badge) => (
                    <div
                        key={badge.label}
                        className="flex shrink-0 items-center gap-2"
                    >
                        <span className="text-base">{badge.icon}</span>
                        <span className="whitespace-nowrap text-xs font-semibold text-warm-700">
                            {badge.label}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}
