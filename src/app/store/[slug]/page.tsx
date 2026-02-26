import { notFound } from "next/navigation";
import Image from "next/image";
import { Check, Shield, Star } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { BannerSlider } from "@/components/ui/BannerSlider";
import { StickyBookingBar } from "@/components/ui/StickyBookingBar";
import connectDB from "@/lib/db/mongodb";
import Product from "@/models/Product";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectDB();
  const product = await Product.findOne({ slug, status: "published" }).lean();
  if (!product) return { title: "Product Not Found" };
  return { title: product.name, description: product.shortDescription };
}

async function getProductBySlug(slug: string) {
  await connectDB();
  const product = await Product.findOne({ slug, status: "published" }).lean();
  if (!product) return null;
  const images = product.images?.length ? product.images : [product.mainImage].filter(Boolean);
  return {
    id: product._id.toString(),
    slug: product.slug,
    name: product.name,
    description: product.fullDescription || product.shortDescription,
    images: images.length ? images : ["/placeholder.svg"],
    price: product.pricing?.sellingPrice ?? 0,
    originalPrice: product.pricing?.mrp && product.pricing.mrp > (product.pricing?.sellingPrice ?? 0) ? product.pricing.mrp : undefined,
    rating: (product as { averageRating?: number }).averageRating ?? 4.7,
    reviewCount: (product as { totalSold?: number }).totalSold ?? 0,
    benefits: product.spiritualBenefits ? [product.spiritualBenefits] : [],
    isAuthentic: Boolean(product.authenticityCertificate),
  };
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const galleryItems = (product.images.length > 0 ? product.images : ["/placeholder.svg"]).map(
    (image, index) => (
      <div
        key={`${product.id}-${index}`}
        className="relative aspect-square overflow-hidden rounded-2xl border border-saffron-200/70 bg-saffron-50"
      >
        <Image
          src={image}
          alt={`${product.name} ${index + 1}`}
          fill
          priority={index === 0}
          sizes="(max-width: 768px) 90vw, 40vw"
          className="object-cover"
        />
      </div>
    )
  );

  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-8 md:pb-12 md:pt-12">
      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h1 className="font-heading text-3xl font-bold text-warm-900 md:hidden">{product.name}</h1>
          <div className="mt-4 lg:mt-0">
            <BannerSlider itemClassName="min-w-[88%] sm:min-w-[420px]" items={galleryItems} />
          </div>
        </section>

        <section>
          <h1 className="font-heading hidden text-3xl font-bold text-warm-900 md:block">{product.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <span className="inline-flex items-center gap-1 rounded-full bg-saffron-100 px-3 py-1 text-saffron-700">
              <Star size={14} className="fill-gold-400 text-gold-400" />
              {product.rating} ({product.reviewCount}+ reviews)
            </span>
            {product.isAuthentic ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-gold-100 px-3 py-1 text-amber-800">
                <Shield size={14} />
                Authentic Product
              </span>
            ) : null}
          </div>

          <div className="mt-4 flex items-end gap-2">
            <p className="text-3xl font-bold text-saffron-700">{formatPrice(product.price)}</p>
            {product.originalPrice ? (
              <p className="text-lg text-warm-500 line-through">{formatPrice(product.originalPrice)}</p>
            ) : null}
          </div>

          <p className="mt-4 text-warm-700">{product.description}</p>

          <section className="mt-6">
            <h2 className="font-heading text-xl font-semibold text-warm-900">Benefits</h2>
            <ul className="mt-3 space-y-2">
              {product.benefits.map((benefit, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 rounded-xl border border-saffron-200/70 bg-white/85 px-3 py-2 text-sm text-warm-700"
                >
                  <Check size={16} className="text-saffron-700" />
                  {benefit}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-6 rounded-2xl border border-gold-200/70 bg-gradient-to-r from-gold-50 to-saffron-50 p-4">
            <h2 className="font-heading text-lg font-semibold text-warm-900">Authenticity Promise</h2>
            <p className="mt-2 text-sm text-warm-700">
              Every store item is quality checked and sourced from trusted spiritual vendors.
            </p>
          </section>
        </section>
      </div>

      <StickyBookingBar
        startingPrice={product.price}
        ctaText="Add To Cart"
        href={`/contact?product=${product.slug}`}
      />
    </div>
  );
}
