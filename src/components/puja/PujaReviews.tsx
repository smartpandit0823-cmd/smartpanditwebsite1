import { Star, Quote } from "lucide-react";
import { ReviewForm } from "@/components/ui/ReviewForm";
import connectDB from "@/lib/db/mongodb";
import Review from "@/models/Review";

interface PujaReviewsProps {
    pujaId: string;
    pujaName: string;
}

export async function PujaReviews({ pujaId, pujaName }: PujaReviewsProps) {
    await connectDB();
    const reviews = await Review.find({ targetId: pujaId, targetModel: "Puja", status: "approved" })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean() as any[];

    const avgResult = await Review.aggregate([
        { $match: { targetId: pujaId, targetModel: "Puja", status: "approved" } },
        { $group: { _id: null, avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]) as any[];

    const avgRating = avgResult[0]?.avgRating?.toFixed(1) || "0";
    const totalCount = avgResult[0]?.count || 0;

    return (
        <div className="space-y-8">
            {/* Rating Summary */}
            {totalCount > 0 && (
                <div className="flex flex-col items-center justify-center rounded-2xl bg-warm-50 p-6 text-center">
                    <div className="text-4xl font-black text-warm-900">{avgRating}</div>
                    <div className="mt-1 flex items-center gap-1 text-gold-400">
                        {Array(5).fill(0).map((_, i) => (
                            <Star key={i} size={16} className={i < Math.round(Number(avgRating)) ? "fill-current" : "text-warm-300"} />
                        ))}
                    </div>
                    <p className="mt-1 text-sm text-warm-500">Based on {totalCount} review{totalCount !== 1 ? "s" : ""}</p>
                </div>
            )}

            {/* Reviews List */}
            {reviews.length > 0 && (
                <div className="space-y-4">
                    {reviews.map((review: any) => (
                        <div key={review._id.toString()} className="rounded-2xl border border-warm-100 bg-white p-5 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-full bg-saffron-100 font-bold text-saffron-600">
                                        {review.customerName?.charAt(0)?.toUpperCase() || "U"}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-warm-900">{review.customerName}</p>
                                        <div className="flex items-center gap-2">
                                            <div className="flex text-gold-400">
                                                {Array(5).fill(0).map((_, i) => (
                                                    <Star key={i} size={12} className={i < review.rating ? "fill-current" : "text-warm-300"} />
                                                ))}
                                            </div>
                                            {review.isVerifiedPurchase && (
                                                <span className="text-[10px] font-semibold text-green-600">✓ Verified</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {review.title && <p className="mt-3 text-sm font-semibold text-warm-800">{review.title}</p>}
                            <p className="mt-2 text-sm text-warm-700 leading-relaxed">{review.comment}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Review Form */}
            <div className="pt-4">
                <ReviewForm targetId={pujaId} targetModel="Puja" />
            </div>
        </div>
    );
}
