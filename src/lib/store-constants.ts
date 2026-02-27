// ── SanatanSetu Store Categories ─────────────────────────────────────────────

export const STORE_CATEGORIES = [
  {
    id: "rudraksha",
    name: "Rudraksha",
    slug: "/store?category=rudraksha",
    emoji: "📿",
    image: "/images/products/rudraksha.png",
    description: "Divine beads for protection",
    gradient: "from-amber-50 to-orange-50",
    borderColor: "border-amber-200",
  },
  {
    id: "puja-kits",
    name: "Puja Kits",
    slug: "/store?category=puja-kits",
    emoji: "🪔",
    image: "/images/products/puja-kit.png",
    description: "Festival & ritual kits",
    gradient: "from-red-50 to-orange-50",
    borderColor: "border-red-200",
  },
  {
    id: "astrology-remedies",
    name: "Gemstones",
    slug: "/store?category=astrology-remedies",
    emoji: "💎",
    image: "/images/products/gemstone.png",
    description: "Gemstones & yantras",
    gradient: "from-purple-50 to-indigo-50",
    borderColor: "border-purple-200",
  },
  {
    id: "temple-products",
    name: "Temple Products",
    slug: "/store?category=temple-products",
    emoji: "🛕",
    image: "/images/products/puja-kit.png",
    description: "Prasad, vibhuti, jal",
    gradient: "from-yellow-50 to-amber-50",
    borderColor: "border-yellow-200",
  },
  {
    id: "spiritual-jewellery",
    name: "Mala & Beads",
    slug: "/store?category=spiritual-jewellery",
    emoji: "✨",
    image: "/images/products/mala.png",
    description: "Sacred spiritual pieces",
    gradient: "from-rose-50 to-pink-50",
    borderColor: "border-rose-200",
  },
  {
    id: "premium-kits",
    name: "Premium Kits",
    slug: "/store?category=premium-kits",
    emoji: "👑",
    image: "/images/products/puja-kit.png",
    description: "Curated custom combos",
    gradient: "from-amber-50 to-yellow-50",
    borderColor: "border-amber-300",
  },
  {
    id: "digital-products",
    name: "Digital",
    slug: "/store?category=digital-products",
    emoji: "📱",
    image: "/images/products/mala.png",
    description: "E-books & courses",
    gradient: "from-sky-50 to-blue-50",
    borderColor: "border-sky-200",
  },
  {
    id: "subscription-boxes",
    name: "Subscriptions",
    slug: "/store?category=subscription-boxes",
    emoji: "📦",
    image: "/images/products/rudraksha.png",
    description: "Monthly spiritual box",
    gradient: "from-green-50 to-emerald-50",
    borderColor: "border-green-200",
  },
] as const;

// ── Home Banners ─────────────────────────────────────────────────────────────

export const STORE_BANNERS = [
  {
    id: "banner-1",
    title: "Sacred Rudraksha Collection",
    subtitle: "Energized & certified beads for spiritual growth",
    cta: "Explore Now",
    href: "/store?category=rudraksha",
    badge: "Bestseller",
    gradient: "from-saffron-500 via-orange-400 to-amber-500",
    emoji: "📿",
    image: "/images/banners/hero-spiritual.png",
  },
  {
    id: "banner-2",
    title: "Maha Shivratri Puja Kit",
    subtitle: "Complete kit with samagri, instructions & mantra guide",
    cta: "Shop Kit",
    href: "/store?category=puja-kits",
    badge: "Festival Special",
    gradient: "from-maroon-600 via-red-500 to-orange-500",
    emoji: "🪔",
    image: "/images/banners/banner-festive.png",
  },
  {
    id: "banner-3",
    title: "Astrology Remedy Gemstones",
    subtitle: "Lab-certified gemstones recommended by expert astrologers",
    cta: "Find Your Stone",
    href: "/store?category=astrology-remedies",
    badge: "Expert Verified",
    gradient: "from-purple-600 via-violet-500 to-indigo-500",
    emoji: "💎",
    image: "/images/banners/hero-spiritual.png",
  },
  {
    id: "banner-4",
    title: "Monthly Spiritual Box",
    subtitle: "Curated items delivered to your doorstep every month",
    cta: "Subscribe Now",
    href: "/store?category=subscription-boxes",
    badge: "New Launch",
    gradient: "from-emerald-600 via-teal-500 to-green-500",
    emoji: "📦",
    image: "/images/banners/banner-festive.png",
  },
] as const;

// ── Trust / USP Badges ───────────────────────────────────────────────────────

export const STORE_USP_BADGES = [
  { label: "Pandit Verified", icon: "🙏" },
  { label: "Certified Authentic", icon: "📜" },
  { label: "Free Shipping ₹499+", icon: "🚚" },
  { label: "COD Available", icon: "💵" },
  { label: "Easy Returns", icon: "↩️" },
  { label: "Secure Checkout", icon: "🔒" },
] as const;

// ── Product Benefits Icons ───────────────────────────────────────────────────

export const SPIRITUAL_BENEFITS = [
  "Peace of mind",
  "Positive energy",
  "Protection from evil",
  "Prosperity & wealth",
  "Health & well-being",
  "Career growth",
  "Relationship harmony",
  "Spiritual awakening",
] as const;
