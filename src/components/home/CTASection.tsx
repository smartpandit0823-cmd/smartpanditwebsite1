import Link from "next/link";
import { Flame, HeadphonesIcon } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-saffron-600 via-saffron-700 to-warm-900 py-12 text-white md:py-20">
      {/* Background decorations */}
      <div className="absolute inset-0 z-0 opacity-10 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/mandala-pattern.png')]" />
      <div className="absolute right-0 top-0 h-96 w-96 -translate-y-1/2 translate-x-1/3 rounded-full bg-gold-400/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-96 w-96 -translate-x-1/3 translate-y-1/2 rounded-full bg-saffron-500/30 blur-3xl" />

      <div className="section-wrap relative z-10 text-center">
        <h2 className="mx-auto max-w-3xl font-heading text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
          Ready to experience <br className="hidden md:block" />
          <span className="text-gold-300">divine blessings?</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-saffron-100 md:text-xl">
          Join thousands of devotees. Book a verified Pandit, transparent pricing, and instant confirmation within minutes.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/puja"
            className="group relative flex w-full sm:w-auto items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-8 py-4 text-lg font-bold text-saffron-700 shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
          >
            <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(150%)]">
              <div className="relative h-full w-8 bg-saffron-100/50" />
            </div>
            <Flame size={20} className="text-saffron-500" />
            Book Puja Now
          </Link>
          <Link
            href="/team"
            className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 py-4 text-lg font-bold text-white shadow-lg backdrop-blur-md transition-all hover:bg-white/20 hover:border-white/50"
          >
            <HeadphonesIcon size={20} className="transition-transform group-hover:-rotate-12" />
            Talk to Expert
          </Link>
        </div>
      </div>
    </section>
  );
}
