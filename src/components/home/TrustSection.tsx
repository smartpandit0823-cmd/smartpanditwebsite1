"use client";

import { Shield, Truck, RotateCcw, CreditCard, Award, Gem } from "lucide-react";

const TRUST_ITEMS = [
    {
        icon: Award,
        label: "Lab Certified",
        sublabel: "Every product tested",
        color: "text-saffron-600",
        bg: "bg-saffron-50",
    },
    {
        icon: Truck,
        label: "COD Available",
        sublabel: "Cash on Delivery",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
    },
    {
        icon: RotateCcw,
        label: "7 Day Return",
        sublabel: "Easy returns",
        color: "text-blue-600",
        bg: "bg-blue-50",
    },
    {
        icon: CreditCard,
        label: "Secure Payment",
        sublabel: "100% protected",
        color: "text-purple-600",
        bg: "bg-purple-50",
    },
];

export function TrustSection() {
    return (
        <section className="section-shell">
            <div className="section-wrap">
                <div className="rounded-2xl border border-saffron-200/50 bg-white/80 backdrop-blur-sm p-6 md:p-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {TRUST_ITEMS.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.label} className="flex flex-col items-center text-center">
                                    <div
                                        className={`flex size-14 items-center justify-center rounded-2xl ${item.bg} mb-3`}
                                    >
                                        <Icon size={24} className={item.color} strokeWidth={1.5} />
                                    </div>
                                    <p className="text-sm font-semibold text-warm-900">{item.label}</p>
                                    <p className="text-[10px] text-warm-500 mt-0.5">{item.sublabel}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
