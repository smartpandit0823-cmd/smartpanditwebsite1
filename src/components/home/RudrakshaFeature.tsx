"use client";

import Link from "next/link";
import { CheckCircle2, Award, ShieldCheck, ChevronRight } from "lucide-react";

export function RudrakshaFeature() {
    return (
        <section className="section-shell bg-gradient-to-l from-orange-50/50 to-warm-50 py-12 md:py-20 relative overflow-hidden">
            {/* Decorative large circle in background */}
            <div className="absolute top-1/2 -right-32 -translate-y-1/2 w-96 h-96 bg-saffron-100/50 rounded-full blur-3xl pointer-events-none" />

            <div className="section-wrap relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-10">
                    {/* Left: Text & Features */}
                    <div className="w-full md:w-1/2">
                        <div className="inline-flex items-center gap-2 mb-3">
                            <Award size={16} className="text-saffron-600" />
                            <span className="text-[11px] font-bold text-saffron-600 tracking-wider uppercase">
                                Premium Collection
                            </span>
                        </div>

                        <h2 className="font-heading text-3xl md:text-4xl font-bold text-warm-900 leading-tight mb-4">
                            Our Most Trusted <br className="hidden md:block" />
                            <span className="text-saffron-700">Rudraksha Beads</span>
                        </h2>

                        <p className="text-warm-600 mb-8 max-w-md">
                            Experience authentic spiritual awakening with our premium range of genuine Rudraksha beads, specially sourced and energized.
                        </p>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-start gap-3">
                                <CheckCircle2 size={20} className="text-green-600 mt-0.5 shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-warm-900 text-sm">Lab Certified Authenticity</h4>
                                    <p className="text-xs text-warm-500 mt-0.5">X-Ray & ISO lab verified certification with every bead.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <ShieldCheck size={20} className="text-blue-600 mt-0.5 shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-warm-900 text-sm">100% Original Nepal Origin</h4>
                                    <p className="text-xs text-warm-500 mt-0.5">Matured beads sourced directly from the Himalayas.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <SparklesIcon className="text-amber-500 mt-0.5 shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-warm-900 text-sm">Energized (Praan Pratishtha)</h4>
                                    <p className="text-xs text-warm-500 mt-0.5">Custom energized with your name & strict Vedic rituals.</p>
                                </div>
                            </div>
                        </div>

                        <Link
                            href="/store?category=rudraksha"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-saffron-600 to-amber-600 text-white font-bold text-sm px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                        >
                            Explore Rudraksha <ChevronRight size={16} />
                        </Link>
                    </div>

                    {/* Right: Image grid/showcase */}
                    <div className="w-full md:w-1/2 relative">
                        <div className="relative aspect-square md:aspect-auto md:h-[450px] w-full max-w-md mx-auto">
                            <div className="absolute inset-0 bg-saffron-200/30 rounded-full animate-pulse blur-2xl" />
                            <div className="absolute inset-4 bg-white rounded-3xl shadow-xl overflow-hidden border border-saffron-100 flex items-center justify-center p-6 bg-gradient-to-b from-white to-warm-50">
                                {/* Placeholder for actual image - using a stylized representation for now */}
                                <div className="text-center">
                                    <div className="text-8xl mb-4 drop-shadow-xl animate-float">📿</div>
                                    <div className="inline-block bg-white/80 backdrop-blur border border-saffron-200 px-4 py-2 rounded-xl shadow-sm text-sm font-bold text-warm-900">
                                        Authentic 1 to 21 Mukhi
                                    </div>
                                </div>
                            </div>
                            {/* Floating Trust Badges */}
                            <div className="absolute top-8 -left-4 md:-left-8 bg-white p-3 rounded-xl shadow-lg border border-warm-100 flex items-center gap-2 animate-float" style={{ animationDelay: '1s' }}>
                                <img src="https://cdn-icons-png.flaticon.com/512/1908/1908298.png" className="w-6 h-6 grayscale opacity-80" alt="Nepal" />
                                <span className="text-xs font-bold text-warm-900">Nepal Seed</span>
                            </div>
                            <div className="absolute bottom-12 -right-4 md:-right-8 bg-white p-3 rounded-xl shadow-lg border border-warm-100 flex items-center gap-2 animate-float" style={{ animationDelay: '2s' }}>
                                <ShieldCheck size={20} className="text-green-600" />
                                <span className="text-xs font-bold text-warm-900">Lab Tested</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function SparklesIcon(props: any) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
        </svg>
    );
}
