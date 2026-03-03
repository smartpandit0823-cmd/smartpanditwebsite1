"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { ChevronLeft, Zap, ArrowRight, ShieldCheck } from "lucide-react";

// Simplified Product for Trending Demo
interface TrendingProduct {
    id: string;
    slug: string;
    name: string;
    image: string;
    price: number;
    originalPrice?: number;
    discount: number;
    rating: number;
    reviewCount: number;
    isNew?: boolean;
}

const TRENDING_ITEMS: TrendingProduct[] = [
    { id: "t1", slug: "himalayan-sphatik-mala", name: "Himalayan Sphatik Mala", image: "", price: 1499, originalPrice: 1999, discount: 25, rating: 4.9, reviewCount: 420, isNew: true },
    { id: "t2", slug: "golden-pyrite-bracelet", name: "Golden Pyrite Bracelet", image: "", price: 999, originalPrice: 1599, discount: 37, rating: 4.8, reviewCount: 890, isNew: true },
    { id: "t3", slug: "7-chakra-tree", name: "7 Chakra Healing Tree", image: "", price: 1299, originalPrice: 1899, discount: 31, rating: 4.7, reviewCount: 310, isNew: false },
    { id: "t4", slug: "black-horse-shoe", name: "Original Black Horse Shoe", image: "", price: 599, originalPrice: 999, discount: 40, rating: 4.6, reviewCount: 550, isNew: false },
    { id: "t5", slug: "rose-quartz-roller", name: "Rose Quartz Face Roller", image: "", price: 899, originalPrice: 1299, discount: 30, rating: 4.8, reviewCount: 220, isNew: true },
    { id: "t6", slug: "gomati-chakra-set", name: "11 Gomati Chakra Set", image: "", price: 399, originalPrice: 599, discount: 33, rating: 4.9, reviewCount: 1100, isNew: false },
];

export function TrendingNow() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);

    // Auto-scroll logic for trending (slow continuous scroll on desktop)
    useEffect(() => {
        let animationFrameId: number;
        const container = scrollRef.current;

        const scroll = () => {
            if (container && !isHovering && window.innerWidth > 768) {
                container.scrollLeft += 0.5; // Very slow scroll
                if (container.scrollLeft >= container.scrollWidth - container.clientWidth - 1) {
                    // Reset to start if reached end
                    container.scrollLeft = 0;
                }
            }
            animationFrameId = requestAnimationFrame(scroll);
        };

        animationFrameId = requestAnimationFrame(scroll);
        return () => cancelAnimationFrame(animationFrameId);
    }, [isHovering]);

    const handleScroll = (dir: 1 | -1) => {
        scrollRef.current?.scrollBy({ left: dir * 200, behavior: "smooth" });
    };

    return (
        <section className="section-shell relative z-10 overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-teal-50/30 to-emerald-50/20" />

            <div className="section-wrap relative">
                <div className="flex items-end justify-between mb-6">
                    <div>
                        <div className="inline-flex items-center gap-1.5 mb-1.5 px-2 py-0.5 rounded-full bg-teal-100/80 text-teal-700 border border-teal-200">
                            <Zap size={10} className="fill-teal-600" />
                            <span className="text-[9px] font-bold tracking-widest uppercase">Hot & Viral</span>
                        </div>
                        <h2 className="font-heading text-2xl md:text-3xl font-bold text-warm-900 leading-none">
                            Trending Now
                        </h2>
                    </div>
                    <Link
                        href="/store?sort=trending"
                        className="flex items-center gap-1 text-[11px] font-bold text-teal-600 hover:text-teal-700 transition"
                    >
                        See All <ArrowRight size={14} />
                    </Link>
                </div>

                <div className="relative group">
                    <div
                        ref={scrollRef}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        onTouchStart={() => setIsHovering(true)}
                        onTouchEnd={() => setIsHovering(false)}
                        className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4 p-2 -mx-4 px-4 md:mx-0 md:px-0"
                    >
                        {TRENDING_ITEMS.map((product) => (
                            <Link
                                key={product.id}
                                href={`/store/${product.slug}`}
                                className="w-[180px] shrink-0 snap-start bg-white rounded-2xl p-3 border border-warm-100 shadow-sm hover:shadow-md transition-all flex flex-col group/card"
                            >
                                <div className="relative aspect-[4/5] bg-warm-50 rounded-xl mb-3 overflow-hidden">
                                    {product.isNew && (
                                        <div className="absolute top-2 left-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded z-10 shadow-sm">
                                            NEW LAUNCH
                                        </div>
                                    )}
                                    {/* Placeholder text for image */}
                                    <div className="absolute inset-0 flex items-center justify-center text-4xl group-hover/card:scale-110 transition-transform duration-500 opacity-60">✨</div>
                                </div>
                                <h3 className="font-semibold text-warm-900 text-[13px] line-clamp-2 leading-snug mb-2 group-hover/card:text-teal-700 transition-colors">
                                    {product.name}
                                </h3>

                                <div className="mt-auto">
                                    <div className="flex gap-1.5 items-end mb-1">
                                        <span className="text-sm font-bold text-warm-900">₹{product.price}</span>
                                        <span className="text-[10px] text-warm-400 line-through">₹{product.originalPrice}</span>
                                    </div>
                                    <span className="text-[10px] text-teal-600 font-semibold bg-teal-50 px-1.5 py-0.5 rounded flex items-center gap-1 w-fit">
                                        <ShieldCheck size={10} /> In High Demand
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <button
                        onClick={() => handleScroll(-1)}
                        className="absolute -left-4 top-[40%] text-warm-500 opacity-0 group-hover:opacity-100 hidden md:flex size-10 z-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-xl border border-warm-100 hover:text-teal-600 hover:scale-110 transition-all active:scale-95"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={() => handleScroll(1)}
                        className="absolute -right-4 top-[40%] text-warm-500 opacity-0 group-hover:opacity-100 hidden md:flex size-10 z-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-xl border border-warm-100 hover:text-teal-600 hover:scale-110 transition-all active:scale-95 rotate-180"
                        aria-label="Scroll right"
                    >
                        <ChevronLeft size={20} />
                    </button>
                </div>
            </div>
        </section>
    );
}
