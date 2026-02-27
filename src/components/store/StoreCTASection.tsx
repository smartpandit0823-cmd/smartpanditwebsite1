"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Sparkles, Crown, ArrowRight } from "lucide-react";

export function StoreCTASection() {
    return (
        <section className="section-shell">
            <div className="section-wrap">
                {/* Main CTA */}
                <div className="relative overflow-hidden rounded-3xl p-6 md:p-10">
                    {/* Background Image */}
                    <Image
                        src="/images/banners/hero-spiritual.png"
                        alt="Sacred Collection"
                        fill
                        className="object-cover"
                        sizes="100vw"
                    />
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-linear-to-br from-saffron-900/80 via-saffron-800/70 to-amber-800/60" />

                    {/* Sacred geometry pattern */}
                    <div
                        className="pointer-events-none absolute inset-0 opacity-[0.08]"
                        style={{
                            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
                            backgroundSize: "24px 24px",
                        }}
                    />

                    {/* Floating Om — animated */}
                    <span className="absolute -right-4 -top-4 text-8xl opacity-15 animate-breathe">🕉️</span>
                    <span className="absolute -bottom-2 -left-2 text-6xl opacity-10 animate-float">🪷</span>

                    <div className="relative z-10 text-center">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md border border-white/10">
                            <Crown size={12} />
                            SanatanSetu Premium
                        </span>
                        <h2 className="mt-4 font-serif text-2xl font-bold text-white md:text-3xl lg:text-4xl drop-shadow-md">
                            Begin Your Spiritual Journey
                        </h2>
                        <p className="mx-auto mt-2 max-w-lg text-sm text-white/85 md:text-base leading-relaxed">
                            Explore authentic spiritual products curated by verified pandits.
                            Every item blessed & certified.
                        </p>

                        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                            <Link
                                href="/store"
                                className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-saffron-700 shadow-xl transition-all active:scale-95 hover:shadow-2xl hover:-translate-y-0.5 group"
                            >
                                <ShoppingBag size={16} />
                                Shop Now
                                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                            </Link>
                            <Link
                                href="/store?category=premium-kits"
                                className="flex items-center gap-2 rounded-xl border-2 border-white/30 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition-all active:scale-95 hover:bg-white/10"
                            >
                                <Sparkles size={16} />
                                Explore Premium Kits
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom mini CTAs with images */}
                <div className="mt-4 grid grid-cols-3 gap-3">
                    {[
                        { img: "/images/products/rudraksha.png", title: "Energized Rudraksha", sub: "From ₹299", href: "/store?category=rudraksha" },
                        { img: "/images/products/gemstone.png", title: "Certified Gemstones", sub: "Lab Tested", href: "/store?category=astrology-remedies" },
                        { img: "/images/products/mala.png", title: "Prayer Mala", sub: "108 Beads", href: "/store?category=spiritual-jewellery" },
                    ].map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            className="card-premium flex flex-col items-center gap-2 rounded-2xl border border-gold-200/60 bg-white p-3 text-center md:p-4"
                        >
                            <div className="relative size-12 md:size-14 overflow-hidden rounded-xl">
                                <Image src={item.img} alt={item.title} fill className="object-cover" sizes="56px" />
                            </div>
                            <span className="text-[11px] font-semibold text-warm-800">{item.title}</span>
                            <span className="text-[10px] text-warm-500">{item.sub}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
