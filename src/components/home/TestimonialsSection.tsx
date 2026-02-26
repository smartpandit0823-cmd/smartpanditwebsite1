import { Star, Play, Quote, ShieldCheck } from "lucide-react";
import connectDB from "@/lib/db/mongodb";
import Review from "@/models/Review";
import Testimonial from "@/models/Testimonial";
import { HomeReviewForm } from "@/components/home/HomeReviewForm";
import { VideoExperienceClient } from "@/components/home/VideoExperienceClient";

async function fetchTestimonialData() {
  try {
    await connectDB();

    const [reviews, videos, reviewResult] = await Promise.all([
      Review.find({ status: "approved" })
        .sort({ createdAt: -1 })
        .limit(8)
        .lean() as any,
      Testimonial.find({ type: "video", status: "active" })
        .sort({ createdAt: -1 })
        .limit(4)
        .lean() as any,
      Review.aggregate([
        { $match: { status: "approved" } },
        { $group: { _id: null, avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
      ]),
    ]);

    const avgRating = reviewResult[0]?.avgRating?.toFixed(1) || "4.9";
    const totalReviews = reviewResult[0]?.count || 0;

    return { reviews, videos, avgRating, totalReviews };
  } catch (error) {
    console.error("Failed to fetch testimonials", error);
    return { reviews: [], videos: [], avgRating: "4.9", totalReviews: 0 };
  }
}

function timeAgo(dateStr: string) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return `${Math.floor(diff / 2592000)}mo ago`;
}

export async function TestimonialsSection() {
  const { reviews, videos, avgRating, totalReviews } = await fetchTestimonialData();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-warm-50/30 to-white py-10 md:py-16">
      <div className="section-wrap relative z-10">

        {/* ── Header ── */}
        <div className="mb-10 text-center md:mb-14">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-saffron-500">Testimonials</p>
          <h2 className="font-heading text-3xl font-bold text-warm-900 md:text-5xl">
            Voices of <span className="bg-gradient-to-r from-saffron-500 to-gold-500 bg-clip-text text-transparent">Devotion</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-warm-600 md:text-lg">
            Real experiences from devotees who found divine connection through SmartPandit.
          </p>

          {/* Rating Summary Pill */}
          <div className="mx-auto mt-6 inline-flex items-center gap-3 rounded-full border border-gold-200 bg-white px-5 py-2.5 shadow-sm">
            <div className="flex gap-0.5 text-gold-400">
              {Array(5).fill(0).map((_, i) => <Star key={i} size={16} className="fill-current" />)}
            </div>
            <span className="text-sm font-bold text-warm-900">{avgRating}/5</span>
            {totalReviews > 0 && (
              <span className="text-sm text-warm-500">({totalReviews} reviews)</span>
            )}
          </div>
        </div>

        {/* ── Video Experiences (Admin managed) ── */}
        <VideoExperienceClient videos={videos.map((vid: any) => ({
          ...vid,
          _id: vid._id.toString()
        }))} />

        {/* ── Written Reviews ── */}
        <div>
          <h3 className="mb-5 font-heading text-lg font-bold text-warm-900 md:text-xl">✍️ Written Blessings</h3>

          {reviews.length > 0 ? (
            <>
              {/* Mobile: Horizontal Scroll Cards */}
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory md:hidden">
                {reviews.map((review: any) => (
                  <div
                    key={review._id.toString()}
                    className="group min-w-[280px] max-w-[300px] flex-shrink-0 snap-start rounded-2xl border border-warm-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-saffron-200 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Quote size={40} className="text-saffron-500" />
                    </div>
                    {/* Star Row */}
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex gap-0.5 text-gold-400">
                        {Array(5).fill(0).map((_, i) => (
                          <Star key={i} size={14} className={i < review.rating ? "fill-current" : "text-warm-200"} />
                        ))}
                      </div>
                      <span className="text-[10px] text-warm-400">{timeAgo(review.createdAt)}</span>
                    </div>

                    {/* Comment */}
                    <p className="mb-4 text-sm text-warm-700 leading-relaxed line-clamp-4">"{review.comment}"</p>

                    {review.title && (
                      <p className="mb-3 text-xs font-semibold text-saffron-600">🕉️ {review.title}</p>
                    )}

                    {/* User */}
                    <div className="flex items-center gap-3 border-t border-warm-50 pt-4 mt-auto">
                      <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-saffron-100 to-gold-100 shadow-inner">
                        <span className="text-sm font-bold text-saffron-700">{review.customerName?.charAt(0)?.toUpperCase() || "U"}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-warm-900 truncate">{review.customerName}</p>
                        {review.isVerifiedPurchase && (
                          <p className="flex items-center gap-1 text-[10px] font-medium text-green-600">
                            <ShieldCheck size={10} /> Verified Purchase
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop: Masonry Grid */}
              <div className="hidden md:columns-2 lg:columns-3 gap-5 space-y-5 md:block">
                {reviews.map((review: any) => (
                  <div
                    key={review._id.toString()}
                    className="group break-inside-avoid rounded-2xl border border-warm-100/80 bg-white/80 backdrop-blur-sm p-7 shadow-sm transition-all duration-500 hover:shadow-2xl hover:border-saffron-300 hover:-translate-y-2 relative overflow-hidden ring-1 ring-transparent hover:ring-saffron-100 z-10 hover:z-20"
                  >
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-125 duration-500">
                      <Quote size={80} className="text-saffron-500" />
                    </div>
                    {/* Star Row */}
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex gap-0.5 text-gold-400">
                        {Array(5).fill(0).map((_, i) => (
                          <Star key={i} size={14} className={i < review.rating ? "fill-current" : "text-warm-200"} />
                        ))}
                      </div>
                      <span className="text-[10px] text-warm-400">{timeAgo(review.createdAt)}</span>
                    </div>

                    <Quote className="mb-3 text-saffron-100" size={28} />
                    <p className="mb-5 text-warm-700 leading-relaxed">"{review.comment}"</p>

                    {review.title && (
                      <p className="mb-4 text-xs font-semibold text-saffron-600">🕉️ {review.title}</p>
                    )}

                    {/* User */}
                    <div className="flex items-center gap-3 border-t border-warm-50 pt-4">
                      <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-saffron-100 to-gold-100 font-bold text-saffron-700">
                        {review.customerName?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-warm-900">{review.customerName}</p>
                        <div className="flex items-center gap-2">
                          {review.isVerifiedPurchase && (
                            <span className="flex items-center gap-1 text-[10px] font-semibold text-green-600">
                              <ShieldCheck size={10} /> Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-warm-200 bg-warm-50/50 py-14 text-center">
              <div className="mb-4 text-5xl">🙏</div>
              <h3 className="text-xl font-bold text-warm-900">No Reviews Yet</h3>
              <p className="mt-2 max-w-sm text-sm text-warm-500">
                Be the first devotee to share your blessed experience with SmartPandit.
              </p>
            </div>
          )}
        </div>

        {/* ── Write Review CTA + Form ── */}
        <HomeReviewForm />

      </div>
    </section>
  );
}
