import { Shield, Target, Users } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";

const VALUES = [
  {
    title: "Verified Pandits",
    description: "Every pandit profile goes through identity and ritual quality checks.",
    icon: Shield,
  },
  {
    title: "Transparent Pricing",
    description: "Clear package pricing with no hidden surprise charges at checkout.",
    icon: Target,
  },
  {
    title: "Community Trust",
    description: "Trusted by 1L+ devotees across cities for puja and spiritual guidance.",
    icon: Users,
  },
];

export const metadata = {
  title: "About Us",
  description: "SmartPandit - India's trusted platform for verified pandits, astrology & puja services.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <SectionHeader
        title="About SmartPandit"
        subtitle="A spiritual-tech platform designed to simplify trusted ritual bookings."
        centered={false}
      />

      <section className="mt-8 rounded-3xl border border-saffron-200/70 bg-gradient-to-br from-saffron-50 to-gold-50 p-6">
        <h2 className="font-heading text-2xl font-semibold text-warm-900">Our Mission</h2>
        <p className="mt-3 max-w-3xl text-sm text-warm-700 md:text-base">
          SmartPandit connects families with verified pandits, astrology experts, temple services,
          and authentic store products through a reliable mobile-first booking journey.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-heading text-xl font-semibold text-warm-900">Why Families Trust Us</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {VALUES.map((value) => (
            <article
              key={value.title}
              className="rounded-2xl border border-saffron-200/70 bg-white/85 p-5"
            >
              <div className="flex size-11 items-center justify-center rounded-full bg-saffron-100 text-saffron-700">
                <value.icon size={20} />
              </div>
              <h3 className="mt-3 font-semibold text-warm-900">{value.title}</h3>
              <p className="mt-1 text-sm text-warm-600">{value.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
