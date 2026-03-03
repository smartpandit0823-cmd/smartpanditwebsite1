"use client";

import { HeroSection } from "@/components/home/HeroSection";
import { ShopByPurpose } from "@/components/home/ShopByPurpose";
import { BestSellers } from "@/components/home/BestSellers";
import { TrendingNow } from "@/components/home/TrendingNow";
import { ComboDeals } from "@/components/home/ComboDeals";
import { ZodiacSlider } from "@/components/home/ZodiacSlider";
import { RudrakshaFeature } from "@/components/home/RudrakshaFeature";
import { VastuIdols } from "@/components/home/VastuIdols";
import { PyramidCrystal } from "@/components/home/PyramidCrystal";
import { SiddhCollection } from "@/components/home/SiddhCollection";
import { BlogPreview } from "@/components/home/BlogPreview";
import { CustomerReviews } from "@/components/home/CustomerReviews";
import { WhySmartPandit } from "@/components/home/WhySmartPandit";
import { InstagramCommunity } from "@/components/home/InstagramCommunity";

interface StoreProduct {
    id: string;
    slug: string;
    name: string;
    category: string;
    images: string[];
    price: number;
    originalPrice?: number;
    discount: number;
    rating: number;
    reviewCount: number;
    benefits: string[];
    description: string;
    inStock: boolean;
    isAuthentic: boolean;
    featured: boolean;
    panditRecommended?: boolean;
    astrologerRecommended?: boolean;
    video?: string;
}

interface BannerData {
    _id: string;
    title: string;
    subtitle?: string;
    image: string;
    mobileImage?: string;
    link?: string;
}

export function StoreHomeClient({
    products,
    banners,
}: {
    products: StoreProduct[];
    banners: BannerData[];
}) {
    // Categorize products
    const bestSellers = products.filter((p) => p.featured).slice(0, 8);
    const siddhProducts = products
        .filter((p) => p.isAuthentic || p.panditRecommended)
        .slice(0, 10);
    const allProducts = products.slice(0, 12);

    // Use best available selection
    const bestSellersList =
        bestSellers.length > 0 ? bestSellers : allProducts.slice(0, 6);
    const siddhList =
        siddhProducts.length > 0 ? siddhProducts : allProducts.slice(0, 6);

    return (
        <div className="min-h-dvh">
            {/* 2. Hero Section */}
            <HeroSection banners={banners} />

            {/* 3. Shop By Purpose */}
            <ShopByPurpose />

            {/* 4. Best Sellers */}
            <BestSellers products={bestSellersList} />

            {/* 5. Trending Now */}
            <TrendingNow />

            {/* 6. Combo Deals */}
            <ComboDeals />

            {/* 7. Zodiac Section */}
            <ZodiacSlider />

            {/* 8. Rudraksha Feature */}
            <RudrakshaFeature />

            {/* 8. Vastu & Idols */}
            <VastuIdols />

            {/* 9. Pyramids & Crystals */}
            <PyramidCrystal />

            {/* 10. Siddh Collection */}
            <SiddhCollection products={siddhList} />

            {/* 11. Blog Preview */}
            <BlogPreview />

            {/* 12. Testimonials */}
            <CustomerReviews />

            {/* 13. Why SmartPandit */}
            <WhySmartPandit />

            {/* 14. Instagram Community */}
            <InstagramCommunity />

            {/* Decorative Mandala Background */}
            <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.012] overflow-hidden">
                <div className="absolute -right-32 -top-32 size-96 animate-mandala">
                    <svg viewBox="0 0 200 200" fill="none" className="size-full text-saffron-600">
                        <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="0.5" />
                        <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="0.5" />
                        <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="0.5" />
                        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                            <line
                                key={angle}
                                x1="100"
                                y1="20"
                                x2="100"
                                y2="180"
                                stroke="currentColor"
                                strokeWidth="0.3"
                                transform={`rotate(${angle} 100 100)`}
                            />
                        ))}
                    </svg>
                </div>
            </div>
        </div>
    );
}
