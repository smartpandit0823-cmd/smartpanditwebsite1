"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart, Heart, BadgeCheck, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";

interface StoreProduct {
    id: string;
    slug: string;
    name: string;
    category: string;
    images: string[];
    price: number;
    originalPrice?: number;
    discount: number;
    rating: number;
    reviewCount: number;
    benefits: string[];
    description: string;
    inStock: boolean;
    isAuthentic: boolean;
    featured: boolean;
    panditRecommended?: boolean;
    astrologerRecommended?: boolean;
}

export function StoreProductCard({ product }: { product: StoreProduct }) {
    const [wishlisted, setWishlisted] = useState(false);
    const [justAdded, setJustAdded] = useState(false);
    const { addToCart, adding } = useCart();
    const isAdding = adding === product.id;
    const hasDiscount = product.discount > 0 && product.originalPrice;
    const mainImage = product.images?.[0] || "/images/products/rudraksha.png";

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!product.inStock || isAdding) return;
        const success = await addToCart(product.id);
        if (success) {
            setJustAdded(true);
            setTimeout(() => setJustAdded(false), 1500);
        }
    };

    return (
        <div className="card-premium group relative flex flex-col overflow-hidden rounded-2xl border border-gold-200/60 bg-white shadow-sm">
            {/* Image Container */}
            <Link href={`/store/${product.slug}`} className="relative aspect-square overflow-hidden bg-linear-to-br from-warm-50 to-saffron-50/30">
                <Image
                    src={mainImage}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />

                {/* Badges overlay */}
                <div className="absolute left-2 top-2 flex flex-col gap-1.5">
                    {hasDiscount && (
                        <span className="rounded-lg bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                            {product.discount}% OFF
                        </span>
                    )}
                    {product.panditRecommended && (
                        <span className="flex items-center gap-1 rounded-lg bg-saffron-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                            🙏 Pandit Pick
                        </span>
                    )}
                    {product.astrologerRecommended && (
                        <span className="flex items-center gap-1 rounded-lg bg-purple-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                            🔮 Astro Pick
                        </span>
                    )}
                </div>

                {/* Wishlist */}
                <button
                    onClick={(e) => { e.preventDefault(); setWishlisted(!wishlisted); }}
                    className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition-all active:scale-90 hover:bg-white"
                    aria-label="Add to wishlist"
                >
                    <Heart
                        size={16}
                        className={wishlisted ? "fill-red-500 text-red-500" : "text-warm-400"}
                    />
                </button>

                {/* Authenticity badge */}
                {product.isAuthentic && (
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-green-500/90 px-2 py-0.5 text-[9px] font-semibold text-white backdrop-blur-sm">
                        <BadgeCheck size={10} />
                        Certified
                    </div>
                )}
            </Link>

            {/* Content */}
            <div className="flex flex-1 flex-col p-3 md:p-4">
                {/* Category */}
                <span className="text-[10px] font-medium uppercase tracking-wider text-saffron-500">
                    {product.category}
                </span>

                {/* Name */}
                <Link href={`/store/${product.slug}`}>
                    <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-warm-900 transition-colors hover:text-saffron-600">
                        {product.name}
                    </h3>
                </Link>

                {/* Rating */}
                <div className="mt-1.5 flex items-center gap-1">
                    <div className="flex items-center gap-0.5">
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                        <span className="text-xs font-semibold text-warm-800">{product.rating}</span>
                    </div>
                    <span className="text-[10px] text-warm-500">({product.reviewCount})</span>
                </div>

                {/* Price */}
                <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-lg font-bold text-warm-900">₹{product.price.toLocaleString("en-IN")}</span>
                    {hasDiscount && (
                        <span className="text-xs text-warm-400 line-through">₹{product.originalPrice!.toLocaleString("en-IN")}</span>
                    )}
                </div>

                {/* Benefits preview */}
                {product.benefits.length > 0 && (
                    <p className="mt-1.5 line-clamp-1 text-[11px] text-warm-500">
                        ✦ {product.benefits[0]}
                    </p>
                )}

                {/* Add to Cart */}
                <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock || isAdding}
                    className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 ${justAdded
                        ? "bg-green-500 text-white shadow-green-200"
                        : "bg-linear-to-r from-saffron-500 to-saffron-600 text-white hover:shadow-lg"
                        }`}
                >
                    {isAdding ? (
                        <>
                            <Loader2 size={14} className="animate-spin" />
                            Adding...
                        </>
                    ) : justAdded ? (
                        <>
                            <Check size={14} />
                            Added ✓
                        </>
                    ) : (
                        <>
                            <ShoppingCart size={14} />
                            {product.inStock ? "Add to Cart" : "Out of Stock"}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
