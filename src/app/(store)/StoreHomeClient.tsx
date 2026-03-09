"use client";

import { HeroSection } from "@/components/home/HeroSection";
import { ShopByPurpose } from "@/components/home/ShopByPurpose";
import { OffersSlider } from "@/components/home/OffersSlider";
import { BestSellers } from "@/components/home/BestSellers";
import { TrendingNow } from "@/components/home/TrendingNow";
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

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    category: string;
    featuredImage?: string;
    readTime?: string;
    publishedAt?: string;
}

export interface ReviewData {
    id: string;
    customerName: string;
    rating: number;
    comment: string;
    productName?: string;
    city?: string;
    isVerifiedPurchase: boolean;
    createdAt: string;
}

export function StoreHomeClient({
    products,
    banners,
    blogs = [],
    reviews = [],
}: {
    products: StoreProduct[];
    banners: BannerData[];
    blogs?: BlogPost[];
    reviews?: ReviewData[];
}) {
    let bestSellers = products.filter((p) => p.featured).slice(0, 8);
    if (bestSellers.length === 0) {
        bestSellers = [...products].sort((a, b) => b.rating - a.rating).slice(0, 8);
    }
    const siddhProducts = products
        .filter((p) => p.isAuthentic || p.panditRecommended)
        .slice(0, 10);

    let trendingProducts = products.filter(p => p.rating >= 4.5).slice(0, 16);
    if (trendingProducts.length === 0) {
        trendingProducts = [...products].sort((a, b) => b.rating - a.rating).slice(0, 16);
    }
    const rudrakshaProducts = products.filter(p => p.category?.toLowerCase() === 'rudraksha').slice(0, 4);
    const vastuProducts = products.filter(p => p.category?.toLowerCase() === 'vastu').slice(0, 4);
    const crystalProducts = products.filter(p => p.category?.toLowerCase() === 'crystals' || p.category?.toLowerCase() === 'gemstones' || p.category?.toLowerCase() === 'pyramids').slice(0, 4);

    const mapProduct = (p: StoreProduct) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        category: p.category,
        image: p.images?.[0] || "https://images.unsplash.com/photo-1601314167099-24b553556066?w=400&h=400",
        rating: p.rating,
        reviewCount: p.reviewCount,
        sellingPrice: p.price,
        mrp: p.originalPrice,
        discount: p.discount,
        soldCount: 0,
        inStock: p.inStock,
        badge: p.featured ? "BESTSELLER" : undefined as any,
    });

    const bestSellersList = bestSellers.map(mapProduct);

    return (
        <div className="min-h-dvh">
            {/* 2. Hero Section */}
            <HeroSection banners={banners} />

            {/* Offers Slider Component */}
            <OffersSlider />

            {/* 3. Shop By Purpose */}
            <ShopByPurpose />

            {/* 4. Best Sellers — only show if we have featured products */}
            {bestSellersList.length > 0 && <BestSellers products={bestSellersList} />}

            {/* 5. Trending Now — only show if we have trending */}
            {trendingProducts.length > 0 && <TrendingNow products={trendingProducts.map(mapProduct)} />}

            {/* 6. Zodiac Section */}
            <ZodiacSlider />

            {/* 7. Rudraksha Feature — only show if products exist */}
            {rudrakshaProducts.length > 0 && <RudrakshaFeature products={rudrakshaProducts.map(mapProduct)} />}

            {/* 8. Vastu & Idols */}
            {vastuProducts.length > 0 && <VastuIdols products={vastuProducts.map(mapProduct)} />}

            {/* 9. Pyramids & Crystals */}
            {crystalProducts.length > 0 && <PyramidCrystal products={crystalProducts.map(mapProduct)} />}

            {/* 10. Siddh Collection — only show if products exist */}
            {siddhProducts.length > 0 && <SiddhCollection products={siddhProducts.map(mapProduct)} />}

            {/* 11. Blog Preview — only show real blogs from admin */}
            {blogs.length > 0 && <BlogPreview blogs={blogs} />}

            {/* 12. Customer Reviews — only show real approved reviews */}
            {reviews.length > 0 && <CustomerReviews reviews={reviews} />}

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

