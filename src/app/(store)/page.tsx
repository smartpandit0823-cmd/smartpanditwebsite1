import connectDB from "@/lib/db/mongodb";
import Product from "@/models/Product";
import Slider from "@/models/Slider";
import Banner from "@/models/Banner";
import Blog from "@/models/Blog";
import Review from "@/models/Review";
import { StoreHomeClient } from "./StoreHomeClient";

export const dynamic = "force-dynamic";

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
    price: p.pricing?.sellingPrice ?? (p as any).sellingPrice ?? 0,
    originalPrice:
      (p.pricing?.mrp ?? (p as any).mrp ?? 0) > (p.pricing?.sellingPrice ?? (p as any).sellingPrice ?? 0)
        ? (p.pricing?.mrp ?? (p as any).mrp)
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

async function getHomeBanners() {
  await connectDB();

  const banners = await Banner.find({ position: "home", status: "active" })
    .sort({ order: 1 })
    .lean();

  if (banners.length > 0) {
    return banners.map((b) => ({
      _id: b._id.toString(),
      title: b.title,
      subtitle: b.subtitle || "",
      image: b.image,
      mobileImage: b.mobileImage || "",
      link: b.link || "",
    }));
  }

  const sliders = await Slider.find({ active: true })
    .sort({ order: 1 })
    .lean();

  return sliders.map((s) => ({
    _id: s._id.toString(),
    title: s.title,
    subtitle: "",
    image: s.image,
    mobileImage: "",
    link: s.link || "",
  }));
}

async function getHomeBlogs() {
  await connectDB();
  const blogs = await Blog.find({ status: "published" })
    .sort({ publishedAt: -1 })
    .limit(3)
    .lean();

  return blogs.map((b) => ({
    id: b._id.toString(),
    title: b.title,
    slug: b.slug,
    excerpt: b.excerpt,
    category: b.category,
    featuredImage: b.featuredImage,
    publishedAt: b.publishedAt?.toISOString(),
  }));
}

async function getHomeReviews() {
  await connectDB();
  const reviews = await Review.find({ status: "approved", targetModel: "Product" })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  return reviews.map((r) => ({
    id: r._id.toString(),
    customerName: r.customerName,
    rating: r.rating,
    comment: r.comment,
    isVerifiedPurchase: r.isVerifiedPurchase,
    createdAt: r.createdAt.toISOString(),
  }));
}

export default async function HomePage() {
  const [products, banners, blogs, reviews] = await Promise.all([
    getAllProducts(),
    getHomeBanners(),
    getHomeBlogs(),
    getHomeReviews(),
  ]);

  return <StoreHomeClient products={products} banners={banners} blogs={blogs} reviews={reviews} />;
}
