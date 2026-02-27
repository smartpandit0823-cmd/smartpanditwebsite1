import type { Metadata, Viewport } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import { ConditionalSiteShell } from "@/components/layout/ConditionalSiteShell";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "SanatanSetu – Premium Spiritual Store",
    template: "%s | SanatanSetu",
  },
  description:
    "India's premium spiritual store — Rudraksha, Puja Kits, Gemstones, Temple Prasad, Sacred Jewellery & more. Pandit verified, astrologer recommended. Free shipping ₹499+.",
  keywords: [
    "spiritual products",
    "rudraksha online",
    "puja kit",
    "gemstones",
    "temple prasad",
    "spiritual jewellery",
    "astrology remedies",
    "premium puja kits",
    "SanatanSetu",
  ],
  authors: [{ name: "SanatanSetu" }],
  creator: "SanatanSetu",
  metadataBase: new URL("https://sanatansetu.com"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://sanatansetu.com",
    siteName: "SanatanSetu",
    title: "SanatanSetu – Premium Spiritual Store",
    description:
      "India's premium spiritual store — authentic products curated by verified pandits & expert astrologers.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SanatanSetu – Premium Spiritual Store",
    description:
      "Shop Rudraksha, Puja Kits, Gemstones & more. Pandit verified. Starting ₹199.",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SanatanSetu",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ff7d00",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable}`}>
      <body className="antialiased font-sans bg-warm-50 text-warm-900">
        <ConditionalSiteShell>{children}</ConditionalSiteShell>
      </body>
    </html>
  );
}
