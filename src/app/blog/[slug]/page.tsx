"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
    Clock, Eye, ArrowLeft, Tag, BookOpen, Share2, Calendar, User as UserIcon, ChevronRight, Loader2, Facebook, Twitter, Linkedin, Copy, Check,
} from "lucide-react";

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}

function readTime(content?: string) {
    if (!content) return "2 min read";
    const words = content.trim().split(/\s+/).length;
    return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

// Simple markdown-like renderer
function renderContent(content: string) {
    const lines = content.split("\n");
    let html = "";
    let inList = false;

    for (const line of lines) {
        const trimmed = line.trim();

        if (trimmed.startsWith("## ")) {
            if (inList) { html += "</ul>"; inList = false; }
            html += `<h2 class="mt-8 mb-4 text-2xl font-bold text-warm-900">${trimmed.slice(3)}</h2>`;
        } else if (trimmed.startsWith("### ")) {
            if (inList) { html += "</ul>"; inList = false; }
            html += `<h3 class="mt-6 mb-3 text-xl font-bold text-warm-900">${trimmed.slice(4)}</h3>`;
        } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
            if (!inList) { html += '<ul class="my-4 space-y-2">'; inList = true; }
            html += `<li class="flex items-start gap-2 text-warm-700"><span class="mt-1.5 size-1.5 shrink-0 rounded-full bg-saffron-500"></span>${formatInline(trimmed.slice(2))}</li>`;
        } else if (trimmed === "") {
            if (inList) { html += "</ul>"; inList = false; }
        } else {
            if (inList) { html += "</ul>"; inList = false; }
            html += `<p class="mb-4 text-base leading-relaxed text-warm-700">${formatInline(trimmed)}</p>`;
        }
    }
    if (inList) html += "</ul>";
    return html;
}

function formatInline(text: string) {
    return text
        .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-warm-900">$1</strong>')
        .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
        .replace(/`(.+?)`/g, '<code class="rounded bg-warm-100 px-1.5 py-0.5 text-sm font-mono text-saffron-700">$1</code>');
}

export default function BlogDetailPage() {
    const params = useParams();
    const slug = params?.slug as string;
    const [blog, setBlog] = useState<any>(null);
    const [related, setRelated] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!slug) return;
        setLoading(true);
        fetch(`/api/public/blogs/${slug}`)
            .then(r => r.json())
            .then(json => {
                if (json.success) {
                    setBlog(json.data);
                    setRelated(json.related || []);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [slug]);

    function handleCopyLink() {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-warm-50">
                <Loader2 size={32} className="animate-spin text-saffron-500" />
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-warm-50 text-center">
                <BookOpen size={48} className="mb-4 text-warm-300" />
                <h2 className="text-2xl font-bold text-warm-800">Article Not Found</h2>
                <p className="mt-2 text-warm-500">The article you're looking for doesn't exist.</p>
                <Link href="/blog" className="mt-6 rounded-full bg-saffron-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-saffron-600">
                    Back to Blog
                </Link>
            </div>
        );
    }

    const shareUrl = typeof window !== "undefined" ? window.location.href : "";

    return (
        <div className="min-h-screen bg-warm-50">
            {/* ── Hero Banner ── */}
            <section className="relative overflow-hidden bg-warm-900 pt-20 pb-6 md:pt-24">
                {blog.featuredImage && (
                    <div className="absolute inset-0">
                        <img src={blog.featuredImage} alt={blog.title} className="h-full w-full object-cover opacity-30" />
                        <div className="absolute inset-0 bg-gradient-to-t from-warm-900 via-warm-900/80 to-warm-900/60" />
                    </div>
                )}

                <div className="relative z-10 mx-auto max-w-3xl px-4">
                    {/* Breadcrumb */}
                    <div className="mb-6 flex items-center gap-2 text-sm text-warm-300">
                        <Link href="/blog" className="flex items-center gap-1 hover:text-saffron-300 transition">
                            <ArrowLeft size={14} />
                            Blog
                        </Link>
                        <ChevronRight size={14} />
                        <span className="text-warm-400 truncate">{blog.category}</span>
                    </div>

                    {/* Category Badge */}
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-saffron-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                            {blog.category}
                        </span>
                        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-warm-200 backdrop-blur-sm">
                            {readTime(blog.content)}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="font-heading text-3xl font-extrabold leading-tight text-white md:text-4xl lg:text-5xl">
                        {blog.title}
                    </h1>

                    {/* Excerpt */}
                    {blog.excerpt && (
                        <p className="mt-4 text-base text-warm-200 md:text-lg leading-relaxed">{blog.excerpt}</p>
                    )}

                    {/* Author Meta */}
                    <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-white/10 pt-5 text-sm text-warm-300">
                        <span className="flex items-center gap-2">
                            <div className="flex size-8 items-center justify-center rounded-full bg-saffron-500 text-white text-xs font-bold">
                                {blog.author?.[0]?.toUpperCase() || "A"}
                            </div>
                            <span className="font-medium text-white">{blog.author}</span>
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {formatDate(blog.publishedAt || blog.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                            <Eye size={14} />
                            {blog.views || 0} views
                        </span>
                    </div>
                </div>
            </section>

            {/* ── Content ── */}
            <article className="mx-auto max-w-3xl px-4 py-10">
                {/* Featured Image (full width in content) */}
                {blog.featuredImage && (
                    <div className="mb-10 overflow-hidden rounded-2xl shadow-xl">
                        <img src={blog.featuredImage} alt={blog.title} className="w-full object-cover" />
                    </div>
                )}

                {/* Blog Content */}
                <div
                    className="prose prose-warm max-w-none"
                    dangerouslySetInnerHTML={{ __html: renderContent(blog.content) }}
                />

                {/* Tags */}
                {blog.tags?.length > 0 && (
                    <div className="mt-10 border-t border-warm-200 pt-6">
                        <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-warm-800">
                            <Tag size={16} className="text-saffron-500" />
                            Tags
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {blog.tags.map((tag: string) => (
                                <Link
                                    key={tag}
                                    href={`/blog?search=${encodeURIComponent(tag)}`}
                                    className="rounded-full border border-warm-200 bg-white px-4 py-2 text-xs font-medium text-warm-600 transition hover:border-saffron-300 hover:text-saffron-600 hover:bg-saffron-50"
                                >
                                    #{tag}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Share Buttons */}
                <div className="mt-8 flex items-center gap-3 border-t border-warm-200 pt-6">
                    <span className="flex items-center gap-2 text-sm font-semibold text-warm-800">
                        <Share2 size={16} className="text-saffron-500" />
                        Share
                    </span>
                    <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex size-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition hover:bg-blue-100"
                    >
                        <Facebook size={18} />
                    </a>
                    <a
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(blog.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex size-10 items-center justify-center rounded-full bg-sky-50 text-sky-600 transition hover:bg-sky-100"
                    >
                        <Twitter size={18} />
                    </a>
                    <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex size-10 items-center justify-center rounded-full bg-blue-50 text-blue-700 transition hover:bg-blue-100"
                    >
                        <Linkedin size={18} />
                    </a>
                    <button
                        onClick={handleCopyLink}
                        className="flex size-10 items-center justify-center rounded-full bg-warm-100 text-warm-600 transition hover:bg-warm-200"
                    >
                        {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                    </button>
                </div>
            </article>

            {/* ── Related Posts ── */}
            {related.length > 0 && (
                <section className="bg-gradient-to-b from-white to-warm-50 py-12">
                    <div className="mx-auto max-w-5xl px-4">
                        <h2 className="mb-8 font-heading text-2xl font-bold text-warm-900">Related Articles</h2>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {related.map((post) => (
                                <Link
                                    key={post._id}
                                    href={`/blog/${post.slug}`}
                                    className="group flex flex-col overflow-hidden rounded-2xl border border-warm-200/60 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <div className="aspect-[16/10] overflow-hidden bg-warm-100">
                                        {post.featuredImage ? (
                                            <img src={post.featuredImage} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-saffron-50 to-gold-50">
                                                <BookOpen size={32} className="text-saffron-300" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <span className="text-xs font-semibold text-saffron-500">{post.category}</span>
                                        <h3 className="mt-1 text-sm font-bold text-warm-900 line-clamp-2 group-hover:text-saffron-600 transition-colors">
                                            {post.title}
                                        </h3>
                                        <p className="mt-1 text-xs text-warm-400">
                                            {formatDate(post.publishedAt || post.createdAt)}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}


        </div>
    );
}
