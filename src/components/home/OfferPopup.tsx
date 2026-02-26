"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, ArrowRight, Timer } from "lucide-react";
import Link from "next/link";
import { BannerSlider } from "@/components/ui/BannerSlider";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

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

export function OfferPopup() {
    const [offers, setOffers] = useState<any[]>([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        // Check if user has already seen the popup in this session
        const hasSeen = sessionStorage.getItem("hasSeenOfferPopup");
        if (hasSeen) return;

        fetch("/api/public/offers")
            .then(res => res.json())
            .then(json => {
                if (json.success && json.data.length > 0) {
                    setOffers(json.data);
                    // Small delay before showing popup for better UX
                    setTimeout(() => {
                        setOpen(true);
                        sessionStorage.setItem("hasSeenOfferPopup", "true");
                    }, 1500);
                }
            })
            .catch((err) => console.error("Failed to load offers", err));
    }, []);

    if (offers.length === 0) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none sm:mx-4">
                <DialogTitle className="sr-only">Special Offers</DialogTitle>
                <button
                    onClick={() => setOpen(false)}
                    className="absolute -right-2 -top-10 z-50 flex size-10 items-center justify-center rounded-full bg-white text-warm-900 shadow-xl transition-transform hover:scale-110 md:-right-10 md:top-0 md:bg-white/20 md:text-white md:backdrop-blur-md"
                >
                    <X size={20} />
                </button>

                <div className="relative w-full overflow-hidden rounded-[2rem] bg-warm-900 shadow-2xl">
                    <BannerSlider
                        className="-mx-0 px-0 pb-0"
                        itemClassName="min-w-full sm:min-w-full lg:min-w-full snap-center"
                        items={offers.map((offer) => {
                            const bgImg = offer.image || OFFER_IMG[offer.id] || "/images/offers/default.jpg";
                            const ctaText = offer.type === "store" ? "Shop Now" : offer.type === "puja" ? "Book Puja" : "Claim Offer";
                            const href = offer.targetSlug && offer.type === "puja" ? `/puja/${offer.targetSlug}`
                                : offer.targetSlug && offer.type === "store" ? `/store/${offer.targetSlug}`
                                    : offer.href || "/offers";

                            return (
                                <Link onClick={() => setOpen(false)} href={href} key={offer._id || offer.id} className="group relative w-full overflow-hidden block">
                                    {/* Background Image */}
                                    <div className="absolute inset-0 z-0 bg-warm-900">
                                        <img src={bgImg} alt={offer.title} className="h-full w-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-warm-900/90 via-warm-900/60 to-transparent" />
                                    </div>

                                    {/* Content */}
                                    <div className="relative z-10 flex min-h-[400px] flex-col justify-center p-8 md:min-h-[450px] md:p-14 lg:w-3/4">
                                        <div className="mb-4 flex flex-wrap items-center gap-3">
                                            {(offer.badge || offer.discount) ? (
                                                <div className="flex items-center gap-1.5 rounded-full bg-saffron-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                                                    <Sparkles size={12} />
                                                    {offer.badge || `${offer.discount}${offer.discountType === "percent" ? "%" : "₹"} OFF`}
                                                </div>
                                            ) : null}
                                            <CountdownTimer />
                                        </div>

                                        <h3 className="mb-4 text-3xl font-black leading-tight text-white md:text-5xl">{offer.title}</h3>
                                        <p className="mb-8 max-w-sm text-base text-warm-100 md:text-lg">{offer.description || offer.subtitle}</p>

                                        <div className="inline-flex w-max items-center justify-center gap-2 rounded-full border border-saffron-400 bg-saffron-500 px-8 py-4 text-base font-bold text-white shadow-[0_0_30px_rgba(249,115,22,0.4)] transition-all group-hover:scale-105 group-hover:bg-saffron-600 active:scale-95">
                                            {offer.cta || ctaText}
                                            <ArrowRight size={18} />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
