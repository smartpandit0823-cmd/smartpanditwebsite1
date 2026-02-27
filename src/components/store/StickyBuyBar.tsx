"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";

interface StickyBuyBarProps {
    price?: number;
    originalPrice?: number;
    inStock?: boolean;
    href?: string;
}

export function StickyBuyBar({
    price = 0,
    originalPrice,
    inStock = true,
    href = "/store",
}: StickyBuyBarProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gold-200/50 bg-white/95 backdrop-blur-xl md:hidden">
            <div className="flex items-center justify-between px-4 py-3 pb-safe">
                {/* Price */}
                <div className="flex flex-col">
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-bold text-warm-900">
                            ₹{price.toLocaleString("en-IN")}
                        </span>
                        {originalPrice && originalPrice > price && (
                            <span className="text-xs text-warm-400 line-through">
                                ₹{originalPrice.toLocaleString("en-IN")}
                            </span>
                        )}
                    </div>
                    <span className="text-[10px] text-green-600 font-medium">
                        {inStock ? "✓ In Stock" : "Out of Stock"}
                    </span>
                </div>

                {/* Buy Button */}
                <Link
                    href={href}
                    className="flex items-center gap-2 rounded-xl bg-linear-to-r from-saffron-500 to-saffron-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all active:scale-95 disabled:opacity-50"
                >
                    <ShoppingBag size={16} />
                    Buy Now
                </Link>
            </div>
        </div>
    );
}
