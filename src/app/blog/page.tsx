"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, Clock, Eye, ArrowRight, Tag, Bookmark, Filter, BookOpen, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}

function readTime(content?: string) {
    if (!content) return "2 min read";
    const words = content.trim().split(/\s+/).length;
    return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

export default function BlogPage() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(timer);
    }, [search]);

    const fetchBlogs = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: String(page), limit: "12" });
            if (debouncedSearch) params.set("search", debouncedSearch);
            if (selectedCategory) params.set("category", selectedCategory);

            const res = await fetch(`/api/public/blogs?${params}`);
            const json = await res.json();
            if (json.success) {
                setBlogs(json.data);
                setCategories(json.categories || []);
                setTotalPages(json.totalPages);
                setTotal(json.total);
            }
        } catch (err) {
            console.error("Failed to fetch blogs", err);
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch, selectedCategory]);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    // Reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, selectedCategory]);

    const featuredBlog = blogs.length > 0 && page === 1 && !debouncedSearch && !selectedCategory ? blogs[0] : null;
    const gridBlogs = featuredBlog ? blogs.slice(1) : blogs;

    return (
        <div className="min-h-screen bg-[#faf8f5]">
            {/* ── Premium Hero Header ── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#4a2e15] via-[#5c3a21] to-[#3a220c] pb-16 pt-28 md:pb-24 md:pt-36">
                {/* Decorative Overlays */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]" />
                <div className="absolute top-0 right-0 h-96 w-96 translate-x-1/3 -translate-y-1/3 rounded-full bg-saffron-500/20 blur-[120px]" />
                <div className="absolute bottom-0 left-0 h-96 w-96 -translate-x-1/3 translate-y-1/3 rounded-full bg-gold-500/10 blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#faf8f5] to-transparent z-10" />

                <div className="section-wrap relative z-20 text-center px-4">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-saffron-300/20 bg-black/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-saffron-200 backdrop-blur-md">
                        <BookOpen size={14} className="text-saffron-300" />
                        Spiritual Journal
                    </div>
                    <h1 className="font-heading text-4xl font-black text-white md:text-6xl lg:text-7xl drop-shadow-lg tracking-tight">
                        Divine <span className="bg-gradient-to-r from-saffron-300 via-gold-400 to-saffron-300 bg-clip-text text-transparent">Wisdom</span> & Lore
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-base text-warm-200/90 md:text-xl font-medium leading-relaxed">
                        Journey through our curated collection of ancient knowledge, astrological insights, and spiritual practices perfectly crafted for the modern soul.
                    </p>

                    {/* Premium Search Bar */}
                    <div className="mx-auto mt-10 max-w-2xl relative group">
                        <div className="absolute inset-0 bg-saffron-500/20 rounded-full blur-xl transition-all group-hover:bg-saffron-500/30 group-focus-within:bg-saffron-500/40" />
                        <div className="relative flex items-center bg-white/10 border border-white/20 backdrop-blur-lg rounded-full p-2 transition-all focus-within:border-saffron-400 focus-within:bg-white/20">
                            <div className="pl-4">
                                <Search size={20} className="text-saffron-200" />
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search articles, mantras, temples, zodiac..."
                                className="w-full bg-transparent border-none px-4 py-3 text-white placeholder:text-warm-300/70 focus:outline-none focus:ring-0 text-base"
                            />
                            {debouncedSearch && (
                                <button onClick={() => setSearch('')} className="pr-4 text-warm-300 hover:text-white transition">
                                    <Tag size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Category Filter Tab Bar ── */}
            {categories.length > 0 && (
                <div className="relative z-30 mx-auto max-w-6xl px-4 -mt-8">
                    <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-1 no-scrollbar rounded-2xl bg-white/80 p-3 shadow-lg shadow-warm-900/5 backdrop-blur-xl border border-white">
                        <div className="flex shrink-0 items-center justify-center rounded-xl bg-warm-100/80 px-4 py-2 text-warm-600 mr-2">
                            <Filter size={16} className="mr-2" />
                            <span className="text-sm font-bold uppercase tracking-wider">Topics</span>
                        </div>
                        <button
                            onClick={() => setSelectedCategory("")}
                            className={`shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${!selectedCategory
                                ? "bg-saffron-500 text-white shadow-md shadow-saffron-500/25"
                                : "bg-transparent text-warm-600 hover:bg-warm-100/50 hover:text-saffron-600"
                                }`}
                        >
                            All Posts
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${selectedCategory === cat
                                    ? "bg-saffron-500 text-white shadow-md shadow-saffron-500/25"
                                    : "bg-transparent text-warm-600 hover:bg-warm-100/50 hover:text-saffron-600"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="mx-auto max-w-6xl px-4 py-12">
                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-32">
                        <Loader2 size={40} className="animate-spin text-saffron-500 mb-4" />
                        <p className="text-warm-500 font-medium animate-pulse">Summoning knowledge...</p>
                    </div>
                )}

                {/* No Results */}
                {!loading && blogs.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-3xl shadow-sm border border-warm-100">
                        <div className="flex size-24 items-center justify-center rounded-full bg-saffron-50 text-saffron-300 mb-6 relative">
                            <Search size={40} />
                            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1">
                                <div className="bg-warm-100 rounded-full p-2 text-warm-400">
                                    <Eye size={16} />
                                </div>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-warm-900">We couldn't find anything matching your quest</h3>
                        <p className="mt-2 text-base text-warm-500 max-w-md">
                            {debouncedSearch
                                ? `No ancient texts or articles found for "${debouncedSearch}". Try a different incantation.`
                                : "The scroll library is currently empty. Check back soon for profound wisdom!"}
                        </p>
                        {debouncedSearch && (
                            <button onClick={() => setSearch("")} className="mt-6 font-bold text-saffron-600 hover:text-saffron-700 underline underline-offset-4">
                                Clear search and see all
                            </button>
                        )}
                    </div>
                )}

                {!loading && blogs.length > 0 && (
                    <>
                        {/* ── Magazine Style Featured Blog ── */}
                        {featuredBlog && (
                            <div className="mb-16">
                                <p className="text-xs font-bold uppercase tracking-widest text-warm-400 mb-6 flex items-center gap-2">
                                    <span className="h-px bg-warm-200 w-8 inline-block"></span>
                                    Latest Spiritual Masterpiece
                                </p>
                                <Link href={`/blog/${featuredBlog.slug}`} className="group block">
                                    <div className="grid md:grid-cols-2 gap-0 overflow-hidden rounded-3xl bg-white shadow-xl shadow-warm-900/5 transition-all duration-500 hover:shadow-2xl border border-warm-200/50">

                                        {/* Left Side: Image */}
                                        <div className="relative h-72 md:h-full w-full overflow-hidden bg-warm-100">
                                            {featuredBlog.featuredImage && (
                                                <img
                                                    src={featuredBlog.featuredImage}
                                                    alt={featuredBlog.title}
                                                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                                />
                                            )}
                                            {/* Image gradient overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:bg-gradient-to-l opacity-80" />
                                            {/* Category floating badge */}
                                            <div className="absolute top-6 left-6">
                                                <span className="px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-saffron-700 shadow-sm">
                                                    {featuredBlog.category}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Right Side: Content Box */}
                                        <div className="flex flex-col justify-center p-8 md:p-12 lg:p-14 relative bg-white">
                                            {/* Title */}
                                            <h2 className="font-heading text-3xl font-extrabold leading-tight text-warm-900 md:text-4xl group-hover:text-saffron-600 transition-colors duration-300">
                                                {featuredBlog.title}
                                            </h2>

                                            {/* Excerpt */}
                                            <p className="mt-5 text-base text-warm-600 line-clamp-3 leading-relaxed">
                                                {featuredBlog.excerpt || "Read this deeply insightful narrative curated to expand your spiritual wisdom..."}
                                            </p>

                                            {/* Meta data */}
                                            <div className="mt-8 flex items-center justify-between border-t border-warm-100 pt-6 text-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-saffron-400 to-saffron-600 text-white font-bold shadow-sm">
                                                        {featuredBlog.author?.[0]?.toUpperCase() || "A"}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-warm-900">{featuredBlog.author}</p>
                                                        <p className="text-xs text-warm-500">{formatDate(featuredBlog.publishedAt || featuredBlog.createdAt)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-1 text-warm-400 text-xs font-medium">
                                                    <span className="flex items-center gap-1.5 bg-warm-50 px-3 py-1 rounded-lg">
                                                        <Clock size={12} className="text-warm-500" />
                                                        {readTime(featuredBlog.content)}
                                                    </span>
                                                    {featuredBlog.views > 0 && (
                                                        <span className="flex items-center gap-1.5 bg-warm-50 px-3 py-1 rounded-lg">
                                                            <Eye size={12} className="text-warm-500" />
                                                            {featuredBlog.views} views
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )}

                        {/* ── Standard Blog Grid ── */}
                        {gridBlogs.length > 0 && (
                            <>
                                <p className="text-xs font-bold uppercase tracking-widest text-warm-400 mb-6 flex items-center gap-2">
                                    <span className="h-px bg-warm-200 w-8 inline-block"></span>
                                    Explore More Wisdom
                                </p>
                                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                    {gridBlogs.map((blog) => (
                                        <Link
                                            key={blog._id}
                                            href={`/blog/${blog.slug}`}
                                            className="group flex flex-col overflow-hidden rounded-[1.5rem] bg-white border border-warm-200/50 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-saffron-900/5"
                                        >
                                            {/* Image Region */}
                                            <div className="relative aspect-[4/3] w-full overflow-hidden bg-warm-100">
                                                {blog.featuredImage ? (
                                                    <img
                                                        src={blog.featuredImage}
                                                        alt={blog.title}
                                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-warm-100 to-saffron-50">
                                                        <BookOpen size={48} className="text-warm-300" />
                                                    </div>
                                                )}
                                                {/* Floating Badges */}
                                                <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
                                                    <span className="px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest text-saffron-700 shadow-sm border border-white/50">
                                                        {blog.category}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Content Region */}
                                            <div className="flex flex-1 flex-col p-6">
                                                <h3 className="font-heading text-xl font-bold leading-tight text-warm-900 line-clamp-2 group-hover:text-saffron-600 transition-colors">
                                                    {blog.title}
                                                </h3>
                                                <p className="mt-3 flex-1 text-sm text-warm-500 line-clamp-2 leading-relaxed">
                                                    {blog.excerpt || "Dive into this article to explore ancient knowledge..."}
                                                </p>

                                                {/* Footer Region */}
                                                <div className="mt-6 flex items-center justify-between border-t border-warm-100 pt-5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-warm-100 text-warm-600 text-xs font-bold">
                                                            {blog.author?.[0]?.toUpperCase()}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-semibold text-warm-800">{blog.author}</span>
                                                            <span className="text-[10px] uppercase font-bold text-warm-400 tracking-wider">
                                                                {formatDate(blog.publishedAt || blog.createdAt)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-center size-8 rounded-full bg-warm-50 text-warm-400 group-hover:bg-saffron-50 group-hover:text-saffron-500 transition-colors">
                                                        <ArrowRight size={14} />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* ── Modern Pagination ── */}
                        {totalPages > 1 && (
                            <div className="mt-16 border-t border-warm-200/50 pt-10 flex flex-col items-center justify-center gap-6">
                                <div className="flex items-center gap-2 bg-white px-2 py-2 rounded-2xl shadow-sm border border-warm-200/50">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="flex size-11 items-center justify-center rounded-xl font-bold text-warm-600 transition-all hover:bg-warm-100 disabled:opacity-30 disabled:pointer-events-none"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <div className="flex items-center gap-1.5 px-3">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                                            .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                                            .map((p, idx, arr) => (
                                                <span key={p} className="flex items-center">
                                                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                                                        <span className="px-1 text-warm-300 font-serif">...</span>
                                                    )}
                                                    <button
                                                        onClick={() => setPage(p)}
                                                        className={`flex size-10 items-center justify-center rounded-xl text-sm font-bold transition-all ${page === p
                                                            ? "bg-saffron-500 text-white shadow-md shadow-saffron-500/30"
                                                            : "text-warm-600 hover:bg-warm-100"
                                                            }`}
                                                    >
                                                        {p}
                                                    </button>
                                                </span>
                                            ))}
                                    </div>
                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="flex size-11 items-center justify-center rounded-xl font-bold text-warm-600 transition-all hover:bg-warm-100 disabled:opacity-30 disabled:pointer-events-none"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                                {/* Result count */}
                                <p className="text-sm font-medium text-warm-400 bg-white/50 backdrop-blur-sm px-4 py-1.5 rounded-full border border-warm-200/50">
                                    Displaying <strong className="text-warm-800">{(page - 1) * 12 + 1}</strong> to <strong className="text-warm-800">{Math.min(page * 12, total)}</strong> of <strong className="text-warm-800">{total}</strong> sacred texts
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
