"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-diya opacity-60 pointer-events-none">
            <svg width="40" height="50" viewBox="0 0 40 50" fill="none">
                {/* Flame */}
                <ellipse cx="20" cy="12" rx="6" ry="10" fill="url(#flameGrad)" />
                {/* Diya body */}
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

// Particle dots for spiritual background
function SpiritualParticles() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(8)].map((_, i) => (
                <div
                    key={i}
                    className="particle"
                    style={{
                        left: `${10 + i * 12}%`,
                        top: `${20 + (i % 3) * 25}%`,
                        animationDelay: `${i * 0.5}s`,
                        animationDuration: `${3 + (i % 3)}s`,
                    }}
                />
            ))}
        </div>
    );
}

export function HeroSection({ banners }: { banners: BannerData[] }) {
    const [current, setCurrent] = useState(0);
    const [touchStart, setTouchStart] = useState(0);

    const slideTo = useCallback(
        (dir: 1 | -1) => {
            if (banners.length === 0) return;
            setCurrent((prev) => (prev + dir + banners.length) % banners.length);
        },
        [banners.length]
    );

    // Auto-slide
    useEffect(() => {
        if (banners.length <= 1) return;
        const timer = setInterval(() => slideTo(1), 5000);
        return () => clearInterval(timer);
    }, [banners.length, slideTo]);

    const hasBanners = banners.length > 0;

    return (
        <section className="relative w-full overflow-hidden bg-gradient-to-br from-warm-900 via-saffron-800 to-warm-900">
            {/* Spiritual particle background */}
            <SpiritualParticles />

            {/* Banner Slider */}
            {hasBanners ? (
                <div
                    className="relative aspect-[3/4] sm:aspect-[16/9] md:aspect-[21/9] w-full"
                    onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
                    onTouchEnd={(e) => {
                        const diff = touchStart - e.changedTouches[0].clientX;
                        if (Math.abs(diff) > 50) slideTo(diff > 0 ? 1 : -1);
                    }}
                >
                    {banners.map((banner, idx) => (
                        <div
                            key={banner._id}
                            className={`absolute inset-0 transition-all duration-700 ease-out ${idx === current
                                ? "opacity-100 scale-100"
                                : "opacity-0 scale-105"
                                }`}
                        >
                            <img
                                src={banner.mobileImage || banner.image}
                                alt={banner.title}
                                className="h-full w-full object-cover"
                            />
                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        </div>
                    ))}

                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-end pb-[10vh] sm:pb-16 px-6 text-center z-10">
                        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
                            Unlock Divine Energy for Wealth, Love & Protection
                        </h1>
                        <p className="text-[15px] sm:text-lg text-white/90 max-w-lg mb-8 font-medium drop-shadow-md">
                            Authentic spiritual tools for modern life.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto px-4 sm:px-0">
                            <Link
                                href="/store"
                                className="gradient-saffron px-8 py-3.5 rounded-full text-white font-bold text-sm sm:text-base tracking-wide shadow-[0_4px_16px_rgba(255,122,0,0.4)] btn-glow transition-transform active:scale-95 hover:scale-105"
                            >
                                Shop Now ✨
                            </Link>
                            <Link
                                href="/quiz"
                                className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-3.5 rounded-full text-white font-bold text-sm sm:text-base tracking-wide shadow-lg transition-all hover:bg-white/20 hover:border-white/40 active:scale-95"
                            >
                                Take Energy Quiz
                            </Link>
                        </div>
                    </div>

                    {/* Glowing Diya */}
                    <GlowingDiya />

                    {/* Dots */}
                    {banners.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                            {banners.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrent(idx)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === current
                                        ? "w-6 bg-saffron-400"
                                        : "w-1.5 bg-white/40"
                                        }`}
                                    aria-label={`Slide ${idx + 1}`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Desktop arrows */}
                    {banners.length > 1 && (
                        <>
                            <button
                                onClick={() => slideTo(-1)}
                                className="absolute left-3 top-1/2 -translate-y-1/2 hidden md:flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition z-20"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={() => slideTo(1)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition z-20"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </>
                    )}
                </div>
            ) : (
                /* Fallback hero when no banners */
                <div className="relative flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
                    <SpiritualParticles />
                    <div className="animate-om-glow text-6xl mb-6">🙏</div>
                    <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
                        Unlock Divine Energy for Wealth, Love & Protection
                    </h1>
                    <p className="text-[15px] sm:text-lg text-white/90 max-w-lg mb-8 font-medium">
                        Authentic spiritual tools for modern life.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 sm:px-0">
                        <Link
                            href="/store"
                            className="gradient-saffron px-8 py-3.5 rounded-full text-white font-bold text-sm sm:text-base tracking-wide shadow-[0_4px_16px_rgba(255,122,0,0.4)] btn-glow transition-transform active:scale-95"
                        >
                            Shop Now ✨
                        </Link>
                        <Link
                            href="/quiz"
                            className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-3.5 rounded-full text-white font-bold text-sm sm:text-base tracking-wide shadow-lg transition-all hover:bg-white/20 hover:border-white/40 active:scale-95"
                        >
                            Take Energy Quiz
                        </Link>
                    </div>
                    <GlowingDiya />
                </div>
            )}
        </section>
    );
}
