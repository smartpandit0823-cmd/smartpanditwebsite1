"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const ZODIAC_SIGNS = [
    { sign: "Aries", name: "Mesh", date: "Mar 21 - Apr 19", stone: "Red Coral", color: "bg-red-50", text: "text-red-700" },
    { sign: "Taurus", name: "Vrishabha", date: "Apr 20 - May 20", stone: "Diamond / Opal", color: "bg-green-50", text: "text-green-700" },
    { sign: "Gemini", name: "Mithun", date: "May 21 - Jun 20", stone: "Emerald", color: "bg-yellow-50", text: "text-yellow-700" },
    { sign: "Cancer", name: "Karkat", date: "Jun 21 - Jul 22", stone: "Pearl", color: "bg-slate-50", text: "text-slate-700" },
    { sign: "Leo", name: "Simha", date: "Jul 23 - Aug 22", stone: "Ruby", color: "bg-orange-50", text: "text-orange-700" },
    { sign: "Virgo", name: "Kanya", date: "Aug 23 - Sep 22", stone: "Emerald", color: "bg-emerald-50", text: "text-emerald-700" },
    { sign: "Libra", name: "Tula", date: "Sep 23 - Oct 22", stone: "Diamond / Opal", color: "bg-pink-50", text: "text-pink-700" },
    { sign: "Scorpio", name: "Vrishchik", date: "Oct 23 - Nov 21", stone: "Red Coral", color: "bg-red-50", text: "text-red-700" },
    { sign: "Sagittarius", name: "Dhanu", date: "Nov 22 - Dec 21", stone: "Yellow Sapphire", color: "bg-amber-50", text: "text-amber-700" },
    { sign: "Capricorn", name: "Makar", date: "Dec 22 - Jan 19", stone: "Blue Sapphire", color: "bg-blue-50", text: "text-blue-700" },
    { sign: "Aquarius", name: "Kumbh", date: "Jan 20 - Feb 18", stone: "Blue Sapphire", color: "bg-indigo-50", text: "text-indigo-700" },
    { sign: "Pisces", name: "Meen", date: "Feb 19 - Mar 20", stone: "Yellow Sapphire", color: "bg-purple-50", text: "text-purple-700" }
];

export function ZodiacSlider() {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (dir: 1 | -1) => {
        scrollRef.current?.scrollBy({ left: dir * 200, behavior: "smooth" });
    };

    return (
        <section className="section-shell bg-gradient-to-br from-cosmic-50 to-white">
            <div className="section-wrap">
                <div className="flex items-end justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles size={16} className="text-cosmic-600" />
                            <span className="text-xs font-bold text-cosmic-600 tracking-wider">
                                SHOP BY RASHI
                            </span>
                        </div>
                        <h2 className="font-heading text-2xl md:text-3xl font-bold text-warm-900">
                            Your Astrological Remedies
                        </h2>
                    </div>
                </div>

                <div className="relative group">
                    <div
                        ref={scrollRef}
                        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth p-2 -mx-2"
                    >
                        {ZODIAC_SIGNS.map((zodiac) => (
                            <div key={zodiac.sign} className="w-[180px] shrink-0">
                                <Link
                                    href={`/store?rashi=${zodiac.sign.toLowerCase()}`}
                                    className="flex flex-col items-center bg-white border border-cosmic-100 rounded-2xl p-5 text-center shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                                >
                                    <div className={`size-14 rounded-full ${zodiac.color} flex items-center justify-center mb-3`}>
                                        <span className={`font-heading text-lg font-bold ${zodiac.text}`}>
                                            {zodiac.name[0]}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-warm-900">{zodiac.sign}</h3>
                                    <span className="text-[10px] text-warm-500 mb-3">{zodiac.date}</span>
                                    <div className="w-full bg-cosmic-50 rounded-lg p-2 mb-3">
                                        <span className="block text-[9px] text-cosmic-600 uppercase font-semibold mb-0.5">Lucky Stone</span>
                                        <span className="text-xs font-medium text-warm-900">{zodiac.stone}</span>
                                    </div>
                                    <span className="text-xs font-semibold text-cosmic-600 w-full rounded-full border border-cosmic-200 py-1.5 hover:bg-cosmic-50 transition-colors">
                                        Shop Now
                                    </span>
                                </Link>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => scroll(-1)}
                        className="absolute -left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 hidden md:flex size-10 items-center justify-center rounded-full bg-white shadow-md text-warm-500 hover:text-cosmic-600 transition"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={() => scroll(1)}
                        className="absolute -right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 hidden md:flex size-10 items-center justify-center rounded-full bg-white shadow-md text-warm-500 hover:text-cosmic-600 transition"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </section>
    );
}
