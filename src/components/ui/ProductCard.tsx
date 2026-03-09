"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Star, Flame, Zap, Loader2, ShoppingCart, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";

export interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    name: string;
    image: string;
    badge?: "NEW" | "SALE" | "BESTSELLER" | "LAB CERTIFIED";
    purposeTag?: string;
    rating: number;
    reviewCount: number;
    sellingPrice: number;
    mrp?: number;
    discount?: number;
    soldCount?: number;
    inStock: boolean;
    inHighDemand?: boolean;
  };
  compact?: boolean;
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart, adding } = useCart();
  const isAdding = adding === product.id;

  const badgeColors = {
    NEW: "bg-[#00B894] text-white",
    SALE: "bg-[#FF6B8A] text-white",
    BESTSELLER: "bg-[#FF8C00] text-white",
    "LAB CERTIFIED": "bg-[#00CEC9] text-white",
  };

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock || isAdding) return;
    const success = await addToCart(product.id);
    if (success) {
      setAddedToCart(true);
      // Reset after 5 seconds
      setTimeout(() => setAddedToCart(false), 5000);
    }
  }

  function handleBuyNow(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    // Add to cart then go to checkout
    addToCart(product.id).then((success) => {
      if (success) {
        router.push("/checkout");
      }
    });
  }

  function handleContinueToCheckout(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    router.push("/cart");
  }

  return (
    <div
      className={`relative flex flex-col group bg-white border border-orange-100 rounded-xl overflow-hidden hover:shadow-[0_2px_16px_rgba(255,140,0,0.08)] transition-all flex-shrink-0 snap-start ${compact ? "w-[160px] md:w-[200px]" : "w-full"
        }`}
    >
      {/* Top Image Section */}
      <Link
        href={`/product/${product.slug}`}
        className="relative bg-[#F5F5F5] aspect-square block overflow-hidden"
      >
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${!product.inStock ? "grayscale opacity-50" : ""
            }`}
        />

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center">
            <span className="bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-[#1A1A1A]">
              Out of Stock
            </span>
          </div>
        )}

        {/* Badge */}
        {product.badge && product.inStock && (
          <div
            className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${badgeColors[product.badge]}`}
          >
            {product.badge}
          </div>
        )}

        {/* Discount Badge */}
        {!product.badge && (product.discount ?? 0) > 0 && product.inStock && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#FF6B8A] text-white">
            {product.discount}% OFF
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white shadow-sm text-warm-500 hover:text-[#FF6B8A] transition-colors"
        >
          <Heart
            size={16}
            className={
              isWishlisted ? "fill-[#FF6B8A] text-[#FF6B8A]" : ""
            }
          />
        </button>
      </Link>

      {/* Content Section */}
      <div className="p-3 flex flex-col flex-grow">
        <Link href={`/product/${product.slug}`} className="flex-grow">
          {product.inHighDemand && (
            <div className="flex items-center gap-1 text-[#00B894] mb-1">
              <Zap size={10} fill="currentColor" />
              <span className="text-[11px] font-bold uppercase tracking-wide">
                In High Demand
              </span>
            </div>
          )}

          <h3 className="text-sm font-bold text-[#1A1A1A] line-clamp-2 leading-snug mb-1">
            {product.name}
          </h3>

          {product.purposeTag && !compact && (
            <p className="text-xs text-[#888888] mb-1.5">{product.purposeTag}</p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <Star size={12} className="text-[#FFD700] fill-[#FFD700]" />
            <span className="text-xs font-semibold text-[#1A1A1A]">
              {product.rating}
            </span>
            <span className="text-xs text-[#888888]">
              ({product.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-end gap-1.5 mb-1.5 flex-wrap">
            <span className="text-base font-bold text-[#FF8C00]">
              ₹{product.sellingPrice.toLocaleString("en-IN")}
            </span>
            {product.mrp && product.mrp > product.sellingPrice && (
              <span className="text-xs font-medium text-[#888888] line-through mb-0.5">
                ₹{product.mrp.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {/* Sold Count */}
          {(product.soldCount ?? 0) > 0 && (
            <div className="flex items-center gap-1 text-[#FF8C00]/80">
              <Flame size={12} fill="currentColor" />
              <span className="text-[11px] font-semibold">
                {product.soldCount}+ bought
              </span>
            </div>
          )}
        </Link>

        {/* Action Buttons */}
        <div className="mt-3 flex flex-col gap-1.5">
          {product.inStock ? (
            addedToCart ? (
              /* After adding → show "Continue to Checkout" */
              <button
                onClick={handleContinueToCheckout}
                className="w-full flex items-center justify-center gap-1.5 bg-[#00B894] hover:bg-[#00A884] text-white h-[36px] rounded-lg text-xs font-bold transition-all active:scale-[0.97] animate-[fadeIn_0.2s_ease-in]"
              >
                <ShoppingCart size={13} />
                Continue to Cart
                <ArrowRight size={13} />
              </button>
            ) : (
              /* Default: Add to Cart */
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="w-full flex items-center justify-center gap-2 bg-[#FF8C00] hover:bg-[#E67E00] disabled:bg-[#FFB366] text-white h-[36px] rounded-lg text-xs font-bold transition-all active:scale-[0.97]"
              >
                {isAdding ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <>
                    <ShoppingCart size={13} />
                    Add to Cart
                  </>
                )}
              </button>
            )
          ) : (
            <button className="w-full border-2 border-[#1A1A1A] text-[#1A1A1A] h-[36px] flex items-center justify-center rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors">
              🔔 Notify Me
            </button>
          )}

          {/* Buy Now — always visible for in-stock products */}
          {product.inStock && (
            <button
              onClick={handleBuyNow}
              className="w-full flex items-center justify-center gap-1.5 bg-[#1A1A1A] hover:bg-[#333] text-white h-[34px] rounded-lg text-xs font-bold transition-all active:scale-[0.97]"
            >
              ⚡ Buy Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
