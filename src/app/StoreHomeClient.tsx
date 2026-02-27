"use client";

import {
    StoreBannerSlider,
    StoreCategoriesGrid,
    StoreProductSection,
    StoreUSPBar,
    StoreReelsDiscovery,
    StoreCTASection,
} from "@/components/store";

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

export function StoreHomeClient({ products }: { products: StoreProduct[] }) {
    const trendingProducts = products.filter((p) => p.featured).slice(0, 8);
    const panditPicks = products.filter((p) => p.panditRecommended).slice(0, 8);
    const allProducts = products.slice(0, 12);
    const reelProducts = products.filter((p) => p.images.length > 0).slice(0, 10);

    // If no pandit picks exist, use first 4 featured as demo
    const panditSection =
        panditPicks.length > 0 ? panditPicks : trendingProducts.slice(0, 4);

    return (
        <div className="min-h-dvh page-enter">
            {/* 1. Hero Banner Slider */}
            <StoreBannerSlider />

            {/* 2. USP Trust Bar */}
            <StoreUSPBar />

            {/* 3. Categories Grid */}
            <StoreCategoriesGrid />

            {/* 4. Trending Products */}
            <StoreProductSection
                title="Trending Now"
                subtitle="Most popular spiritual products this week"
                products={trendingProducts.length > 0 ? trendingProducts : allProducts.slice(0, 4)}
                viewAllHref="/store"
                badge="🔥 Hot"
            />

            {/* 5. Reels-style Discovery */}
            <StoreReelsDiscovery products={reelProducts} />

            {/* 6. Pandit Recommended (USP) */}
            <StoreProductSection
                title="Pandit Recommended"
                subtitle="Handpicked by our verified pandits for your rituals"
                products={panditSection}
                viewAllHref="/store?filter=pandit-recommended"
                badge="Pandit Verified"
                badgeEmoji="🙏"
            />

            {/* 7. CTA Section */}
            <StoreCTASection />

            {/* 8. All Products */}
            <StoreProductSection
                title="All Products"
                subtitle="Browse our complete spiritual collection"
                products={allProducts}
                viewAllHref="/store"
            />

            {/* Decorative Mandala Background */}
            <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.015] overflow-hidden">
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
