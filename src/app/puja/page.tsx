import connectDB from "@/lib/db/mongodb";
import Puja from "@/models/Puja";
import PujaListClient from "./PujaListClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Puja Online | SmartPandit — Verified Pandits",
  description: "Book Satyanarayan, Griha Pravesh, Narayan Nagbali, Kaal Sarp Dosh and a variety of powerful pujas with verified pandits across India.",
};

async function getPujas() {
  await connectDB();
  const pujas = await Puja.find({ status: "active" })
    .sort({ featured: -1, trending: -1, popular: -1, createdAt: -1 })
    .lean();

  return pujas.map((p) => ({
    id: p._id.toString(),
    slug: p.slug,
    name: p.name,
    category: p.category,
    image: p.images?.[0] || "",
    shortDescription: p.shortDescription,
    priceFrom: p.packages?.length ? Math.min(...p.packages.map((pk: { price: number }) => pk.price)) : 0,
    averageRating: (p as { averageRating?: number }).averageRating ?? 0,
    totalBookings: (p as { totalBookings?: number }).totalBookings ?? 0,
    duration: p.duration || "",
    popular: p.popular || false,
    featured: p.featured || false,
    trending: p.trending || false,
    panditRecommended: p.panditRecommended || false,
    templeName: (p as { templeName?: string }).templeName || "",
    templeLocation: (p as { templeLocation?: string }).templeLocation || "",
    pujaType: p.pujaType || "online",
  }));
}

export default async function PujaListingPage() {
  const pujas = await getPujas();
  const categories = Array.from(new Set(pujas.map((p) => p.category).filter(Boolean))) as string[];


  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-20 md:pb-12 md:pt-24">
      {/* Header */}
      <div className="mb-2">
        <h1 className="font-heading text-3xl font-bold text-warm-900 md:text-4xl">
          Book Puja Online 🙏
        </h1>
        <p className="mt-2 text-sm text-warm-600 md:text-base">
          Verified pandits · Authentic rituals · {pujas.length}+ pujas available
        </p>
      </div>

      <PujaListClient pujas={pujas} categories={categories} />

    </div>
  );
}
