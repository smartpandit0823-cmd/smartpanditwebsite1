"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, Grid3X3, LayoutList, ChevronDown } from "lucide-react";
import { StoreProductCard } from "@/components/store/StoreProductCard";
import { STORE_CATEGORIES } from "@/lib/store-constants";

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
    video?: string;
}

type SortOption = "newest" | "price-low" | "price-high" | "rating" | "popular";

export function StoreListingClient({ products }: { products: StoreProduct[] }) {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get("category") || "all";
    const filter = searchParams.get("filter");

    const [activeCategory, setActiveCategory] = useState(initialCategory);
    const [sortBy, setSortBy] = useState<SortOption>("newest");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [showSort, setShowSort] = useState(false);

    const categories = [
        { id: "all", name: "All", emoji: "✨" },
        ...STORE_CATEGORIES.map((c) => ({ id: c.id, name: c.name, emoji: c.emoji })),
    ];

    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Category filter
        if (activeCategory !== "all") {
            result = result.filter((p) => p.category === activeCategory);
        }

        // Special filters
        if (filter === "pandit-recommended") {
            result = result.filter((p) => p.panditRecommended);
        } else if (filter === "astrologer-recommended") {
            result = result.filter((p) => p.astrologerRecommended);
        }

        // Sort
        switch (sortBy) {
            case "price-low":
                result.sort((a, b) => a.price - b.price);
                break;
            case "price-high":
                result.sort((a, b) => b.price - a.price);
                break;
            case "rating":
                result.sort((a, b) => b.rating - a.rating);
                break;
            case "popular":
                result.sort((a, b) => b.reviewCount - a.reviewCount);
                break;
            default:
                break;
        }

        return result;
    }, [products, activeCategory, sortBy, filter]);

    const sortLabels: Record<SortOption, string> = {
        newest: "Newest",
        "price-low": "Price: Low → High",
        "price-high": "Price: High → Low",
        rating: "Highest Rated",
        popular: "Most Popular",
    };

    return (
        <div className="mx-auto max-w-7xl px-4 pb-28 pt-20 md:pb-12 md:pt-24">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="font-serif text-2xl font-bold text-warm-900 md:text-3xl">
                    🛕 SanatanSetu Store
                </h1>
                <p className="mt-1 text-sm text-warm-600">
                    Authentic spiritual products curated by pandits & astrologers
                </p>
            </div>

            {/* Categories Filter */}
            <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 snap-x">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-all snap-start active:scale-95 ${activeCategory === cat.id
                                ? "bg-saffron-500 text-white shadow-md"
                                : "border border-saffron-200 bg-white text-warm-700 hover:bg-saffron-50"
                            }`}
                    >
                        <span>{cat.emoji}</span>
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Sort & View Controls */}
            <div className="mt-5 flex items-center justify-between">
                <p className="text-sm text-warm-600">
                    <span className="font-semibold text-warm-800">{filteredProducts.length}</span> products
                </p>

                <div className="flex items-center gap-2">
                    {/* Sort dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowSort(!showSort)}
                            className="flex items-center gap-1.5 rounded-lg border border-gold-200 bg-white px-3 py-1.5 text-xs font-medium text-warm-700 transition hover:bg-saffron-50"
                        >
                            <SlidersHorizontal size={14} />
                            {sortLabels[sortBy]}
                            <ChevronDown size={12} />
                        </button>
                        {showSort && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowSort(false)} />
                                <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-xl border border-gold-200 bg-white py-1 shadow-lg">
                                    {(Object.entries(sortLabels) as [SortOption, string][]).map(([key, label]) => (
                                        <button
                                            key={key}
                                            onClick={() => { setSortBy(key); setShowSort(false); }}
                                            className={`block w-full px-3 py-2 text-left text-xs transition ${sortBy === key
                                                    ? "bg-saffron-50 font-semibold text-saffron-700"
                                                    : "text-warm-700 hover:bg-warm-50"
                                                }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* View toggle */}
                    <div className="hidden md:flex items-center gap-1 rounded-lg border border-gold-200 bg-white p-0.5">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`rounded-md p-1.5 transition ${viewMode === "grid" ? "bg-saffron-100 text-saffron-600" : "text-warm-400"
                                }`}
                        >
                            <Grid3X3 size={14} />
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`rounded-md p-1.5 transition ${viewMode === "list" ? "bg-saffron-100 text-saffron-600" : "text-warm-400"
                                }`}
                        >
                            <LayoutList size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className={`mt-6 ${viewMode === "grid"
                    ? "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 md:gap-5"
                    : "flex flex-col gap-4"
                }`}>
                {filteredProducts.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center py-16 text-center">
                        <span className="text-5xl">🕉️</span>
                        <h3 className="mt-4 font-serif text-lg font-semibold text-warm-800">
                            No products found
                        </h3>
                        <p className="mt-1 text-sm text-warm-500">
                            Try a different category or check back soon for new arrivals.
                        </p>
                        <button
                            onClick={() => setActiveCategory("all")}
                            className="mt-4 rounded-xl bg-saffron-500 px-5 py-2.5 text-sm font-bold text-white transition active:scale-95"
                        >
                            View All Products
                        </button>
                    </div>
                ) : (
                    filteredProducts.map((product) => (
                        <StoreProductCard key={product.id} product={product} />
                    ))
                )}
            </div>
        </div>
    );
}
