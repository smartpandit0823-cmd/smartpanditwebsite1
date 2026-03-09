import Link from "next/link";
import { Sparkles } from "lucide-react";

// Mappings for astrological elements and colors
const RASHI_DATA = [
    { name: "Aries", dates: "Mar 21 – Apr 19", element: "fire", symbol: "♈", stone: "Red Coral", slug: "aries" },
    { name: "Taurus", dates: "Apr 20 – May 20", element: "earth", symbol: "♉", stone: "Diamond/Opal", slug: "taurus" },
    { name: "Gemini", dates: "May 21 – Jun 20", element: "air", symbol: "♊", stone: "Emerald", slug: "gemini" },
    { name: "Cancer", dates: "Jun 21 – Jul 22", element: "water", symbol: "♋", stone: "Pearl", slug: "cancer" },
    { name: "Leo", dates: "Jul 23 – Aug 22", element: "fire", symbol: "♌", stone: "Ruby", slug: "leo" },
    { name: "Virgo", dates: "Aug 23 – Sep 22", element: "earth", symbol: "♍", stone: "Emerald", slug: "virgo" },
    { name: "Libra", dates: "Sep 23 – Oct 22", element: "air", symbol: "♎", stone: "Diamond", slug: "libra" },
    { name: "Scorpio", dates: "Oct 23 – Nov 21", element: "water", symbol: "♏", stone: "Red Coral", slug: "scorpio" },
    { name: "Sagittarius", dates: "Nov 22 – Dec 21", element: "fire", symbol: "♐", stone: "Yellow Sapphire", slug: "sagittarius" },
    { name: "Capricorn", dates: "Dec 22 – Jan 19", element: "earth", symbol: "♑", stone: "Blue Sapphire", slug: "capricorn" },
    { name: "Aquarius", dates: "Jan 20 – Feb 18", element: "air", symbol: "♒", stone: "Blue Sapphire", slug: "aquarius" },
    { name: "Pisces", dates: "Feb 19 – Mar 20", element: "water", symbol: "♓", stone: "Yellow Sapphire", slug: "pisces" }
];

const getElementColors = (element: string) => {
    switch (element) {
        case "fire": return { bg: "bg-red-50", text: "text-red-500", border: "border-red-100" };
        case "earth": return { bg: "bg-green-50", text: "text-green-600", border: "border-green-100" };
        case "air": return { bg: "bg-yellow-50", text: "text-amber-500", border: "border-yellow-200" };
        case "water": return { bg: "bg-blue-50", text: "text-blue-500", border: "border-blue-100" };
        default: return { bg: "bg-gray-50", text: "text-gray-500", border: "border-gray-200" };
    }
};

export function ZodiacSlider() {
    return (
        <section className="py-8 md:py-10 bg-[#FFF8F0] px-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 opacity-5 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#8B5CF6] text-white rounded-full text-xs font-bold tracking-wider mb-4 shadow-sm shadow-[#8B5CF6]/20">
                        <span role="img" aria-label="crystal ball">🔮</span>
                        SHOP BY RASHI
                    </div>
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#1A1A1A]">
                        Your Astrological Remedies
                    </h2>
                </div>

                <div className="flex overflow-x-auto gap-4 md:grid md:grid-cols-4 lg:grid-cols-6 md:gap-4 pb-6 no-scrollbar snap-x snap-mandatory px-1 py-2">
                    {RASHI_DATA.map((rashi) => {
                        const colors = getElementColors(rashi.element);

                        return (
                            <div
                                key={rashi.slug}
                                className={`snap-start shrink-0 w-[150px] md:w-auto flex flex-col items-center bg-white border ${colors.border} rounded-2xl p-4 shadow-sm hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-1`}
                            >
                                {/* Zodiac Symbol */}
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-4xl mb-3 ${colors.bg} ${colors.text} shadow-inner`}>
                                    {rashi.symbol}
                                </div>

                                <h3 className="font-bold text-lg text-[#1A1A1A] mb-0.5">{rashi.name}</h3>
                                <p className="text-[11px] font-medium text-[#888888] mb-4">{rashi.dates}</p>

                                <div className="w-full h-px bg-gray-100 mb-3 relative">
                                    <div className="absolute left-1/2 -top-1.5 -translate-x-1/2 bg-white px-2">
                                        <Sparkles size={12} className="text-[#FF8C00]" />
                                    </div>
                                </div>

                                <span className="text-[10px] font-bold text-[#00CEC9] uppercase tracking-wider mb-1">Lucky Stone</span>
                                <span className="text-sm font-bold text-[#FF8C00] text-center mb-4 line-clamp-1">{rashi.stone}</span>

                                <Link
                                    href={`/shop?zodiac=${rashi.slug}`}
                                    className="w-full mt-auto text-center py-2 px-4 border-2 border-[#FF8C00] text-[#FF8C00] font-bold text-sm rounded-xl hover:bg-[#FF8C00] hover:text-white transition-colors"
                                >
                                    Shop Now
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
