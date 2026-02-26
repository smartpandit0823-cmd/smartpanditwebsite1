"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/admin/forms/FileUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Eye, Save, Send, Trash2, ImageIcon, Type, FileText, Tag, Search as SearchIcon, Globe } from "lucide-react";

const BLOG_CATEGORIES = [
    "Spirituality",
    "Puja Guide",
    "Astrology",
    "Festival",
    "Temple",
    "Vastu",
    "Ayurveda",
    "Meditation",
    "Yoga",
    "Mythology",
    "Rituals",
    "General",
];

type BlogData = {
    _id?: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featuredImage: string;
    category: string;
    tags: string[];
    author: string;
    status: "draft" | "published";
    seo: {
        seoTitle: string;
        metaDescription: string;
        keywords: string[];
    };
    relatedPujas: string[];
};

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
}

export function BlogForm({ blog }: { blog?: BlogData }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [tagInput, setTagInput] = useState("");
    const [keywordInput, setKeywordInput] = useState("");
    const [activeTab, setActiveTab] = useState<"content" | "media" | "seo">("content");
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);

    const [form, setForm] = useState<BlogData>({
        title: blog?.title ?? "",
        slug: blog?.slug ?? "",
        excerpt: blog?.excerpt ?? "",
        content: blog?.content ?? "",
        featuredImage: blog?.featuredImage ?? "",
        category: blog?.category ?? "General",
        tags: blog?.tags ?? [],
        author: blog?.author ?? "",
        status: blog?.status ?? "draft",
        seo: {
            seoTitle: blog?.seo?.seoTitle ?? "",
            metaDescription: blog?.seo?.metaDescription ?? "",
            keywords: blog?.seo?.keywords ?? [],
        },
        relatedPujas: blog?.relatedPujas ?? [],
    });

    // Auto-generate slug from title
    useEffect(() => {
        if (!blog?._id && form.title) {
            setForm(prev => ({ ...prev, slug: generateSlug(prev.title) }));
        }
    }, [form.title, blog?._id]);

    // Word count tracking
    useEffect(() => {
        const words = form.content.trim().split(/\s+/).filter(Boolean).length;
        setWordCount(words);
        setCharCount(form.content.length);
    }, [form.content]);

    // Auto-fill SEO title from title
    useEffect(() => {
        if (!form.seo.seoTitle && form.title) {
            setForm(prev => ({
                ...prev,
                seo: { ...prev.seo, seoTitle: `${prev.title} | SmartPandit Blog` }
            }));
        }
    }, [form.title]);

    function addTag() {
        const tag = tagInput.trim();
        if (tag && !form.tags.includes(tag)) {
            setForm({ ...form, tags: [...form.tags, tag] });
        }
        setTagInput("");
    }

    function removeTag(tag: string) {
        setForm({ ...form, tags: form.tags.filter(t => t !== tag) });
    }

    function addKeyword() {
        const kw = keywordInput.trim();
        if (kw && !form.seo.keywords.includes(kw)) {
            setForm({ ...form, seo: { ...form.seo, keywords: [...form.seo.keywords, kw] } });
        }
        setKeywordInput("");
    }

    function removeKeyword(kw: string) {
        setForm({ ...form, seo: { ...form.seo, keywords: form.seo.keywords.filter(k => k !== kw) } });
    }

    async function handleSubmit(publishStatus: "draft" | "published") {
        setLoading(true);
        try {
            const payload = { ...form, status: publishStatus };

            if (blog?._id) {
                const res = await fetch(`/api/admin/blogs/${blog._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                if (res.ok) router.push("/admin/blogs");
                else {
                    const err = await res.json();
                    alert(err.error || "Failed to update");
                }
            } else {
                const res = await fetch("/api/admin/blogs", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                const data = await res.json();
                if (data.id) router.push(`/admin/blogs/${data.id}`);
                else alert(data.error || "Failed to create");
            }
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        if (!blog?._id) return;
        if (!confirm("Are you sure you want to delete this blog post?")) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/blogs/${blog._id}`, { method: "DELETE" });
            if (res.ok) router.push("/admin/blogs");
        } finally {
            setLoading(false);
        }
    }

    const tabs = [
        { id: "content" as const, label: "Content", icon: Type },
        { id: "media" as const, label: "Media & Details", icon: ImageIcon },
        { id: "seo" as const, label: "SEO", icon: Globe },
    ];

    return (
        <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex items-center gap-1 rounded-xl bg-warm-100 p-1">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${activeTab === tab.id ? "bg-white text-saffron-700 shadow-sm" : "text-warm-600 hover:text-warm-900"}`}
                        >
                            <Icon size={16} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* ═══ CONTENT TAB ═══ */}
            {activeTab === "content" && (
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <FileText size={20} className="text-saffron-500" />
                                Blog Content
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            {/* Title */}
                            <div>
                                <Label className="text-sm font-semibold">Title *</Label>
                                <Input
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    placeholder="Enter a compelling blog title..."
                                    className="mt-1.5 text-lg font-semibold"
                                    required
                                />
                            </div>

                            {/* Slug */}
                            <div>
                                <Label className="text-sm font-semibold">URL Slug</Label>
                                <div className="mt-1.5 flex items-center gap-2">
                                    <span className="text-sm text-warm-400">/blog/</span>
                                    <Input
                                        value={form.slug}
                                        onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                        placeholder="auto-generated-from-title"
                                        className="flex-1"
                                    />
                                </div>
                            </div>

                            {/* Excerpt */}
                            <div>
                                <Label className="text-sm font-semibold">Excerpt / Summary</Label>
                                <Textarea
                                    value={form.excerpt}
                                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                                    placeholder="Write a short summary that appears on blog cards (150-200 chars recommended)"
                                    rows={3}
                                    className="mt-1.5"
                                />
                                <p className="mt-1 text-xs text-warm-400">{form.excerpt?.length || 0}/200 characters</p>
                            </div>

                            {/* Content */}
                            <div>
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-semibold">Full Content *</Label>
                                    <div className="flex items-center gap-3 text-xs text-warm-400">
                                        <span>{wordCount} words</span>
                                        <span>{charCount} chars</span>
                                        <span>~{Math.ceil(wordCount / 200)} min read</span>
                                    </div>
                                </div>
                                <Textarea
                                    value={form.content}
                                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                                    placeholder="Write your full blog post content here... Supports markdown formatting."
                                    rows={20}
                                    className="mt-1.5 font-mono text-sm leading-relaxed"
                                    required
                                />
                                <p className="mt-1 text-xs text-warm-400">Tip: Use **bold**, *italic*, ## headings, - bullet points for formatting</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ═══ MEDIA & DETAILS TAB ═══ */}
            {activeTab === "media" && (
                <div className="space-y-6">
                    {/* Featured Image */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <ImageIcon size={20} className="text-saffron-500" />
                                Featured Image
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FileUpload
                                value={form.featuredImage}
                                onChange={(url) => setForm({ ...form, featuredImage: url as string })}
                                folder="blogs"
                            />
                            {form.featuredImage && (
                                <div className="mt-4 overflow-hidden rounded-xl border border-warm-200">
                                    <img src={form.featuredImage} alt="Preview" className="w-full max-h-64 object-cover" />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <FileText size={20} className="text-saffron-500" />
                                Post Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Category */}
                                <div>
                                    <Label className="text-sm font-semibold">Category *</Label>
                                    <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                                        <SelectTrigger className="mt-1.5">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {BLOG_CATEGORIES.map(cat => (
                                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Author */}
                                <div>
                                    <Label className="text-sm font-semibold">Author Name *</Label>
                                    <Input
                                        value={form.author}
                                        onChange={(e) => setForm({ ...form, author: e.target.value })}
                                        placeholder="e.g. Pandit Sharma"
                                        className="mt-1.5"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Tags */}
                            <div>
                                <Label className="text-sm font-semibold flex items-center gap-2">
                                    <Tag size={14} />
                                    Tags
                                </Label>
                                <div className="mt-1.5 flex gap-2">
                                    <Input
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        placeholder="Add a tag..."
                                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                                        className="flex-1"
                                    />
                                    <Button type="button" variant="outline" onClick={addTag} size="sm">
                                        <Plus size={16} />
                                    </Button>
                                </div>
                                {form.tags.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {form.tags.map(tag => (
                                            <Badge key={tag} variant="secondary" className="flex items-center gap-1.5 px-3 py-1.5">
                                                {tag}
                                                <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 transition">
                                                    <X size={12} />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* ═══ SEO TAB ═══ */}
            {activeTab === "seo" && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <SearchIcon size={20} className="text-saffron-500" />
                            Search Engine Optimization
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        {/* SEO Preview */}
                        <div className="rounded-xl border border-warm-200 bg-warm-50 p-4">
                            <p className="text-xs font-medium text-warm-400 mb-2">Google Preview</p>
                            <p className="text-blue-700 text-lg font-medium truncate">{form.seo.seoTitle || form.title || "Blog Title"}</p>
                            <p className="text-green-700 text-sm">smartpandit.com/blog/{form.slug || "post-url"}</p>
                            <p className="text-warm-600 text-sm mt-1 line-clamp-2">{form.seo.metaDescription || form.excerpt || "Meta description will appear here..."}</p>
                        </div>

                        {/* SEO Title */}
                        <div>
                            <Label className="text-sm font-semibold">SEO Title</Label>
                            <Input
                                value={form.seo.seoTitle}
                                onChange={(e) => setForm({ ...form, seo: { ...form.seo, seoTitle: e.target.value } })}
                                placeholder="SEO optimized title (50-60 chars ideal)"
                                className="mt-1.5"
                            />
                            <p className="mt-1 text-xs text-warm-400">{form.seo.seoTitle.length}/60 characters</p>
                        </div>

                        {/* Meta Description */}
                        <div>
                            <Label className="text-sm font-semibold">Meta Description</Label>
                            <Textarea
                                value={form.seo.metaDescription}
                                onChange={(e) => setForm({ ...form, seo: { ...form.seo, metaDescription: e.target.value } })}
                                placeholder="Compelling description for search results (150-160 chars ideal)"
                                rows={3}
                                className="mt-1.5"
                            />
                            <p className="mt-1 text-xs text-warm-400">{form.seo.metaDescription.length}/160 characters</p>
                        </div>

                        {/* Keywords */}
                        <div>
                            <Label className="text-sm font-semibold">SEO Keywords</Label>
                            <div className="mt-1.5 flex gap-2">
                                <Input
                                    value={keywordInput}
                                    onChange={(e) => setKeywordInput(e.target.value)}
                                    placeholder="Add keyword..."
                                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addKeyword(); } }}
                                    className="flex-1"
                                />
                                <Button type="button" variant="outline" onClick={addKeyword} size="sm">
                                    <Plus size={16} />
                                </Button>
                            </div>
                            {form.seo.keywords.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {form.seo.keywords.map(kw => (
                                        <Badge key={kw} variant="outline" className="flex items-center gap-1.5">
                                            {kw}
                                            <button type="button" onClick={() => removeKeyword(kw)} className="hover:text-red-500">
                                                <X size={12} />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* ═══ ACTION BUTTONS ═══ */}
            <div className="flex items-center justify-between rounded-xl border border-warm-200 bg-white p-4">
                <div className="flex items-center gap-3">
                    {blog?._id && (
                        <Button variant="destructive" onClick={handleDelete} disabled={loading} size="sm">
                            <Trash2 size={16} className="mr-1.5" />
                            Delete
                        </Button>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => handleSubmit("draft")}
                        disabled={loading || !form.title || !form.content || !form.author}
                    >
                        <Save size={16} className="mr-1.5" />
                        {loading ? "Saving..." : "Save as Draft"}
                    </Button>
                    <Button
                        onClick={() => handleSubmit("published")}
                        disabled={loading || !form.title || !form.content || !form.author}
                        className="bg-saffron-500 hover:bg-saffron-600"
                    >
                        <Send size={16} className="mr-1.5" />
                        {loading ? "Publishing..." : "Publish"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
