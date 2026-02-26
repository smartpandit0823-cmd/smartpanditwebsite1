"use client";

import { HOME_OFFERS } from "@/lib/constants";
import { BannerSlider } from "@/components/ui/BannerSlider";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Timer, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const OFFER_IMG: Record<string, string> = {
  "offer-1": "/images/offers/shivratri.jpg",
  "offer-2": "/images/offers/navratri.jpg",
};

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ h: 12, m: 45, s: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev;
        if (s > 0) s--;
        else if (m > 0) { m--; s = 59; }
        else if (h > 0) { h--; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-1.5 rounded-lg bg-black/40 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
      <Timer size={14} className="text-saffron-300" />
      <span>{String(timeLeft.h).padStart(2, '0')}:{String(timeLeft.m).padStart(2, '0')}:{String(timeLeft.s).padStart(2, '0')}</span>
    </div>
  );
}

// (kept top imports and CountdownTimer unmodified)
export function OffersSlider() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/offers")
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data.length > 0) {
          setOffers(json.data);
        } else {
          setOffers([]);
        }
      })
      .catch(() => setOffers([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading || offers.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-warn-50 py-8 md:py-12">
      <div className="absolute left-0 top-0 h-full w-full bg-[#fcf9f2] opacity-50" />
      <div className="section-wrap relative z-10">
        <SectionHeader
          title="Festival Offers"
          subtitle="Limited-time spiritual offers and exclusive packages."
          centered={false}
        />
        <div className="mt-8">
          <BannerSlider
            items={offers.map((offer) => {
              const bgImg = offer.image || OFFER_IMG[offer.id] || "/images/offers/default.jpg";
              const ctaText = offer.type === "store" ? "Shop Now" : offer.type === "puja" ? "Book Puja" : "Claim Offer";
              const href = offer.targetSlug && offer.type === "puja" ? `/puja/${offer.targetSlug}`
                : offer.targetSlug && offer.type === "store" ? `/store/${offer.targetSlug}`
                  : offer.href || "/offers";
              return (
                <Link key={offer._id || offer.id} href={href} className="group relative w-full overflow-hidden rounded-3xl border border-saffron-200/50 shadow-xl transition-transform duration-500 hover:shadow-2xl hover:-translate-y-1 block">
                  {/* Background Image */}
                  <div className="absolute inset-0 z-0 bg-warm-900">
                    <img src={bgImg} alt={offer.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70" />
                    <div className="absolute inset-0 bg-gradient-to-r from-warm-900/90 via-warm-900/50 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex h-[280px] md:h-[340px] flex-col justify-center p-6 md:p-10 lg:w-2/3">
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                      {(offer.badge || offer.discount) ? (
                        <div className="flex items-center gap-1.5 rounded-full bg-saffron-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                          <Sparkles size={12} />
                          {offer.badge || `${offer.discount}${offer.discountType === "percent" ? "%" : "₹"} OFF`}
                        </div>
                      ) : null}
                      <CountdownTimer />
                    </div>

                    <h3 className="mb-3 text-2xl font-black leading-tight text-white md:text-4xl">{offer.title}</h3>
                    <p className="mb-6 max-w-sm text-sm text-warm-100 md:text-base">{offer.description || offer.subtitle}</p>

                    <div className="inline-flex w-max items-center justify-center gap-2 rounded-full border border-saffron-400 bg-saffron-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-saffron-500/30 transition-all group-hover:scale-105 group-hover:bg-saffron-600 active:scale-95">
                      {offer.cta || ctaText}
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </Link>
              );
            })}
          />
        </div>
      </div>
    </section>
  );
}
