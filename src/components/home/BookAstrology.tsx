import Link from "next/link";
import { ArrowRight, Sparkles, Star, Phone, Video, MessageCircle } from "lucide-react";
import { BannerSlider } from "@/components/ui/BannerSlider";
import { SectionHeader } from "@/components/ui/SectionHeader";
import Image from "next/image";

const ASTROLOGERS = [
    {
        id: "1",
        name: "Acharya Sharma",
        specialty: "Vedic Astrology, Kundli",
        experience: "15+ Years",
        rating: 4.9,
        reviews: 1240,
        image: "https://images.unsplash.com/photo-1544168190-79c17527004f?w=400&h=400&fit=crop",
        pricePerMin: 25,
        languages: ["Hindi", "English", "Sanskrit"],
    },
    {
        id: "2",
        name: "Pandita Verma",
        specialty: "Tarot, Numerology",
        experience: "8+ Years",
        rating: 4.8,
        reviews: 850,
        image: "https://images.unsplash.com/photo-1574015974293-817f0ebebb74?w=400&h=400&fit=crop",
        pricePerMin: 20,
        languages: ["Hindi", "English"],
    },
    {
        id: "3",
        name: "Guru Dutt",
        specialty: "Vastu Shastra, Palmistry",
        experience: "20+ Years",
        rating: 5.0,
        reviews: 2100,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        pricePerMin: 35,
        languages: ["Hindi", "Marathi"],
    },
    {
        id: "4",
        name: "Dr. Jyotsna",
        specialty: "Nadi Astrology, Face Reading",
        experience: "12+ Years",
        rating: 4.7,
        reviews: 930,
        image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop",
        pricePerMin: 30,
        languages: ["English", "Telugu"],
    },
];

export function BookAstrology() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/50 to-purple-50/30 py-10 md:py-16">
            <div className="pointer-events-none absolute -left-20 top-20 h-64 w-64 rounded-full bg-indigo-200/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 bottom-10 h-64 w-64 rounded-full bg-purple-200/30 blur-3xl" />

            <div className="section-wrap relative z-10">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 md:mb-12">
                    <SectionHeader
                        title="Talk to Expert Astrologers"
                        subtitle="Get instant guidance for your life's problems from verified, premium astrologers."
                        centered={false}
                    />
                    <Link
                        href="/astrology"
                        className="hidden md:inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 transition-colors hover:border-indigo-300 hover:text-indigo-800 shadow-sm"
                    >
                        <Sparkles size={16} />
                        View All Astrologers
                    </Link>
                </div>

                <div className="mt-6 md:mt-0">
                    <BannerSlider
                        itemClassName="min-w-[75%] sm:min-w-[300px] lg:min-w-[340px]"
                        items={ASTROLOGERS.map((astro) => (
                            <Link key={astro.id} href={`/astrology/${astro.id}`} className="group block h-full select-none">
                                <article className="relative flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-xl shadow-indigo-900/5 border border-indigo-100/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(79,70,229,0.2)] hover:border-indigo-300/50">
                                    <div className="flex p-4 md:p-5 gap-4 items-center border-b border-indigo-50/50 bg-gradient-to-br from-indigo-50/50 to-transparent">
                                        <div className="relative size-14 md:size-16 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-md">
                                            <Image src={astro.image} alt={astro.name} fill className="object-cover" />
                                        </div>
                                        <div>
                                            <h3 className="text-base md:text-lg font-bold text-warm-900 group-hover:text-indigo-700 transition-colors">{astro.name}</h3>
                                            <p className="text-xs font-semibold text-indigo-600">{astro.specialty}</p>
                                            <div className="mt-1 flex items-center gap-3 text-xs font-medium text-warm-500">
                                                <span>Exp: {astro.experience}</span>
                                                <span className="flex items-center gap-1">
                                                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                                                    {astro.rating}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col p-4 md:p-5 bg-white">
                                        <p className="text-xs md:text-sm font-medium text-warm-600 text-center mb-4">
                                            {astro.languages.join(", ")}
                                        </p>
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-sm font-bold text-warm-900 bg-indigo-50 px-3 py-1.5 rounded-xl">₹{astro.pricePerMin}/min</span>
                                            <div className="flex gap-2">
                                                <div className="flex items-center justify-center size-9 rounded-full bg-green-50 text-green-600 border border-green-100 transition-colors group-hover:bg-green-500 group-hover:text-white">
                                                    <Phone size={14} />
                                                </div>
                                                <div className="flex items-center justify-center size-9 rounded-full bg-blue-50 text-blue-600 border border-blue-100 transition-colors group-hover:bg-blue-500 group-hover:text-white">
                                                    <MessageCircle size={14} />
                                                </div>
                                            </div>
                                        </div>
                                        <button className="mt-4 w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-bold text-white shadow-lg transition-colors group-hover:bg-indigo-700 active:scale-[0.98]">
                                            Consult Now
                                        </button>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    />
                </div>

                <div className="mt-10 text-center md:hidden">
                    <Link
                        href="/astrology"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-indigo-200 bg-white px-6 py-4 text-base font-bold text-indigo-700 transition hover:bg-indigo-50 active:scale-[0.98]"
                    >
                        <Sparkles size={18} />
                        Explore All Astrologers
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
