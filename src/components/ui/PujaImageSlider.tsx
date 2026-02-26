"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PujaImageSliderProps {
    images: string[];
    name: string;
}

export function PujaImageSlider({ images, name }: PujaImageSliderProps) {
    const [current, setCurrent] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

    const total = images.length;

    const go = useCallback((idx: number) => {
        setCurrent((idx + total) % total);
    }, [total]);

    // Auto-advance every 5s
    useEffect(() => {
        if (total <= 1) return;
        timerRef.current = setInterval(() => go(current + 1), 5000);
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [current, total, go]);

    if (!images.length) {
        return (
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded-3xl md:aspect-[2.5/1]">
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-saffron-100 to-gold-200">
                    <span className="text-8xl">🙏</span>
                </div>
            </div>
        );
    }

    if (total === 1) {
        return (
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded-3xl md:aspect-[2.5/1]">
                <Image src={images[0]} alt={name} fill priority unoptimized sizes="(max-width:768px) 100vw,896px" className="object-cover" />
            </div>
        );
    }

    return (
        <div
            className="group relative aspect-[3/2] w-full overflow-hidden rounded-3xl md:aspect-[2.5/1]"
            onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
            onTouchEnd={(e) => {
                const diff = touchStart - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 50) go(diff > 0 ? current + 1 : current - 1);
            }}
        >
            {/* Slides */}
            <div
                className="flex h-full transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${current * 100}%)`, width: `${total * 100}%` }}
            >
                {images.map((img, i) => (
                    <div key={i} className="relative h-full" style={{ width: `${100 / total}%` }}>
                        <Image
                            src={img}
                            alt={`${name} ${i + 1}`}
                            fill
                            priority={i === 0}
                            unoptimized
                            sizes="(max-width:768px) 100vw,896px"
                            className="object-cover"
                        />
                    </div>
                ))}
            </div>

            {/* Gradient overlay (bottom) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            {/* Nav arrows */}
            <button
                onClick={() => go(current - 1)}
                className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur-sm transition-all hover:bg-white group-hover:flex md:flex"
                aria-label="Previous image"
            >
                <ChevronLeft size={20} className="text-warm-800" />
            </button>
            <button
                onClick={() => go(current + 1)}
                className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur-sm transition-all hover:bg-white group-hover:flex md:flex"
                aria-label="Next image"
            >
                <ChevronRight size={20} className="text-warm-800" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
                {images.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => go(i)}
                        className={`h-2 rounded-full transition-all duration-300 ${i === current ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
                            }`}
                        aria-label={`Go to image ${i + 1}`}
                    />
                ))}
            </div>

            {/* Counter */}
            <div className="absolute right-4 top-4 rounded-full bg-black/40 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                {current + 1} / {total}
            </div>
        </div>
    );
}
