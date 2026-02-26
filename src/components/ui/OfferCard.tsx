import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface OfferCardProps {
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  badge: string;
}

export function OfferCard({ title, subtitle, cta, href, badge }: OfferCardProps) {
  return (
    <article className="relative overflow-hidden rounded-3xl border border-gold-200/70 bg-gradient-to-br from-saffron-500 via-saffron-600 to-maroon-700 p-5 text-white shadow-xl shadow-saffron-300/40">
      <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide backdrop-blur-sm">
        {badge}
      </span>
      <h3 className="mt-4 text-xl font-semibold leading-tight">{title}</h3>
      <p className="mt-2 text-sm text-saffron-50/90">{subtitle}</p>
      <Link
        href={href}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-maroon-700 transition hover:bg-gold-50"
      >
        {cta}
        <ArrowRight size={16} />
      </Link>
      <div className="pointer-events-none absolute -right-10 -top-10 size-28 rounded-full bg-white/15 blur-lg" />
    </article>
  );
}
