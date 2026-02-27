import Link from "next/link";

const STORE_LINKS = [
  { label: "Rudraksha", href: "/store?category=rudraksha" },
  { label: "Puja Kits", href: "/store?category=puja-kits" },
  { label: "Astro Remedies", href: "/store?category=astrology-remedies" },
  { label: "Temple Products", href: "/store?category=temple-products" },
  { label: "Premium Kits", href: "/store?category=premium-kits" },
  { label: "Jewellery", href: "/store?category=spiritual-jewellery" },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cancellation Policy", href: "/cancellation" },
  { label: "Return Policy", href: "/return-policy" },
];

export function Footer() {
  return (
    <footer className="border-t border-saffron-200/50 bg-linear-to-b from-warm-50 to-saffron-50/30">
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        {/* Trust Bar */}
        <div className="mb-8 rounded-2xl border border-saffron-200/70 bg-white/75 p-4 text-center text-sm text-warm-700 backdrop-blur-sm">
          Pandit Verified • Astrologer Recommended • Authenticity Certificate • Free Shipping ₹499+ • COD Available
        </div>

        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="font-heading text-2xl font-bold text-saffron-700">
              🙏 SanatanSetu
            </Link>
            <p className="mt-3 text-sm text-warm-700">
              India&apos;s premium spiritual store — authentic products curated by verified pandits & expert astrologers.
            </p>
          </div>

          {/* Store Categories */}
          <div>
            <h4 className="font-heading text-sm font-semibold text-warm-900">Store</h4>
            <ul className="mt-3 space-y-2">
              {STORE_LINKS.map((link) => (
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
            <h4 className="font-heading text-sm font-semibold text-warm-900">Company</h4>
            <ul className="mt-3 space-y-2">
              {COMPANY_LINKS.map((link) => (
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
            <h4 className="font-heading text-sm font-semibold text-warm-900">Legal</h4>
            <ul className="mt-3 space-y-2">
              {LEGAL_LINKS.map((link) => (
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
            © {new Date().getFullYear()} SanatanSetu. All rights reserved.
          </p>
          <p className="text-xs text-warm-500">
            Sacred Products • Verified Quality • 4.8★ Rating • 50K+ Happy Customers
          </p>
        </div>
      </div>
    </footer>
  );
}
