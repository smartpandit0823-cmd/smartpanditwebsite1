"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Clock, Users, ChevronLeft, ChevronRight, Sparkles, TrendingUp, Flame, MapPin } from "lucide-react";

interface PujaCard {
    id: string;
    slug: string;
    name: string;
    category: string;
    image: string;
    shortDescription: string;
    priceFrom: number;
    averageRating: number;
    totalBookings: number;
    duration: string;
    popular: boolean;
    featured: boolean;
    trending: boolean;
    panditRecommended: boolean;
    templeName: string;
    templeLocation: string;
    pujaType: string;
}

interface PujaListClientProps {
    pujas: PujaCard[];
    categories: string[];
}

function formatPrice(n: number) {
    return "₹" + n.toLocaleString("en-IN");
}

/* ── Single card ─────────────────────────────────────────────────────── */
function PujaCardUI({ puja, index }: { puja: PujaCard; index: number }) {
    return (
        <Link
            href={`/puja/${puja.slug}`}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-gold-200/60 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-saffron-100/40"
            style={{ animationDelay: `${index * 60}ms` }}
        >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden">
                {puja.image ? (
                    <Image
                        src={puja.image}
                        alt={puja.name}
                        fill
                        sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-saffron-100 to-gold-100">
                        <span className="text-5xl">🙏</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                {/* Badges top-left */}
                <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                    {puja.trending && (
                        <span className="flex items-center gap-1 rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white">
                            <TrendingUp size={9} />Trending
                        </span>
                    )}
                    {puja.featured && (
                        <span className="flex items-center gap-1 rounded-full bg-saffron-600 px-2 py-0.5 text-[10px] font-bold text-white">
                            <Sparkles size={9} />Featured
                        </span>
                    )}
                    {puja.popular && (
                        <span className="flex items-center gap-1 rounded-full bg-gold-600 px-2 py-0.5 text-[10px] font-bold text-white">
                            <Flame size={9} />Popular
                        </span>
                    )}
                </div>

                {/* Category pill bottom */}
                <div className="absolute bottom-3 left-3">
                    <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                        {puja.category}
                    </span>
                </div>
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col p-4">
                <h3 className="font-heading text-base font-bold leading-tight text-warm-900 group-hover:text-saffron-700 transition-colors line-clamp-1">
                    {puja.name}
                </h3>
                {puja.templeName && (
                    <p className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-saffron-700">
                        <MapPin size={10} className="shrink-0" />
                        {puja.templeName}{puja.templeLocation ? `, ${puja.templeLocation}` : ""}
                    </p>
                )}
                <p className="mt-1 text-xs text-warm-600 line-clamp-2 flex-1">{puja.shortDescription}</p>

                {/* Meta */}
                <div className="mt-3 flex items-center gap-3 text-xs text-warm-500">
                    {puja.duration && (
                        <span className="flex items-center gap-1">
                            <Clock size={11} />
                            {puja.duration}
                        </span>
                    )}
                    {puja.totalBookings > 0 && (
                        <span className="flex items-center gap-1">
                            <Users size={11} />
                            {puja.totalBookings}+ booked
                        </span>
                    )}
                    {puja.averageRating > 0 && (
                        <span className="flex items-center gap-1 text-gold-600">
                            <Star size={11} className="fill-gold-500" />
                            {puja.averageRating.toFixed(1)}
                        </span>
                    )}
                </div>

                {/* Price + CTA */}
                <div className="mt-4 flex items-center justify-between">
                    <div>
                        <span className="text-[10px] text-warm-400">Starting</span>
                        <p className="text-lg font-bold text-saffron-700">{formatPrice(puja.priceFrom)}</p>
                    </div>
                    <span className="rounded-xl bg-saffron-500 px-4 py-1.5 text-xs font-semibold text-white transition-colors group-hover:bg-saffron-600">
                        Book Now
                    </span>
                </div>
            </div>

            {/* Glow on hover */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-saffron-200/0 transition-all group-hover:ring-saffron-300/60" />
        </Link>
    );
}

/* ── Horizontal slider for featured ───────────────────────────────────── */
function FeaturedSlider({ pujas }: { pujas: PujaCard[] }) {
    const ref = useRef<HTMLDivElement>(null);
    function scrollBy(delta: number) {
        ref.current?.scrollBy({ left: delta, behavior: "smooth" });
    }
    if (!pujas.length) return null;
    return (
        <div className="relative">
            <div
                ref={ref}
                className="no-scrollbar flex gap-4 overflow-x-auto pb-2 scroll-smooth"
            >
                {pujas.map((p, i) => (
                    <div key={p.id} className="w-[280px] shrink-0 sm:w-[300px]">
                        <PujaCardUI puja={p} index={i} />
                    </div>
                ))}
            </div>
            <button
                onClick={() => scrollBy(-320)}
                className="absolute -left-4 top-1/2 hidden -translate-y-1/2 rounded-full border border-gold-200 bg-white p-2 shadow-md md:flex"
                aria-label="Scroll left"
            >
                <ChevronLeft size={18} className="text-warm-700" />
            </button>
            <button
                onClick={() => scrollBy(320)}
                className="absolute -right-4 top-1/2 hidden -translate-y-1/2 rounded-full border border-gold-200 bg-white p-2 shadow-md md:flex"
                aria-label="Scroll right"
            >
                <ChevronRight size={18} className="text-warm-700" />
            </button>
        </div>
    );
}

/* ── Main component ───────────────────────────────────────────────────── */
export default function PujaListClient({ pujas, categories }: PujaListClientProps) {
    const [activeCategory, setActiveCategory] = useState("All");
    const [search, setSearch] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const featured = pujas.filter((p) => p.featured || p.trending);
    const filtered = pujas.filter((p) => {
        const matchCat = activeCategory === "All" || p.category === activeCategory;
        const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    return (
        <div className={`transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}>

            {/* ── Search bar ── */}
            <div className="relative mt-2 mb-6">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search pujas... (e.g. Satyanarayan, Dosha Shanti)"
                    className="w-full rounded-2xl border border-gold-200 bg-white/80 px-5 py-3.5 pr-12 text-sm text-warm-800 placeholder:text-warm-400 shadow-sm backdrop-blur-sm focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-200"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
            </div>

            {/* ── Category tabs ── */}
            <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-2">
                {["All", ...categories].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${activeCategory === cat
                            ? "bg-saffron-500 text-white shadow-md shadow-saffron-200"
                            : "border border-gold-200 bg-white text-warm-700 hover:border-saffron-300 hover:text-saffron-700"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* ── Featured slider (only when "All" + no search) ── */}
            {activeCategory === "All" && !search && featured.length > 0 && (
                <section className="mt-8">
                    <div className="mb-4 flex items-center gap-2">
                        <Sparkles size={18} className="text-saffron-600" />
                        <h2 className="font-heading text-lg font-bold text-warm-900">Featured & Trending</h2>
                    </div>
                    <FeaturedSlider pujas={featured} />
                </section>
            )}

            {/* ── All pujas grid ── */}
            <section className="mt-8">
                {activeCategory !== "All" || search ? (
                    <p className="mb-4 text-sm text-warm-500">{filtered.length} pujas found</p>
                ) : (
                    <div className="mb-4 flex items-center gap-2">
                        <span className="text-lg">🙏</span>
                        <h2 className="font-heading text-lg font-bold text-warm-900">All Pujas</h2>
                    </div>
                )}

                {filtered.length === 0 ? (
                    <div className="py-20 text-center">
                        <p className="text-4xl mb-4">🙏</p>
                        <p className="text-warm-600">No pujas found. Try a different search or category.</p>
                    </div>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((puja, i) => (
                            <PujaCardUI key={puja.id} puja={puja} index={i} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
