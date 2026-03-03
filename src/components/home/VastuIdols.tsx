"use client";

import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

const VASTU_ITEMS = [
    { id: "v1", name: "Premium Pyrite Tortoise", description: "For Wealth & Business Growth", image: "", colSpan: "col-span-2 md:col-span-1", rowSpan: "row-span-2", bg: "bg-gradient-to-br from-amber-50 to-orange-100", textColor: "text-orange-900" },
    { id: "v2", name: "7 Horses Frame", description: "For Accelerated Success", image: "", colSpan: "col-span-1", rowSpan: "row-span-1", bg: "bg-gradient-to-br from-blue-50 to-indigo-100", textColor: "text-indigo-900" },
    { id: "v3", name: "Ganesh Idol", description: "Remove All Obstacles", image: "", colSpan: "col-span-1", rowSpan: "row-span-1", bg: "bg-gradient-to-br from-rose-50 to-pink-100", textColor: "text-rose-900" },
    { id: "v4", name: "Hanuman Idol", description: "For Courage & Protection", image: "", colSpan: "col-span-2 md:col-span-1", rowSpan: "row-span-1", bg: "bg-gradient-to-br from-red-50 to-orange-50", textColor: "text-red-900" },
];

export function VastuIdols() {
    return (
        <section className="section-shell">
            <div className="section-wrap">
                <div className="flex items-end justify-between mb-6">
                    <div>
                        <div className="inline-flex items-center gap-2 mb-2">
                            <Sparkles size={16} className="text-emerald-600" />
                            <span className="text-[11px] font-bold text-emerald-600 tracking-wider uppercase">
                                Home Harmony
                            </span>
                        </div>
                        <h2 className="font-heading text-2xl md:text-3xl font-bold text-warm-900">
                            Vastu & Idols
                        </h2>
                    </div>
                    <Link
                        href="/store?category=vastu"
                        className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors flex items-center gap-1"
                    >
                        View All <ArrowRight size={14} />
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 auto-rows-[140px] md:auto-rows-[160px]">
                    {VASTU_ITEMS.map((item) => (
                        <Link
                            key={item.id}
                            href={`/store?item=${item.id}`}
                            className={`relative group rounded-2xl overflow-hidden p-4 md:p-6 transition-all hover:shadow-md hover:-translate-y-1 ${item.bg} ${item.colSpan} ${item.rowSpan} border border-white/50 shadow-sm`}
                        >
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <h3 className={`font-heading font-bold text-base md:text-xl leading-tight ${item.textColor} drop-shadow-sm`}>
                                        {item.name}
                                    </h3>
                                    <p className={`text-[10px] md:text-xs font-medium mt-1 ${item.textColor} opacity-80`}>
                                        {item.description}
                                    </p>
                                </div>
                                <div className="mt-auto">
                                    <span className="inline-block bg-white/60 backdrop-blur-md rounded-full px-3 py-1 text-[10px] font-bold text-warm-900 transition-colors group-hover:bg-white/90">
                                        Shop Now
                                    </span>
                                </div>
                            </div>
                            {/* Image Placeholder */}
                            <div className="absolute right-[-10%] bottom-[-10%] w-[60%] h-[60%] opacity-30 group-hover:scale-110 transition-transform duration-500">
                                <div className="w-full h-full bg-warm-900/10 rounded-full blur-2xl" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
