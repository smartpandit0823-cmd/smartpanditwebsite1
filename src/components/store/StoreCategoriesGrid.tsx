"use client";

import Link from "next/link";
import Image from "next/image";
import { STORE_CATEGORIES } from "@/lib/store-constants";

export function StoreCategoriesGrid() {
    return (
        <section className="section-shell">
            <div className="section-wrap">
                {/* Section Header */}
                <div className="mb-6 flex items-end justify-between">
                    <div>
                        <h2 className="font-serif text-xl font-bold text-warm-900 md:text-2xl">
                            Shop by Category
                        </h2>
                        <p className="mt-1 text-sm text-warm-600">
                            Explore our curated spiritual collections
                        </p>
                    </div>
                    <Link href="/store" className="text-xs font-semibold text-saffron-600 hover:text-saffron-700 transition-colors">
                        View All →
                    </Link>
                </div>

                {/* Grid — 4 cols on mobile, 4 on desktop */}
                <div className="grid grid-cols-4 gap-3 md:gap-4">
                    {STORE_CATEGORIES.map((cat, i) => (
                        <Link
                            key={cat.id}
                            href={cat.slug}
                            className="group flex flex-col items-center gap-2 rounded-2xl border border-gold-200/60 bg-white p-2.5 text-center transition-all duration-300 active:scale-95 hover:border-saffron-300 hover:shadow-lg hover:-translate-y-1 md:p-4"
                            style={{ animationDelay: `${i * 60}ms` }}
                        >
                            {/* Image Icon with 3D effect */}
                            <div className={`relative flex size-14 items-center justify-center rounded-2xl bg-linear-to-br ${cat.gradient} shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md md:size-16 overflow-hidden`}>
                                <Image
                                    src={cat.image}
                                    alt={cat.name}
                                    fill
                                    className="object-cover rounded-2xl p-1"
                                    sizes="64px"
                                />
                                {/* Shine overlay */}
                                <div className="absolute inset-0 bg-linear-to-br from-white/30 via-transparent to-transparent rounded-2xl pointer-events-none" />
                            </div>

                            {/* Label */}
                            <span className="text-[11px] font-semibold leading-tight text-warm-800 group-hover:text-saffron-700 transition-colors md:text-sm">
                                {cat.name}
                            </span>
                            <span className="hidden text-[10px] text-warm-500 md:block">
                                {cat.description}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
