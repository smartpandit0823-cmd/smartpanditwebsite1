"use client";

import Link from "next/link";
import { useRef } from "react";
import { Star, Heart, Flame, ChevronLeft } from "lucide-react";

interface Product {
    id: string;
    slug: string; // ✅ Added slug to match what's missing
    name: string;
    images: string[];
    price: number;
    originalPrice?: number;
    discount: number;
    rating: number;
    reviewCount: number;
    inStock: boolean;
}

function ProductCard({ product }: { product: Product }) {
    return (
        <Link
            href={`/store/${product.slug}`}
            className="group relative flex flex-col bg-white rounded-2xl border border-saffron-100/60 overflow-hidden card-premium h-full"
        >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-warm-50 shrink-0">
                {product.images?.[0] ? (
                    <img
                        src={product.images[0]}
                        alt={product.name ?? "Product image"}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-4xl">🙏</div>
                )}
                {/* Discount Badge */}
                {product.discount > 0 && (
                    <span className="absolute left-[6px] top-[6px] z-10 flex min-w-[32px] flex-col items-center justify-center rounded bg-gradient-to-r from-red-600 to-red-500 p-[3px] text-center shadow-md">
                        <span className="text-[10px] sm:text-[11px] font-bold text-white tracking-widest leading-none">
                            {product.discount}% OFF
                        </span>
                    </span>
                )}

                {/* Wishlist Heart */}
                <button
                    className="absolute top-[6px] right-[6px] z-10 flex size-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-warm-400 hover:text-red-500 transition-colors shadow-sm"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    title="Add to wishlist"
                    aria-label="Add to wishlist"
                >
                    <Heart size={14} />
                </button>
                {/* Limited Stock Badge */}
                {product.discount > 15 && (
                    <span className="absolute bottom-[6px] right-[6px] z-10 bg-black/80 backdrop-blur-sm text-white text-[8px] sm:text-[9px] font-bold px-2 py-1 flex items-center gap-1 rounded shadow-sm">
                        <Flame size={10} className="text-orange-400" /> Limited Stock
                    </span>
                )}
            </div>

            {/* Details */}
            <div className="p-3 sm:p-4 flex flex-1 flex-col">
                <h3 className="line-clamp-2 text-xs sm:text-sm font-semibold text-warm-900 leading-snug mb-1.5 group-hover:text-saffron-700 transition-colors">
                    {product.name}
                </h3>

                {/* Rating and Social Proof */}
                <div className="flex flex-col gap-1.5 mb-2 mt-auto">
                    <div className="flex items-center gap-1">
                        <div className="flex text-amber-400 gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={10}
                                    className={`${i < Math.round(product.rating ?? 4.8) ? "fill-amber-400" : "fill-neutral-200 text-neutral-200"} `}
                                />
                            ))}
                        </div>
                        <span className="text-[10px] font-medium text-warm-500">
                            ({product.reviewCount ?? 120})
                        </span>
                    </div>

                    <div className="flex w-fit items-center gap-1 rounded bg-green-50 px-[4px] py-[2px] text-[9px] font-semibold text-green-700 mt-0.5 shadow-sm">
                        🔥 5,000+ Bought
                    </div>
                </div>

                {/* Price */}
                <div className="flex items-end gap-1.5 align-bottom">
                    <span className="text-sm font-bold text-warm-900">
                        ₹{product.price?.toLocaleString()}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-[10px] text-warm-400 line-through">
                            ₹{product.originalPrice?.toLocaleString()}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}

export function BestSellers({ products }: { products: Product[] }) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (dir: 1 | -1) => {
        scrollRef.current?.scrollBy({ left: dir * 200, behavior: "smooth" });
    };

    if (products.length === 0) return null;

    return (
        <section className="section-shell bg-gradient-to-b from-transparent to-saffron-50/30">
            <div className="section-wrap">
                {/* Section Header */}
                <div className="flex flex-col mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold tracking-widest uppercase text-saffron-600 bg-saffron-100 border border-saffron-200 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                            🔥 Trending
                        </span>
                    </div>
                    <div className="flex items-end justify-between">
                        <div>
                            <h2 className="font-heading text-2xl md:text-3xl font-bold text-warm-900">
                                Best Sellers
                            </h2>
                            <p className="text-xs sm:text-sm text-warm-600 mt-1">
                                Most loved by our devotees
                            </p>
                        </div>
                        <Link
                            href="/store?sort=best-selling"
                            className="bg-saffron-50 rounded-full px-3 py-1.5 text-xs font-semibold text-saffron-700 hover:bg-saffron-100 hover:text-saffron-800 transition-colors shadow-sm whitespace-nowrap"
                        >
                            View All →
                        </Link>
                    </div>
                </div>

                {/* Product Grid (2 col mobile) */}
                <div className="grid grid-cols-2 gap-3 md:hidden">
                    {products.slice(0, 6).map((product) => (
                        <div key={product.id} className="h-full">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>

                {/* Desktop: Horizontal scroll */}
                <div className="hidden md:block relative group">
                    <div
                        ref={scrollRef}
                        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth p-2 -mx-2"
                    >
                        {products.map((product) => (
                            <div key={product.id} className="w-[200px] shrink-0">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                    {/* Horizontal Arrows - Hidden by default till hover on Desktop*/}
                    <button
                        onClick={() => scroll(-1)}
                        className="absolute left-0 top-[40%] text-warm-500 opacity-0 group-hover:opacity-100 z-10 size-10 flex -translate-y-1/2 -translate-x-1/2 items-center justify-center rounded-full bg-white shadow-xl border border-warm-100 hover:text-saffron-600 hover:scale-110 transition-all active:scale-95"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={() => scroll(1)}
                        className="absolute right-0 top-[40%] text-warm-500 opacity-0 group-hover:opacity-100 z-10 size-10 flex -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-white shadow-xl border border-warm-100 hover:text-saffron-600 hover:scale-110 transition-all active:scale-95 rotate-180"
                        aria-label="Scroll right"
                    >
                        <ChevronLeft size={20} />
                    </button>
                </div>
            </div>
        </section>
    );
}
