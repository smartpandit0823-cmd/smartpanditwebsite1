import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Church, Crown, Flame, ShoppingBag, Sparkles, Waves } from "lucide-react";

const ICONS: Record<string, any> = {
  Church, Crown, Flame, ShoppingBag, Sparkles, Waves,
};

const CATEGORY_IMAGES: Record<string, string> = {
  "puja": "/images/categories/hero-puja.png",
  "astrology": "/images/categories/hero-astrology.png",
  "temple": "/images/categories/hero-templee.png",
  "store": "/images/categories/hero-store.png",
  "kumbh": "/images/categories/hero-temple.png",
  "vip-darshan": "/images/categories/hero-puja.png",
};

export function CategoriesGrid() {
  return (
    <section className="relative overflow-hidden bg-warm-50 pt-6 md:pt-10 pb-0">
      <div className="section-wrap">
        <SectionHeader
          title="Explore Services"
          subtitle="Choose from our premium spiritual offerings."
          centered={false}
        />

        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
          {CATEGORIES.map((category) => {
            const Icon = ICONS[category.icon] || Flame;
            const bgImage = CATEGORY_IMAGES[category.id] || "/images/categories/placeholder.jpg";

            return (
              <Link
                key={category.id}
                href={category.slug}
                className="group relative overflow-hidden rounded-2xl md:rounded-3xl shadow-lg border border-transparent bg-white transition-all hover:-translate-y-1 hover:shadow-xl hover:border-saffron-300"
              >
                {/* Image Background */}
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={bgImage}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-warm-900/90 via-warm-900/40 to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
                  <div className="flex w-full items-end justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-white md:text-xl">{category.name}</h3>
                      <p className="mt-1 text-xs text-warm-200 md:text-sm">{category.description}</p>
                    </div>
                    {/* Floating Icon */}
                    <div className="flex size-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-transform duration-300 group-hover:bg-saffron-500 group-hover:scale-110 md:size-12">
                      <Icon size={20} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
