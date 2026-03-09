"use client";

import { useState } from "react";
import { Star, CheckCircle2, PenLine } from "lucide-react";
import { ReviewData } from "@/app/(store)/StoreHomeClient";
import { WriteReviewModal } from "@/components/reviews/WriteReviewModal";

export function CustomerReviews({ reviews }: { reviews: ReviewData[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <section className="py-8 md:py-10 bg-[#FFF8F0] px-4 overflow-hidden relative">
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col items-center text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#1A1A1A] leading-tight mb-2">
                        Customer Reviews
                    </h2>
                    <p className="text-[#888888] text-sm md:text-base font-medium mb-4">
                        What our devotees say about us
                    </p>
                    <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white border border-[#FFD700] rounded-full text-sm font-bold shadow-sm text-[#1A1A1A]">
                        <div className="flex text-[#FFD700]">
                            {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                        </div>
                        {reviews.length > 0
                            ? `${(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)}/5`
                            : "5.0/5"}
                        <span className="text-[#888888] ml-1 font-medium">({reviews.length}+ reviews)</span>
                    </div>
                </div>

                <div className="flex overflow-x-auto gap-4 pb-6 no-scrollbar snap-x snap-mandatory px-1 py-2">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="snap-start shrink-0 w-[300px] flex flex-col bg-white border border-yellow-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative"
                        >
                            {review.productName && (
                                <div className="absolute -top-3 left-4 bg-[#FF8C00] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm">
                                    Bought: {review.productName}
                                </div>
                            )}

                            <div className="flex text-[#FFD700] mb-3 mt-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-gray-300" : ""} />
                                ))}
                            </div>

                            <p className="italic text-[#1A1A1A] text-sm leading-relaxed mb-6 font-medium line-clamp-3">
                                &quot;{review.comment}&quot;
                            </p>

                            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#FEFAF4] text-[#FF8C00] flex items-center justify-center font-bold text-lg shadow-inner">
                                    {review.customerName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#1A1A1A] text-sm leading-none mb-1">{review.customerName}</h4>
                                    <div className="flex items-center gap-1.5 text-[11px] text-[#888888] font-medium">
                                        {review.isVerifiedPurchase && (
                                            <span className="flex items-center gap-0.5 text-[#00CEC9]">
                                                <CheckCircle2 size={12} />
                                                Verified
                                            </span>
                                        )}
                                        {review.city && <span>• {review.city}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Write a Review CTA */}
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF8C00] text-white font-bold rounded-full shadow-md hover:bg-[#E67E00] transition-colors"
                    >
                        <PenLine size={16} />
                        Write a Review
                    </button>
                </div>
            </div>

            <WriteReviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </section>
    );
}
