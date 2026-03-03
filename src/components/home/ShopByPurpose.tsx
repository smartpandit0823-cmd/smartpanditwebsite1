"use client";

import Link from "next/link";
import { useRef } from "react";
import { Heart, Coins, Shield, Activity, Briefcase, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

export function ShopByPurpose() {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (dir: 1 | -1) => {
        scrollRef.current?.scrollBy({ left: dir * 180, behavior: "smooth" });
    };

    const purposes = [
        {
            id: "wealth",
            name: "Wealth & Success",
            icon: <Coins size={28} className="text-yellow-600" />,
            color: "from-yellow-100/80 to-amber-50",
            borderColor: "border-yellow-200/60",
            emoji: "💰",
            delay: "0ms",
        },
        {
            id: "love",
            name: "Love & Marriage",
            icon: <Heart size={28} className="text-rose-500" />,
            color: "from-rose-100/80 to-pink-50",
            borderColor: "border-rose-200/60",
            emoji: "❤️",
            delay: "100ms",
        },
        {
            id: "protection",
            name: "Evil Eye Protection",
            icon: <Shield size={28} className="text-blue-600" />,
            color: "from-blue-100/80 to-indigo-50",
            borderColor: "border-blue-200/60",
            emoji: "🧿",
            delay: "200ms",
        },
        {
            id: "health",
            name: "Health & Healing",
            icon: <Activity size={28} className="text-emerald-600" />,
            color: "from-emerald-100/80 to-teal-50",
            borderColor: "border-emerald-200/60",
            emoji: "🩺",
            delay: "300ms",
        },
        {
            id: "career",
            name: "Job & Career Growth",
            icon: <Briefcase size={28} className="text-indigo-600" />,
            color: "from-indigo-100/80 to-violet-50",
            borderColor: "border-indigo-200/60",
            emoji: "📈",
            delay: "400ms",
        },
        {
            id: "rashi",
            name: "Rashi Remedies",
            icon: <Sparkles size={28} className="text-purple-600" />,
            color: "from-purple-100/80 to-fuchsia-50",
            borderColor: "border-purple-200/60",
            emoji: "✨",
            delay: "500ms",
        },
    ];

    return (
        <section className="section-shell -mt-6 sm:-mt-10 relative z-20">
            <div className="section-wrap">
                <div className="flex items-center justify-between mb-4 px-1">
                    <h2 className="font-heading text-xl md:text-2xl font-bold text-warm-900 drop-shadow-sm">
                        Shop By Purpose
                    </h2>
                    {/* Subtle instructions for mobile swipe */}
                    <span className="text-[10px] text-warm-400 font-medium md:hidden animate-pulse">
                        Swipe ⟵
                    </span>
                </div>

                <div className="relative group">
                    {/* Horizontally scrollable container */}
                    <div
                        ref={scrollRef}
                        className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0"
                    >
                        {purposes.map((purpose) => (
                            <Link
                                key={purpose.id}
                                href={`/store?purpose=${purpose.id}`}
                                className={`relative w-[140px] md:w-[150px] shrink-0 snap-start flex flex-col items-center p-5 rounded-[20px] bg-gradient-to-br ${purpose.color} border ${purpose.borderColor} shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md animate-soft-fade active:scale-95`}
                                style={{ animationDelay: purpose.delay, animationFillMode: "both" }}
                            >
                                {/* Glow behind icon */}
                                <div className="absolute top-4 w-12 h-12 bg-white/50 rounded-full blur-xl" />

                                {/* Icon Container */}
                                <div className="relative z-10 size-14 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 mb-3 group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-3xl drop-shadow-sm">{purpose.emoji}</span>
                                </div>

                                <h3 className="relative z-10 font-bold text-warm-900 text-[13px] text-center leading-tight">
                                    {purpose.name}
                                </h3>
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Navigation Arrows */}
                    <button
                        onClick={() => scroll(-1)}
                        className="absolute -left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 hidden md:flex size-10 items-center justify-center rounded-full bg-white shadow-md text-warm-500 hover:text-saffron-600 transition z-10 border border-warm-100"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={() => scroll(1)}
                        className="absolute -right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 hidden md:flex size-10 items-center justify-center rounded-full bg-white shadow-md text-warm-500 hover:text-saffron-600 transition z-10 border border-warm-100"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </section>
    );
}
