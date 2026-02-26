"use client";

import { useState } from "react";
import { Star, Send, CheckCircle2 } from "lucide-react";

interface ReviewFormProps {
    targetId: string;
    targetModel: "Puja" | "Product";
    onSuccess?: () => void;
}

export function ReviewForm({ targetId, targetModel, onSuccess }: ReviewFormProps) {
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [title, setTitle] = useState("");
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    targetId,
                    targetModel,
                    customerName: name,
                    customerEmail: email,
                    rating,
                    title,
                    comment,
                }),
            });

            const json = await res.json();
            if (json.success) {
                setSubmitted(true);
                onSuccess?.();
            } else {
                setError(json.error || "Something went wrong");
            }
        } catch {
            setError("Failed to submit review");
        } finally {
            setLoading(false);
        }
    }

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-green-100 bg-green-50/50 p-8 text-center">
                <CheckCircle2 size={48} className="mb-4 text-green-500" />
                <h3 className="text-xl font-bold text-warm-900">Thank You! 🙏</h3>
                <p className="mt-2 text-warm-600">Your review has been submitted. It will appear after admin approval.</p>
            </div>
        );
    }

    return (
        <div className="rounded-3xl border border-warm-100 bg-white p-6 shadow-sm md:p-8">
            <h3 className="mb-6 font-heading text-xl font-bold text-warm-900">Share Your Experience</h3>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Star Rating */}
                <div>
                    <label className="mb-2 block text-sm font-semibold text-warm-700">Your Rating</label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="transition-transform hover:scale-110"
                            >
                                <Star
                                    size={32}
                                    className={`transition-colors ${star <= (hoverRating || rating)
                                            ? "fill-gold-400 text-gold-400"
                                            : "text-warm-300"
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-warm-700">Your Name *</label>
                        <input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            placeholder="Enter your name"
                            className="w-full rounded-xl border border-warm-200 px-4 py-3 text-sm focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-warm-700">Email *</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email"
                            className="w-full rounded-xl border border-warm-200 px-4 py-3 text-sm focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100"
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-semibold text-warm-700">Review Title</label>
                    <input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="e.g. Amazing Griha Pravesh Puja"
                        className="w-full rounded-xl border border-warm-200 px-4 py-3 text-sm focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-semibold text-warm-700">Your Review *</label>
                    <textarea
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        required
                        rows={4}
                        placeholder="Share your experience with SmartPandit..."
                        className="w-full rounded-xl border border-warm-200 px-4 py-3 text-sm focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100"
                    />
                </div>

                {error && (
                    <p className="text-sm font-medium text-red-600">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-saffron-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-saffron-600 disabled:opacity-50"
                >
                    <Send size={16} />
                    {loading ? "Submitting..." : "Submit Review"}
                </button>
            </form>
        </div>
    );
}
