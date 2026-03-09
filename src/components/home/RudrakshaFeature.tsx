import Link from "next/link";
import { CheckCircle2, Shield, Zap, Truck, Plus } from "lucide-react";
import { ProductCardProps } from "../ui/ProductCard";

export function RudrakshaFeature({ products }: { products?: ProductCardProps['product'][] }) {
    const displayProducts = products && products.length > 0 ? products : [
        { name: "1 Mukhi", price: 2499, image: "https://images.unsplash.com/photo-1601314167099-24b553556066?auto=format&fit=crop&q=80", slug: "1-mukhi" },
        { name: "5 Mukhi", price: 499, image: "https://images.unsplash.com/photo-1601314167099-24b553556066?auto=format&fit=crop&q=80", slug: "5-mukhi" },
        { name: "11 Mukhi", price: 3999, image: "https://images.unsplash.com/photo-1601314167099-24b553556066?auto=format&fit=crop&q=80", slug: "11-mukhi" },
        { name: "Gauri Shankar", price: 5499, image: "https://images.unsplash.com/photo-1601314167099-24b553556066?auto=format&fit=crop&q=80", slug: "gauri-shankar" }
    ];

    return (
        <section className="py-8 md:py-10 px-4 max-w-7xl mx-auto">
            <div className="bg-[#FEFAF4] border border-orange-100 rounded-2xl md:rounded-[32px] overflow-hidden shadow-[0_8px_32px_rgba(255,140,0,0.06)] flex flex-col md:flex-row relative">

                {/* Abstract Background pattern */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_top_right,rgba(255,215,0,0.1),transparent_50%)] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-1/2 h-full bg-[radial-gradient(circle_at_bottom_left,rgba(255,140,0,0.05),transparent_50%)] pointer-events-none"></div>

                {/* Left Side: Content (60%) */}
                <div className="p-8 md:p-12 md:w-[60%] flex flex-col justify-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-100 text-[#FF8C00] rounded-full text-xs font-bold uppercase tracking-wider mb-6 self-start">
                        <span className="w-2 h-2 rounded-full bg-[#FF8C00] animate-pulse"></span>
                        PREMIUM COLLECTION
                    </div>

                    <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#1A1A1A] leading-tight mb-4">
                        Our Most Trusted <br />
                        <span className="bg-gradient-to-r from-[#FF8C00] to-[#FFD700] text-transparent bg-clip-text">Rudraksha Beads</span>
                    </h2>

                    <p className="text-lg text-[#888888] mb-8 font-medium max-w-md">
                        Experience the divine power of authentic Nepal Rudraksha, hand-selected for spiritual seekers.
                    </p>

                    <div className="flex flex-col gap-4 mb-8">
                        <div className="flex items-start gap-3">
                            <Shield className="text-[#00B894] shrink-0 mt-0.5" size={20} />
                            <div>
                                <h4 className="font-bold text-[#1A1A1A] text-sm md:text-base">Lab Certified Authenticity</h4>
                                <p className="text-xs text-[#888888]">X-Ray & ISO lab verified with every bead</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="text-[#00B894] shrink-0 mt-0.5" size={20} />
                            <div>
                                <h4 className="font-bold text-[#1A1A1A] text-sm md:text-base">100% Original Nepal Origin</h4>
                                <p className="text-xs text-[#888888]">Sourced directly from Himalayas</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Zap className="text-[#FF8C00] shrink-0 mt-0.5" size={20} />
                            <div>
                                <h4 className="font-bold text-[#1A1A1A] text-sm md:text-base">Energized</h4>
                                <p className="text-xs text-[#888888]">Praan Pratishtha performed by expert priests</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Truck className="text-[#FF8C00] shrink-0 mt-0.5" size={20} />
                            <div>
                                <h4 className="font-bold text-[#1A1A1A] text-sm md:text-base">Free Insured Shipping</h4>
                                <p className="text-xs text-[#888888]">Safe packaging guaranteed</p>
                            </div>
                        </div>
                    </div>

                    <Link
                        href="/shop?category=rudraksha"
                        className="self-start bg-[#FF8C00] hover:bg-[#E67E00] px-8 py-4 rounded-full text-white font-bold text-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                    >
                        Explore Rudraksha Collection →
                    </Link>
                </div>

                {/* Right Side: Imagery (40%) */}
                <div className="relative md:w-[40%] bg-gradient-to-br from-orange-50 to-[#FFF8E7] p-8 md:p-12 flex flex-col justify-center items-center">

                    <div className="relative w-full max-w-[320px] aspect-square mb-8">
                        <img
                            src="https://images.unsplash.com/photo-1601314167099-24b553556066?auto=format&fit=crop&q=80"
                            alt="Premium Rudraksha"
                            className="w-full h-full object-contain filter drop-shadow-2xl animate-float"
                        />

                        {/* Floating Chips */}
                        <div className="absolute top-4 -left-4 md:-left-8 bg-white shadow-lg rounded-xl px-4 py-2 flex items-center gap-2 transform -rotate-3 border border-orange-50">
                            <span className="text-sm font-bold text-[#1A1A1A]">Nepal Seed 🏔️</span>
                        </div>

                        <div className="absolute bottom-8 -right-4 md:-right-8 bg-[#00CEC9] shadow-lg rounded-xl px-4 py-2 flex items-center gap-2 transform rotate-6 border border-[#00B894]">
                            <span className="text-sm font-bold text-white">Lab Tested ✓</span>
                        </div>
                    </div>

                    {/* Small Rudraksha Type Cards */}
                    <div className="w-full">
                        <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar snap-x px-1">
                            {displayProducts.map((type, idx) => (
                                <Link href={`/product/${type.slug}`} key={idx} className="snap-start shrink-0 w-32 bg-white rounded-xl p-2 border border-orange-100 shadow-sm hover:border-[#FF8C00] transition-colors cursor-pointer group block">
                                    <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-2 relative">
                                        <img src={'image' in type ? type.image : (type as any).img} alt={type.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                    </div>
                                    <h5 className="font-bold text-[#1A1A1A] text-[13px] line-clamp-1">{type.name}</h5>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-[#FF8C00] font-bold text-[13px]">
                                            {'sellingPrice' in type ? `₹${type.sellingPrice}` : `₹${type.price}`}
                                        </span>
                                        <button className="bg-orange-50 hover:bg-[#FF8C00] hover:text-white text-[#FF8C00] p-1 rounded transition-colors">
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
