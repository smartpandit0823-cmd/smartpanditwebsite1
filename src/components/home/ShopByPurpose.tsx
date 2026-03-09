import Link from "next/link";
import { Coins, Heart, Shield, Leaf, Rocket, Sparkles } from "lucide-react";

const PURPOSES = [
    {
        title: "Wealth & Prosperity",
        subtitle: "Tiger Eye, Pyrite",
        bg: "bg-[#FFF8E7]",
        border: "border-b-[#FFD700]",
        iconBg: "bg-[#FFD700]/20",
        iconColor: "text-[#D4AF37]",
        icon: Coins,
        slug: "wealth",
    },
    {
        title: "Love & Relations",
        subtitle: "Rose Quartz",
        bg: "bg-[#FFF0F3]",
        border: "border-b-[#FF6B8A]",
        iconBg: "bg-[#FF6B8A]/20",
        iconColor: "text-[#FF6B8A]",
        icon: Heart,
        slug: "love",
    },
    {
        title: "Protection",
        subtitle: "Black Tourmaline",
        bg: "bg-[#EEF2FF]",
        border: "border-b-[#6366F1]",
        iconBg: "bg-[#6366F1]/20",
        iconColor: "text-[#6366F1]",
        icon: Shield,
        slug: "protection",
    },
    {
        title: "Health & Healing",
        subtitle: "Amethyst, 7 Chakra",
        bg: "bg-[#ECFDF5]",
        border: "border-b-[#10B981]",
        iconBg: "bg-[#10B981]/20",
        iconColor: "text-[#10B981]",
        icon: Leaf,
        slug: "health",
    },
    {
        title: "Career & Success",
        subtitle: "11 Mukhi, Blue Sapphire",
        bg: "bg-[#FFF7ED]",
        border: "border-b-[#F97316]",
        iconBg: "bg-[#F97316]/20",
        iconColor: "text-[#F97316]",
        icon: Rocket,
        slug: "career",
    },
    {
        title: "Rashi Remedies",
        subtitle: "Find your lucky stone",
        bg: "bg-[#F5F3FF]",
        border: "border-b-[#8B5CF6]",
        iconBg: "bg-[#8B5CF6]/20",
        iconColor: "text-[#8B5CF6]",
        icon: Sparkles,
        slug: "rashi",
    },
];

export function ShopByPurpose() {
    return (
        <section className="py-6 md:py-8 bg-white px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-heading font-bold text-[#1A1A1A]">Shop By Purpose</h2>
                    <span className="text-sm font-medium text-[#888888] md:hidden">Swipe →</span>
                </div>

                <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar snap-x snap-mandatory">
                    {PURPOSES.map((purpose) => {
                        const Icon = purpose.icon;
                        return (
                            <Link
                                key={purpose.slug}
                                href={`/shop?purpose=${purpose.slug}`}
                                className={`flex-none w-[140px] h-[170px] rounded-xl snap-start flex flex-col items-center justify-center p-4 text-center border-b-4 hover:-translate-y-1 transition-transform ${purpose.bg} ${purpose.border}`}
                            >
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${purpose.iconBg} ${purpose.iconColor}`}
                                >
                                    <Icon size={24} />
                                </div>
                                <h3 className="text-sm font-bold text-[#1A1A1A] leading-tight mb-1">
                                    {purpose.title}
                                </h3>
                                <p className="text-xs text-[#888888] line-clamp-2">{purpose.subtitle}</p>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
