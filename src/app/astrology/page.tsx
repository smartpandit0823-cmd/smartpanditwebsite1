import Link from "next/link";
import {
  Briefcase,
  Heart,
  LucideIcon,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Wallet,
} from "lucide-react";
import { HOW_IT_WORKS } from "@/lib/constants";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StickyBookingBar } from "@/components/ui/StickyBookingBar";

const ASTRO_TYPES: Array<{ name: string; icon: LucideIcon; price: string }> = [
  { name: "Love & Relationship", icon: Heart, price: "From ₹299" },
  { name: "Career Guidance", icon: Briefcase, price: "From ₹399" },
  { name: "Finance & Business", icon: Wallet, price: "From ₹399" },
  { name: "Kundali Analysis", icon: Sparkles, price: "From ₹599" },
];

const TRUST_ITEMS: Array<{ title: string; description: string; icon: LucideIcon }> = [
  {
    title: "Verified Astrologers",
    description: "Experience verified profiles and vetted credentials.",
    icon: ShieldCheck,
  },
  {
    title: "Transparent Minutes",
    description: "Clear per-minute charges before consultation starts.",
    icon: Wallet,
  },
  {
    title: "Private Sessions",
    description: "Secure one-to-one call and chat consultation flow.",
    icon: UserCheck,
  },
];

export const metadata = {
  title: "Astrology Consultations",
  description: "Consult verified astrologers for love, career, finance & more. Book online from ₹199/min.",
};

export default function AstrologyPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-20 md:pb-12 md:pt-24">
      <SectionHeader
        title="Astrology Consultations"
        subtitle="Choose consultation type, connect with trusted astrologers, and get instant guidance."
        centered={false}
      />

      <section className="mt-8">
        <h2 className="font-heading text-xl font-semibold text-warm-900">Consultation Types</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ASTRO_TYPES.map((type) => (
            <div
              key={type.name}
              className="card-surface rounded-2xl border border-saffron-200/70 bg-white/85 p-4"
            >
              <div className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-saffron-100 to-gold-100 text-saffron-700">
                <type.icon size={20} />
              </div>
              <h3 className="mt-3 font-semibold text-warm-900">{type.name}</h3>
              <p className="mt-1 text-sm text-saffron-700">{type.price}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-heading text-xl font-semibold text-warm-900">How Consultation Works</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {HOW_IT_WORKS.map((step) => (
            <article
              key={step.step}
              className="rounded-2xl border border-saffron-200/70 bg-white/85 p-4"
            >
              <span className="inline-flex rounded-full bg-saffron-100 px-2.5 py-1 text-xs font-semibold text-saffron-700">
                Step {step.step}
              </span>
              <h3 className="mt-2 font-semibold text-warm-900">{step.title}</h3>
              <p className="mt-1 text-sm text-warm-600">{step.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-heading text-xl font-semibold text-warm-900">Astrologer Trust</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {TRUST_ITEMS.map((item) => (
            <article
              key={item.title}
              className="glass-surface rounded-2xl border border-saffron-200/70 p-4"
            >
              <div className="flex size-10 items-center justify-center rounded-full bg-saffron-100 text-saffron-700">
                <item.icon size={18} />
              </div>
              <h3 className="mt-3 font-semibold text-warm-900">{item.title}</h3>
              <p className="mt-1 text-sm text-warm-600">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-saffron-200/70 bg-gradient-to-br from-saffron-50 to-gold-50 p-5 md:p-7">
        <h2 className="font-heading text-xl font-semibold text-warm-900">Booking Form</h2>
        <p className="mt-1 text-sm text-warm-600">
          Fill quick details and our astrology support team will confirm your slot.
        </p>
        <form className="mt-4 grid gap-3 md:grid-cols-2">
          <input
            type="text"
            placeholder="Your Name"
            className="rounded-xl border border-saffron-200 bg-white px-4 py-3 text-sm text-warm-800 outline-none focus:border-saffron-400"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            className="rounded-xl border border-saffron-200 bg-white px-4 py-3 text-sm text-warm-800 outline-none focus:border-saffron-400"
          />
          <select className="rounded-xl border border-saffron-200 bg-white px-4 py-3 text-sm text-warm-800 outline-none focus:border-saffron-400">
            <option>Select Consultation Type</option>
            {ASTRO_TYPES.map((type) => (
              <option key={type.name}>{type.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Preferred Time"
            className="rounded-xl border border-saffron-200 bg-white px-4 py-3 text-sm text-warm-800 outline-none focus:border-saffron-400"
          />
          <textarea
            placeholder="Brief concern (optional)"
            rows={4}
            className="rounded-xl border border-saffron-200 bg-white px-4 py-3 text-sm text-warm-800 outline-none focus:border-saffron-400 md:col-span-2"
          />
          <button
            type="button"
            className="gradient-saffron rounded-xl px-5 py-3 text-sm font-semibold text-white md:col-span-2 md:w-fit"
          >
            Request Consultation
          </button>
        </form>
      </section>

      <div className="mt-8 text-center">
        <Link
          href="/contact"
          className="inline-flex rounded-xl border border-maroon-300 px-6 py-3 text-sm font-semibold text-maroon-700"
        >
          Need help choosing astrologer?
        </Link>
      </div>

      <StickyBookingBar startingPrice={299} href="/contact" ctaText="Talk To Astrologer" />
    </div>
  );
}
