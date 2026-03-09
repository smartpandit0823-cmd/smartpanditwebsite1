"use client";

import { Gift } from "lucide-react";
import { useState, useEffect } from "react";

// Mock data based on the blueprint
const COMBOS = [
    {
        id: "combo-1",
        name: "Wealth & Prosperity Kit",
        emoji: "💰",
        itemsInside: 3,
        items: ["Tiger Eye Bracelet", "Pyrite Tortoise", "Gomati Chakra (set of 11)"],
        originalPrice: 2999,
        price: 2499,
        save: 500,
    },
    {
        id: "combo-2",
        name: "Complete Puja Edition",
        emoji: "🪔",
        itemsInside: 5,
        items: ["Sphatik Mala", "Copper Diya", "Pure Chandan", "Gangajal", "Kumkum"],
        originalPrice: 1999,
        price: 1499,
        save: 500,
    },
    {
        id: "combo-3",
        name: "Protection Shield",
        emoji: "🛡️",
        itemsInside: 3,
        items: ["Black Tourmaline", "Evil Eye Wall Hanging", "Panchmukhi Hanuman Yantra"],
        originalPrice: 3499,
        price: 2799,
        save: 700,
    }
];

export function ComboDeals() {
    const [timeLeft, setTimeLeft] = useState<{ hours: string; mins: string; secs: string }>({
        hours: "00",
        mins: "00",
        secs: "00"
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const midnight = new Date();
            midnight.setHours(24, 0, 0, 0);
            const diff = midnight.getTime() - now.getTime();

            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft({
                hours: hours.toString().padStart(2, '0'),
                mins: mins.toString().padStart(2, '0'),
                secs: secs.toString().padStart(2, '0')
            });
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="py-16 bg-white px-4 border-y border-orange-50">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-[#FF8C00] rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                            <Gift size={14} />
                            SPECIAL BUNDLES
                        </div>
                        <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#1A1A1A]">
                            🎁 Save more with curated combos
                        </h2>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#888888] mr-1">Ends in:</span>
                        <div className="flex gap-1">
                            <span className="w-9 h-10 flex items-center justify-center bg-[#1A1A1A] text-white font-bold rounded-md shadow-inner">{timeLeft.hours}</span>
                            <span className="font-bold text-[#1A1A1A] py-2">:</span>
                            <span className="w-9 h-10 flex items-center justify-center bg-[#1A1A1A] text-white font-bold rounded-md shadow-inner">{timeLeft.mins}</span>
                            <span className="font-bold text-[#1A1A1A] py-2">:</span>
                            <span className="w-9 h-10 flex items-center justify-center bg-[#FF6B8A] text-white font-bold rounded-md shadow-inner animate-pulse">{timeLeft.secs}</span>
                        </div>
                    </div>
                </div>

                {/* Combos Grid */}
                <div className="flex overflow-x-auto gap-4 pb-6 md:grid md:grid-cols-3 md:gap-6 no-scrollbar snap-x snap-mandatory">
                    {COMBOS.map((combo) => (
                        <div
                            key={combo.id}
                            className="snap-start shrink-0 w-[280px] md:w-auto relative bg-gradient-to-b from-[#FEFAF4] to-white border border-[#FFD700]/40 rounded-2xl p-5 hover:shadow-[0_8px_32px_rgba(255,140,0,0.12)] transition-shadow"
                        >
                            {/* Save Badge */}
                            <div className="absolute -top-3 -right-2 bg-[#00CEC9] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md z-10 transform rotate-3">
                                Save ₹{combo.save}
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-20 h-20 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-4xl shadow-inner">
                                    {combo.emoji}
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#1A1A1A] text-lg leading-tight mb-1 pr-4">{combo.name}</h3>
                                    <span className="text-xs font-bold text-[#FF8C00] tracking-wide uppercase px-2 py-0.5 bg-orange-50 rounded">
                                        {combo.itemsInside} Items Inside
                                    </span>
                                </div>
                            </div>

                            {/* Items Previews */}
                            <div className="mb-6 space-y-2 relative min-h-[90px]">
                                {/* Visual dotted connector */}
                                <div className="absolute left-[9px] top-4 bottom-2 w-px border-l-2 border-dashed border-gray-200"></div>

                                {combo.items.map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 relative z-10">
                                        <div className="w-5 h-5 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center shrink-0">
                                            <div className="w-2 h-2 rounded-full bg-[#FF8C00]"></div>
                                        </div>
                                        <span className="text-sm font-medium text-[#1A1A1A] line-clamp-1">{item}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Price and Action */}
                            <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                                <div className="flex flex-col">
                                    <span className="text-xs font-semibold text-[#888888] line-through mb-0.5">₹{combo.originalPrice}</span>
                                    <span className="text-2xl font-bold text-[#FF8C00] leading-none">₹{combo.price}</span>
                                </div>
                                <button className="bg-[#1A1A1A] text-white px-6 py-3 rounded-xl text-sm font-bold shadow-md hover:bg-[#FF8C00] transition-colors hover:shadow-[#FF8C00]/40 hover:-translate-y-0.5 active:translate-y-0 relative z-20">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
