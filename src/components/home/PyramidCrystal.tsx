import Link from "next/link";
import { Sparkles, Diamond, ShieldPlus, Brain } from "lucide-react";
import { ProductCardProps } from "../ui/ProductCard";

export function PyramidCrystal({ products }: { products?: ProductCardProps['product'][] }) {
    const defaultAmplifiers = [
        {
            title: "Copper Pyramids",
            subtitle: "Vastu Correction",
            icon: <span>🔺</span>,
            image: "https://images.unsplash.com/photo-1596707328639-50c6fb0e0926?auto=format&fit=crop&q=80",
            slug: "copper-pyramids"
        },
        {
            title: "Crystal Spheres",
            subtitle: "Focus & Clarity",
            icon: <span>🔮</span>,
            image: "https://images.unsplash.com/photo-1601314167099-24b553556066?auto=format&fit=crop&q=80",
            slug: "crystal-spheres"
        },
        {
            title: "Amethyst Clusters",
            subtitle: "Stress Relief",
            icon: <span>💜</span>,
            image: "https://images.unsplash.com/photo-1611005202685-6f9202029be8?auto=format&fit=crop&q=80",
            slug: "amethyst-clusters"
        },
        {
            title: "Orgone Generators",
            subtitle: "EMF Protection",
            icon: <span>✨</span>,
            image: "https://images.unsplash.com/photo-1599643477873-10eb0cf37e6f?auto=format&fit=crop&q=80",
            slug: "orgone-generators"
        }
    ];

    const displayItems = products && products.length > 0 ? products : defaultAmplifiers;

    const item1 = displayItems[0];
    const item2 = displayItems[1] || defaultAmplifiers[1];
    const item3 = displayItems[2] || defaultAmplifiers[2];
    const item4 = displayItems[3] || defaultAmplifiers[3];
    const itemsToMap = [item1, item2, item3, item4].filter(Boolean);

    return (
        <section className="py-8 md:py-10 px-4 bg-white">
            <div className="max-w-4xl mx-auto flex flex-col items-center">

                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#8B5CF6]/10 text-[#8B5CF6] rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                        <Sparkles size={14} />
                        ENERGY AMPLIFIERS
                    </div>
                    <p className="text-[#888888] text-sm md:text-base font-medium max-w-md mx-auto">
                        Clear negativity and manifest your goals faster with our high-vibration spiritual tools.
                    </p>
                </div>

                {/* 2x2 Grid */}
                <div className="grid grid-cols-2 gap-4 w-full mb-10">
                    {itemsToMap.map((amp, idx) => (
                        <Link
                            key={idx}
                            href={`/product/${amp.slug}`}
                            className="group relative h-[150px] md:h-[180px] rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_8px_24px_rgba(139,92,246,0.12)] transition-shadow border border-purple-50 flex flex-col justify-end p-4 md:p-5"
                        >
                            <img
                                src={'image' in amp ? amp.image : (amp as any).img}
                                alt={'name' in amp ? amp.name : (amp as any).title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                            <div className="relative z-10">
                                <div className="mb-2 text-2xl filter drop-shadow">
                                    {(amp as any).icon || <span>✨</span>}
                                </div>
                                <h3 className="font-bold text-white text-sm md:text-lg leading-tight mb-0.5 drop-shadow-md">
                                    {'name' in amp ? amp.name : (amp as any).title}
                                </h3>
                                <p className="text-[11px] md:text-xs text-[#E9D5FF] font-medium drop-shadow">
                                    {'subtitle' in amp ? (amp as any).subtitle : "Energy Amplifier"}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

                <Link
                    href="/shop?category=energy-amplifiers"
                    className="border-2 border-[#1A1A1A] text-[#1A1A1A] px-8 py-3.5 rounded-full font-bold text-sm hover:bg-[#1A1A1A] hover:text-white transition-colors tracking-wide"
                >
                    Explore All Amplifiers →
                </Link>

            </div>
        </section>
    );
}
