"use client";

import Link from "next/link";
import { useState } from "react";
import { Zap } from "lucide-react";
import { ProductCardProps, ProductCard } from "../ui/ProductCard";

const CATEGORY_TABS = [
    { label: "All", value: "all" },
    { label: "Rudraksha", value: "rudraksha" },
    { label: "Gemstones", value: "gemstones" },
    { label: "Bracelets", value: "bracelets" },
    { label: "Vastu", value: "vastu" },
    { label: "Crystals", value: "crystals" },
    { label: "Puja Kits", value: "puja-kits" },
    { label: "Combos", value: "combos" },
    { label: "Pyramids", value: "pyramids" },
];

interface TrendingNowProps {
    products: (ProductCardProps["product"] & { category?: string })[];
}

export function TrendingNow({ products }: TrendingNowProps) {
    const [activeTab, setActiveTab] = useState("all");

    if (!products || products.length === 0) return null;

    // Filter available categories from actual products
    const availableCategories = new Set(
        products.map((p) => (p as any).category?.toLowerCase()).filter(Boolean)
    );

    // Only show tabs where products exist + "All"
    const visibleTabs = CATEGORY_TABS.filter(
        (tab) => tab.value === "all" || availableCategories.has(tab.value)
    );

    // Filter products based on active tab
    const filteredProducts =
        activeTab === "all"
            ? products
            : products.filter(
                (p) => (p as any).category?.toLowerCase() === activeTab
            );

    // If filtered is empty, show all
    const displayProducts = filteredProducts.length > 0 ? filteredProducts : products;

    return (
        <section className="py-8 md:py-10 bg-[#FEFAF4] px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-end justify-between mb-5">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#00B894] text-white rounded-full text-xs font-bold uppercase tracking-wider mb-2 shadow-sm">
                            <Zap size={14} fill="currentColor" />
                            HOT & VIRAL
                        </div>
                        <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#1A1A1A]">
                            Trending Now
                        </h2>
                    </div>
                    <Link
                        href="/shop?trending=true"
                        className="text-sm font-bold text-[#FF8C00] hover:text-[#E67E00] flex items-center mb-1 transition-colors group"
                    >
                        See All{" "}
                        <span className="ml-1 text-lg leading-none group-hover:translate-x-1 transition-transform">
                            →
                        </span>
                    </Link>
                </div>

                {/* Category Tabs — horizontal scroll */}
                {visibleTabs.length > 1 && (
                    <div className="flex overflow-x-auto gap-2 pb-4 no-scrollbar snap-x">
                        {visibleTabs.map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => setActiveTab(tab.value)}
                                className={`snap-start shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all whitespace-nowrap ${activeTab === tab.value
                                    ? "bg-[#FF8C00] text-white border-[#FF8C00] shadow-md"
                                    : "bg-white text-[#1A1A1A] border-gray-200 hover:border-[#FF8C00] hover:text-[#FF8C00]"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Products Grid — 2-col mobile, 3-col tablet, 4-col desktop */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                    {displayProducts.slice(0, 8).map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
