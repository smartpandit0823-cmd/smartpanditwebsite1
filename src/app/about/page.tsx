import {
  Shield,
  Target,
  Users,
  Heart,
  Sparkles,
  Globe,
  BookOpen,
  Phone,
} from "lucide-react";

const VALUES = [
  {
    title: "Authentic & Energized Products",
    description:
      "Every spiritual product — from Rudraksha to Yantras — is authentic, lab-certified, and energized by experienced pandits before dispatch.",
    icon: Sparkles,
  },
  {
    title: "Verified Pandits & Astrologers",
    description:
      "Each pandit and astrologer on our platform goes through rigorous identity checks, knowledge verification, and experience validation.",
    icon: Shield,
  },
  {
    title: "Transparent Pricing",
    description:
      "No hidden charges. Clear pricing for all pujas, consultations, and spiritual products with complete breakdown at checkout.",
    icon: Target,
  },
  {
    title: "Pan-India Service",
    description:
      "Serving devotees across 50+ cities in India with reliable delivery of products and puja bookings at your doorstep.",
    icon: Globe,
  },
  {
    title: "Community of 1L+ Devotees",
    description:
      "Trusted by over 1 lakh families for puja services, astrology consultations, and premium spiritual products.",
    icon: Users,
  },
  {
    title: "Vedic Knowledge & Guidance",
    description:
      "Our team of scholars provides guidance rooted in authentic Vedic scriptures and Sanatan Dharma traditions.",
    icon: BookOpen,
  },
];

const SERVICES = [
  {
    title: "Spiritual Store",
    desc: "Premium Rudraksha, gemstones, bracelets, yantras, vastu items, and puja samagri — all lab-certified and energized.",
  },
  {
    title: "Puja Booking",
    desc: "Book verified pandits for Griha Pravesh, Satyanarayan Katha, Navgraha Shanti, Kaal Sarp Dosh, and 100+ other pujas.",
  },
  {
    title: "Astrology Consultation",
    desc: "Connect with experienced Vedic astrologers for Kundali analysis, horoscope matching, career guidance, and remedies.",
  },
  {
    title: "Temple Darshan",
    desc: "Plan your temple visits with guided darshan packages across India's most sacred temples and tirth sthan.",
  },
];

export const metadata = {
  title: "About SanatanSetu",
  description:
    "SanatanSetu — India's trusted spiritual platform for authentic spiritual products, verified pandit bookings, astrology, and more.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      {/* Hero */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-saffron-500 to-amber-600 text-3xl shadow-lg shadow-saffron-500/20">
          🙏
        </div>
        <h1 className="font-heading text-3xl font-bold text-warm-900 md:text-4xl">
          About SanatanSetu
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-warm-600 md:text-base">
          Your bridge to Sanatan Dharma — connecting devotees with authentic spiritual products,
          verified pandits, Vedic astrology, and sacred services across India.
        </p>
      </div>

      {/* Mission */}
      <section className="mt-10 rounded-3xl border border-saffron-200/70 bg-gradient-to-br from-saffron-50 to-gold-50 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <Heart size={24} className="text-saffron-600" />
          <h2 className="font-heading text-2xl font-semibold text-warm-900">Our Mission</h2>
        </div>
        <p className="max-w-3xl text-sm text-warm-700 md:text-base leading-relaxed">
          At <strong>SanatanSetu</strong>, we believe that every devotee deserves access to authentic
          spiritual products and trusted ritual services. Our mission is to bridge the gap between
          ancient Vedic traditions and modern convenience — making it easy for families to practice
          Sanatan Dharma with confidence. From energized Rudraksha and Yantras to verified pandit
          bookings and Vedic astrology consultations, we bring the divine to your doorstep.
        </p>
      </section>

      {/* What We Offer */}
      <section className="mt-10">
        <h2 className="font-heading text-xl font-semibold text-warm-900 text-center md:text-2xl">
          What We Offer
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {SERVICES.map((s) => (
            <article
              key={s.title}
              className="rounded-2xl border border-saffron-200/70 bg-white/85 p-5"
            >
              <h3 className="font-semibold text-warm-900 text-lg">{s.title}</h3>
              <p className="mt-2 text-sm text-warm-600 leading-relaxed">{s.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Why Trust Us */}
      <section className="mt-10">
        <h2 className="font-heading text-xl font-semibold text-warm-900 text-center md:text-2xl">
          Why Families Trust SanatanSetu
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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

      {/* CTA */}
      <section className="mt-10 rounded-3xl bg-gradient-to-r from-saffron-500 to-amber-500 p-8 text-center text-white">
        <h2 className="font-heading text-2xl font-bold">Start Your Spiritual Journey</h2>
        <p className="mt-2 text-sm opacity-90 max-w-lg mx-auto">
          Whether you need authentic spiritual products, want to book a puja, or seek astrological
          guidance — SanatanSetu is here for you.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <a
            href="/shop"
            className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-saffron-600 shadow-lg hover:shadow-xl transition-shadow"
          >
            Visit Store
          </a>
          <a
            href="/contact"
            className="rounded-xl border-2 border-white/50 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
          >
            Contact Us
          </a>
          <a
            href="tel:+919022462127"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-white/50 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
          >
            <Phone size={16} />
            +91 90224 62127
          </a>
        </div>
      </section>
    </div>
  );
}
