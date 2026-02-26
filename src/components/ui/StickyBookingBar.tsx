"use client";

import { formatPrice } from "@/lib/utils";

interface StickyBookingBarProps {
  startingPrice: number;
  ctaText?: string;
  href?: string;
  slug?: string;
}

export function StickyBookingBar({
  startingPrice,
  ctaText = "Request Puja",
}: StickyBookingBarProps) {
  function handleClick() {
    const el = document.getElementById("booking-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return null;
}

