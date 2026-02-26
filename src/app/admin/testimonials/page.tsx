"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Edit, Play, Video, Star, Eye, EyeOff } from "lucide-react";
import { FileUpload } from "@/components/admin/forms/FileUpload";

interface Testimonial {
    _id: string;
    name: string;
    title: string;
    type: "text" | "video";
    videoUrl?: string;
    thumbnailUrl?: string;
    text?: string;
    rating: number;
    status: "active" | "inactive";
    featured: boolean;
    createdAt: string;
}

export default function AdminTestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState({
        name: "",
        title: "",
        type: "video" as "text" | "video",
        videoUrl: "",
        thumbnailUrl: "",
        text: "",
        rating: 5,
        status: "active" as "active" | "inactive",
        featured: false,
    });

    const fetchTestimonials = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/testimonials");
            const json = await res.json();
            if (json.success) setTestimonials(json.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTestimonials();
    }, [fetchTestimonials]);

    function resetForm() {
        setForm({ name: "", title: "", type: "video", videoUrl: "", thumbnailUrl: "", text: "", rating: 5, status: "active", featured: false });
        setEditId(null);
        setShowForm(false);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            const url = editId ? `/api/admin/testimonials/${editId}` : "/api/admin/testimonials";
            const method = editId ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const json = await res.json();
            if (json.success) {
                resetForm();
                fetchTestimonials();
            } else {
                alert(json.error);
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this testimonial?")) return;
        try {
            await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
            fetchTestimonials();
        } catch (err) {
            console.error(err);
        }
    }

    async function toggleStatus(t: Testimonial) {
        const newStatus = t.status === "active" ? "inactive" : "active";
        await fetch(`/api/admin/testimonials/${t._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
        });
        fetchTestimonials();
    }

    function startEdit(t: Testimonial) {
        setForm({
            name: t.name,
            title: t.title,
            type: t.type,
            videoUrl: t.videoUrl || "",
            thumbnailUrl: t.thumbnailUrl || "",
            text: t.text || "",
            rating: t.rating,
            status: t.status,
            featured: t.featured,
        });
        setEditId(t._id);
        setShowForm(true);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-heading text-3xl font-bold text-warm-900">Testimonials</h1>
                    <p className="mt-1 text-warm-600">Manage video experiences & featured testimonials shown on home page</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowForm(true); }}
                    className="flex items-center gap-2 rounded-xl bg-saffron-500 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-saffron-600"
                >
                    <Plus size={18} /> Add Testimonial
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="rounded-2xl border border-warm-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 font-heading text-xl font-bold text-warm-900">
                        {editId ? "Edit Testimonial" : "Add New Testimonial"}
                    </h2>
                    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-warm-700">Name *</label>
                            <input
                                value={form.name}
                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                required
                                className="w-full rounded-lg border border-warm-200 px-4 py-2.5 text-sm focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-warm-700">Title / Puja Name *</label>
                            <input
                                value={form.title}
                                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                required
                                className="w-full rounded-lg border border-warm-200 px-4 py-2.5 text-sm focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-warm-700">Type</label>
                            <select
                                value={form.type}
                                onChange={e => setForm(f => ({ ...f, type: e.target.value as "text" | "video" }))}
                                className="w-full rounded-lg border border-warm-200 px-4 py-2.5 text-sm focus:border-saffron-400 focus:outline-none"
                            >
                                <option value="video">Video</option>
                                <option value="text">Text</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-warm-700">Rating</label>
                            <select
                                value={form.rating}
                                onChange={e => setForm(f => ({ ...f, rating: Number(e.target.value) }))}
                                className="w-full rounded-lg border border-warm-200 px-4 py-2.5 text-sm focus:border-saffron-400 focus:outline-none"
                            >
                                {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                            </select>
                        </div>
                        {form.type === "video" && (
                            <>
                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-warm-700">Video URL (YouTube/Drive)</label>
                                    <input
                                        value={form.videoUrl}
                                        onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))}
                                        placeholder="https://youtube.com/..."
                                        className="w-full rounded-lg border border-warm-200 px-4 py-2.5 text-sm focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-warm-700">Thumbnail Image</label>
                                    <div className="mt-1">
                                        <FileUpload
                                            value={form.thumbnailUrl}
                                            onChange={url => setForm(f => ({ ...f, thumbnailUrl: url as string }))}
                                            folder="testimonials"
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                        {form.type === "text" && (
                            <div className="md:col-span-2">
                                <label className="mb-1 block text-sm font-semibold text-warm-700">Testimonial Text</label>
                                <textarea
                                    value={form.text}
                                    onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                                    rows={3}
                                    className="w-full rounded-lg border border-warm-200 px-4 py-2.5 text-sm focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100"
                                />
                            </div>
                        )}
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 text-sm font-medium text-warm-700">
                                <input
                                    type="checkbox"
                                    checked={form.featured}
                                    onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                                    className="rounded border-warm-300"
                                />
                                Featured
                            </label>
                        </div>

                        <div className="flex items-center justify-end gap-3 md:col-span-2">
                            <button type="button" onClick={resetForm} className="rounded-lg px-5 py-2.5 text-sm font-semibold text-warm-600 hover:bg-warm-100">
                                Cancel
                            </button>
                            <button type="submit" className="rounded-lg bg-saffron-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-saffron-600">
                                {editId ? "Update" : "Create"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Table */}
            {loading ? (
                <div className="py-16 text-center text-warm-500">Loading...</div>
            ) : testimonials.length === 0 ? (
                <div className="rounded-2xl border border-warm-200 bg-white py-16 text-center text-warm-500">
                    <Video size={48} className="mx-auto mb-4 text-warm-300" />
                    <p className="text-lg font-medium">No testimonials yet</p>
                    <p className="text-sm">Click "Add Testimonial" to create your first video experience.</p>
                </div>
            ) : (
                <div className="rounded-2xl border border-warm-200 bg-white overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="border-b border-warm-100 bg-warm-50">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold text-warm-700">Preview</th>
                                <th className="px-4 py-3 text-left font-semibold text-warm-700">Name</th>
                                <th className="px-4 py-3 text-left font-semibold text-warm-700">Title</th>
                                <th className="px-4 py-3 text-left font-semibold text-warm-700">Type</th>
                                <th className="px-4 py-3 text-left font-semibold text-warm-700">Rating</th>
                                <th className="px-4 py-3 text-left font-semibold text-warm-700">Status</th>
                                <th className="px-4 py-3 text-right font-semibold text-warm-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-warm-100">
                            {testimonials.map(t => (
                                <tr key={t._id} className="transition hover:bg-warm-50/50">
                                    <td className="px-4 py-3">
                                        {t.thumbnailUrl ? (
                                            <img src={t.thumbnailUrl} alt="" className="size-12 rounded-lg object-cover" />
                                        ) : (
                                            <div className="flex size-12 items-center justify-center rounded-lg bg-saffron-50 text-saffron-500">
                                                {t.type === "video" ? <Play size={20} /> : <Star size={20} />}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 font-medium text-warm-900">{t.name}</td>
                                    <td className="px-4 py-3 text-warm-600">{t.title}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${t.type === "video" ? "bg-purple-50 text-purple-700" : "bg-blue-50 text-blue-700"}`}>
                                            {t.type === "video" ? <Video size={12} /> : <Star size={12} />}
                                            {t.type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gold-500">{"★".repeat(t.rating)}</td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => toggleStatus(t)}
                                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition ${t.status === "active" ? "bg-green-50 text-green-700 hover:bg-green-100" : "bg-red-50 text-red-600 hover:bg-red-100"}`}
                                        >
                                            {t.status === "active" ? <Eye size={12} /> : <EyeOff size={12} />}
                                            {t.status}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 text-right space-x-2">
                                        <button onClick={() => startEdit(t)} className="rounded-lg p-2 text-warm-500 transition hover:bg-warm-100 hover:text-saffron-600">
                                            <Edit size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(t._id)} className="rounded-lg p-2 text-warm-500 transition hover:bg-red-50 hover:text-red-600">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
