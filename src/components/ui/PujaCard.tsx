import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, Sparkles, Video, Gift } from "lucide-react";
import { Puja } from "@/lib/types";

interface PujaCardProps {
  puja: Puja & {
    discount?: string | number;
    isTemple?: boolean;
    includesVideo?: boolean;
    includesPrasad?: boolean;
    popular?: boolean;
  };
}

export function PujaCard({ puja }: PujaCardProps) {
  return (
    <Link href={`/puja/${puja.slug}`} className="group block select-none cursor-pointer w-[280px] shrink-0">
      <div className="relative flex w-full flex-col overflow-hidden rounded-[16px] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-warm-100 transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1">

        {/* Top Image Region (16:9) */}
        <div className="relative aspect-video w-full overflow-hidden bg-warm-50">
          <Image
            src={puja.image}
            alt={puja.name}
            fill
            sizes="280px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-warm-900/60 via-transparent to-transparent opacity-80" />

          {/* Discount Badge */}
          {puja.discount && (
            <div className="absolute left-3 top-3 z-10">
              <span className="inline-flex items-center rounded bg-red-500 px-2 py-1 text-[11px] font-bold text-white shadow-sm">
                {typeof puja.discount === 'number' ? `₹${puja.discount} OFF` : puja.discount}
              </span>
            </div>
          )}

          {/* Optional Badges */}
          <div className="absolute right-3 top-3 z-10 flex flex-col items-end gap-1.5">
            {puja.popular && (
              <span className="inline-flex items-center gap-1 rounded bg-saffron-500 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                <Sparkles size={10} />
                Popular
              </span>
            )}
            {puja.isTemple && (
              <span className="inline-flex items-center gap-1 rounded bg-white/90 backdrop-blur-sm px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-warm-900 shadow-sm">
                <MapPin size={10} className="text-saffron-600" />
                Temple
              </span>
            )}
          </div>

          {/* Bottom Indicators (Rating & Add-ons) */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <div className="flex items-center gap-1 rounded bg-warm-900/40 backdrop-blur-md px-1.5 py-0.5 text-[11px] font-bold text-white">
              {puja.rating}
              <Star size={10} className="fill-saffron-400 text-saffron-400" />
            </div>

            {(puja.includesVideo || puja.includesPrasad) && (
              <div className="flex gap-1.5">
                {puja.includesVideo && (
                  <div className="flex items-center gap-1.5 rounded bg-warm-900/40 backdrop-blur-md px-1.5 py-0.5 text-[10px] font-medium text-white">
                    <Video size={10} /> E-Puja
                  </div>
                )}
                {puja.includesPrasad && (
                  <div className="flex items-center gap-1.5 rounded bg-warm-900/40 backdrop-blur-md px-1.5 py-0.5 text-[10px] font-medium text-white">
                    <Gift size={10} /> Prasad
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content Region */}
        <div className="flex flex-col p-3 md:p-4">
          {/* Title */}
          <h3 className="line-clamp-1 text-[16px] md:text-[18px] font-bold text-warm-900 group-hover:text-saffron-600 transition-colors">
            {puja.name}
          </h3>

          {/* Description */}
          <p className="mt-1 line-clamp-1 text-[13px] md:text-[14px] text-warm-500">
            {puja.shortBenefits?.[0] || puja.description || "Powerful puja for peace and success"}
          </p>

          {/* Action Button */}
          <div className="mt-4 flex flex-col gap-3">
            {/* Full Width Button */}
            <button className="flex w-full items-center justify-center rounded-[12px] bg-warm-100 py-2.5 text-[14px] md:text-[15px] font-bold text-warm-700 transition-all active:scale-[0.98] group-hover:bg-saffron-500 group-hover:text-white group-hover:shadow-[0_4px_12px_rgba(245,158,11,0.25)]">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
