import Link from "next/link";
import connectDB from "@/lib/db/mongodb";
import Product from "@/models/Product";
import { ProductCard } from "@/components/ui/ProductCard";
import { BannerSlider } from "@/components/ui/BannerSlider";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Product as ProductType } from "@/lib/types";
import { ArrowRight, ShoppingBag } from "lucide-react";

async function getFeaturedProducts() {
  await connectDB();
  const products = await Product.find({ status: "published", featured: true }).limit(6).lean();
  return products.map((p) => ({
    id: p._id.toString(),
    slug: p.slug,
    name: p.name,
    category: p.category,
    images: p.images?.length ? p.images : [p.mainImage].filter(Boolean),
    price: p.pricing?.sellingPrice ?? 0,
    originalPrice: p.pricing?.mrp && p.pricing.mrp > (p.pricing?.sellingPrice ?? 0) ? p.pricing.mrp : undefined,
    discount: p.pricing?.discount ?? 0,
    rating: (p as { averageRating?: number }).averageRating ?? 4.7,
    reviewCount: (p as { totalSold?: number }).totalSold ?? 0,
    benefits: p.spiritualBenefits ? [p.spiritualBenefits] : [],
    description: p.shortDescription,
    inStock: p.inventory?.inStock ?? true,
    isAuthentic: Boolean(p.authenticityCertificate),
    featured: p.featured,
  })) as ProductType[];
}

export async function FeaturedProducts() {
  const featured = await getFeaturedProducts();

  return (
    <section className="relative overflow-hidden bg-[#faf8f5] py-10 md:py-16">
      {/* Background pattern mask */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="absolute right-0 top-0 h-96 w-96 -translate-y-1/2 translate-x-1/3 rounded-full bg-saffron-100/50 blur-3xl" />

      <div className="section-wrap relative z-10">
        <div className="mb-8 flex flex-col md:mb-12 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            title="Premium Spiritual Store"
            subtitle="Authentic rudraksha, yantras, and puja samagri directly from sacred origins."
            centered={false}
          />
          <Link
            href="/store"
            className="hidden items-center gap-2 rounded-full bg-saffron-50 px-5 py-2.5 text-sm font-semibold text-saffron-700 transition hover:bg-saffron-100 hover:text-saffron-800 md:inline-flex shadow-sm"
          >
            <ShoppingBag size={16} />
            Visit Store
          </Link>
        </div>

        <div className="mt-6 md:mt-0">
          <BannerSlider
            itemClassName="min-w-[65%] sm:min-w-[240px] lg:min-w-[280px]"
            items={featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          />
        </div>

        <div className="mt-10 text-center md:hidden">
          <Link
            href="/store"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-saffron-300 bg-white px-6 py-4 text-base font-bold text-saffron-700 transition hover:bg-saffron-50 active:scale-[0.98]"
          >
            <ShoppingBag size={18} />
            Explore Store
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
