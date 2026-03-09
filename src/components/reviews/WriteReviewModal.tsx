"use client";

import { useState, useEffect } from "react";
import { Star, X, Loader2 } from "lucide-react";

interface WriteReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    // If not provided, the modal should show a product selector
    preselectedProductId?: string;
    preselectedProductName?: string;
    preselectedModel?: "Product" | "Puja";
}

export function WriteReviewModal({ isOpen, onClose, preselectedProductId, preselectedProductName, preselectedModel = "Product" }: WriteReviewModalProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const [products, setProducts] = useState<{ _id: string, name: string }[]>([]);
    const [selectedProductId, setSelectedProductId] = useState(preselectedProductId || "");

    useEffect(() => {
        if (isOpen && !preselectedProductId) {
            // Fetch list of products for the dropdown
            fetch("/api/products?limit=50")
                .then(res => res.json())
                .then(data => {
                    if (data.data) {
                        setProducts(data.data.map((p: any) => ({ _id: p.id || p._id, name: p.name })));
                    }
                })
                .catch(console.error);
        }
    }, [isOpen, preselectedProductId]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const targetId = preselectedProductId || selectedProductId;
        if (!targetId) {
            setError("Please select a product to review.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    targetId,
                    targetModel: preselectedModel,
                    customerName: name,
                    customerEmail: email,
                    rating,
                    comment
                })
            });

            const data = await res.json();
            if (res.ok && data.success) {
                setSuccess(true);
            } else {
                setError(data.error || "Failed to submit review");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-[#FEFAF4]">
                    <h3 className="font-heading font-bold text-xl text-[#1A1A1A]">
                        Write a Review
                    </h3>
                    <button onClick={onClose} className="p-2 -mr-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {success ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Star className="w-8 h-8 fill-current" />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-2">Thank you!</h4>
                            <p className="text-gray-500 mb-6 font-medium">Your review has been submitted and is waiting for admin approval.</p>
                            <button onClick={onClose} className="bg-[#FF8C00] text-white px-8 py-2.5 rounded-xl font-bold hover:bg-[#E67E00] transition-colors shadow-md">
                                Close
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                                    {error}
                                </div>
                            )}

                            {!preselectedProductId ? (
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Select Product</label>
                                    <select
                                        required
                                        value={selectedProductId}
                                        onChange={(e) => setSelectedProductId(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-[#FF8C00] focus:ring-[#FF8C00] focus:ring-1 outline-none transition-all text-sm"
                                    >
                                        <option value="">-- Choose a Product --</option>
                                        {products.map(p => (
                                            <option key={p._id} value={p._id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Reviewing</label>
                                    <div className="font-medium text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 text-sm">
                                        {preselectedProductName || "This Product"}
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Rating</label>
                                <div className="flex gap-1.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className="focus:outline-none hover:scale-110 transition-transform"
                                        >
                                            <Star
                                                size={32}
                                                className={star <= rating ? "fill-[#FFD700] text-[#FFD700]" : "text-gray-200"}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Your Name *</label>
                                    <input
                                        required
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-[#FF8C00] focus:ring-[#FF8C00] focus:ring-1 outline-none transition-all text-sm"
                                        placeholder="Rahul S."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Email *</label>
                                    <input
                                        required
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-[#FF8C00] focus:ring-[#FF8C00] focus:ring-1 outline-none transition-all text-sm"
                                        placeholder="rahul@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Your Review *</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-[#FF8C00] focus:ring-[#FF8C00] focus:ring-1 outline-none transition-all resize-none text-sm"
                                    placeholder="Share your experience with this product..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#1A1A1A] text-white py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-[#333] transition-colors disabled:opacity-70 mt-4 shadow-md"
                            >
                                {loading ? <Loader2 size={18} className="animate-spin" /> : "Submit Review"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
