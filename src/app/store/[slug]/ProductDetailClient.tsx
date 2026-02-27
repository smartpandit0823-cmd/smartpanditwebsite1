"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Star,
    Heart,
    ShoppingCart,
    Shield,
    Check,
    Truck,
    BadgeCheck,
    ChevronLeft,
    ChevronRight,
    Share2,
    Package,
    CreditCard,
    Play,
    Loader2,
    Minus,
    Plus,
} from "lucide-react";
import { StoreProductCard } from "@/components/store/StoreProductCard";
import { useCart } from "@/contexts/CartContext";

interface ProductDetail {
    id: string;
    slug: string;
    name: string;
    category: string;
    description: string;
    shortDescription: string;
    images: string[];
    video: string | null;
    price: number;
    originalPrice?: number;
    discount: number;
    rating: number;
    reviewCount: number;
    benefits: string[];
    howToUse: string | null;
    isAuthentic: boolean;
    inStock: boolean;
    panditRecommended: boolean;
    featured: boolean;
    shipping: {
        freeShipping: boolean;
        deliveryDays: number;
        deliveryCharge: number;
    };
}

interface RelatedProduct {
    id: string;
    slug: string;
    name: string;
    category: string;
    images: string[];
    price: number;
    originalPrice?: number;
    discount: number;
    rating: number;
    reviewCount: number;
    benefits: string[];
    description: string;
    inStock: boolean;
    isAuthentic: boolean;
    featured: boolean;
    panditRecommended?: boolean;
    astrologerRecommended?: boolean;
}

export function ProductDetailClient({
    product,
    relatedProducts,
}: {
    product: ProductDetail;
    relatedProducts: RelatedProduct[];
}) {
    const [currentImage, setCurrentImage] = useState(0);
    const [wishlisted, setWishlisted] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [touchStart, setTouchStart] = useState(0);
    const [justAdded, setJustAdded] = useState(false);
    const { addToCart, adding } = useCart();
    const router = useRouter();
    const isAdding = adding === product.id;

    const images = product.images.length > 0 ? product.images : ["/placeholder.svg"];
    const hasDiscount = product.discount > 0 && product.originalPrice;

    const nextImage = () => setCurrentImage((c) => (c + 1) % images.length);
    const prevImage = () => setCurrentImage((c) => (c - 1 + images.length) % images.length);

    const handleAddToCart = async () => {
        if (!product.inStock || isAdding) return;
        const success = await addToCart(product.id, quantity);
        if (success) {
            setJustAdded(true);
            setTimeout(() => setJustAdded(false), 2000);
        }
    };

    const handleBuyNow = async () => {
        if (!product.inStock || isAdding) return;
        const success = await addToCart(product.id, quantity);
        if (success) {
            router.push("/cart");
        }
    };

    return (
        <div className="min-h-dvh pb-24 pt-16 md:pb-12 md:pt-20">
            <div className="mx-auto max-w-7xl px-4">
                {/* Breadcrumb */}
                <nav className="mb-4 flex items-center gap-2 text-xs text-warm-500">
                    <Link href="/" className="hover:text-saffron-600">Home</Link>
                    <span>/</span>
                    <Link href="/store" className="hover:text-saffron-600">Store</Link>
                    <span>/</span>
                    <span className="text-warm-700 font-medium">{product.name}</span>
                </nav>

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* ─── LEFT: Image Gallery ─── */}
                    <section>
                        {/* Main Image */}
                        <div
                            className="relative aspect-square overflow-hidden rounded-2xl border border-gold-200/60 bg-linear-to-br from-warm-50 to-saffron-50/30"
                            onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
                            onTouchEnd={(e) => {
                                const diff = touchStart - e.changedTouches[0].clientX;
                                if (Math.abs(diff) > 50) diff > 0 ? nextImage() : prevImage();
                            }}
                        >
                            <Image
                                src={images[currentImage]}
                                alt={`${product.name} ${currentImage + 1}`}
                                fill
                                priority
                                className="object-cover transition-opacity duration-300"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />

                            {/* Badges */}
                            <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                                {hasDiscount && (
                                    <span className="rounded-lg bg-red-500 px-2.5 py-1 text-xs font-bold text-white shadow">
                                        {product.discount}% OFF
                                    </span>
                                )}
                                {product.panditRecommended && (
                                    <span className="flex items-center gap-1 rounded-lg bg-saffron-500 px-2.5 py-1 text-xs font-bold text-white shadow">
                                        🙏 Pandit Recommended
                                    </span>
                                )}
                            </div>

                            {/* Wishlist + Share */}
                            <div className="absolute right-3 top-3 flex flex-col gap-2">
                                <button
                                    onClick={() => setWishlisted(!wishlisted)}
                                    className="flex size-10 items-center justify-center rounded-full bg-white/80 shadow-md backdrop-blur-sm transition active:scale-90"
                                >
                                    <Heart
                                        size={18}
                                        className={wishlisted ? "fill-red-500 text-red-500" : "text-warm-500"}
                                    />
                                </button>
                                <button className="flex size-10 items-center justify-center rounded-full bg-white/80 shadow-md backdrop-blur-sm transition active:scale-90">
                                    <Share2 size={18} className="text-warm-500" />
                                </button>
                            </div>

                            {/* Nav arrows */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-1.5 shadow-md backdrop-blur-sm"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-1.5 shadow-md backdrop-blur-sm"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </>
                            )}

                            {/* Image counter */}
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                                {currentImage + 1} / {images.length}
                            </div>

                            {/* Authenticity badge */}
                            {product.isAuthentic && (
                                <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-green-500/90 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                                    <BadgeCheck size={12} />
                                    Certified Authentic
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Strip */}
                        {images.length > 1 && (
                            <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentImage(i)}
                                        className={`relative size-16 shrink-0 overflow-hidden rounded-xl border-2 transition ${currentImage === i
                                            ? "border-saffron-500 shadow-md"
                                            : "border-gold-200/50 opacity-60 hover:opacity-100"
                                            }`}
                                    >
                                        <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                                    </button>
                                ))}
                                {product.video && (
                                    <button className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-gold-200/50 bg-warm-100">
                                        <Play size={20} className="text-saffron-600" />
                                        <span className="absolute bottom-0.5 text-[8px] font-medium text-warm-600">
                                            Video
                                        </span>
                                    </button>
                                )}
                            </div>
                        )}
                    </section>

                    {/* ─── RIGHT: Product Info ─── */}
                    <section className="flex flex-col">
                        {/* Category */}
                        <span className="text-xs font-medium uppercase tracking-wider text-saffron-500">
                            {product.category}
                        </span>

                        {/* Name */}
                        <h1 className="mt-2 font-serif text-2xl font-bold text-warm-900 md:text-3xl">
                            {product.name}
                        </h1>

                        {/* Rating */}
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-saffron-50 px-3 py-1 text-sm">
                                <Star size={14} className="fill-amber-400 text-amber-400" />
                                <span className="font-semibold text-warm-800">{product.rating}</span>
                                <span className="text-warm-500">({product.reviewCount}+ sold)</span>
                            </span>
                            {product.isAuthentic && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                    <Shield size={12} />
                                    Authentic Product
                                </span>
                            )}
                            {product.panditRecommended && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-saffron-100 px-3 py-1 text-xs font-semibold text-saffron-700">
                                    🙏 Pandit Pick
                                </span>
                            )}
                        </div>

                        {/* Price */}
                        <div className="mt-4 flex items-end gap-3">
                            <span className="text-3xl font-bold text-warm-900">
                                ₹{product.price.toLocaleString("en-IN")}
                            </span>
                            {product.originalPrice && (
                                <span className="text-lg text-warm-400 line-through">
                                    ₹{product.originalPrice.toLocaleString("en-IN")}
                                </span>
                            )}
                            {hasDiscount && (
                                <span className="rounded-lg bg-green-100 px-2 py-0.5 text-sm font-bold text-green-700">
                                    Save {product.discount}%
                                </span>
                            )}
                        </div>

                        {/* Shipping Info */}
                        <div className="mt-4 flex flex-wrap gap-3">
                            <div className="flex items-center gap-1.5 text-xs text-warm-600">
                                <Truck size={14} className="text-saffron-500" />
                                {product.shipping.freeShipping
                                    ? "Free Shipping"
                                    : `Delivery ₹${product.shipping.deliveryCharge}`}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-warm-600">
                                <Package size={14} className="text-saffron-500" />
                                Delivery in {product.shipping.deliveryDays} days
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-warm-600">
                                <CreditCard size={14} className="text-saffron-500" />
                                COD Available
                            </div>
                        </div>

                        {/* Description */}
                        <p className="mt-5 text-sm leading-relaxed text-warm-700">
                            {product.shortDescription}
                        </p>

                        {/* Quantity + Cart */}
                        <div className="mt-6 flex items-center gap-3">
                            {/* Quantity */}
                            <div className="flex items-center rounded-xl border border-gold-200 bg-white">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="flex size-10 items-center justify-center text-warm-600 transition hover:text-warm-900"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="min-w-[32px] text-center text-sm font-semibold text-warm-900">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="flex size-10 items-center justify-center text-warm-600 transition hover:text-warm-900"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>

                            {/* Add to Cart */}
                            <button
                                onClick={handleAddToCart}
                                disabled={!product.inStock || isAdding}
                                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold shadow-lg transition-all active:scale-95 hover:shadow-xl disabled:opacity-50 ${justAdded
                                        ? "bg-green-500 text-white"
                                        : "bg-linear-to-r from-saffron-500 to-saffron-600 text-white"
                                    }`}
                            >
                                {isAdding ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Adding...
                                    </>
                                ) : justAdded ? (
                                    <>
                                        <Check size={16} />
                                        Added to Cart ✓
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart size={16} />
                                        {product.inStock ? "Add to Cart" : "Out of Stock"}
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Buy Now */}
                        <button
                            onClick={handleBuyNow}
                            disabled={!product.inStock || isAdding}
                            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-saffron-500 bg-saffron-50 px-6 py-3 text-sm font-bold text-saffron-700 transition-all active:scale-95 hover:bg-saffron-100 disabled:opacity-50"
                        >
                            ⚡ Buy Now
                        </button>

                        {/* ── Spiritual Benefits ── */}
                        {product.benefits.length > 0 && (
                            <section className="mt-8">
                                <h2 className="font-serif text-lg font-semibold text-warm-900">
                                    ✦ Spiritual Benefits
                                </h2>
                                <ul className="mt-3 space-y-2">
                                    {product.benefits.map((benefit, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start gap-2 rounded-xl border border-gold-200/50 bg-white/80 px-3 py-2.5 text-sm text-warm-700"
                                        >
                                            <Check
                                                size={16}
                                                className="mt-0.5 shrink-0 text-green-500"
                                            />
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* ── How To Use ── */}
                        {product.howToUse && (
                            <section className="mt-6">
                                <h2 className="font-serif text-lg font-semibold text-warm-900">
                                    📖 How To Use
                                </h2>
                                <div className="mt-3 rounded-2xl border border-gold-200/50 bg-white/80 p-4 text-sm leading-relaxed text-warm-700">
                                    {product.howToUse}
                                </div>
                            </section>
                        )}

                        {/* ── Full Description ── */}
                        <section className="mt-6">
                            <h2 className="font-serif text-lg font-semibold text-warm-900">
                                📋 Product Details
                            </h2>
                            <div className="mt-3 rounded-2xl border border-gold-200/50 bg-white/80 p-4 text-sm leading-relaxed text-warm-700">
                                {product.description}
                            </div>
                        </section>

                        {/* ── Authenticity Promise ── */}
                        <section className="mt-6 rounded-2xl border border-gold-200/70 bg-linear-to-r from-gold-50 to-saffron-50 p-4">
                            <h2 className="flex items-center gap-2 font-serif text-lg font-semibold text-warm-900">
                                <Shield size={18} className="text-saffron-600" />
                                Authenticity Promise
                            </h2>
                            <p className="mt-2 text-sm text-warm-700">
                                Every SanatanSetu product is blessed, quality checked, and sourced from
                                trusted spiritual vendors. Certificate of authenticity included.
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-warm-700 shadow-sm">
                                    📜 Certificate Included
                                </span>
                                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-warm-700 shadow-sm">
                                    🙏 Pandit Verified
                                </span>
                                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-warm-700 shadow-sm">
                                    🔄 Easy Returns
                                </span>
                            </div>
                        </section>
                    </section>
                </div>

                {/* ── Related Products ── */}
                {relatedProducts.length > 0 && (
                    <section className="mt-12">
                        <h2 className="font-serif text-xl font-bold text-warm-900">
                            You May Also Like
                        </h2>
                        <div className="no-scrollbar -mx-4 mt-4 flex gap-4 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:px-0">
                            {relatedProducts.map((p) => (
                                <div key={p.id} className="w-[180px] shrink-0 md:w-auto">
                                    <StoreProductCard product={p} />
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* ── Premium Sticky Buy Bar (Mobile) ── */}
            <div className="fixed bottom-[72px] left-4 right-4 z-40 md:hidden animate-in slide-in-from-bottom-8 fade-in duration-500 ease-out">
                {/* Glassmorphism Floating Container */}
                <div className="flex items-center justify-between rounded-3xl border border-white/40 bg-white/80 p-3 shadow-[0_-8px_30px_-15px_rgba(0,0,0,0.2)] backdrop-blur-2xl">
                    <div className="flex flex-col pl-2">
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-xl font-bold text-warm-900 tracking-tight">
                                ₹{product.price.toLocaleString("en-IN")}
                            </span>
                            {product.originalPrice && (
                                <span className="text-xs font-medium text-warm-400 line-through">
                                    ₹{product.originalPrice.toLocaleString("en-IN")}
                                </span>
                            )}
                        </div>
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-green-600">
                            {product.inStock ? "✓ In Stock" : "Out of Stock"}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdding}
                            className={`flex h-11 w-11 items-center justify-center rounded-2xl border-2 shadow-sm transition-all active:scale-95 ${justAdded
                                    ? "border-green-200 bg-green-50 text-green-600"
                                    : "border-saffron-100 bg-linear-to-b from-white to-saffron-50 text-saffron-600"
                                }`}
                        >
                            {isAdding ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : justAdded ? (
                                <Check size={18} strokeWidth={2.5} />
                            ) : (
                                <ShoppingCart size={18} strokeWidth={2.5} />
                            )}
                        </button>
                        <button
                            onClick={handleBuyNow}
                            disabled={isAdding}
                            className="flex h-11 items-center justify-center rounded-2xl bg-linear-to-r from-saffron-500 to-saffron-600 px-6 text-sm font-bold text-white shadow-[0_4px_14px_0_rgba(245,158,11,0.39)] transition-all active:scale-95 hover:shadow-[0_6px_20px_rgba(245,158,11,0.23)] hover:-translate-y-0.5"
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
