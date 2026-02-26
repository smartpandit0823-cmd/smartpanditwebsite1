import Link from "next/link";
import connectDB from "@/lib/db/mongodb";
import Puja from "@/models/Puja";
import { PujaCard } from "@/components/ui/PujaCard";
import { BannerSlider } from "@/components/ui/BannerSlider";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Puja as PujaType } from "@/lib/types";
import { ArrowRight } from "lucide-react";

async function getPopularPujas() {
  await connectDB();
  const pujas = await Puja.find({ status: "active", $or: [{ popular: true }, { featured: true }] })
    .limit(6)
    .lean();
  return pujas.map((p) => ({
    id: p._id.toString(),
    slug: p.slug,
    name: p.name,
    category: p.category,
    categorySlug: p.category?.toLowerCase().replace(/\s+/g, "-") || "general",
    image: p.images?.[0] || "/placeholder.svg",
    startingPrice: p.packages?.length ? Math.min(...p.packages.map((pk: { price: number }) => pk.price)) : 0,
    rating: (p as { averageRating?: number }).averageRating ?? 4.8,
    reviewCount: (p as { totalBookings?: number }).totalBookings ?? 0,
    duration: p.duration || "2-3 hours",
    shortBenefits: p.benefits || [],
    description: p.shortDescription,
    popular: p.popular,
    featured: p.featured,
  })) as PujaType[];
}

export async function PopularPujas() {
  const popular = await getPopularPujas();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fcf9f2] to-amber-50/30 py-10 md:py-16">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -left-20 top-20 h-64 w-64 rounded-full bg-saffron-200/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-64 w-64 rounded-full bg-warm-200/30 blur-3xl" />

      <div className="section-wrap relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 md:mb-12">
          <SectionHeader
            title="Most Booked Pujas"
            subtitle="Authentic Vedic rituals performed by verified Pandits, thousands of happy devotees."
            centered={false}
          />
          <Link
            href="/puja"
            className="hidden md:inline-flex items-center gap-2 rounded-full border border-warm-200 bg-white px-5 py-2.5 text-sm font-semibold text-warm-700 transition-colors hover:border-saffron-300 hover:text-saffron-600 shadow-sm"
          >
            View All Services
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-6 md:mt-0">
          <BannerSlider
            itemClassName="min-w-[70%] sm:min-w-[280px] lg:min-w-[320px]"
            items={popular.map((puja) => (
              <PujaCard key={puja.id} puja={puja} />
            ))}
          />
        </div>

        <div className="mt-10 text-center md:hidden">
          <Link
            href="/puja"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-warm-100 px-6 py-4 text-base font-semibold text-warm-800 transition active:scale-[0.98]"
          >
            Explore All Pujas
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
