"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/ui/ProductCard";
import { Filter, ChevronDown, X } from "lucide-react";

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
}

const CATEGORY_TABS = [
    "All",
    "Bracelets",
    "Rudraksha",
    "Yantras",
    "Vastu",
    "Idols",
    "Gemstones",
    "Combos",
    "Protection",
];

export function ShopClient({ products }: { products: StoreProduct[] }) {
    const searchParams = useSearchParams();
    const initCategory = searchParams?.get("category") || "All";

    const [activeTab, setActiveTab] = useState(
        CATEGORY_TABS.find(t => t.toLowerCase() === initCategory.toLowerCase()) || "All"
    );
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sortBy, setSortBy] = useState("Popularity");

    // Map product to standard ProductCard props
    const mapProduct = (p: StoreProduct) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        image: p.images?.[0] || "https://images.unsplash.com/photo-1601314167099-24b553556066?w=400&h=400",
        rating: p.rating,
        reviewCount: p.reviewCount,
        sellingPrice: p.price,
        mrp: p.originalPrice,
        discount: p.discount,
        soldCount: 0,
        inStock: p.inStock,
        badge: p.featured ? "BESTSELLER" as const : undefined,
    });

    const filteredProducts = useMemo(() => {
        let list = products;
        if (activeTab !== "All") {
            list = list.filter((p) => p.category.toLowerCase() === activeTab.toLowerCase());
        }

        if (sortBy === "Price: Low→High") {
            list.sort((a, b) => a.price - b.price);
        } else if (sortBy === "Price: High→Low") {
            list.sort((a, b) => b.price - a.price);
        }
        return list;
    }, [products, activeTab, sortBy]);

    return (
        <div className="min-h-dvh bg-[#F9F9F9] flex flex-col relative">

            {/* Category Tabs Bar */}
            <div className="sticky top-[96px] lg:top-[96px] z-30 bg-white border-b border-orange-100 shadow-sm">
                <div className="flex overflow-x-auto no-scrollbar max-w-7xl mx-auto px-4">
                    {CATEGORY_TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`whitespace-nowrap px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === tab
                                    ? "border-[#FF8C00] text-[#FF8C00] bg-[#FFF8F0]"
                                    : "border-transparent text-[#888888] hover:text-[#1A1A1A]"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 flex gap-6">

                {/* Left Sidebar (Desktop Filters) */}
                <aside className="hidden lg:block w-[240px] shrink-0 sticky top-[150px] self-start h-[calc(100vh-160px)] overflow-y-auto no-scrollbar pr-2">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-[#1A1A1A] text-lg">Filters</h3>
                        <button className="text-[#FF8C00] text-sm font-bold hover:underline">Clear All</button>
                    </div>

                    {/* By Purpose */}
                    <div className="border-t border-gray-200 py-4">
                        <h4 className="font-bold text-sm text-[#1A1A1A] mb-3">By Purpose</h4>
                        <div className="space-y-2">
                            {["Wealth", "Love", "Protection", "Health", "Career"].map(purpose => (
                                <label key={purpose} className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#FF8C00] focus:ring-[#FF8C00] cursor-pointer" />
                                    <span className="text-sm text-[#888888] group-hover:text-[#1A1A1A]">{purpose}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* By Price */}
                    <div className="border-t border-gray-200 py-4">
                        <h4 className="font-bold text-sm text-[#1A1A1A] mb-3">Price Range</h4>
                        <div className="space-y-2">
                            {["Under ₹500", "₹500 - ₹1,500", "₹1,500 - ₹5,000", "₹5,000+"].map(range => (
                                <label key={range} className="flex items-center gap-2 cursor-pointer group">
                                    <input type="radio" name="price" className="w-4 h-4 text-[#FF8C00] focus:ring-[#FF8C00] cursor-pointer" />
                                    <span className="text-sm text-[#888888] group-hover:text-[#1A1A1A]">{range}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Special Filters */}
                    <div className="border-t border-gray-200 py-4">
                        <h4 className="font-bold text-sm text-[#1A1A1A] mb-3">Special Filters</h4>
                        <div className="space-y-2">
                            {["COD Available only", "Lab Certified only", "In Stock only"].map(f => (
                                <label key={f} className="flex items-center justify-between cursor-pointer group">
                                    <span className="text-sm text-[#888888] group-hover:text-[#1A1A1A]">{f}</span>
                                    <input type="checkbox" className="w-8 h-4 rounded-full appearance-none bg-gray-200 checked:bg-[#00B894] relative transition-colors cursor-pointer after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-3 after:h-3 after:bg-white after:rounded-full checked:after:translate-x-4 after:transition-transform" />
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1">
                    {/* Top Filter/Sort Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <button
                                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-[#1A1A1A] hover:bg-gray-50 bg-white"
                                onClick={() => setIsFilterOpen(true)}
                            >
                                <Filter size={16} /> Filters
                            </button>
                            <p className="text-xs sm:text-sm text-[#888888] font-medium">
                                Showing <span className="font-bold text-[#1A1A1A]">{filteredProducts.length}</span> products
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#1A1A1A]">Sort by:</span>
                            <div className="relative">
                                <select
                                    className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-2 text-sm font-bold text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#FF8C00] focus:border-[#FF8C00]"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option>Popularity</option>
                                    <option>Newest First</option>
                                    <option>Price: Low→High</option>
                                    <option>Price: High→Low</option>
                                    <option>Highest Rated</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#888888]" />
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
                        {filteredProducts.map((p) => (
                            <ProductCard key={p.id} product={mapProduct(p)} />
                        ))}
                    </div>

                    {/* Load More */}
                    {filteredProducts.length > 0 && (
                        <div className="flex justify-center mt-10">
                            <button className="px-8 py-3 rounded-full border-2 border-[#FF8C00] text-[#FF8C00] font-bold text-sm hover:bg-orange-50 transition-colors">
                                Load More Products
                            </button>
                        </div>
                    )}

                    {filteredProducts.length === 0 && (
                        <div className="py-20 text-center flex flex-col items-center justify-center">
                            <div className="text-4xl mb-4">🙏</div>
                            <h3 className="font-bold text-xl mb-2">No products found</h3>
                            <p className="text-[#888888] mb-6">Try changing your filters or search term.</p>
                            <button
                                onClick={() => setActiveTab("All")}
                                className="px-6 py-2 bg-[#FF8C00] text-white rounded-lg font-bold"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Filter Bottom Sheet overlay */}
            {isFilterOpen && (
                <div className="fixed inset-0 z-[100] bg-black/50 lg:hidden transition-opacity" onClick={() => setIsFilterOpen(false)} />
            )}

            {/* Mobile Filter Bottom Sheet content */}
            <div className={`fixed inset-x-0 bottom-0 z-[101] bg-white rounded-t-3xl p-5 transform transition-transform duration-300 lg:hidden flex flex-col max-h-[85vh] ${isFilterOpen ? "translate-y-0" : "translate-y-full"}`}>
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100 shrink-0">
                    <h3 className="font-bold text-[#1A1A1A] text-lg">Filters</h3>
                    <button onClick={() => setIsFilterOpen(false)} className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
                    {/* Reuse logic here or map similar to desktop */}
                    <div>
                        <h4 className="font-bold text-sm text-[#1A1A1A] mb-3">By Purpose</h4>
                        <div className="space-y-3">
                            {["Wealth", "Love", "Protection", "Health", "Career"].map(purpose => (
                                <label key={purpose} className="flex items-center gap-3">
                                    <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-[#FF8C00] focus:ring-[#FF8C00]" />
                                    <span className="text-[15px] font-medium text-[#1A1A1A]">{purpose}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 mt-4 flex gap-3 shrink-0">
                    <button className="flex-1 py-3 text-[#1A1A1A] font-bold text-sm bg-gray-100 rounded-xl">Clear All</button>
                    <button
                        className="flex-1 py-3 bg-[#FF8C00] text-white font-bold text-sm rounded-xl shadow-md"
                        onClick={() => setIsFilterOpen(false)}
                    >
                        Apply Filters
                    </button>
                </div>
            </div>

        </div>
    );
}
