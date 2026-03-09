"use client";

import Link from "next/link";
import { ProductCard, ProductCardProps } from "../ui/ProductCard";

interface BestSellersProps {
    products?: ProductCardProps["product"][];
}

const MOCK_BEST_SELLERS: ProductCardProps["product"][] = [
    {
        id: "1",
        slug: "five-mukhi-rudraksha",
        name: "5 Mukhi Nepal Rudraksha",
        image: "https://images.unsplash.com/photo-1601314167099-24b553556066?w=400&h=400&fit=crop",
        badge: "BESTSELLER",
        rating: 4.8,
        reviewCount: 342,
        sellingPrice: 499,
        mrp: 999,
        discount: 50,
        soldCount: 2300,
        inStock: true,
    },
    {
        id: "2",
        slug: "tiger-eye-bracelet",
        name: "Tiger Eye Premium Bracelet",
        image: "https://images.unsplash.com/photo-1599643477873-10eb0cf37e6f?w=400&h=400&fit=crop",
        rating: 4.9,
        reviewCount: 128,
        sellingPrice: 899,
        mrp: 1599,
        discount: 44,
        soldCount: 1500,
        inStock: true,
    },
    {
        id: "3",
        slug: "shree-yantra",
        name: "Sphatik Shree Yantra",
        image: "https://images.unsplash.com/photo-1596707328639-50c6fb0e0926?w=400&h=400&fit=crop",
        rating: 4.7,
        reviewCount: 89,
        sellingPrice: 1299,
        mrp: 2499,
        discount: 48,
        soldCount: 850,
        inStock: true,
    },
    {
        id: "4",
        slug: "black-tourmaline",
        name: "Black Tourmaline Stone",
        image: "https://images.unsplash.com/photo-1611005202685-6f9202029be8?w=400&h=400&fit=crop",
        rating: 4.9,
        reviewCount: 56,
        sellingPrice: 799,
        mrp: 1499,
        discount: 47,
        soldCount: 1200,
        inStock: true,
    },
    {
        id: "5",
        slug: "black-tourmaline",
        name: "Black Tourmaline Stone",
        image: "https://images.unsplash.com/photo-1611005202685-6f9202029be8?w=400&h=400&fit=crop",
        rating: 4.9,
        reviewCount: 56,
        sellingPrice: 799,
        mrp: 1499,
        discount: 47,
        soldCount: 1200,
        inStock: true,
    },
    {
        id: "6",
        slug: "black-tourmaline",
        name: "Black Tourmaline Stone",
        image: "https://images.unsplash.com/photo-1611005202685-6f9202029be8?w=400&h=400&fit=crop",
        rating: 4.9,
        reviewCount: 56,
        sellingPrice: 799,
        mrp: 1499,
        discount: 47,
        soldCount: 1200,
        inStock: true,
    },
    {
        id: "7",
        slug: "black-tourmaline",
        name: "Black Tourmaline Stone",
        image: "https://images.unsplash.com/photo-1611005202685-6f9202029be8?w=400&h=400&fit=crop",
        rating: 4.9,
        reviewCount: 56,
        sellingPrice: 799,
        mrp: 1499,
        discount: 47,
        soldCount: 1200,
        inStock: true,
    },
    {
        id: "8",
        slug: "black-tourmaline",
        name: "Black Tourmaline Stone",
        image: "https://images.unsplash.com/photo-1611005202685-6f9202029be8?w=400&h=400&fit=crop",
        rating: 4.9,
        reviewCount: 56,
        sellingPrice: 799,
        mrp: 1499,
        discount: 47,
        soldCount: 1200,
        inStock: true,
    }
];

export function BestSellers({ products = MOCK_BEST_SELLERS }: BestSellersProps) {
    // Use mock data if empty array passed for now
    const displayProducts = products.length > 0 ? products : MOCK_BEST_SELLERS;

    return (
        <section className="py-8 md:py-10 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-end justify-between mb-5">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FF8C00]/10 text-[#FF8C00] rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                            🔥 MOST LOVED
                        </div>
                        <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#1A1A1A]">
                            Best Sellers
                        </h2>
                    </div>

                    <Link href="/shop?bestsellers=true" className="text-sm font-bold text-[#FF8C00] hover:text-[#E67E00] flex items-center mb-1 transition-colors group">
                        See All <span className="ml-1 text-lg leading-none group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>

                {/* 2-Col Mobile, 4-Col Desktop Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                    {displayProducts.slice(0, 8).map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
