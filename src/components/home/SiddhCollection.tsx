"use client";

import Link from "next/link";
import { Crown } from "lucide-react";
import { ProductCardProps } from "../ui/ProductCard";

interface SiddhCollectionProps {
    products?: ProductCardProps["product"][];
}

const MOCK_SIDDH_PRODUCTS = [
    {
        id: "s1",
        slug: "one-mukhi-rudraksha",
        name: "1 Mukhi Certified Rudraksha",
        image: "https://images.unsplash.com/photo-1601314167099-24b553556066?auto=format&fit=crop&q=80",
        sellingPrice: 12500,
        rating: 4.9,
        reviewCount: 42,
        inStock: true
    },
    {
        id: "s2",
        slug: "blue-sapphire-neelam",
        name: "Blue Sapphire (Neelam) 5 Ratti",
        image: "https://images.unsplash.com/photo-1611005202685-6f9202029be8?auto=format&fit=crop&q=80",
        sellingPrice: 24000,
        rating: 4.8,
        reviewCount: 29,
        inStock: true
    },
    {
        id: "s3",
        slug: "sphatik-shivling",
        name: "Original Sphatik Shivling",
        image: "https://images.unsplash.com/photo-1596707328639-50c6fb0e0926?auto=format&fit=crop&q=80",
        sellingPrice: 8500,
        rating: 5.0,
        reviewCount: 88,
        inStock: true
    },
    {
        id: "s4",
        slug: "gauri-shankar-rudraksha",
        name: "Gauri Shankar Rudraksha",
        image: "https://images.unsplash.com/photo-1601314167099-24b553556066?auto=format&fit=crop&q=80",
        sellingPrice: 11200,
        rating: 4.9,
        reviewCount: 51,
        inStock: true
    }
];

export function SiddhCollection({ products = MOCK_SIDDH_PRODUCTS }: SiddhCollectionProps) {
    const displayProducts = products && products.length > 0 ? products : MOCK_SIDDH_PRODUCTS;

    return (
        <section className="py-8 md:py-12 bg-[#0F0F0F] px-4 -mx-4 md:mx-0 overflow-hidden relative">
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col items-center md:items-start text-center md:text-left mb-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30 rounded-full text-xs font-bold uppercase tracking-widest mb-4 shadow-[0_0_15px_rgba(255,215,0,0.15)]">
                        <Crown size={14} className="animate-pulse" />
                        SIDDH COLLECTION
                    </div>
                    <h2 className="text-3xl md:text-5xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFF8E7] via-[#FFD700] to-[#D4AF37] leading-[1.2] mb-3 drop-shadow-lg">
                        Rare & Powerful.<br className="hidden md:block" /> Curated for Serious Seekers.
                    </h2>
                    <p className="text-[#888888] text-sm md:text-lg font-medium max-w-2xl">
                        Exclusive, high-value spiritual items energised, lab-verified, and individually handpicked by our master astrologers.
                    </p>
                </div>

                {/* Horizontal scroll on mobile, 4-col desktop */}
                <div className="flex overflow-x-auto gap-4 md:grid md:grid-cols-4 md:gap-6 pb-6 no-scrollbar snap-x snap-mandatory px-1 py-4">
                    {displayProducts.slice(0, 4).map((product) => (
                        <div key={product.id} className="snap-start shrink-0 w-[240px] md:w-auto flex flex-col group bg-[#1A1A1A] border border-[#333333] hover:border-[#FFD700]/50 rounded-2xl p-4 transition-all hover:shadow-[0_8px_32px_rgba(255,215,0,0.1)]">

                            <div className="bg-white rounded-xl aspect-[4/3] w-full p-4 mb-5 shadow-inner flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-contain filter drop-shadow-xl"
                                />
                                <div className="absolute top-2 left-2 px-2 py-1 bg-gradient-to-r from-[#D4AF37] to-[#aa860a] text-white text-[9px] font-bold uppercase rounded shadow-sm">
                                    Expert Certified
                                </div>
                            </div>

                            <div className="flex flex-col flex-1">
                                <h3 className="font-bold text-white text-base leading-tight mb-2 line-clamp-2">
                                    {product.name}
                                </h3>
                                <div className="flex items-center gap-1.5 mb-4">
                                    <span className="text-[#FFD700] font-bold text-lg">₹{product.sellingPrice.toLocaleString('en-IN')}</span>
                                    <span className="text-[10px] text-[#888888] uppercase tracking-wider bg-[#333] px-1.5 py-0.5 rounded">Consult First</span>
                                </div>

                                <Link
                                    href={`/product/${product.slug}`}
                                    className="w-full mt-auto py-3 px-4 rounded-xl border border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-[#1A1A1A] font-bold text-sm text-center shadow-[0_0_10px_rgba(255,215,0,0.1)] hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all flex items-center justify-center gap-2 group-hover:translate-x-0"
                                >
                                    View Details <span className="text-lg leading-none transform group-hover:translate-x-1 transition-transform">→</span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
