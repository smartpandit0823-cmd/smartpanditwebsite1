"use client";

import Link from "next/link";
import { useRef } from "react";
import { Clock, ChevronLeft, ChevronRight, Zap } from "lucide-react";

interface ComboItem {
    id: string;
    name: string;
    image: string;
    originalTotal: number;
    comboPrice: number;
    savings: number;
    items: string[];
    limitedStock?: boolean;
}

const DEMO_COMBOS: ComboItem[] = [
    {
        id: "combo-1",
        name: "Wealth & Prosperity Kit",
        image: "",
        originalTotal: 2999,
        comboPrice: 2499,
        savings: 500,
        items: ["Kuber Yantra", "8/7 Mukhi Rudraksha", "Citrine Stone"],
        limitedStock: true,
    },
    {
        id: "combo-2",
        name: "Complete Puja Edition",
        image: "",
        originalTotal: 1999,
        comboPrice: 1499,
        savings: 500,
        items: ["Ganesh Idol", "Thali", "Kumkum"],
    },
    {
        id: "combo-3",
        name: "Protection Shield",
        image: "",
        originalTotal: 3499,
        comboPrice: 2799,
        savings: 700,
        items: ["5 Mukhi", "Kavach", "Nazar Suraksha"],
        limitedStock: true,
    }
];

export function ComboDeals() {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (dir: 1 | -1) => {
        scrollRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
    };

    return (
        <section className="section-shell bg-gradient-to-br from-red-50/50 to-orange-50/50">
            <div className="section-wrap">
                <div className="flex items-end justify-between mb-6">
                    <div className="text-left">
                        <h2 className="font-heading text-2xl md:text-3xl font-bold text-warm-900 mb-1">
                            Combo Deals
                        </h2>
                        <p className="text-sm text-warm-600">
                            Save more with curated bundles
                        </p>
                    </div>
                    {/* Timer Demo */}
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase font-bold text-red-500 mb-1 flex items-center gap-1">
                            <Clock size={12} /> Ends In
                        </span>
                        <div className="flex gap-1 text-xs font-bold font-mono">
                            <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded shadow-sm">02</span>:
                            <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded shadow-sm">14</span>:
                            <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded shadow-sm">59</span>
                        </div>
                    </div>
                </div>

                <div className="relative group">
                    <div
                        ref={scrollRef}
                        className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0"
                    >
                        {DEMO_COMBOS.map((combo) => (
                            <Link
                                key={combo.id}
                                href={`/store?combo=${combo.id}`}
                                className="group/card relative w-[280px] md:w-[320px] shrink-0 snap-center flex flex-col rounded-2xl bg-white shadow-sm border border-orange-100 overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                {/* Image Placeholder area */}
                                <div className="h-32 bg-gradient-to-t from-orange-100 to-amber-50 relative flex items-center justify-center">
                                    <div className="absolute top-3 left-3 flex items-center gap-1 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md z-10">
                                        <Zap size={12} /> Save ₹{combo.savings}
                                    </div>
                                    {combo.limitedStock && (
                                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[9px] font-medium px-2 py-1 rounded-full z-10">
                                            Limited Stock
                                        </div>
                                    )}
                                    <div className="text-5xl opacity-40 drop-shadow-sm group-hover/card:scale-110 transition-transform duration-500">
                                        🎁
                                    </div>
                                </div>

                                <div className="p-4 flex flex-col flex-1">
                                    <h3 className="font-heading text-base font-bold text-warm-900 mb-2 leading-tight">
                                        {combo.name}
                                    </h3>
                                    <div className="flex gap-2 text-xs font-semibold text-warm-600 mb-4 items-center">
                                        <span className="bg-orange-50 px-2 py-1 rounded text-orange-700">3 Items inside</span>
                                    </div>

                                    <div className="flex justify-between items-end mt-auto pt-3 border-t border-warm-100">
                                        <div>
                                            <p className="text-[10px] text-warm-400 line-through mb-0.5">₹{combo.originalTotal.toLocaleString()}</p>
                                            <p className="text-lg font-bold text-warm-900 leading-none">₹{combo.comboPrice.toLocaleString()}</p>
                                        </div>
                                        <span className="bg-orange-600 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-md active:scale-95 transition-transform">
                                            Add to Cart
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <button
                        onClick={() => scroll(-1)}
                        className="absolute -left-4 top-[40%] text-warm-500 opacity-0 group-hover:opacity-100 hidden md:flex size-10 z-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-xl border border-warm-100 hover:text-saffron-600 hover:scale-110 transition-all active:scale-95"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={() => scroll(1)}
                        className="absolute -right-4 top-[40%] text-warm-500 opacity-0 group-hover:opacity-100 hidden md:flex size-10 z-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-xl border border-warm-100 hover:text-saffron-600 hover:scale-110 transition-all active:scale-95 rotate-180"
                        aria-label="Scroll right"
                    >
                        <ChevronLeft size={20} />
                    </button>
                </div>
            </div>
        </section>
    );
}
