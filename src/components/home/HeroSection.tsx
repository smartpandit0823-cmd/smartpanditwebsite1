"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Star, CheckCircle2 } from "lucide-react";

interface BannerData {
    _id: string;
    title: string;
    subtitle?: string;
    image: string;
    mobileImage?: string;
    link?: string;
}

// Glowing diya SVG component
function GlowingDiya() {
    return (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-diya opacity-80 pointer-events-none">
            <svg width="60" height="70" viewBox="0 0 40 50" fill="none">
                <ellipse cx="20" cy="12" rx="6" ry="10" fill="url(#flameGrad)" />
                <path d="M8 35 C8 30, 12 28, 20 28 C28 28, 32 30, 32 35 L34 42 C34 44, 32 46, 20 46 C8 46, 6 44, 6 42 Z" fill="url(#diyaGrad)" />
                <defs>
                    <radialGradient id="flameGrad">
                        <stop offset="0%" stopColor="#fff3bf" />
                        <stop offset="50%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="diyaGrad" x1="20" y1="28" x2="20" y2="46">
                        <stop offset="0%" stopColor="#d4af37" />
                        <stop offset="100%" stopColor="#aa860a" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
}

function SpiritualParticles() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {[...Array(5)].map((_, i) => (
                <div
                    key={i}
                    className="absolute bg-[#FFD700] rounded-full animate-float opacity-50"
                    style={{
                        width: `${Math.random() * 6 + 4}px`,
                        height: `${Math.random() * 6 + 4}px`,
                        left: `${10 + Math.random() * 80}%`,
                        top: `${20 + Math.random() * 60}%`,
                        animationDelay: `${i * 0.7}s`,
                        animationDuration: `${4 + Math.random() * 3}s`,
                        boxShadow: "0 0 10px #FFD700"
                    }}
                />
            ))}
        </div>
    );
}

const FLOATING_PRODUCTS = [
    { img: "https://images.unsplash.com/photo-1601314167099-24b553556066?auto=format&fit=crop&q=80", name: "Rudraksha" },
    { img: "https://images.unsplash.com/photo-1599643477873-10eb0cf37e6f?auto=format&fit=crop&q=80", name: "Tiger Eye Bracelet" },
    { img: "https://images.unsplash.com/photo-1596707328639-50c6fb0e0926?auto=format&fit=crop&q=80", name: "Shree Yantra" }
];

export function HeroSection({ banners }: { banners: BannerData[] }) {
    const [currentImg, setCurrentImg] = useState(0);

    // Convert admin banners to floating products, or fallback to defaults
    const activeProducts = banners && banners.length > 0
        ? banners.map(b => ({ img: b.image, name: b.title || "Spiritual Item" }))
        : FLOATING_PRODUCTS;

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImg((prev) => (prev + 1) % activeProducts.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [activeProducts.length]);

    // Always use fixed headline — do NOT use admin banner title as headline text
    const headline = "Unlock Divine Energy for";
    const subtext = banners.length > 0 && banners[0].subtitle
        ? banners[0].subtitle
        : "Authentic spiritual tools energised by expert priests. 100% lab certified. Delivered pan India.";

    return (
        <section className="relative w-full overflow-hidden bg-[#FEFAF4] min-h-[80vh] md:min-h-[90vh] flex items-center">
            {/* Radial Saffron Glow */}
            <div className="absolute inset-x-0 bottom-0 h-3/4 bg-radial-gradient from-[#fff0d9] to-transparent opacity-80 z-0"></div>

            <SpiritualParticles />
            <GlowingDiya />

            <div className="max-w-7xl mx-auto px-4 lg:px-8 w-full relative z-10 flex flex-col md:flex-row items-center gap-12 mt-12 md:mt-0 pb-20">

                {/* LEFT SIDE */}
                <div className="flex-1 max-w-2xl text-center md:text-left">
                    <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-[#FF8C00] bg-orange-50 text-[#FF8C00] text-sm font-semibold shadow-sm">
                        ✨ India&apos;s #1 Trusted Spiritual Store
                    </div>

                    <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-[#1A1A1A] leading-[1.15] mb-6">
                        {headline.replace("Wealth, Love & Protection", "")} <br className="hidden md:block" />
                        <span className="bg-gradient-to-r from-[#FF8C00] to-[#FFD700] text-transparent bg-clip-text">Wealth, Love</span> & Protection
                    </h1>

                    <p className="text-lg text-[#888888] mb-8 font-medium max-w-lg mx-auto md:mx-0">
                        {subtext}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-8">
                        <Link
                            href="/shop"
                            className="bg-[#FF8C00] px-8 py-4 rounded-full text-white font-bold text-lg shadow-[0_4px_16px_rgba(255,140,0,0.3)] transition-transform hover:scale-105 active:scale-95 text-center"
                        >
                            Shop Now ✨
                        </Link>
                        <Link
                            href="/consult-astrologer"
                            className="border-2 border-[#FF8C00] text-[#FF8C00] px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-50 transition-colors text-center"
                        >
                            Consult Astrologer →
                        </Link>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-gray-200">
                                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Customer" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                        <div className="text-sm font-medium text-[#1A1A1A]">
                            <div className="flex items-center gap-1 text-[#FFD700] mb-0.5">
                                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                            </div>
                            <span className="text-[#888888]">4.8/5 from 25,000+ happy customers</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE (Desktop) */}
                <div className="hidden md:flex flex-1 justify-center relative min-h-[500px] w-full items-center">
                    {activeProducts.map((prod, idx) => (
                        <div
                            key={idx}
                            className={`absolute transition-all duration-1000 ease-in-out ${idx === currentImg ? "opacity-100 scale-100 z-20" : "opacity-0 scale-90 z-0"
                                }`}
                        >
                            <div className="relative w-80 h-96 rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(255,140,0,0.15)] bg-white p-4 animate-float border border-orange-100">
                                <img src={prod.img} alt={prod.name} className="w-full h-full object-cover rounded-xl bg-gray-50" />

                                {/* Floating Lab badge */}
                                <div className="absolute top-8 -left-6 bg-white shadow-lg rounded-xl px-4 py-2 flex items-center gap-2 border border-gray-100 transform -rotate-6">
                                    <CheckCircle2 size={16} className="text-[#00CEC9]" />
                                    <span className="text-sm font-bold text-[#1A1A1A]">Lab Tested ✓</span>
                                </div>

                                {/* Floating Price badge */}
                                <div className="absolute bottom-8 -right-6 bg-[#FF8C00] shadow-lg rounded-xl px-4 py-2 transform rotate-6">
                                    <span className="text-sm font-bold text-white">₹999 only</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
