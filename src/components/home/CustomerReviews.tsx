"use client";

import { useRef } from "react";
import { Star, ChevronLeft, ChevronRight, BadgeCheck } from "lucide-react";

interface Review {
    id: string;
    name: string;
    location?: string;
    photo?: string;
    avatar?: string;
    rating: number;
    text: string;
    product: string;
    verified: boolean;
}

const DEMO_REVIEWS: Review[] = [
    {
        id: "r1",
        name: "Priya S.",
        location: "Mumbai, MH",
        rating: 5,
        text: "The 5 Mukhi Rudraksha is absolutely genuine. I can feel the positive energy. Packaging was premium and delivery was fast!",
        product: "5 Mukhi Rudraksha",
        verified: true,
    },
    {
        id: "r2",
        name: "Rahul M.",
        location: "Delhi",
        rating: 5,
        text: "Best puja kit I've ever purchased! Everything was included and the quality is outstanding. Will order again.",
        product: "Complete Puja Kit",
        verified: true,
    },
    {
        id: "r3",
        name: "Anisha K.",
        location: "Bangalore, KA",
        rating: 4,
        text: "Beautiful gemstone bracelet. The color is exactly as shown. Very good customer service too. Highly recommend!",
        product: "Amethyst Bracelet",
        verified: true,
    },
    {
        id: "r4",
        name: "Deepak J.",
        location: "Pune, MH",
        rating: 5,
        text: "Ordered the Siddh collection items. The energization certificate added trust. Products were exactly as described.",
        product: "Siddh Hanuman Kavach",
        verified: true,
    },
    {
        id: "r5",
        name: "Meera P.",
        location: "Ahmedabad, GJ",
        rating: 5,
        text: "Amazing quality Yantra! The gold plating is premium and it came with a genuine authenticity certificate.",
        product: "Shree Yantra",
        verified: true,
    },
];

export function CustomerReviews() {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (dir: 1 | -1) => {
        scrollRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
    };

    return (
        <section className="section-shell bg-gradient-to-b from-warm-50 to-saffron-50/20">
            <div className="section-wrap">
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="font-heading text-2xl md:text-3xl font-bold text-warm-900">
                        Customer Reviews
                    </h2>
                    <p className="text-sm text-warm-600 mt-1">What our devotees say about us</p>
                    <div className="flex items-center justify-center gap-1 mt-3">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                        ))}
                        <span className="ml-2 text-sm font-semibold text-warm-800">4.8/5</span>
                        <span className="text-xs text-warm-500 ml-1">(2.5k+ reviews)</span>
                    </div>
                </div>

                {/* Reviews Slider */}
                <div className="relative">
                    <div
                        ref={scrollRef}
                        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth -mx-4 px-4"
                    >
                        {DEMO_REVIEWS.map((review) => (
                            <div
                                key={review.id}
                                className="flex-shrink-0 w-[270px] md:w-[300px] card-surface rounded-2xl p-5"
                            >
                                {/* Stars */}
                                <div className="flex gap-0.5 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={13}
                                            className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-warm-200"}
                                        />
                                    ))}
                                </div>

                                {/* Review text */}
                                <p className="text-sm text-warm-700 leading-relaxed line-clamp-4 mb-4">
                                    &ldquo;{review.text}&rdquo;
                                </p>

                                {/* Product */}
                                <p className="text-[10px] text-saffron-600 font-medium mb-3">
                                    Bought: {review.product}
                                </p>

                                {/* Reviewer */}
                                <div className="flex items-center gap-2 pt-3 border-t border-warm-100 relative">
                                    <div className="size-8 rounded-full bg-gradient-to-br from-saffron-400 to-saffron-600 flex shrink-0 items-center justify-center text-white text-xs font-bold">
                                        {review.name[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-warm-900 truncate flex items-center gap-1">
                                            {review.name}
                                            {review.verified && (
                                                <span className="flex items-center gap-0.5 text-[9px] font-bold text-green-600 bg-green-50 px-1 rounded">
                                                    <BadgeCheck size={10} />
                                                    Verified Buyer
                                                </span>
                                            )}
                                        </p>
                                        {review.location && (
                                            <p className="text-[10px] text-warm-400 truncate">{review.location}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop arrows */}
                    <button
                        onClick={() => scroll(-1)}
                        className="absolute -left-3 top-1/2 -translate-y-1/2 hidden md:flex size-10 rounded-full bg-white shadow-lg items-center justify-center text-warm-600 hover:text-saffron-600 transition"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        onClick={() => scroll(1)}
                        className="absolute -right-3 top-1/2 -translate-y-1/2 hidden md:flex size-10 rounded-full bg-white shadow-lg items-center justify-center text-warm-600 hover:text-saffron-600 transition"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </section>
    );
}
