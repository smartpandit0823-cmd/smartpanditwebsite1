"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Flame, MessageCircle, Star, ShieldCheck, CheckCircle2 } from "lucide-react";

const HERO_IMAGES = [
  "/images/home/hero-temple.png",
  "/images/home/hero-puja.png",
  "/images/home/hero-store.png",
  "/images/home/hero-astrology.png",
];

export function Hero() {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-warm-900 pb-10 pt-16 md:pb-16 md:pt-24">
      {/* Background Image Slider with Parallax feel & Overlays */}
      <div className="absolute inset-0 z-0">
        {HERO_IMAGES.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Temple Background ${idx + 1}`}
            className={`absolute inset-0 h-full w-full object-cover object-top scale-105 transition-opacity duration-1000 ${currentIdx === idx ? "opacity-40" : "opacity-0"
              }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-warm-900/80 via-warm-900/60 to-warm-50" />
        {/* Subtle Saffron Glow */}
        <div className="absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-saffron-500/30 blur-[100px]" />
      </div>

      <div className="section-wrap relative z-10 mx-auto px-4 md:px-8">
        <div className="flex flex-col items-center text-center">

          {/* Top Badge */}
          <div className="mb-6 inline-flex animate-fade-in-up items-center gap-2 rounded-full border border-saffron-300/30 bg-white/10 px-4 py-1.5 text-xs font-medium text-saffron-100 backdrop-blur-md">
            <span className="flex size-2 items-center justify-center rounded-full bg-saffron-400">
              <span className="absolute size-2 animate-ping rounded-full bg-saffron-400 opacity-75"></span>
            </span>
            India's Most Trusted Spiritual Platform
          </div>

          {/* Headline */}
          <h1 className="font-heading text-4xl font-extrabold leading-[1.1] text-white md:text-6xl lg:text-7xl">
            Experience the Divine <br />
            <span className="bg-gradient-to-r from-saffron-300 via-gold-400 to-saffron-500 bg-clip-text text-transparent">
              With Verified Pandits
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-warm-100/90 md:text-xl">
            Premium Puja, Astrology, and authentic Temple services. Seamless online bookings for your spiritual needs.
          </p>

          {/* Dual CTAs */}
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row w-full sm:w-auto">
            <Link
              href="/puja"
              className="group relative flex w-full sm:w-auto items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-saffron-500 to-saffron-600 px-8 py-4 text-lg font-bold text-white shadow-[0_0_40px_-10px_rgba(255,122,0,0.5)] transition-all hover:scale-105 hover:shadow-[0_0_60px_-15px_rgba(255,122,0,0.7)]"
            >
              <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(150%)]">
                <div className="relative h-full w-8 bg-white/20" />
              </div>
              <Flame size={20} className="text-saffron-100" />
              Book Puja Now
            </Link>

            <Link
              href="#our-pandits"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20"
            >
              <Star size={20} />
              Our Pandits
            </Link>
          </div>

          {/* Animated Stats / Floating Elements */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 md:gap-12">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-white/10 text-saffron-400 backdrop-blur-md border border-white/10">
                <Star size={24} fill="currentColor" />
              </div>
              <div className="text-left">
                <p className="text-xl font-bold text-white">4.9/5</p>
                <p className="text-xs text-warm-200">User Ratings</p>
              </div>
            </div>

            <div className="hidden h-10 w-px bg-white/20 md:block" />

            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-white/10 text-saffron-400 backdrop-blur-md border border-white/10">
                <ShieldCheck size={24} />
              </div>
              <div className="text-left">
                <p className="text-xl font-bold text-white">500+</p>
                <p className="text-xs text-warm-200">Verified Pandits</p>
              </div>
            </div>

            <div className="hidden h-10 w-px bg-white/20 sm:block" />

            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-white/10 text-saffron-400 backdrop-blur-md border border-white/10">
                <CheckCircle2 size={24} />
              </div>
              <div className="text-left">
                <p className="text-xl font-bold text-white">10k+</p>
                <p className="text-xs text-warm-200">Pujas Completed</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
