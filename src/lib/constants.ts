// ── Navigation ───────────────────────────────────────────────────────────────

export const NAV_LINKS = {
  main: [
    { label: "Home", href: "/" },
    { label: "Store", href: "/store" },
    { label: "Rudraksha", href: "/store?category=rudraksha" },
    { label: "Puja Kits", href: "/store?category=puja-kits" },
  ],
  top: [
    { label: "Premium Kits", href: "/store?category=premium-kits" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
  ],
} as const;

export const BOTTOM_NAV = [
  { label: "Home", href: "/", icon: "Home" },
  { label: "Search", href: "/store", icon: "Search" },
  { label: "Store", href: "/store", icon: "ShoppingBag" },
  { label: "Wishlist", href: "/user/wishlist", icon: "Heart" },
  { label: "Profile", href: "/user/profile", icon: "User" },
] as const;

// ── Store Categories (Home Grid) ─────────────────────────────────────────────

export const CATEGORIES = [
  {
    id: "rudraksha",
    name: "Rudraksha",
    slug: "/store?category=rudraksha",
    icon: "Gem",
    description: "Sacred beads for protection",
  },
  {
    id: "puja-kits",
    name: "Puja Kits",
    slug: "/store?category=puja-kits",
    icon: "Flame",
    description: "Complete ritual kits",
  },
  {
    id: "astrology-remedies",
    name: "Astro Remedies",
    slug: "/store?category=astrology-remedies",
    icon: "Sparkles",
    description: "Gemstones & yantras",
  },
  {
    id: "temple-products",
    name: "Temple Products",
    slug: "/store?category=temple-products",
    icon: "Church",
    description: "Prasad & temple items",
  },
  {
    id: "spiritual-jewellery",
    name: "Jewellery",
    slug: "/store?category=spiritual-jewellery",
    icon: "Crown",
    description: "Sacred spiritual pieces",
  },
  {
    id: "premium-kits",
    name: "Premium Kits",
    slug: "/store?category=premium-kits",
    icon: "Star",
    description: "Curated custom combos",
  },
] as const;

// ── Offer banners ───────────────────────────────────────────────────────────

export const HOME_OFFERS = [
  {
    id: "offer-1",
    title: "Sacred Rudraksha Collection",
    subtitle: "Energized & certified — starting ₹299",
    cta: "Shop Rudraksha",
    href: "/store?category=rudraksha",
    badge: "Bestseller",
  },
  {
    id: "offer-2",
    title: "Festival Puja Kit",
    subtitle: "Complete kit with samagri & mantra guide",
    cta: "View Kits",
    href: "/store?category=puja-kits",
    badge: "New",
  },
  {
    id: "offer-3",
    title: "Astrology Gemstones",
    subtitle: "Lab-certified stones from expert astrologers",
    cta: "Find Your Stone",
    href: "/store?category=astrology-remedies",
    badge: "Expert Verified",
  },
  {
    id: "offer-4",
    title: "Monthly Spiritual Box",
    subtitle: "Curated items delivered every month",
    cta: "Subscribe Now",
    href: "/store?category=subscription-boxes",
    badge: "New Launch",
  },
] as const;

// ── How It Works (3 steps) ────────────────────────────────────────────────

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Browse & Discover",
    desc: "Explore curated spiritual products by category or recommendation.",
    icon: "Search",
  },
  {
    step: 2,
    title: "Order Instantly",
    desc: "Add to cart, choose COD or pay online — quick checkout.",
    icon: "ShoppingCart",
  },
  {
    step: 3,
    title: "Receive & Bless",
    desc: "Authentic products delivered with certificate of authenticity.",
    icon: "CheckCircle",
  },
] as const;

// ── Why SanatanSetu ───────────────────────────────────────────────────────

export const WHY_SMARTPANDIT = [
  {
    title: "Pandit Verified",
    desc: "Products recommended by verified pandits.",
    icon: "Shield",
  },
  {
    title: "Authentic & Certified",
    desc: "Every item comes with authenticity certificate.",
    icon: "BadgeCheck",
  },
  {
    title: "Astrologer Recommended",
    desc: "Remedy products suggested by expert astrologers.",
    icon: "Sparkles",
  },
  {
    title: "Fast Delivery",
    desc: "Free shipping on orders ₹499+. COD available.",
    icon: "Truck",
  },
] as const;

// ── Trust badges ───────────────────────────────────────────────────────────

export const TRUST_BADGES = [
  "Pandit Verified",
  "Authenticity Certificate",
  "Free Shipping ₹499+",
  "COD Available",
  "Easy Returns",
] as const;

// ── Footer links ───────────────────────────────────────────────────────────

export const FOOTER_LINKS = {
  services: [
    { label: "Rudraksha", href: "/store?category=rudraksha" },
    { label: "Puja Kits", href: "/store?category=puja-kits" },
    { label: "Astro Remedies", href: "/store?category=astrology-remedies" },
    { label: "Temple Products", href: "/store?category=temple-products" },
    { label: "Premium Kits", href: "/store?category=premium-kits" },
    { label: "Jewellery", href: "/store?category=spiritual-jewellery" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/faq" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cancellation Policy", href: "/cancellation" },
    { label: "Return Policy", href: "/return-policy" },
  ],
} as const;

// ── WhatsApp ───────────────────────────────────────────────────────────────

export const WHATSAPP_NUMBER = "919022462127";
