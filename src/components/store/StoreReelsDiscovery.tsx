"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, ShoppingCart, Heart } from "lucide-react";

interface ReelProduct {
    id: string;
    slug: string;
    name: string;
    images: string[];
    video?: string;
    price: number;
    originalPrice?: number;
    category: string;
}

export function StoreReelsDiscovery({ products }: { products: ReelProduct[] }) {
    const [activeReel, setActiveReel] = useState<string | null>(null);

    if (products.length === 0) return null;

    return (
        <section className="section-shell">
            <div className="section-wrap">
                {/* Header */}
                <div className="mb-6 flex items-end justify-between">
                    <div>
                        <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-pink-100 to-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                            🎬 Discover
                        </span>
                        <h2 className="font-serif text-xl font-bold text-warm-900 md:text-2xl">
                            Spiritual Reels
                        </h2>
                        <p className="mt-1 text-sm text-warm-600">
                            Watch & shop spiritual products
                        </p>
                    </div>
                </div>

                {/* Reels horizontal scroll */}
                <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 snap-x">
                    {products.slice(0, 10).map((product) => (
                        <div
                            key={product.id}
                            className="relative w-[160px] shrink-0 snap-start overflow-hidden rounded-2xl shadow-md md:w-[200px]"
                        >
                            {/* Vertical media card */}
                            <Link href={`/product/${product.slug}`} className="block">
                                <div className="relative aspect-9/16 bg-linear-to-br from-warm-100 to-saffron-50">
                                    <Image
                                        src={product.images?.[0] || "/placeholder-product.jpg"}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                        sizes="200px"
                                    />

                                    {/* Play icon overlay */}
                                    {product.video && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div
                                                className="flex size-12 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm transition-transform active:scale-90"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setActiveReel(activeReel === product.id ? null : product.id);
                                                }}
                                            >
                                                <Play size={20} className="ml-0.5 text-white" fill="white" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Gradient overlay at bottom */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-3 pt-12">
                                        {/* Product name */}
                                        <p className="line-clamp-2 text-xs font-semibold text-white">
                                            {product.name}
                                        </p>
                                        {/* Price */}
                                        <div className="mt-1 flex items-baseline gap-1.5">
                                            <span className="text-sm font-bold text-white">
                                                ₹{product.price.toLocaleString("en-IN")}
                                            </span>
                                            {product.originalPrice && product.originalPrice > product.price && (
                                                <span className="text-[10px] text-white/60 line-through">
                                                    ₹{product.originalPrice.toLocaleString("en-IN")}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Side actions */}
                                    <div className="absolute bottom-20 right-2 flex flex-col gap-3">
                                        <button
                                            className="flex size-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition active:scale-90"
                                            onClick={(e) => e.preventDefault()}
                                            aria-label="Wishlist"
                                        >
                                            <Heart size={14} className="text-white" />
                                        </button>
                                        <button
                                            className="flex size-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition active:scale-90"
                                            onClick={(e) => e.preventDefault()}
                                            aria-label="Add to cart"
                                        >
                                            <ShoppingCart size={14} className="text-white" />
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
