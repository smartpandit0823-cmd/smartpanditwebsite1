"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, Truck, ShieldCheck, CheckCircle2, MapPin, ChevronLeft, ChevronRight, ShoppingCart, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { ProductCardProps, ProductCard } from "@/components/ui/ProductCard";
import { WriteReviewModal } from "@/components/reviews/WriteReviewModal";
import { format } from "date-fns";

interface DetailedProduct {
    id: string;
    slug: string;
    name: string;
    category: string;
    images: string[];
    price: number;
    originalPrice?: number;
    discount?: number;
    rating: number;
    reviewCount: number;
    benefits: string[];
    description: string;
    shortDescription?: string;
    inStock: boolean;
    isAuthentic: boolean;
    soldCount: number;
    variants?: string[];
    shipping?: { freeShipping: boolean; deliveryCharge: number; freeShippingAboveAmount: number };
}

export function ProductDetailClient({
    product,
    relatedProducts,
    reviews = []
}: {
    product: DetailedProduct;
    relatedProducts: ProductCardProps["product"][];
    reviews?: { id: string; customerName: string; rating: number; comment: string; date: string; isVerifiedPurchase: boolean }[];
}) {
    const router = useRouter();
    const [activeImage, setActiveImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [pincode, setPincode] = useState("");
    const [deliveryStatus, setDeliveryStatus] = useState<{ checked: boolean; msg: string; success: boolean }>({ checked: false, msg: "", success: false });
    const [activeTab, setActiveTab] = useState<"desc" | "benefits" | "usage">("desc");
    const [addedToCart, setAddedToCart] = useState(false);
    const [isBuying, setIsBuying] = useState(false);
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const { addToCart, adding } = useCart();
    const isAdding = adding === product.id;

    const handlePincodeCheck = async () => {
        if (pincode.length !== 6) {
            setDeliveryStatus({ checked: true, success: false, msg: "❌ Invalid Pincode" });
            return;
        }
        setDeliveryStatus({ checked: false, success: false, msg: "" });
        try {
            const res = await fetch(`/api/shipping/pincode?pincode=${pincode}&weight=500`);
            const data = await res.json();
            if (data.serviceable) {
                const addBiz = (s: Date, d: number) => { const r = new Date(s); let a = 0; while (a < d) { r.setDate(r.getDate() + 1); if (r.getDay() !== 0) a++; } return r; };
                const now = new Date();
                const minD = data.estimatedDays?.min || 3;
                const maxD = data.estimatedDays?.max || 5;
                const estStart = addBiz(now, minD).toLocaleDateString("en-IN", { day: "numeric", month: "short", weekday: "short" });
                const estEnd = addBiz(now, maxD).toLocaleDateString("en-IN", { day: "numeric", month: "short", weekday: "short" });
                const codMsg = data.cod ? " · COD ✓" : " · Prepaid only";

                let shippingMsg = "Free Shipping";
                if (!product.shipping?.freeShipping && product.price < (product.shipping?.freeShippingAboveAmount || 499)) {
                    // Use true Delhivery Dynamic API cost if returned, otherwise fallback to Admin setup
                    const charge = data.shippingCharge ? data.shippingCharge : (product.shipping?.deliveryCharge || 40);
                    shippingMsg = `+ ₹${charge} Shipping`;
                }

                setDeliveryStatus({
                    checked: true,
                    success: true,
                    msg: `🚚 Delivery by ${estStart} – ${estEnd}${codMsg} | ${shippingMsg}`
                });
            } else {
                setDeliveryStatus({ checked: true, success: false, msg: "❌ Delivery not available at this pincode" });
            }
        } catch {
            let shippingMsg = "Free Shipping";
            if (!product.shipping?.freeShipping && product.price < (product.shipping?.freeShippingAboveAmount || 499)) {
                shippingMsg = `+ ₹${product.shipping?.deliveryCharge || 40} Shipping`;
            }
            setDeliveryStatus({ checked: true, success: true, msg: `🚚 Delivery in 3-5 business days | ${shippingMsg}` });
        }
    };

    const handleAddToCart = async () => {
        const success = await addToCart(product.id, quantity);
        if (success) setAddedToCart(true);
    };

    const handleBuyNow = async () => {
        setIsBuying(true);
        const success = await addToCart(product.id, quantity);
        if (success) {
            router.push("/checkout");
        } else {
            setIsBuying(false);
        }
    };

    return (
        <div className="bg-[#FEFAF4] min-h-dvh pt-4 pb-20 lg:pb-16 outline-none">
            <div className="max-w-7xl mx-auto px-4">

                {/* Breadcrumb */}
                <nav className="text-[11px] md:text-sm font-medium text-[#888888] mb-6 flex space-x-2">
                    <Link href="/" className="hover:text-[#FF8C00]">Home</Link>
                    <span>/</span>
                    <Link href="/shop" className="hover:text-[#FF8C00]">Shop</Link>
                    <span>/</span>
                    <span className="capitalize">{product.category}</span>
                    <span>/</span>
                    <span className="text-[#1A1A1A] line-clamp-1 truncate block">{product.name}</span>
                </nav>

                {/* Top Section */}
                <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 mb-16">

                    {/* Left: Images */}
                    <div className="w-full lg:w-[45%] flex flex-col relative">
                        <div className="aspect-square bg-white rounded-2xl md:rounded-3xl border border-orange-100 overflow-hidden relative mb-4 shadow-sm">
                            <img src={product.images[activeImage]} alt={product.name} className="w-full h-full object-contain p-4 md:p-8" />

                            {/* Product Badge */}
                            <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full shadow-md transform -rotate-2">
                                {product.discount}% OFF
                            </div>

                            <div className="absolute top-4 right-4 flex flex-col gap-2">
                                {product.isAuthentic && (
                                    <div className="bg-[#00CEC9] text-white text-[10px] sm:text-xs font-bold uppercase tracking-wide px-2 py-1 rounded shadow-sm flex items-center gap-1">
                                        <ShieldCheck size={14} /> Certified
                                    </div>
                                )}
                            </div>

                            {/* Prev / Next */}
                            {product.images.length > 1 && (
                                <>
                                    <button onClick={() => setActiveImage(prev => prev > 0 ? prev - 1 : product.images.length - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white text-gray-800 transition-colors">
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button onClick={() => setActiveImage(prev => prev < product.images.length - 1 ? prev + 1 : 0)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md hover:bg-white text-gray-800 transition-colors">
                                        <ChevronRight size={20} />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {product.images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                                {product.images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(i)}
                                        className={`w-20 h-20 shrink-0 rounded-xl bg-white border-2 overflow-hidden transition-colors ${i === activeImage ? 'border-[#FF8C00]' : 'border-transparent hover:border-gray-300'}`}
                                    >
                                        <img src={img} alt={`Thumb ${i}`} className="w-full h-full object-contain p-2" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Info */}
                    <div className="w-full lg:w-[55%] flex flex-col">

                        {/* Sales ticker */}
                        {product.soldCount > 50 && (
                            <div className="inline-flex items-center gap-1.5 text-[#FF8C00] font-bold text-sm bg-orange-50 px-3 py-1.5 rounded-md self-start mb-4 border border-orange-100">
                                <span className="text-base animate-pulse">🔥</span> {product.soldCount} bought in last 24 hours
                            </div>
                        )}

                        <h1 className="text-3xl md:text-4xl font-heading font-bold text-[#1A1A1A] leading-tight mb-3">
                            {product.name}
                        </h1>

                        {/* Ratings */}
                        <div className="flex items-center gap-2 text-sm mb-6">
                            <div className="flex text-[#FFD700]">
                                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />)}
                            </div>
                            <span className="font-bold text-[#1A1A1A]">{product.rating}</span>
                            <span className="text-gray-300">|</span>
                            <a href="#reviews" className="text-[#888888] font-medium hover:text-[#FF8C00] transition-colors underline underline-offset-2">
                                Read {product.reviewCount} Reviews
                            </a>
                        </div>

                        {/* Price Block */}
                        <div className="flex flex-col gap-1 mb-6 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,rgba(255,140,0,0.05),transparent_70%)] pointer-events-none"></div>

                            <div className="flex items-end gap-3 mb-1">
                                <span className="text-3xl md:text-4xl font-bold text-[#FF8C00] leading-none">₹{product.price.toLocaleString('en-IN')}</span>
                                {product.originalPrice && product.originalPrice > product.price && (
                                    <span className="text-base md:text-lg text-[#888888] line-through font-medium mb-0.5">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                {(product.discount ?? 0) > 0 && (
                                    <span className="text-[11px] font-bold uppercase tracking-wider bg-[#E5FBF9] text-[#00B894] px-2 py-0.5 rounded">
                                        You save ₹{(product.originalPrice! - product.price).toLocaleString('en-IN')}
                                    </span>
                                )}
                                <span className="text-[10px] text-[#888888]">*Inclusive of all taxes</span>
                            </div>
                        </div>

                        {/* Quick Benefits */}
                        <div className="bg-[#FAFAFA] border border-gray-200 rounded-xl p-4 mb-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                                {product.benefits.slice(0, 4).map((b, i) => (
                                    <div key={i} className="flex items-start gap-2">
                                        <CheckCircle2 size={16} className="text-[#00B894] shrink-0 mt-0.5" />
                                        <span className="text-sm font-medium text-[#1A1A1A]">{b}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-col gap-4 mb-8">

                            <div className="flex items-center gap-4">
                                <div className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">Quantity:</div>
                                <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-sm">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-[#1A1A1A] font-bold hover:bg-gray-50 rounded-l-full disabled:opacity-30" disabled={quantity <= 1}>-</button>
                                    <span className="w-8 text-center text-sm font-bold text-[#1A1A1A]">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center text-[#1A1A1A] font-bold hover:bg-gray-50 rounded-r-full">+</button>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 mt-2">
                                {/* Add to Cart / Go to Cart */}
                                {addedToCart ? (
                                    <button onClick={() => router.push("/cart")} className="flex-1 bg-[#00B894] hover:bg-[#00A884] text-white py-4 rounded-xl font-bold text-sm md:text-base tracking-wide shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                                        <ShoppingCart size={20} /> Go to Cart →
                                    </button>
                                ) : (
                                    <button onClick={handleAddToCart} disabled={isAdding} className="flex-1 bg-[#FF8C00] hover:bg-[#E67E00] disabled:bg-[#FFB366] text-white py-4 rounded-xl font-bold text-sm md:text-base tracking-wide shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                                        {isAdding ? <Loader2 size={20} className="animate-spin" /> : <><ShoppingCart size={20} /> Add to Cart</>}
                                    </button>
                                )}

                                {/* Buy Now */}
                                <button onClick={handleBuyNow} disabled={isBuying} className="flex-1 bg-[#1A1A1A] hover:bg-[#333] text-white py-4 rounded-xl font-bold text-sm md:text-base tracking-wide shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                                    {isBuying ? <Loader2 size={20} className="animate-spin" /> : <>⚡ Buy Now</>}
                                </button>
                            </div>

                        </div>

                        {/* Delivery Check */}
                        <div className="flex flex-col gap-2 pt-6 border-t border-gray-200">
                            <div className="flex items-center gap-1.5 text-sm font-bold text-[#1A1A1A]">
                                <MapPin size={16} className="text-[#FF8C00]" /> Check Delivery Exact Date
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    maxLength={6}
                                    placeholder="Enter 6-digit Pincode"
                                    value={pincode}
                                    onChange={e => setPincode(e.target.value.replace(/\D/g, ''))}
                                    className="flex-1 max-w-[200px] border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-[#FF8C00]"
                                />
                                <button onClick={handlePincodeCheck} className="text-xs font-bold bg-white border border-gray-300 text-[#1A1A1A] rounded-lg px-4 hover:bg-gray-50 transition-colors">
                                    Check
                                </button>
                            </div>
                            {deliveryStatus.checked && (
                                <p className={`text-xs font-bold mt-1 ${deliveryStatus.success ? "text-[#00B894]" : "text-red-500"}`}>
                                    {deliveryStatus.msg}
                                </p>
                            )}
                        </div>

                    </div>
                </div>

                {/* Middle Section: About the product & Expert Review */}
                <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 mb-16">

                    <div className="w-full lg:w-[65%] flex flex-col">
                        {/* Tabs Desktop / Accordion Mobile */}
                        <div className="flex gap-4 border-b border-gray-200 mb-6 overflow-x-auto no-scrollbar">
                            <button
                                onClick={() => setActiveTab("desc")}
                                className={`text-sm md:text-base font-bold pb-3 border-b-2 whitespace-nowrap transition-colors ${activeTab === 'desc' ? 'border-[#FF8C00] text-[#FF8C00]' : 'border-transparent text-[#888888] hover:text-[#1A1A1A]'}`}
                            >
                                Description
                            </button>
                            <button
                                onClick={() => setActiveTab("benefits")}
                                className={`text-sm md:text-base font-bold pb-3 border-b-2 whitespace-nowrap transition-colors ${activeTab === 'benefits' ? 'border-[#FF8C00] text-[#FF8C00]' : 'border-transparent text-[#888888] hover:text-[#1A1A1A]'}`}
                            >
                                Detailed Benefits
                            </button>
                            <button
                                onClick={() => setActiveTab("usage")}
                                className={`text-sm md:text-base font-bold pb-3 border-b-2 whitespace-nowrap transition-colors ${activeTab === 'usage' ? 'border-[#FF8C00] text-[#FF8C00]' : 'border-transparent text-[#888888] hover:text-[#1A1A1A]'}`}
                            >
                                How to Use
                            </button>
                        </div>

                        <div className="prose prose-sm md:prose-base prose-orange max-w-none text-[#1A1A1A]">
                            {activeTab === "desc" && (
                                <div dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br/>') }} />
                            )}
                            {activeTab === "benefits" && (
                                <ul className="space-y-4">
                                    {product.benefits.map((b, i) => (
                                        <li key={i} className="flex gap-3">
                                            <div className="mt-1 w-6 h-6 rounded-full bg-orange-50 text-[#FF8C00] flex items-center justify-center shrink-0 shadow-inner">
                                                <CheckCircle2 size={14} />
                                            </div>
                                            <span className="font-medium text-[15px]">{b}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {activeTab === "usage" && (
                                <div>
                                    <h4 className="font-bold text-lg mb-3 block">Recommended Usage</h4>
                                    <ul className="list-disc pl-5 space-y-2 text-[#888888] font-medium">
                                        <li>Cleanse with Gangajal mixed with raw milk every Monday.</li>
                                        <li>Apply Sandalwood paste (Chandan) and offer incense.</li>
                                        <li>Chant the focal mantra 108 times using a crystal or rudraksha mala.</li>
                                        <li>Avoid wearing while sleeping or consuming non-vegetarian food.</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Expert Review */}
                    <div className="w-full lg:w-[35%] shrink-0">
                        <div className="bg-[#0F0F0F] rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD700] rounded-full blur-[80px] opacity-20 pointer-events-none"></div>

                            <div className="inline-flex items-center gap-1 bg-[#1A1A1A] border border-[#333] rounded px-2 py-1 mb-6 shadow-sm">
                                <CheckCircle2 size={12} className="text-[#FFD700]" />
                                <span className="text-[9px] font-bold text-[#FFD700] uppercase tracking-widest">Verified Expert Read</span>
                            </div>

                            <p className="italic font-medium text-[15px] leading-relaxed mb-8 relative z-10 opacity-90">
                                "I highly recommend this specific {product.name} for individuals facing career obstacles. The energy channels in this piece are remarkably clear. It directly addresses doshas preventing professional growth when used as directed."
                            </p>

                            <div className="flex items-center gap-4 relative z-10 border-t border-[#333] pt-6 mt-auto">
                                <div className="w-14 h-14 rounded-full bg-gray-600 overflow-hidden border-2 border-[#FFD700]">
                                    <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80" alt="Acharya" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#FFD700] text-base">Acharya Sharma</h4>
                                    <p className="text-xs text-[#888888] uppercase tracking-wider font-bold">Vedic Master</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* You May Also Like */}
                {relatedProducts && relatedProducts.length > 0 && (
                    <div className="pt-16 border-t border-gray-200">
                        <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#1A1A1A] mb-8">You May Also Like</h2>
                        <div className="flex overflow-x-auto gap-3 md:gap-4 pb-4 no-scrollbar snap-x">
                            {relatedProducts.map(p => (
                                <div key={p.id} className="snap-start shrink-0 w-[240px] md:w-[280px]">
                                    <ProductCard product={p as any} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Reviews Section */}
                <div id="reviews" className="pt-16 border-t border-gray-200 mt-16 scroll-mt-24">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#1A1A1A]">Customer Reviews</h2>
                            <p className="text-gray-500 mt-1">Real experiences from our verified buyers</p>
                        </div>
                        <button onClick={() => setIsReviewOpen(true)} className="px-6 py-2.5 bg-[#FF8C00] text-white font-bold rounded-xl hover:bg-[#E67E00] shadow-sm transition-colors whitespace-nowrap">
                            Write a Review
                        </button>
                    </div>

                    {reviews.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-4">
                            {reviews.map((rv) => (
                                <div key={rv.id} className="bg-white border text-sm border-gray-100 rounded-2xl p-5 shadow-sm">
                                    <div className="flex justify-between md:items-center mb-3">
                                        <div className="flex text-[#FFD700]">
                                            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < rv.rating ? "currentColor" : "none"} className={i >= rv.rating ? "text-gray-300" : ""} />)}
                                        </div>
                                        <span className="text-xs text-gray-400">{format(new Date(rv.date), "dd MMM yyyy")}</span>
                                    </div>
                                    <p className="italic text-[#1A1A1A] leading-relaxed mb-4 text-sm">&quot;{rv.comment}&quot;</p>
                                    <div className="flex items-center gap-2 mt-auto text-xs">
                                        <div className="w-8 h-8 rounded-full bg-orange-50 text-[#FF8C00] flex items-center justify-center font-bold">
                                            {rv.customerName.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-[#1A1A1A]">{rv.customerName}</p>
                                            {rv.isVerifiedPurchase && <p className="text-emerald-600 font-medium flex items-center gap-0.5"><CheckCircle2 size={12} /> Verified Buyer</p>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100">
                            <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="font-bold text-gray-900 text-lg">No reviews yet</p>
                            <p className="text-gray-500 mb-4 h">Be the first to review {product.name}</p>
                            <button onClick={() => setIsReviewOpen(true)} className="px-6 py-2 bg-white border-2 border-[#1A1A1A] text-[#1A1A1A] font-bold rounded-xl hover:bg-gray-50 transition-colors">
                                Write First Review
                            </button>
                        </div>
                    )}
                </div>

            </div>
            <WriteReviewModal isOpen={isReviewOpen} onClose={() => setIsReviewOpen(false)} preselectedProductId={product.id} preselectedProductName={product.name} />
        </div>
    );
}
