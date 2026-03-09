"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BannerData {
    _id: string;
    title: string;
    subtitle?: string;
    image: string;
    mobileImage?: string;
    link?: string;
}

export function StoreBannerSlider({ banners }: { banners: BannerData[] }) {
    const [current, setCurrent] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const len = banners.length;

    const next = useCallback(() => setCurrent((c) => (c + 1) % len), [len]);
    const prev = useCallback(() => setCurrent((c) => (c - 1 + len) % len), [len]);

    // Auto-slide
    useEffect(() => {
        if (len <= 1) return;
        const timer = setInterval(next, 4500);
        return () => clearInterval(timer);
    }, [next, len]);

    if (banners.length === 0) {
        return (
            <section className="relative w-full overflow-hidden bg-gradient-to-br from-saffron-500 via-orange-400 to-amber-500" style={{ minHeight: "340px" }}>
                <div className="relative z-10 flex h-full min-h-[340px] flex-col items-center justify-center px-5 text-center">
                    <span className="text-6xl mb-4">🙏</span>
                    <h2 className="font-serif text-3xl font-bold text-white drop-shadow-md">
                        SanatanSetu Store
                    </h2>
                    <p className="mt-2 text-lg text-white/85">
                        Premium Spiritual Products — Pandit Verified
                    </p>
                    <Link
                        href="/shop"
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-warm-900 shadow-xl transition-all active:scale-95"
                    >
                        Shop Now
                        <ChevronRight size={16} />
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="relative w-full overflow-hidden">
            {/* Slides */}
            <div
                className="flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {banners.map((banner) => (
                    <div
                        key={banner._id}
                        className="relative flex w-full shrink-0 flex-col justify-end overflow-hidden"
                        style={{ minHeight: "340px" }}
                    >
                        {/* Background Image */}
                        <Image
                            src={banner.image}
                            alt={banner.title}
                            fill
                            className="object-cover"
                            priority
                            sizes="100vw"
                        />

                        {/* Dark overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

                        {/* Mandala pattern overlay */}
                        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
                            style={{
                                backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px),
                  radial-gradient(circle at 75% 75%, white 1px, transparent 1px)`,
                                backgroundSize: "40px 40px",
                            }}
                        />

                        {/* Content */}
                        <div className="relative z-10 px-5 pb-10 pt-20 md:px-12 md:pb-16 md:pt-28">
                            {/* Heading */}
                            <h2 className="font-serif text-2xl font-bold leading-tight text-white drop-shadow-md md:text-4xl lg:text-5xl">
                                {banner.title}
                            </h2>
                            {banner.subtitle && (
                                <p className="mt-2 max-w-md text-sm text-white/85 md:text-base leading-relaxed">
                                    {banner.subtitle}
                                </p>
                            )}

                            {/* CTA Button */}
                            {banner.link && (
                                <Link
                                    href={banner.link}
                                    className="mt-5 inline-flex w-fit items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-warm-900 shadow-xl transition-all duration-300 active:scale-95 hover:shadow-2xl hover:-translate-y-0.5 group"
                                >
                                    Shop Now
                                    <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Arrow Nav */}
            {len > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute left-4 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/80 p-2.5 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110 md:flex"
                        aria-label="Previous banner"
                    >
                        <ChevronLeft size={20} className="text-warm-800" />
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-4 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/80 p-2.5 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110 md:flex"
                        aria-label="Next banner"
                    >
                        <ChevronRight size={20} className="text-warm-800" />
                    </button>
                </>
            )}

            {/* Dots */}
            {len > 1 && (
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                    {banners.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`rounded-full transition-all duration-500 ${i === current
                                ? "w-7 h-2 bg-white shadow-lg"
                                : "w-2 h-2 bg-white/40 hover:bg-white/60"
                                }`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Touch handlers */}
            <div
                className="absolute inset-0 md:hidden"
                onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
                onTouchEnd={(e) => {
                    const diff = touchStart - e.changedTouches[0].clientX;
                    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
                }}
            />
        </section>
    );
}
