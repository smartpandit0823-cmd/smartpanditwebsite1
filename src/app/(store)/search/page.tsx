"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Loader2, ArrowLeft } from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";

interface SearchProduct {
    id: string;
    slug: string;
    name: string;
    image: string;
    category: string;
    rating: number;
    reviewCount: number;
    sellingPrice: number;
    mrp?: number;
    discount?: number;
    inStock: boolean;
}

export default function SearchPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("q") || "";

    const [query, setQuery] = useState(initialQuery);
    const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
    const [results, setResults] = useState<SearchProduct[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(!!initialQuery);
    const inputRef = useRef<HTMLInputElement>(null);

    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const POPULAR_SEARCHES = ["Tiger Eye", "Rudraksha", "Shree Yantra", "Evil Eye", "Rose Quartz", "7 Chakra"];

    useEffect(() => {
        inputRef.current?.focus();
        const stored = localStorage.getItem("recentSearches");
        if (stored) {
            setRecentSearches(JSON.parse(stored));
        }
    }, []);

    // Debounce logic
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    // Execute search when debouncedQuery changes and matches the query input
    useEffect(() => {
        if (debouncedQuery) {
            doSearch(debouncedQuery);
        } else {
            setResults([]);
            setSearched(false);
        }
    }, [debouncedQuery]);

    async function doSearch(q: string) {
        if (!q.trim()) return;
        setLoading(true);
        setSearched(true);
        try {
            // using the existing api/products for now with search title fallback if the required endpoint doesn't exist
            const res = await fetch(`/api/products?search=${encodeURIComponent(q.trim())}&limit=20`);
            if (res.ok) {
                const data = await res.json();
                // Assume API returns standard products or we map them
                const mapped = (data.data || data.products || []).map((p: any) => ({
                    id: p._id || p.id,
                    slug: p.slug,
                    name: p.name,
                    image: p.images?.[0] || p.mainImage || "https://images.unsplash.com/photo-1601314167099-24b553556066?w=400",
                    category: p.categorySlug || p.category,
                    rating: p.averageRating || p.rating || 4.7,
                    reviewCount: p.totalSold || p.reviewCount || 10,
                    sellingPrice: p.pricing?.sellingPrice || p.price || 0,
                    mrp: p.pricing?.mrp || p.originalPrice || undefined,
                    discount: p.pricing?.discount || p.discount || 0,
                    inStock: p.inventory?.inStock ?? p.inStock ?? true,
                }));
                setResults(mapped);
            }
        } catch {
            setResults([]);
        } finally {
            setLoading(false);
        }
    }

    function saveSearch(q: string) {
        const newRecent = [q, ...recentSearches.filter(s => s !== q)].slice(0, 5);
        setRecentSearches(newRecent);
        localStorage.setItem("recentSearches", JSON.stringify(newRecent));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`, { scroll: false });
            saveSearch(query.trim());
            doSearch(query);
        }
    }

    return (
        <div className="min-h-dvh bg-white flex flex-col">
            <div className="max-w-7xl mx-auto w-full px-4 py-6">

                {/* Header / Search Bar */}
                <div className="flex gap-3 mb-8">
                    <button
                        onClick={() => router.back()}
                        className="hidden lg:flex flex-shrink-0 w-12 h-12 items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                        <ArrowLeft size={20} className="text-[#1A1A1A]" />
                    </button>

                    <form onSubmit={handleSubmit} className="flex-1 relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search products, purposes, rashis..."
                            className="w-full h-12 pl-12 pr-12 rounded-full border-2 border-orange-100 bg-[#FEFAF4] text-[#1A1A1A] text-[15px] font-medium focus:outline-none focus:border-[#FF8C00] transition-colors shadow-sm"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888888]" size={20} />

                        {query && (
                            <button
                                type="button"
                                onClick={() => { setQuery(""); setResults([]); setSearched(false); inputRef.current?.focus(); router.push('/search', { scroll: false }); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#FF8C00]"
                            >
                                <X size={18} />
                            </button>
                        )}

                        {loading && (
                            <div className="absolute right-12 top-1/2 -translate-y-1/2">
                                <Loader2 size={16} className="animate-spin text-[#FF8C00]" />
                            </div>
                        )}
                    </form>
                </div>

                {/* Empty / Initial State */}
                {!searched && !query && (
                    <div className="lg:px-16">
                        <h2 className="text-xl font-bold text-[#1A1A1A] mb-8 flex items-center gap-2">
                            <span className="text-2xl">🔍</span> What are you looking for?
                        </h2>

                        {recentSearches.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-sm font-bold text-[#888888] uppercase tracking-wider mb-4">Recent Searches</h3>
                                <div className="flex flex-wrap gap-2">
                                    {recentSearches.map((s, idx) => (
                                        <div key={idx} className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2">
                                            <button
                                                onClick={() => { setQuery(s); saveSearch(s); router.push(`/search?q=${encodeURIComponent(s)}`); }}
                                                className="text-sm font-medium text-[#1A1A1A] hover:text-[#FF8C00]"
                                            >
                                                {s}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const newer = recentSearches.filter(rs => rs !== s);
                                                    setRecentSearches(newer);
                                                    localStorage.setItem("recentSearches", JSON.stringify(newer));
                                                }}
                                                className="text-gray-400 hover:text-red-500 ml-1"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <h3 className="text-sm font-bold text-[#888888] uppercase tracking-wider mb-4">Popular Searches</h3>
                            <div className="flex flex-wrap gap-2">
                                {POPULAR_SEARCHES.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => { setQuery(s); saveSearch(s); router.push(`/search?q=${encodeURIComponent(s)}`); }}
                                        className="bg-[#FEFAF4] border border-[#FFD700]/50 text-[#FF8C00] rounded-full px-4 py-2 text-sm font-bold hover:bg-[#FF8C00] hover:text-white transition-colors"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Results State */}
                {searched && !loading && (
                    <div>
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                            <h2 className="font-medium text-[#888888]">
                                Showing <span className="font-bold text-[#1A1A1A]">{results.length}</span> results for <span className="text-[#1A1A1A] font-bold">"{debouncedQuery}"</span>
                            </h2>
                            {results.length > 0 && (
                                <button className="text-[#FF8C00] font-bold text-sm hidden lg:block hover:underline">
                                    Sort & Filter
                                </button>
                            )}
                        </div>

                        {results.length === 0 ? (
                            <div className="py-20 flex flex-col items-center justify-center text-center">
                                <div className="text-6xl mb-4 opacity-50">🙏</div>
                                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">No results for "{debouncedQuery}"</h3>
                                <p className="text-[#888888] mb-6">Suggestions: Try: Rudraksha | Tiger Eye | Protection Stones</p>
                                <Link
                                    href="/shop"
                                    className="bg-[#1A1A1A] text-white px-8 py-3.5 rounded-full font-bold text-sm shadow-md hover:bg-gray-800 transition-colors"
                                >
                                    Browse All Products →
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                                {results.map((p) => (
                                    <ProductCard key={p.id} product={p as any} />
                                ))}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}
