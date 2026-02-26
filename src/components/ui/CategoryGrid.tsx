import Link from "next/link";
import {
  Church,
  Crown,
  Flame,
  LucideIcon,
  ShoppingBag,
  Sparkles,
  Waves,
} from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
}

interface CategoryGridProps {
  items: readonly CategoryItem[];
}

const ICONS: Record<string, LucideIcon> = {
  Church,
  Crown,
  Flame,
  ShoppingBag,
  Sparkles,
  Waves,
};

export function CategoryGrid({ items }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
      {items.map((category) => {
        const Icon = ICONS[category.icon] ?? Flame;
        return (
          <Link
            key={category.id}
            href={category.slug}
            className="group card-surface rounded-2xl border border-saffron-200/70 bg-white/85 p-4 text-center backdrop-blur-sm"
          >
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-saffron-100 to-gold-100 text-saffron-700 transition group-hover:scale-105">
              <Icon size={20} />
            </div>
            <h3 className="mt-3 text-sm font-semibold text-warm-900">{category.name}</h3>
            <p className="mt-1 text-xs text-warm-600">{category.description}</p>
          </Link>
        );
      })}
    </div>
  );
}
