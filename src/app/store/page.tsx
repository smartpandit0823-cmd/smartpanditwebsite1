import connectDB from "@/lib/db/mongodb";
import Product from "@/models/Product";
import { ProductCard } from "@/components/ui/ProductCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StickyBookingBar } from "@/components/ui/StickyBookingBar";
import type { Product as ProductType } from "@/lib/types";

export const metadata = {
  title: "Puja Store",
  description: "Authentic puja samagri, rudraksha, idols, incense & spiritual products.",
};

async function getProducts() {
  await connectDB();
  const products = await Product.find({ status: "published" }).lean();
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

export default async function StorePage() {
  const products = await getProducts();
  const filters = ["All", ...(Array.from(new Set(products.map((p) => p.category))).filter(Boolean) as string[])];

  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-8 md:pb-12 md:pt-12">
      <SectionHeader
        title="Puja Store"
        subtitle="Shop authentic spiritual products with trusted sourcing and verified quality."
        centered={false}
      />

      <section className="mt-8 rounded-2xl border border-saffron-200/70 bg-white/85 p-4">
        <h3 className="text-sm font-semibold text-warm-800">Filters</h3>
        <div className="no-scrollbar -mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1">
          {filters.map((filter, index) => (
            <button
              key={filter}
              type="button"
              className={`rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap ${
                index === 0
                  ? "bg-saffron-500 text-white"
                  : "border border-saffron-200 bg-white text-warm-700"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.length === 0 ? (
          <p className="col-span-full py-12 text-center text-warm-600">No products available yet. Check back soon.</p>
        ) : (
          products.map((product) => <ProductCard key={product.id} product={product} />)
        )}
      </div>

      <StickyBookingBar startingPrice={199} href="/store" ctaText="Shop Products" />
    </div>
  );
}
