import Link from "next/link";
import { FOOTER_LINKS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-saffron-200/50 bg-gradient-to-b from-warm-50 to-saffron-50/30">
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="mb-8 rounded-2xl border border-saffron-200/70 bg-white/75 p-4 text-center text-sm text-warm-700 backdrop-blur-sm">
          Verified Pandits • Secure Booking • Authentic Products • 24x7 Support
        </div>
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link
              href="/"
              className="font-heading text-2xl font-bold text-saffron-700"
            >
              SmartPandit
            </Link>
            <p className="mt-3 text-sm text-warm-700">
              India&apos;s most trusted platform for verified pandits, astrology &
              puja services.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading text-sm font-semibold text-warm-900">
              Services
            </h4>
            <ul className="mt-3 space-y-2">
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-warm-700 transition hover:text-saffron-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-heading text-sm font-semibold text-warm-900">
              Company
            </h4>
            <ul className="mt-3 space-y-2">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-warm-700 transition hover:text-saffron-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-heading text-sm font-semibold text-warm-900">
              Legal
            </h4>
            <ul className="mt-3 space-y-2">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-warm-700 transition hover:text-saffron-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-saffron-200/50 pt-8 md:flex-row">
          <p className="text-sm text-warm-600">
            © {new Date().getFullYear()} SmartPandit. All rights reserved.
          </p>
          <p className="text-xs text-warm-500">
            Verified Pandits • 1L+ Services • 4.8★ Rating
          </p>
        </div>
      </div>
    </footer>
  );
}
