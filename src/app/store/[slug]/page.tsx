import { notFound } from "next/navigation";
import connectDB from "@/lib/db/mongodb";
import Product from "@/models/Product";
import { ProductDetailClient } from "./ProductDetailClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await connectDB();
  const product = await Product.findOne({ slug, status: "published" }).lean();
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.shortDescription,
    keywords: [product.name, product.category, "spiritual product", "SanatanSetu"],
  };
}

async function getProductBySlug(slug: string) {
  await connectDB();
  const product = await Product.findOne({ slug, status: "published" }).lean();
  if (!product) return null;

  const images = product.images?.length
    ? product.images
    : [product.mainImage].filter(Boolean);

  return {
    id: product._id.toString(),
    slug: product.slug,
    name: product.name,
    category: product.category,
    description: product.fullDescription || product.shortDescription,
    shortDescription: product.shortDescription,
    images: images.length ? images : ["/placeholder.svg"],
    video: product.video || null,
    price: product.pricing?.sellingPrice ?? 0,
    originalPrice:
      product.pricing?.mrp &&
        product.pricing.mrp > (product.pricing?.sellingPrice ?? 0)
        ? product.pricing.mrp
        : undefined,
    discount: product.pricing?.discount ?? 0,
    rating: product.averageRating ?? 4.7,
    reviewCount: product.totalSold ?? 0,
    benefits: product.spiritualBenefits
      ? product.spiritualBenefits
        .split(/[,\n]/)
        .map((b: string) => b.trim())
        .filter(Boolean)
      : [],
    howToUse: product.howToUse || null,
    isAuthentic: Boolean(product.authenticityCertificate),
    inStock: product.inventory?.inStock ?? true,
    panditRecommended: product.panditRecommended ?? false,
    featured: product.featured,
    shipping: {
      freeShipping: product.shipping?.freeShipping ?? false,
      deliveryDays: product.shipping?.deliveryDays ?? 7,
      deliveryCharge: product.shipping?.deliveryCharge ?? 0,
    },
  };
}

async function getRelatedProducts(category: string, excludeSlug: string) {
  await connectDB();
  const products = await Product.find({
    status: "published",
    category,
    slug: { $ne: excludeSlug },
  })
    .limit(4)
    .lean();

  return products.map((p) => ({
    id: p._id.toString(),
    slug: p.slug,
    name: p.name,
    category: p.category,
    images: p.images?.length ? p.images : [p.mainImage].filter(Boolean),
    price: p.pricing?.sellingPrice ?? 0,
    originalPrice:
      p.pricing?.mrp && p.pricing.mrp > (p.pricing?.sellingPrice ?? 0)
        ? p.pricing.mrp
        : undefined,
    discount: p.pricing?.discount ?? 0,
    rating: p.averageRating ?? 4.7,
    reviewCount: p.totalSold ?? 0,
    benefits: p.spiritualBenefits ? [p.spiritualBenefits] : [],
    description: p.shortDescription,
    inStock: p.inventory?.inStock ?? true,
    isAuthentic: Boolean(p.authenticityCertificate),
    featured: p.featured,
    panditRecommended: p.panditRecommended ?? false,
    astrologerRecommended: false,
  }));
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(product.category, product.slug);

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
