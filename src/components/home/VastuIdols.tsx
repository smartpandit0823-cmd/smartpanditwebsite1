import Link from "next/link";
import { Home } from "lucide-react";
import { ProductCardProps } from "../ui/ProductCard";

export function VastuIdols({ products }: { products?: ProductCardProps['product'][] }) {
    const defaultIdols = [
        {
            title: "Premium Pyrite Tortoise",
            subtitle: "For Wealth & Business Growth. Attract abundance and clear vastu dosha effortlessly.",
            image: "/images/home_static/premium_pyrite_tortoise.png",
            slug: "premium-pyrite-tortoise",
            tag: "Vastu Corrector"
        },
        {
            title: "7 Horses Frame",
            subtitle: "For Accelerated Success",
            image: "/images/home_static/seven_horses_vastu.png",
            slug: "7-horses-frame",
        },
        {
            title: "Ganesh Idol",
            subtitle: "Remove All Obstacles",
            image: "/images/home_static/ganesh_idol_brass.png",
            slug: "ganesh-idol",
        },
        {
            title: "Hanuman Idol",
            subtitle: "For Courage & Protection",
            image: "/images/home_static/hanuman_idol_brass.png",
            slug: "hanuman-idol",
        }
    ];

    const displayProducts = products && products.length > 0 ? products : defaultIdols;

    const mainItem = displayProducts[0];
    const item2 = displayProducts[1] || defaultIdols[1];
    const item3 = displayProducts[2] || defaultIdols[2];
    const item4 = displayProducts[3] || defaultIdols[3];

    return (
        <section className="py-8 md:py-10 px-4 bg-[#FEFAF4] border-t border-orange-50">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-5">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1A1A1A] text-white rounded-full text-[11px] font-bold uppercase tracking-widest mb-3 shadow-md">
                            <Home size={12} />
                            HOME HARMONY
                        </div>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#1A1A1A] leading-tight">
                            Vastu & Idols
                        </h2>
                    </div>

                    <Link
                        href="/shop?category=vastu"
                        className="text-sm font-bold text-[#FF8C00] hover:text-[#E67E00] flex items-center mt-4 md:mt-0 transition-group group"
                    >
                        View All <span className="ml-1 text-lg group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

                    {/* Row 1: Large full-width card (spans all columns on desktop) */}
                    {mainItem && (
                        <div className="lg:col-span-3 min-h-[280px] md:min-h-[400px] relative rounded-3xl overflow-hidden group border border-orange-100 shadow-[0_4px_24px_rgba(255,140,0,0.06)] hover:shadow-[0_8px_32px_rgba(255,140,0,0.12)] transition-shadow">
                            <img
                                src={'image' in mainItem ? mainItem.image : (mainItem as any).image}
                                alt={'name' in mainItem ? mainItem.name : (mainItem as any).title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                            <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full md:w-2/3">
                                <span className="inline-block px-3 py-1 bg-[#FFD700] text-[#1A1A1A] text-[10px] font-bold uppercase tracking-wider rounded-md mb-3">
                                    {(mainItem as any).tag || "Vastu Corrector"}
                                </span>
                                <h3 className="text-2xl md:text-4xl font-bold text-[#FFD700] mb-2 font-heading leading-tight drop-shadow-md">
                                    {'name' in mainItem ? mainItem.name : (mainItem as any).title}
                                </h3>
                                <p className="text-white/90 text-sm md:text-base font-medium mb-5 max-w-md drop-shadow">
                                    {/* (mainItem as any).subtitle handles both mocked and real products (if we added subtitle to ProductCardProps) */}
                                    {'subtitle' in mainItem ? (mainItem as any).subtitle : "Attract abundance and clear vastu dosha effortlessly."}
                                </p>
                                <Link href={`/product/${mainItem.slug}`} className="px-6 py-3 bg-[#FF8C00] text-white font-bold rounded-xl text-sm transition-transform hover:-translate-y-1 active:translate-y-0 shadow-md">
                                    Shop Now
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Row 2: 2 equal half-width cards */}
                    {item2 && (
                        <div className="md:col-span-1 lg:col-span-1 min-h-[220px] md:min-h-[280px] relative rounded-3xl overflow-hidden group border border-orange-100 shadow-sm hover:shadow-md transition-shadow">
                            <img
                                src={'image' in item2 ? item2.image : (item2 as any).image}
                                alt={'name' in item2 ? item2.name : (item2 as any).title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-6 w-full">
                                <h3 className="text-xl font-bold text-[#FFD700] mb-1 font-heading drop-shadow">
                                    {'name' in item2 ? item2.name : (item2 as any).title}
                                </h3>
                                <p className="text-white/80 text-xs md:text-sm font-medium mb-3">{'subtitle' in item2 ? (item2 as any).subtitle : "Powerful Vastu Product"}</p>
                                <Link href={`/product/${item2.slug}`} className="text-sm font-bold text-white uppercase tracking-wider group-hover:text-[#FFD700] transition-colors flex items-center gap-1">
                                    Explore <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                                </Link>
                            </div>
                        </div>
                    )}

                    {item3 && (
                        <div className="md:col-span-1 lg:col-span-1 min-h-[220px] md:min-h-[280px] relative rounded-3xl overflow-hidden group border border-orange-100 shadow-sm hover:shadow-md transition-shadow">
                            <img
                                src={'image' in item3 ? item3.image : (item3 as any).image}
                                alt={'name' in item3 ? item3.name : (item3 as any).title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-6 w-full">
                                <h3 className="text-xl font-bold text-[#FFD700] mb-1 font-heading drop-shadow">
                                    {'name' in item3 ? item3.name : (item3 as any).title}
                                </h3>
                                <p className="text-white/80 text-xs md:text-sm font-medium mb-3">{'subtitle' in item3 ? (item3 as any).subtitle : "Vastu Essential"}</p>
                                <Link href={`/product/${item3.slug}`} className="text-sm font-bold text-white uppercase tracking-wider group-hover:text-[#FFD700] transition-colors flex items-center gap-1">
                                    Explore <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Row 3: 1 full-width card on remaining lg col */}
                    {item4 && (
                        <div className="lg:col-span-1 md:col-span-2 min-h-[220px] md:min-h-[280px] relative rounded-3xl overflow-hidden group border border-orange-100 shadow-sm hover:shadow-md transition-shadow">
                            <img
                                src={'image' in item4 ? item4.image : (item4 as any).image}
                                alt={'name' in item4 ? item4.name : (item4 as any).title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-6 w-full">
                                <h3 className="text-xl font-bold text-[#FFD700] mb-1 font-heading drop-shadow">
                                    {'name' in item4 ? item4.name : (item4 as any).title}
                                </h3>
                                <p className="text-white/80 text-xs md:text-sm font-medium mb-3">{'subtitle' in item4 ? (item4 as any).subtitle : "Vastu Defenses"}</p>
                                <Link href={`/product/${item4.slug}`} className="text-sm font-bold text-white uppercase tracking-wider group-hover:text-[#FFD700] transition-colors flex items-center gap-1">
                                    Explore <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                                </Link>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </section>
    );
}
