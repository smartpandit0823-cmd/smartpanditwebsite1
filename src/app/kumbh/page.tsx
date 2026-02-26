import Link from "next/link";
import { Crown, Flame, Hotel, MapPin } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StickyBookingBar } from "@/components/ui/StickyBookingBar";

const SERVICES = [
  {
    title: "VIP Darshan",
    description: "Priority crowd navigation and planned temple access.",
    icon: Crown,
  },
  {
    title: "Stay & Travel",
    description: "Curated stay options near mela zones with support.",
    icon: Hotel,
  },
  {
    title: "Puja & Rituals",
    description: "Book snan, havan, and guided spiritual ceremonies.",
    icon: Flame,
  },
];

const PACKAGES = [
  {
    name: "Basic Pilgrim",
    price: "₹4,999",
    benefits: ["Darshan guidance", "Helpdesk support", "Daily itinerary"],
  },
  {
    name: "Gold Experience",
    price: "₹9,999",
    benefits: ["VIP darshan support", "Stay assistance", "Puja arrangement"],
    popular: true,
  },
  {
    name: "Royal Kumbh",
    price: "₹18,999",
    benefits: ["Premium stay", "Dedicated coordinator", "Special ritual bookings"],
  },
];

export const metadata = {
  title: "Kumbh Mela",
  description: "VIP Kumbh Mela booking. Stay, puja & pilgrimage packages.",
};

export default function KumbhPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-20 md:pb-12 md:pt-24">
      <SectionHeader
        title="Kumbh Mela"
        subtitle="Complete pilgrimage planning for devotees and families."
        centered={false}
      />

      <section className="mt-8 rounded-3xl bg-gradient-to-br from-saffron-600 via-saffron-700 to-maroon-700 p-6 text-white md:p-8">
        <h2 className="font-heading text-2xl font-semibold">About Kumbh</h2>
        <p className="mt-2 max-w-3xl text-sm text-saffron-50/95">
          Kumbh Mela is one of the world&apos;s largest spiritual gatherings. SmartPandit helps
          pilgrims with safer planning, darshan assistance, rituals, and on-ground support.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-heading text-xl font-semibold text-warm-900">Services</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {SERVICES.map((service) => (
            <article
              key={service.title}
              className="rounded-2xl border border-saffron-200/70 bg-white/85 p-4"
            >
              <div className="flex size-11 items-center justify-center rounded-full bg-saffron-100 text-saffron-700">
                <service.icon size={20} />
              </div>
              <h3 className="mt-3 font-semibold text-warm-900">{service.title}</h3>
              <p className="mt-1 text-sm text-warm-600">{service.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-heading text-xl font-semibold text-warm-900">Packages</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {PACKAGES.map((pkg) => (
            <article
              key={pkg.name}
              className={`rounded-2xl border p-4 ${pkg.popular
                  ? "border-maroon-300 bg-gradient-to-br from-saffron-50 to-gold-50"
                  : "border-saffron-200/70 bg-white/85"
                }`}
            >
              {pkg.popular ? (
                <span className="rounded-full bg-maroon-500 px-2 py-0.5 text-xs font-semibold text-white">
                  Most Popular
                </span>
              ) : null}
              <h3 className="mt-2 font-semibold text-warm-900">{pkg.name}</h3>
              <p className="mt-1 text-xl font-bold text-saffron-700">{pkg.price}</p>
              <ul className="mt-3 space-y-1 text-sm text-warm-700">
                {pkg.benefits.map((benefit) => (
                  <li key={benefit}>• {benefit}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-gold-200/70 bg-gradient-to-r from-gold-50 to-saffron-50 p-5">
        <h2 className="font-heading text-xl font-semibold text-warm-900">VIP Booking</h2>
        <p className="mt-2 text-sm text-warm-700">
          For premium itinerary, VIP darshan route, and ritual concierge support.
        </p>
        <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-amber-800">
          <MapPin size={13} />
          Limited seasonal slots
        </p>
      </section>

      <div className="mt-8 text-center">
        <Link
          href="/contact"
          className="gradient-saffron inline-flex rounded-xl px-8 py-3.5 text-sm font-semibold text-white"
        >
          Book Kumbh Package
        </Link>
      </div>

      <StickyBookingBar startingPrice={4999} href="/contact" ctaText="VIP Kumbh Booking" />
    </div>
  );
}
