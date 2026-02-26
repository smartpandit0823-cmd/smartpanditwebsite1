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
    default: "SmartPandit – Book Verified Pandits Online",
    template: "%s | SmartPandit",
  },
  description:
    "India's most trusted platform to book verified pandits for puja, astrology consultations, religious products, and temple services. Starting ₹499.",
  keywords: [
    "book pandit online",
    "puja booking",
    "astrology consultation",
    "pooja samagri",
    "temple puja",
    "kumbh mela",
    "SmartPandit",
  ],
  authors: [{ name: "SmartPandit" }],
  creator: "SmartPandit",
  metadataBase: new URL("https://smartpandit.in"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://smartpandit.in",
    siteName: "SmartPandit",
    title: "SmartPandit – Book Verified Pandits Online",
    description:
      "India's most trusted platform to book verified pandits for puja, astrology consultations, religious products, and temple services.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartPandit – Book Verified Pandits Online",
    description: "Book verified pandits for puja, astrology & more. Starting ₹499.",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SmartPandit",
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
