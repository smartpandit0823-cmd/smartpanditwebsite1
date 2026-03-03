"use client";

import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";

const BLOG_POSTS = [
    {
        id: "b1",
        title: "How to Choose the Right Rudraksha for You",
        excerpt: "Learn about different Mukhi Rudraksha beads and their spiritual benefits based on your zodiac sign.",
        category: "Rudraksha Guide",
        readTime: "5 min read",
        emoji: "📿",
    },
    {
        id: "b2",
        title: "Which Gemstone is Right For Your Rashi?",
        excerpt: "Discover the perfect gemstone recommendation based on your birth chart and planetary positions.",
        category: "Gemstones",
        readTime: "4 min read",
        emoji: "💎",
    },
    {
        id: "b3",
        title: "Daily Puja Vidhi: Steps for Morning Worship",
        excerpt: "A complete guide to performing morning puja at home with proper mantras and rituals.",
        category: "Puja Guide",
        readTime: "6 min read",
        emoji: "🪔",
    },
];

export function BlogPreview() {
    return (
        <section className="section-shell">
            <div className="section-wrap">
                {/* Header */}
                <div className="flex items-end justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <BookOpen size={16} className="text-saffron-600" />
                            <span className="text-xs font-semibold text-saffron-600 uppercase tracking-wider">
                                Spiritual Wisdom
                            </span>
                        </div>
                        <h2 className="font-heading text-2xl md:text-3xl font-bold text-warm-900">
                            From Our Blog
                        </h2>
                    </div>
                    <Link
                        href="/blog"
                        className="text-xs font-semibold text-saffron-600 hover:text-saffron-700 transition-colors flex items-center gap-1"
                    >
                        All Posts <ArrowRight size={12} />
                    </Link>
                </div>

                {/* Blog Cards */}
                <div className="space-y-3 md:grid md:grid-cols-3 md:space-y-0 md:gap-4">
                    {BLOG_POSTS.map((post) => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.id}`}
                            className="group flex gap-4 card-surface rounded-xl p-4 hover:shadow-card-hover transition-all md:flex-col md:gap-0"
                        >
                            {/* Emoji thumbnail (mobile: left, desktop: top) */}
                            <div className="flex size-16 md:size-auto md:h-32 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-saffron-50 to-gold-50 text-3xl md:text-4xl md:rounded-b-none md:mb-3">
                                {post.emoji}
                            </div>

                            <div className="flex-1 min-w-0">
                                <span className="text-[10px] font-semibold text-saffron-600 uppercase tracking-wide">
                                    {post.category}
                                </span>
                                <h3 className="text-sm font-semibold text-warm-900 mt-0.5 line-clamp-2 group-hover:text-saffron-700 transition-colors">
                                    {post.title}
                                </h3>
                                <p className="text-xs text-warm-500 mt-1 line-clamp-2 hidden md:block">
                                    {post.excerpt}
                                </p>
                                <span className="text-[10px] text-warm-400 mt-1.5 block">
                                    {post.readTime}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
