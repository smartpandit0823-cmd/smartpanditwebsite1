import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, Shield, Plus } from "lucide-react";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/store/${product.slug}`} className="group block h-full select-none">
      <div className="relative flex h-full flex-col overflow-hidden rounded-[2rem] bg-white shadow-lg border border-warm-100/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-saffron-500/10 hover:border-saffron-200">

        {/* Top Image Region */}
        <div className="relative aspect-square w-full overflow-hidden bg-warm-50/50 p-6 flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,237,213,0.5)_0%,transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="relative h-full w-full">
            <Image
              src={product.images[0] ?? "/placeholder.svg"}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-contain drop-shadow-lg transition-transform duration-1000 group-hover:scale-110 group-hover:drop-shadow-2xl"
            />
          </div>

          {/* Floating Badges */}
          <div className="absolute left-4 top-4 flex flex-col items-start gap-2">
            {product.isAuthentic && (
              <span className="flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-md px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-saffron-700 shadow-sm border border-saffron-100/50">
                <Shield size={10} className="text-saffron-500" />
                100% Authentic
              </span>
            )}
          </div>

          {product.discount !== undefined && product.discount > 0 && (
            <div className="absolute right-4 top-4 flex items-center justify-center rounded-full bg-red-500 px-3 py-1.5 text-[10px] font-black tracking-widest text-white shadow-lg">
              {product.discount}% OFF
            </div>
          )}
        </div>

        {/* Content Region */}
        <div className="flex flex-1 flex-col p-4 md:p-5 lg:p-6 bg-white z-10 border-t border-warm-50/80">
          <div className="flex items-center justify-between mb-2.5 md:mb-3">
            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-warm-400">
              {product.category || "Premium Samagri"}
            </span>
            <div className="flex items-center gap-1 rounded-xl bg-warm-50 px-2.5 py-1 text-[11px] md:text-xs font-black text-warm-800">
              <Star size={12} className="fill-gold-400 text-gold-400" />
              {product.rating}
            </div>
          </div>

          <h3 className="line-clamp-2 min-h-[44px] md:min-h-[48px] text-sm md:text-base font-bold leading-snug text-warm-900 transition-colors group-hover:text-saffron-600">
            {product.name}
          </h3>

          {/* Footer Action */}
          <div className="mt-auto pt-4 md:pt-5">
            <div className="flex items-end justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-warm-400 mb-1">Price</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-warm-900 leading-none">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span className="text-sm font-medium text-warm-400 line-through">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>
              </div>
              <div className="flex size-10 items-center justify-center rounded-full bg-warm-50 border border-warm-100 text-warm-600 transition-all duration-300 group-hover:bg-saffron-500 group-hover:text-white group-hover:border-saffron-500 group-hover:shadow-lg shadow-saffron-500/30">
                <Plus size={18} className="group-hover:rotate-90 transition-transform duration-500" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </Link>
  );
}
