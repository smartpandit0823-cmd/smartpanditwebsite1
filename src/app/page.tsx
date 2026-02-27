import connectDB from "@/lib/db/mongodb";
import Product from "@/models/Product";
import { StoreHomeClient } from "./StoreHomeClient";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";

export const metadata = {
  title: "SanatanSetu Store – Sacred Spiritual Products",
  description:
    "Shop authentic spiritual products — Rudraksha, Puja Kits, Gemstones, Temple Prasad & more. Pandit verified, astrologer recommended. Free shipping ₹499+.",
  keywords: [
    "spiritual products",
    "rudraksha",
    "puja kit",
    "gemstones",
    "temple prasad",
    "spiritual jewellery",
    "SanatanSetu",
    "SmartPandit store",
  ],
};

async function getAllProducts() {
  await connectDB();
  const products = await Product.find({ status: "published" })
    .sort({ createdAt: -1 })
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
    video: p.video,
  }));
}

export default async function HomePage() {
  const products = await getAllProducts();

  return (
    <>
      <StoreHomeClient products={products} />
      <TestimonialsSection />
    </>
  );
}
