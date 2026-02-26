"use client";

import { useState } from "react";
import { Star, Send, CheckCircle2, PenLine, X, ChevronDown } from "lucide-react";

export function HomeReviewForm() {
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [pujaName, setPujaName] = useState("");
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
                    targetId: "000000000000000000000000",
                    targetModel: "Puja",
                    customerName: name,
                    customerEmail: email,
                    rating,
                    title: pujaName,
                    comment,
                }),
            });

            const json = await res.json();
            if (json.success) {
                setSubmitted(true);
            } else {
                setError(json.error || "Something went wrong");
            }
        } catch {
            setError("Failed to submit. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    function resetAll() {
        setSubmitted(false);
        setOpen(false);
        setName("");
        setEmail("");
        setPujaName("");
        setComment("");
        setRating(5);
        setError("");
    }

    // ── Success State ──
    if (submitted) {
        return (
            <div className="mx-auto mt-12 max-w-md animate-fade-in-up">
                <div className="flex flex-col items-center rounded-3xl border border-green-100 bg-gradient-to-br from-green-50 to-emerald-50 p-8 text-center shadow-sm md:p-10">
                    <div className="mb-5 flex size-20 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle2 size={40} className="text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-warm-900">Thank You! 🙏</h3>
                    <p className="mt-3 text-sm text-warm-600 leading-relaxed">
                        Your review has been submitted successfully.<br />
                        It will appear on the website after admin approval.
                    </p>
                    <button
                        onClick={resetAll}
                        className="mt-6 rounded-full bg-saffron-500 px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-saffron-600 active:scale-95"
                    >
                        Write Another
                    </button>
                </div>
            </div>
        );
    }

    // ── CTA Button (Collapsed) ──
    if (!open) {
        return (
            <div className="mt-12 flex flex-col items-center text-center">
                <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-saffron-50 md:size-20">
                    <PenLine size={28} className="text-saffron-500" />
                </div>
                <h3 className="text-xl font-bold text-warm-900 md:text-2xl">Had a Blessed Experience?</h3>
                <p className="mt-2 max-w-sm text-sm text-warm-500">
                    Share your experience to help other devotees find their spiritual path.
                </p>
                <button
                    onClick={() => setOpen(true)}
                    className="group mt-6 flex items-center gap-2.5 rounded-full bg-gradient-to-r from-saffron-500 to-saffron-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-saffron-200/40 transition-all hover:scale-105 hover:shadow-xl active:scale-95"
                >
                    <PenLine size={18} className="transition-transform group-hover:-rotate-12" />
                    Write a Review
                    <ChevronDown size={16} className="ml-1 transition-transform group-hover:translate-y-0.5" />
                </button>
            </div>
        );
    }

    // ── Expanded Form ──
    return (
        <div className="mx-auto mt-10 max-w-xl animate-fade-in-up">
            {/* Form Header */}
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h3 className="font-heading text-xl font-bold text-warm-900 md:text-2xl">Write a Review</h3>
                    <p className="mt-1 text-xs text-warm-500">All fields marked * are required</p>
                </div>
                <button
                    onClick={() => setOpen(false)}
                    className="flex size-9 items-center justify-center rounded-full text-warm-400 transition hover:bg-warm-100 hover:text-warm-700"
                >
                    <X size={20} />
                </button>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-5 rounded-3xl border border-warm-100 bg-white p-5 shadow-lg md:p-7"
            >
                {/* Star Rating */}
                <div>
                    <label className="mb-2 block text-sm font-semibold text-warm-700">Your Rating *</label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="transition-transform active:scale-90 hover:scale-125"
                            >
                                <Star
                                    size={32}
                                    className={`transition-colors duration-150 ${star <= (hoverRating || rating)
                                            ? "fill-gold-400 text-gold-400 drop-shadow-sm"
                                            : "text-warm-200"
                                        }`}
                                />
                            </button>
                        ))}
                        <span className="ml-3 flex items-center text-sm font-bold text-warm-700">
                            {rating}/5
                        </span>
                    </div>
                </div>

                {/* Name & Email Row */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-warm-600">Your Name *</label>
                        <input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            placeholder="e.g. Rahul Sharma"
                            className="w-full rounded-xl border border-warm-200 bg-warm-50/50 px-4 py-3 text-sm placeholder:text-warm-300 transition focus:border-saffron-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-saffron-100"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-warm-600">Email *</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            placeholder="your@email.com"
                            className="w-full rounded-xl border border-warm-200 bg-warm-50/50 px-4 py-3 text-sm placeholder:text-warm-300 transition focus:border-saffron-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-saffron-100"
                        />
                    </div>
                </div>

                {/* Puja / Service */}
                <div>
                    <label className="mb-1 block text-xs font-semibold text-warm-600">Which Puja / Service?</label>
                    <input
                        value={pujaName}
                        onChange={e => setPujaName(e.target.value)}
                        placeholder="e.g. Griha Pravesh, Satyanarayan Katha..."
                        className="w-full rounded-xl border border-warm-200 bg-warm-50/50 px-4 py-3 text-sm placeholder:text-warm-300 transition focus:border-saffron-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-saffron-100"
                    />
                </div>

                {/* Comment */}
                <div>
                    <label className="mb-1 block text-xs font-semibold text-warm-600">Your Experience *</label>
                    <textarea
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        required
                        rows={4}
                        placeholder="Share your experience with SmartPandit in a few words..."
                        className="w-full rounded-xl border border-warm-200 bg-warm-50/50 px-4 py-3 text-sm placeholder:text-warm-300 transition focus:border-saffron-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-saffron-100 resize-none"
                    />
                </div>

                {error && (
                    <p className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600">{error}</p>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-saffron-500 to-saffron-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-saffron-200/30 transition-all hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Send size={16} />
                    {loading ? "Submitting..." : "Submit Review"}
                </button>

                <p className="text-center text-[11px] text-warm-400">
                    Your review will be published after admin approval. We respect your privacy.
                </p>
            </form>
        </div>
    );
}
