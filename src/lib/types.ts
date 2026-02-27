// ── Puja ──────────────────────────────────────────────────────────────────

export interface PujaCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  pujaCount?: number;
}

export interface PujaPackage {
  id: string;
  name: string;          // e.g. "Silver", "Gold", "Platinum"
  price: number;
  duration: string;      // e.g. "2 hours"
  pandits: number;
  samagri: boolean;
  benefits: string[];
  popular?: boolean;
}

export interface Puja {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  image: string;
  startingPrice: number;
  rating: number;
  reviewCount: number;
  duration: string;
  shortBenefits: string[];
  description: string;
  whenToDo?: string;
  process?: string[];
  samagriList?: string[];
  packages?: PujaPackage[];
  popular?: boolean;
  featured?: boolean;
}

// ── Astrology ─────────────────────────────────────────────────────────────

export type AstrologyType =
  | "love"
  | "career"
  | "health"
  | "finance"
  | "marriage"
  | "kundali"
  | "numerology"
  | "vastu";

export interface Astrologer {
  id: string;
  name: string;
  image: string;
  specialization: AstrologyType[];
  experience: number;
  rating: number;
  reviewCount: number;
  languages: string[];
  pricePerMin: number;
  isOnline: boolean;
  verified: boolean;
}

export interface AstrologyService {
  id: string;
  type: AstrologyType;
  name: string;
  description: string;
  icon: string;
  startingPrice: number;
  duration: string;
}

// ── Store / Products ───────────────────────────────────────────────────────

export type ProductCategory =
  | "rudraksha"
  | "puja-kits"
  | "astrology-remedies"
  | "temple-products"
  | "spiritual-jewellery"
  | "premium-kits"
  | "digital-products"
  | "subscription-boxes"
  | "idols"
  | "samagri"
  | "books"
  | "jewelry"
  | "incense"
  | "gemstones"
  | "yantras";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory | string;
  images: string[];
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  benefits: string[];
  description: string;
  inStock: boolean;
  isAuthentic?: boolean;
  weight?: string;
  material?: string;
  featured?: boolean;
  panditRecommended?: boolean;
  astrologerRecommended?: boolean;
  video?: string;
  howToUse?: string;
  spiritualStory?: string;
  subscriptionAvailable?: boolean;
  bundleAvailable?: boolean;
}

// ── Temple ─────────────────────────────────────────────────────────────────

export interface Temple {
  id: string;
  slug: string;
  name: string;
  location: string;
  state: string;
  image: string;
  deity: string;
  description: string;
  rating: number;
  availableServices: TempleService[];
}

export interface TempleService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
}

// ── Booking ────────────────────────────────────────────────────────────────

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";
export type BookingType = "puja" | "astrology" | "temple" | "product";

export interface Booking {
  id: string;
  type: BookingType;
  title: string;
  date: string;
  time: string;
  status: BookingStatus;
  amount: number;
  panditName?: string;
  location?: string;
  packageName?: string;
}

// ── Testimonial ───────────────────────────────────────────────────────────

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar?: string;
  rating: number;
  text: string;
  pujaName?: string;
  date?: string;
}

// ── FAQ ───────────────────────────────────────────────────────────────────

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

// ── Navigation ────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}
