import { Check } from "lucide-react";
import { PujaPackage } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PackageCardProps {
  pkg: PujaPackage;
  selected?: boolean;
  onSelect?: () => void;
}

export function PackageCard({ pkg, selected, onSelect }: PackageCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full flex-col rounded-2xl border-2 p-5 text-left transition",
        selected
          ? "border-saffron-500 bg-gradient-to-br from-saffron-50 to-gold-50 shadow-lg shadow-saffron-200/60"
          : "border-saffron-200 bg-white hover:border-saffron-300"
      )}
    >
      {pkg.popular && (
        <span className="mb-2 w-fit rounded-full bg-maroon-500 px-3 py-0.5 text-xs font-semibold text-white">
          Most Popular
        </span>
      )}
      <h4 className="font-heading text-lg font-semibold text-warm-900">{pkg.name}</h4>
      <p className="mt-1 text-2xl font-bold text-saffron-600">
        {formatPrice(pkg.price)}
      </p>
      <p className="text-sm text-warm-600">{pkg.duration} • {pkg.pandits} Pandit(s)</p>
      <p className="mt-1 text-xs font-medium text-maroon-700">
        {pkg.samagri ? "Samagri included" : "Samagri not included"}
      </p>
      <ul className="mt-4 space-y-2">
        {pkg.benefits.slice(0, 4).map((b, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-warm-700">
            <Check size={18} className="mt-0.5 shrink-0 text-saffron-600" />
            {b}
          </li>
        ))}
      </ul>
    </button>
  );
}
