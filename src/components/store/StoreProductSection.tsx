"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { StoreProductCard } from "./StoreProductCard";

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

interface ProductSectionProps {
    title: string;
    subtitle: string;
    products: StoreProduct[];
    viewAllHref: string;
    badge?: string;
    badgeEmoji?: string;
}

export function StoreProductSection({
    title,
    subtitle,
    products,
    viewAllHref,
    badge,
    badgeEmoji,
}: ProductSectionProps) {
    if (products.length === 0) return null;

    return (
        <section className="section-shell">
            <div className="section-wrap">
                {/* Header */}
                <div className="mb-6 flex items-end justify-between">
                    <div>
                        {badge && (
                            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-saffron-100 px-3 py-1 text-xs font-semibold text-saffron-700">
                                {badgeEmoji && <span>{badgeEmoji}</span>}
                                {badge}
                            </span>
                        )}
                        <h2 className="font-serif text-xl font-bold text-warm-900 md:text-2xl">
                            {title}
                        </h2>
                        <p className="mt-1 text-sm text-warm-600">{subtitle}</p>
                    </div>
                    <Link
                        href={viewAllHref}
                        className="flex items-center gap-1 whitespace-nowrap text-sm font-semibold text-saffron-600 transition hover:text-saffron-700"
                    >
                        View All
                        <ChevronRight size={16} />
                    </Link>
                </div>

                {/* Horizontal scroll on mobile, grid on desktop */}
                <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 snap-x md:mx-0 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:px-0">
                    {products.slice(0, 8).map((product) => (
                        <div
                            key={product.id}
                            className="w-[180px] shrink-0 snap-start md:w-auto"
                        >
                            <StoreProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
