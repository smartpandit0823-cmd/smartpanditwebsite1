"use client";

import Link from "next/link";
import { useRef } from "react";
import { Star, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

interface Product {
    id: string;
    slug: string;
    name: string;
    images: string[];
    price: number;
    originalPrice?: number;
    rating: number;
}

export function SiddhCollection({ products }: { products: Product[] }) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (dir: 1 | -1) => {
        scrollRef.current?.scrollBy({ left: dir * 220, behavior: "smooth" });
    };

    if (products.length === 0) return null;

    return (
        <section className="section-premium-dark py-14 md:py-20 relative overflow-hidden">
            {/* Subtle gold corner accents */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-gold-600/10 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-gold-600/10 to-transparent pointer-events-none" />

            <div className="section-wrap px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-3">
                        <Sparkles size={16} className="text-gold-400" />
                        <span className="text-[11px] font-semibold tracking-widest uppercase text-gold-400">
                            Premium Collection
                        </span>
                        <Sparkles size={16} className="text-gold-400" />
                    </div>
                    <h2 className="font-heading text-2xl md:text-3xl font-bold animate-golden-shimmer inline-block">
                        Siddh Collection
                    </h2>
                    <p className="text-sm text-neutral-400 mt-2 max-w-md mx-auto">
                        Energized By Expert Pandits · Certified Authentic
                    </p>
                    {/* Gold divider */}
                    <div className="mt-4 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-gold-500/60 to-transparent" />
                </div>

                {/* Products Slider */}
                <div className="relative">
                    <div
                        ref={scrollRef}
                        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth -mx-4 px-4"
                    >
                        {products.map((product) => (
                            <Link
                                key={product.id}
                                href={`/store/${product.slug}`}
                                className="group flex-shrink-0 w-[160px] md:w-[200px]"
                            >
                                {/* Card */}
                                <div className="relative rounded-2xl overflow-hidden border border-gold-700/30 bg-gradient-to-b from-neutral-800 to-neutral-900 hover:border-gold-500/50 transition-all duration-300">
                                    {/* Image */}
                                    <div className="aspect-square overflow-hidden bg-neutral-800">
                                        {product.images[0] ? (
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-3xl">
                                                ✨
                                            </div>
                                        )}
                                        {/* Gold shimmer on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                    </div>

                                    {/* Info */}
                                    <div className="p-3">
                                        <h3 className="text-xs font-semibold text-neutral-200 line-clamp-2 mb-2 group-hover:text-gold-300 transition-colors">
                                            {product.name}
                                        </h3>
                                        <div className="flex items-center gap-1 mb-1.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={9}
                                                    className={i < Math.round(product.rating) ? "fill-gold-500 text-gold-500" : "text-neutral-600"}
                                                />
                                            ))}
                                        </div>
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-sm font-bold text-gold-400">
                                                ₹{product.price.toLocaleString()}
                                            </span>
                                            {product.originalPrice && (
                                                <span className="text-[10px] text-neutral-500 line-through">
                                                    ₹{product.originalPrice.toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Premium badge */}
                                    <div className="absolute top-2 left-2 bg-gradient-to-r from-gold-600 to-gold-500 text-[9px] font-bold text-black px-2 py-0.5 rounded-full">
                                        SIDDH
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Desktop nav arrows */}
                    <button
                        onClick={() => scroll(-1)}
                        className="absolute -left-3 top-1/2 -translate-y-1/2 hidden md:flex size-10 rounded-full bg-neutral-800 border border-gold-700/30 items-center justify-center text-gold-400 hover:bg-neutral-700 transition"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        onClick={() => scroll(1)}
                        className="absolute -right-3 top-1/2 -translate-y-1/2 hidden md:flex size-10 rounded-full bg-neutral-800 border border-gold-700/30 items-center justify-center text-gold-400 hover:bg-neutral-700 transition"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>

                {/* View All */}
                <div className="text-center mt-8">
                    <Link
                        href="/store?collection=siddh"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-gold-400 border border-gold-600/30 rounded-full px-6 py-2.5 hover:bg-gold-500/10 transition-colors"
                    >
                        Explore Full Collection
                        <ChevronRight size={14} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
