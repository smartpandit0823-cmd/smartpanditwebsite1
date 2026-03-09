import Link from "next/link";
import { Star, MapPin, CheckCircle2, UserPlus, Sparkles, ArrowRight, Shield } from "lucide-react";
import connectDB from "@/lib/db/mongodb";
import Pandit from "@/models/Pandit";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Our Team | SmartPandit — Verified Pandits & Astrologers",
    description: "Meet our verified Pandits and Astrologers. Join our team of spiritual guides and serve devotees across India.",
};

async function getVerifiedPandits() {
    await connectDB();
    return Pandit.find({ verificationStatus: "verified", status: "active" })
        .select("name photo city state specializations experience providesAstrology averageRating totalPujasCompleted totalAstrologyCompleted")
        .sort({ totalPujasCompleted: -1 })
        .lean() as any;
}

export default async function TeamPage() {
    const pandits = await getVerifiedPandits();
    const panditOnly = pandits.filter((p: any) => !p.providesAstrology);
    const astrologers = pandits.filter((p: any) => p.providesAstrology);

    return (
        <div className="min-h-screen bg-warm-50">
            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-br from-warm-900 via-warm-800 to-warm-950 py-20 text-center text-white md:py-28">
                <div className="pointer-events-none absolute -left-40 -top-40 h-[400px] w-[400px] rounded-full bg-saffron-600/20 blur-[120px]" />
                <div className="pointer-events-none absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-gold-600/20 blur-[120px]" />
                <div className="section-wrap relative z-10">
                    <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-saffron-500/30 bg-saffron-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-saffron-300 mb-6">
                        <Sparkles size={14} /> Our Spiritual Guides
                    </div>
                    <h1 className="font-heading text-4xl font-bold md:text-6xl">
                        Meet Our <span className="bg-gradient-to-r from-saffron-300 to-gold-400 bg-clip-text text-transparent">Verified Team</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-warm-200 md:text-lg">
                        Experienced, rigorously verified Pandits and Astrologers dedicated to guiding your spiritual journey with authenticity and devotion.
                    </p>
                    <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                            href="/join-pandit"
                            className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-saffron-500 to-saffron-600 px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                        >
                            <UserPlus size={20} />
                            Join as Pandit
                            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link
                            href="/join-pandit?type=astrologer"
                            className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20"
                        >
                            <Star size={20} />
                            Join as Astrologer
                        </Link>
                    </div>
                </div>
            </section>

            {/* Pandits Section */}
            <section className="py-16 md:py-24">
                <div className="section-wrap">
                    <div className="mb-10">
                        <h2 className="font-heading text-2xl font-bold text-warm-900 md:text-4xl">🙏 Our Pandits</h2>
                        <p className="mt-2 text-warm-600">Verified spiritual guides for your sacred rituals</p>
                    </div>

                    {pandits.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {(panditOnly.length > 0 ? panditOnly : pandits).map((pandit: any) => (
                                <PanditCard key={pandit._id.toString()} pandit={pandit} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-warm-200 bg-white py-16 text-center">
                            <div className="mb-4 text-5xl">🕉️</div>
                            <h3 className="text-xl font-bold text-warm-900">More Pandits Joining Soon</h3>
                            <p className="mt-2 max-w-sm text-sm text-warm-500">
                                We are onboarding verified Pandits from across India. Want to join?
                            </p>
                            <Link
                                href="/join-pandit"
                                className="mt-6 flex items-center gap-2 rounded-full bg-saffron-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-saffron-600"
                            >
                                <UserPlus size={16} /> Apply Now
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Astrologers Section */}
            {astrologers.length > 0 && (
                <section className="bg-gradient-to-b from-white to-warm-50 py-16 md:py-24">
                    <div className="section-wrap">
                        <div className="mb-10">
                            <h2 className="font-heading text-2xl font-bold text-warm-900 md:text-4xl">⭐ Our Astrologers</h2>
                            <p className="mt-2 text-warm-600">Expert astrologers for Kundli, horoscope, and life guidance</p>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {astrologers.map((pandit: any) => (
                                <PanditCard key={pandit._id.toString()} pandit={pandit} isAstrologer />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Join CTA */}
            <section className="relative overflow-hidden bg-gradient-to-br from-saffron-600 via-saffron-700 to-warm-900 py-20 text-center text-white">
                <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 -translate-y-1/2 translate-x-1/3 rounded-full bg-gold-400/20 blur-3xl" />
                <div className="section-wrap relative z-10">
                    <h2 className="font-heading text-3xl font-bold md:text-5xl">
                        Want to Join Our <span className="text-gold-300">Spiritual Team?</span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-saffron-100 md:text-lg">
                        Serve thousands of devotees across India. Apply now and our team will get back to you within 24 hours.
                    </p>
                    <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                            href="/join-pandit"
                            className="group flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-saffron-700 shadow-xl transition-all hover:scale-105"
                        >
                            <UserPlus size={20} />
                            Join as Pandit
                            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link
                            href="/join-pandit?type=astrologer"
                            className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 py-4 text-base font-bold text-white backdrop-blur-md transition hover:bg-white/20"
                        >
                            <Star size={20} />
                            Join as Astrologer
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

// ── Pandit Card Component ───────────────────────────────────────────────────
function PanditCard({ pandit, isAstrologer = false }: { pandit: any; isAstrologer?: boolean }) {
    return (
        <div className="group overflow-hidden rounded-3xl border border-warm-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-saffron-200">
            {/* Photo */}
            <div className="relative flex items-center justify-center bg-gradient-to-br from-warm-50 to-saffron-50/30 p-6 pb-4">
                <div className="relative">
                    <div className="size-28 overflow-hidden rounded-full border-4 border-white shadow-md transition-transform group-hover:scale-105">
                        {pandit.photo ? (
                            <img src={pandit.photo} alt={pandit.name} className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-saffron-100 to-gold-100 text-4xl font-bold text-saffron-600">
                                {pandit.name.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 rounded-full bg-white p-[3px] shadow-sm">
                        <CheckCircle2 size={22} className="text-green-500" />
                    </div>
                </div>
                {isAstrologer && (
                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-1 text-[10px] font-bold text-purple-700">
                        <Star size={10} /> Astrologer
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-5 pt-2 text-center">
                <h3 className="font-heading text-lg font-bold text-warm-900">{pandit.name}</h3>
                <div className="mt-1 flex items-center justify-center gap-1.5 text-sm text-warm-500">
                    <MapPin size={14} className="text-saffron-400" />
                    {pandit.city}{pandit.state ? `, ${pandit.state}` : ""}
                </div>

                {/* Rating & Experience */}
                <div className="mt-4 flex items-center justify-center gap-4 text-xs">
                    {pandit.averageRating > 0 && (
                        <div className="flex items-center gap-1 text-gold-500">
                            <Star size={13} className="fill-current" />
                            <span className="font-bold">{pandit.averageRating.toFixed(1)}</span>
                        </div>
                    )}
                    {pandit.experience > 0 && (
                        <div className="text-warm-600">
                            <span className="font-bold text-warm-900">{pandit.experience}</span> yrs exp
                        </div>
                    )}
                    {pandit.totalPujasCompleted > 0 && (
                        <div className="text-warm-600">
                            <span className="font-bold text-warm-900">{pandit.totalPujasCompleted}</span> pujas
                        </div>
                    )}
                </div>

                {/* Specializations */}
                {pandit.specializations?.length > 0 && (
                    <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                        {pandit.specializations.slice(0, 3).map((s: string, i: number) => (
                            <span key={i} className="rounded-full bg-warm-50 px-2.5 py-1 text-[10px] font-semibold text-warm-700 border border-warm-100">
                                {s}
                            </span>
                        ))}
                    </div>
                )}

                {/* Verified Badge */}
                <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] font-semibold text-green-600">
                    <Shield size={12} /> SmartPandit Verified
                </div>
            </div>
        </div>
    );
}
