"use client";

interface PujaPreviewCardProps {
  name: string;
  category: string;
  image: string;
  shortDescription: string;
  packages: { name: string; price: number }[];
  popular?: boolean;
  featured?: boolean;
}

export function PujaPreviewCard({ name, category, image, shortDescription, packages, popular, featured }: PujaPreviewCardProps) {
  const priceFrom = packages?.length ? Math.min(...packages.map((p) => Number(p.price) || 0)) : 0;
  return (
    <div className="max-w-sm overflow-hidden rounded-2xl border border-saffron-200 bg-white">
      <div className="relative aspect-[4/3] bg-saffron-100">
        {image ? (
          <img src={image} alt={name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">No image</div>
        )}
        {(popular || featured) && (
          <span className="absolute left-2 top-2 rounded-full bg-saffron-500 px-2.5 py-1 text-xs font-semibold text-white">
            {popular ? "Trending" : "Featured"}
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs font-medium text-warm-600">{category}</p>
        <h3 className="mt-1 font-heading text-lg font-semibold text-warm-900 line-clamp-2">{name}</h3>
        {shortDescription && <p className="mt-1 line-clamp-2 text-sm text-warm-600">{shortDescription}</p>}
        <div className="mt-3 flex items-center justify-between border-t border-saffron-100 pt-3">
          <div>
            <p className="text-xs text-warm-600">Starting price</p>
            <p className="font-semibold text-saffron-700">₹{priceFrom.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
