// ── Navigation ───────────────────────────────────────────────────────────────

export const NAV_LINKS = {
  main: [
    { label: "Home", href: "/" },
    { label: "Puja", href: "/puja" },
    { label: "Astrology", href: "/astrology" },
    { label: "Store", href: "/store" },
  ],
  top: [
    { label: "Temple", href: "/temple" },
    { label: "Kumbh Mela", href: "/kumbh" },
    { label: "About", href: "/about" },
  ],
} as const;

export const BOTTOM_NAV = [
  { label: "Home", href: "/", icon: "Home" },
  { label: "Puja", href: "/puja", icon: "Flame" },
  { label: "Astro", href: "/astrology", icon: "Sparkles" },
  { label: "Store", href: "/store", icon: "ShoppingBag" },
  { label: "Bookings", href: "/booking/my-bookings", icon: "Calendar" },
] as const;

// ── Categories (Home Grid) ─────────────────────────────────────────────────

export const CATEGORIES = [
  {
    id: "puja",
    name: "Puja",
    slug: "/puja",
    icon: "Flame",
    description: "Book verified pandits",
  },
  {
    id: "astrology",
    name: "Astrology",
    slug: "/astrology",
    icon: "Sparkles",
    description: "Talk to experts",
  },
  {
    id: "temple",
    name: "Temple",
    slug: "/temple",
    icon: "Church",
    description: "Temple puja booking",
  },
  {
    id: "store",
    name: "Store",
    slug: "/store",
    icon: "ShoppingBag",
    description: "Authentic products",
  },
  {
    id: "kumbh",
    name: "Kumbh",
    slug: "/kumbh",
    icon: "Waves",
    description: "Pilgrimage packages",
  },
  {
    id: "vip-darshan",
    name: "VIP Darshan",
    slug: "/kumbh",
    icon: "Crown",
    description: "Priority spiritual access",
  },
] as const;

// ── Offer banners ───────────────────────────────────────────────────────────

export const HOME_OFFERS = [
  {
    id: "offer-1",
    title: "Maha Shivratri Special",
    subtitle: "Up to 30% off on Rudrabhishek packages",
    cta: "Book Festival Puja",
    href: "/puja",
    badge: "Festival Offer",
  },
  {
    id: "offer-2",
    title: "Griha Pravesh Combo",
    subtitle: "Pandit + samagri bundle from ₹2,499",
    cta: "View Packages",
    href: "/puja",
    badge: "Trending",
  },
  {
    id: "offer-3",
    title: "Astrology Starter",
    subtitle: "First consultation from ₹199/min",
    cta: "Talk To Expert",
    href: "/astrology",
    badge: "New",
  },
  {
    id: "offer-4",
    title: "Temple VIP Darshan",
    subtitle: "Fast-track darshan with guided rituals",
    cta: "Explore Temple Services",
    href: "/temple",
    badge: "Limited Slots",
  },
] as const;

// ── How It Works (3 steps) ────────────────────────────────────────────────

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Select Service",
    desc: "Choose puja, astrology, temple service, or store item.",
    icon: "Search",
  },
  {
    step: 2,
    title: "Book Instantly",
    desc: "Pick package, date, and city with transparent pricing.",
    icon: "Calendar",
  },
  {
    step: 3,
    title: "Pandit Assigned",
    desc: "Verified pandit and support team confirm everything on WhatsApp.",
    icon: "CheckCircle",
  },
] as const;

// ── Why SmartPandit ───────────────────────────────────────────────────────

export const WHY_SMARTPANDIT = [
  {
    title: "Verified Pandits",
    desc: "Background checked, ritual trained, and reviewed.",
    icon: "Shield",
  },
  {
    title: "Secure Booking",
    desc: "Safe payment flow with instant confirmations.",
    icon: "Tag",
  },
  {
    title: "Authentic Products",
    desc: "Sourced spiritual items and samagri quality checks.",
    icon: "MessageCircle",
  },
  {
    title: "Fast Support",
    desc: "Real humans on call and WhatsApp for every booking.",
    icon: "Zap",
  },
] as const;

// ── Trust badges ───────────────────────────────────────────────────────────

export const TRUST_BADGES = [
  "Pandit Verified",
  "Secure Booking",
  "Authentic Products",
  "1L+ Services Done",
  "4.8★ Rating",
] as const;

// ── Footer links ───────────────────────────────────────────────────────────

export const FOOTER_LINKS = {
  services: [
    { label: "Puja Booking", href: "/puja" },
    { label: "Astrology", href: "/astrology" },
    { label: "Store", href: "/store" },
    { label: "Temple Puja", href: "/temple" },
    { label: "Kumbh Mela", href: "/kumbh" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/faq" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cancellation Policy", href: "/cancellation" },
  ],
} as const;

// ── WhatsApp ───────────────────────────────────────────────────────────────

export const WHATSAPP_NUMBER = "919876543210"; // Replace with real number
