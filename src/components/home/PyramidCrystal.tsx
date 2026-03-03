"use client";

import Link from "next/link";
import { Zap, ChevronRight } from "lucide-react";

const AMPLIFIERS = [
    {
        id: "p1",
        name: "Copper Pyramids",
        benefit: "Vastu Correction",
        icon: "🔺",
        color: "from-orange-100 to-amber-50",
        textHover: "group-hover:text-orange-700"
    },
    {
        id: "p2",
        name: "Crystal Spheres",
        benefit: "Focus & Clarity",
        icon: "🔮",
        color: "from-blue-100 to-indigo-50",
        textHover: "group-hover:text-blue-700"
    },
    {
        id: "p3",
        name: "Amethyst Clusters",
        benefit: "Stress Relief",
        icon: "💜",
        color: "from-purple-100 to-fuchsia-50",
        textHover: "group-hover:text-purple-700"
    },
    {
        id: "p4",
        name: "Orgone Generators",
        benefit: "EMF Protection",
        icon: "✨",
        color: "from-emerald-100 to-teal-50",
        textHover: "group-hover:text-emerald-700"
    }
];

export function PyramidCrystal() {
    return (
        <section className="section-shell bg-warm-50/50">
            <div className="section-wrap">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 mb-2">
                            <Zap size={16} className="text-purple-600" />
                            <span className="text-[11px] font-bold text-purple-600 tracking-wider uppercase">
                                High Vibe Tools
                            </span>
                        </div>
                        <h2 className="font-heading text-2xl md:text-3xl font-bold text-warm-900 mb-2">
                            Energy Amplifiers
                        </h2>
                        <p className="text-sm text-warm-600">
                            Clear negativity and manifest your goals faster with our ethically sourced crystals and Vedic pyramids.
                        </p>
                    </div>
                    <Link
                        href="/store?category=pyramids-crystals"
                        className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-purple-700 bg-purple-100/50 px-4 py-2 rounded-full hover:bg-purple-100 transition-colors"
                    >
                        Explore All <ChevronRight size={16} />
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    {AMPLIFIERS.map((item) => (
                        <Link
                            key={item.id}
                            href={`/store?item=${item.id}`}
                            className={`group flex flex-col p-5 rounded-2xl bg-gradient-to-br ${item.color} border border-white shadow-sm hover:shadow-md transition-all hover:-translate-y-1`}
                        >
                            <div className="text-4xl mb-3 drop-shadow-sm group-hover:scale-110 transition-transform origin-bottom">
                                {item.icon}
                            </div>
                            <h3 className={`font-bold text-warm-900 text-sm md:text-base mb-1 transition-colors ${item.textHover}`}>
                                {item.name}
                            </h3>
                            <p className="text-[11px] md:text-xs font-semibold text-warm-600 opacity-80">
                                {item.benefit}
                            </p>
                        </Link>
                    ))}
                </div>

                {/* Mobile View All Button */}
                <div className="mt-6 text-center md:hidden">
                    <Link
                        href="/store?category=pyramids-crystals"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-100 px-5 py-2.5 rounded-full"
                    >
                        Explore All <ChevronRight size={14} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
