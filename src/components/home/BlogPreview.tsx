import Link from "next/link";
import { BookOpen, Clock } from "lucide-react";
import { BlogPost } from "@/app/(store)/StoreHomeClient";

const CATEGORY_COLORS: Record<string, string> = {
    "RUDRAKSHA GUIDE": "bg-orange-100 text-[#FF8C00]",
    "GEMSTONES": "bg-blue-100 text-blue-600",
    "PUJA GUIDE": "bg-green-100 text-[#00B894]",
    "VASTU": "bg-purple-100 text-purple-600",
    "ASTROLOGY": "bg-indigo-100 text-indigo-600",
    "CRYSTALS": "bg-pink-100 text-pink-600",
};

const CATEGORY_EMOJIS: Record<string, string> = {
    "RUDRAKSHA GUIDE": "📿",
    "GEMSTONES": "💎",
    "PUJA GUIDE": "🪔",
    "VASTU": "🏠",
    "ASTROLOGY": "🔮",
    "CRYSTALS": "✨",
};

export function BlogPreview({ blogs }: { blogs: BlogPost[] }) {
    const displayBlogs = blogs.slice(0, 3);

    return (
        <section className="py-8 md:py-10 px-4 bg-white border-y border-orange-50">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-[#FF8C00] rounded-full text-[11px] font-bold uppercase tracking-widest mb-3">
                            <BookOpen size={12} />
                            SPIRITUAL WISDOM
                        </div>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#1A1A1A] leading-tight">
                            From Our Blog
                        </h2>
                    </div>

                    <Link
                        href="/blog"
                        className="text-sm font-bold text-[#FF8C00] hover:text-[#E67E00] flex items-center transition-group group"
                    >
                        All Posts <span className="ml-1 text-lg group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    {displayBlogs.map((post) => {
                        const catKey = post.category?.toUpperCase().trim();
                        const catColor = CATEGORY_COLORS[catKey] || "bg-orange-100 text-[#FF8C00]";
                        const catEmoji = CATEGORY_EMOJIS[catKey] || "📖";

                        return (
                            <Link
                                key={post.id}
                                href={`/blog/${post.slug}`}
                                className="group flex-1 bg-[#FEFAF4] border border-orange-100 rounded-2xl p-6 hover:shadow-[0_8px_32px_rgba(255,140,0,0.08)] transition-all hover:bg-white hover:-translate-y-1 block"
                            >
                                <div className={`inline-flex items-center px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider mb-5 ${catColor}`}>
                                    {post.category?.toUpperCase()}
                                </div>

                                {post.featuredImage ? (
                                    <div className="w-full h-[140px] rounded-xl overflow-hidden mb-5">
                                        <img
                                            src={post.featuredImage}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-[60px] h-[60px] rounded-full bg-orange-50 flex items-center justify-center text-3xl mb-5 shadow-inner">
                                        {catEmoji}
                                    </div>
                                )}

                                <h3 className="font-bold text-[#1A1A1A] text-[15px] md:text-[17px] leading-tight mb-2 group-hover:text-[#FF8C00] transition-colors">
                                    {post.title}
                                </h3>

                                {post.excerpt && (
                                    <p className="text-[13px] text-[#888888] font-medium leading-relaxed mb-5 line-clamp-2">
                                        {post.excerpt}
                                    </p>
                                )}

                                <div className="flex items-center gap-1.5 text-[12px] text-[#888888] font-bold uppercase tracking-wider mt-auto pt-4 border-t border-orange-100/50">
                                    <Clock size={12} className="text-[#FF8C00]" />
                                    {post.readTime || "5 min read"}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
