import { Instagram } from "lucide-react";

// Replace with your actual Instagram handle
const INSTAGRAM_HANDLE = "sanatan_setuu";
const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM_HANDLE}`;

// Placeholder grid items (link to your Instagram directly)
const GRID_ITEMS = [
    { idx: 0, label: "🪔 Puja Samagri" },
    { idx: 1, label: "📿 Rudraksha" },
    { idx: 2, label: "💎 Gemstones" },
    { idx: 3, label: "🛕 Sacred Rituals" },
    { idx: 4, label: "🌸 Spiritual Living" },
];

const GRADIENT_COLORS = [
    "from-orange-400 to-amber-300",
    "from-red-400 to-orange-300",
    "from-purple-400 to-indigo-300",
    "from-emerald-400 to-teal-300",
    "from-pink-400 to-rose-300",
];

export function InstagramCommunity() {
    return (
        <section className="py-8 md:py-10 bg-white px-4 border-t border-orange-50">
            <div className="max-w-7xl mx-auto flex flex-col items-center">

                <div className="text-center mb-6 group">
                    <a
                        href={INSTAGRAM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888] text-white shadow-lg mb-4 hover:scale-110 hover:shadow-2xl transition-all cursor-pointer"
                    >
                        <Instagram size={30} />
                    </a>
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#1A1A1A] leading-tight mb-2">
                        Join Our Spiritual Community
                    </h2>
                    <a
                        href={INSTAGRAM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#FF8C00] text-sm md:text-base font-bold hover:underline"
                    >
                        Follow @{INSTAGRAM_HANDLE} on Instagram
                    </a>
                    <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
                        Get daily spiritual tips, product updates, puja guides & community love. 10,000+ devotees & growing!
                    </p>
                </div>

                {/* Instagram Grid — Tap to visit Instagram */}
                <div className="w-full flex overflow-x-auto gap-3 pb-4 no-scrollbar snap-x snap-mandatory lg:grid lg:grid-cols-5 lg:gap-4 px-1 -mx-1">
                    {GRID_ITEMS.map((item, idx) => (
                        <a
                            key={idx}
                            href={INSTAGRAM_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`snap-start shrink-0 relative flex items-center justify-center w-[180px] lg:w-full aspect-square overflow-hidden group rounded-2xl bg-gradient-to-br ${GRADIENT_COLORS[idx]} shadow-md hover:shadow-xl transition-all hover:-translate-y-1`}
                        >
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
                                <span className="text-4xl">{item.label.split(" ")[0]}</span>
                                <p className="text-white font-bold text-sm drop-shadow-sm mt-1">
                                    {item.label.split(" ").slice(1).join(" ")}
                                </p>
                            </div>
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                                    <Instagram size={22} className="text-white drop-shadow-md" />
                                </div>
                            </div>
                        </a>
                    ))}
                </div>

                <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#f09433] to-[#bc1888] text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 text-sm"
                >
                    <Instagram size={18} />
                    Follow on Instagram
                </a>
            </div>
        </section>
    );
}
