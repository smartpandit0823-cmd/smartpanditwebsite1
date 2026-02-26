import Link from "next/link";
import { Church, Crown, MapPin, Star } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StickyBookingBar } from "@/components/ui/StickyBookingBar";

const TEMPLES = [
  {
    slug: "tirupati",
    name: "Tirupati Balaji",
    location: "Tirupati, Andhra Pradesh",
    rating: "4.9",
    description: "Special seva, archana, and VIP darshan coordination.",
  },
  {
    slug: "somnath",
    name: "Somnath Temple",
    location: "Prabhas Patan, Gujarat",
    rating: "4.8",
    description: "Jyotirlinga puja booking with guided rituals.",
  },
  {
    slug: "kedarnath",
    name: "Kedarnath",
    location: "Rudraprayag, Uttarakhand",
    rating: "4.8",
    description: "Seasonal darshan support and temple puja offerings.",
  },
  {
    slug: "kashi-vishwanath",
    name: "Kashi Vishwanath",
    location: "Varanasi, Uttar Pradesh",
    rating: "4.9",
    description: "Rudrabhishek and VIP darshan planning assistance.",
  },
];

const TEMPLE_OPTIONS = [
  { title: "Archana / Abhishek", price: "From ₹1,499" },
  { title: "VIP Darshan Assistance", price: "From ₹2,999" },
  { title: "Prasad Delivery", price: "From ₹799" },
];

export const metadata = {
  title: "Temple Puja",
  description: "Book puja at famous temples. Tirupati, Somnath, Kedarnath & more.",
};

export default function TemplePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-8 md:pb-12 md:pt-12">
      <SectionHeader
        title="Temple Services"
        subtitle="Book puja and darshan options at India's most sacred temples."
        centered={false}
      />

      <section className="mt-8">
        <h2 className="font-heading text-xl font-semibold text-warm-900">Temple Grid</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TEMPLES.map((temple) => (
            <Link
              key={temple.slug}
              href={`/temple/${temple.slug}`}
              className="card-surface rounded-2xl border border-saffron-200/70 bg-white/85 p-4"
            >
              <div className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-saffron-100 to-gold-100 text-saffron-700">
                <Church size={20} />
              </div>
              <h3 className="mt-3 font-semibold text-warm-900">{temple.name}</h3>
              <p className="mt-1 flex items-center gap-1 text-xs text-warm-600">
                <MapPin size={12} />
                {temple.location}
              </p>
              <p className="mt-2 text-sm text-warm-600">{temple.description}</p>
              <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-gold-100 px-2 py-1 text-xs font-medium text-amber-800">
                <Star size={12} className="fill-gold-400 text-gold-400" />
                {temple.rating}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-saffron-200/70 bg-gradient-to-br from-saffron-50 to-gold-50 p-5 md:p-6">
        <h2 className="font-heading text-xl font-semibold text-warm-900">Temple Details</h2>
        <p className="mt-2 text-sm text-warm-700">
          SmartPandit coordinates temple rituals with local priests, manages confirmations,
          and supports travelers with simple step-by-step updates.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-heading text-xl font-semibold text-warm-900">Puja Options</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {TEMPLE_OPTIONS.map((option) => (
            <article
              key={option.title}
              className="rounded-2xl border border-saffron-200/70 bg-white/85 p-4"
            >
              <h3 className="font-semibold text-warm-900">{option.title}</h3>
              <p className="mt-1 text-sm text-saffron-700">{option.price}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-maroon-300/60 bg-maroon-50/70 p-5 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-maroon-100 text-maroon-700">
          <Crown size={20} />
        </div>
        <h2 className="mt-3 font-heading text-xl font-semibold text-maroon-800">Book Temple Darshan</h2>
        <p className="mt-1 text-sm text-maroon-700">
          Share your travel date and temple preference to get guided booking support.
        </p>
        <Link
          href="/contact"
          className="gradient-saffron mt-4 inline-flex rounded-xl px-6 py-3 text-sm font-semibold text-white"
        >
          Start Temple Booking
        </Link>
      </section>

      <StickyBookingBar startingPrice={1499} href="/contact" ctaText="Book Temple Puja" />
    </div>
  );
}
