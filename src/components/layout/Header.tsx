"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { useCart } from "@/contexts/CartContext";
import {
  Menu,
  X,
  Search,
  ShoppingCart,
  User,
  Heart,
  ChevronRight,
  LogOut,
  Home,
  ShoppingBag,
  Package,
  Phone,
  FileText,
  HelpCircle,
  Settings,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

const TRUST_MESSAGES = [
  "🚚 Free Shipping on orders ₹499+",
  "🔬 100% Lab Certified Rudraksha & Gemstones",
  "📦 COD Available Pan India",
  "↩️ 7 Day Easy Return Policy",
  "⚡ Energised by Expert Priests (Praan Pratishtha)",
  "🔐 Authenticity QR Code with Every Order",
];

const MENU_LINKS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Shop All", href: "/shop", icon: ShoppingBag },
  { label: "My Orders", href: "/user/orders", icon: Package },
  { label: "My Cart", href: "/cart", icon: ShoppingCart },
  { label: "Contact Us", href: "/contact", icon: Phone },
  { label: "About Us", href: "/about", icon: FileText },
  { label: "FAQ", href: "/faq", icon: HelpCircle },
];

const CATEGORY_LINKS = [
  { label: "Rudraksha", href: "/shop?category=rudraksha" },
  { label: "Gemstones", href: "/shop?category=gemstones" },
  { label: "Bracelets", href: "/shop?category=bracelets" },
  { label: "Vastu", href: "/shop?category=vastu" },
  { label: "Puja Kits", href: "/shop?category=puja-kits" },
  { label: "Combos", href: "/shop?category=combos" },
  { label: "Pyramids", href: "/shop?category=pyramids" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useUser();
  const { count: cartCount } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  async function handleLogout() {
    await logout();
    setOpen(false);
    window.location.href = "/";
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex flex-col w-full">
        {/* 1.1 — TRUST STRIP */}
        <div className="flex h-8 w-full items-center bg-[#FF8C00] text-white overflow-hidden text-xs font-semibold whitespace-nowrap">
          <div className="flex animate-[marquee_20s_linear_infinite] shrink-0 min-w-full">
            {[...TRUST_MESSAGES, ...TRUST_MESSAGES, ...TRUST_MESSAGES].map(
              (msg, idx) => (
                <span key={idx} className="mx-8">
                  {msg}
                </span>
              )
            )}
          </div>
          <div
            className="flex animate-[marquee_20s_linear_infinite] shrink-0 min-w-full"
            aria-hidden="true"
          >
            {[...TRUST_MESSAGES, ...TRUST_MESSAGES, ...TRUST_MESSAGES].map(
              (msg, idx) => (
                <span key={idx} className="mx-8">
                  {msg}
                </span>
              )
            )}
          </div>
        </div>

        {/* 1.2 — STICKY HEADER */}
        <header
          className={`w-full border-b border-orange-100 transition-all duration-300 ${isScrolled
              ? "bg-white/95 backdrop-blur-md shadow-md"
              : "bg-white"
            }`}
        >
          <div className="mx-auto flex h-14 md:h-16 max-w-7xl items-center justify-between px-4">
            {/* Left: Hamburger (Mobile) */}
            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-xl text-warm-800 lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>

            {/* Center/Left: Logo */}
            <Link href="/" className="lg:mr-8 flex items-center">
              <img
                src="/logo.png"
                alt="SanatanSetu – Premium Spiritual Store"
                className="h-10 w-auto lg:h-11 object-contain"
              />
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-6 mr-auto">
              {[
                { label: "Home", href: "/" },
                { label: "Shop", href: "/shop" },
                { label: "About", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${pathname === link.href
                      ? "text-[#FF8C00]"
                      : "text-gray-700 hover:text-[#FF8C00]"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Center: Search Bar (Desktop) */}
            <div className="hidden lg:flex flex-1 max-w-md px-4">
              <Link href="/search" className="relative w-full">
                <div className="w-full h-10 pl-4 pr-10 rounded-full border border-orange-200 bg-orange-50/30 text-sm flex items-center text-gray-400 cursor-pointer hover:border-[#FF8C00] transition-colors">
                  Search products, purpose, or Rashi...
                </div>
                <Search
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400"
                  size={18}
                />
              </Link>
            </div>

            {/* Right: Icons */}
            <div className="flex items-center gap-1 lg:gap-3">
              {/* Search (Mobile) */}
              <Link
                href="/search"
                className="flex lg:hidden size-10 items-center justify-center text-warm-700"
              >
                <Search size={22} />
              </Link>

              {/* Wishlist */}
              <Link
                href="/user/favorites"
                className="hidden lg:flex relative size-10 items-center justify-center text-warm-700 hover:text-[#FF8C00] transition-colors"
              >
                <Heart size={22} />
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative flex size-10 items-center justify-center text-warm-700 hover:text-[#FF8C00] transition-colors"
              >
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 flex size-[18px] items-center justify-center rounded-full bg-[#FF8C00] text-[9px] font-bold text-white ring-2 ring-white">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>

              {/* User */}
              <Link
                href={user ? "/user/profile" : "/user/login"}
                className="flex size-10 items-center justify-center text-warm-700 hover:text-[#FF8C00] transition-colors"
              >
                {user ? (
                  <div className="flex size-8 items-center justify-center rounded-full bg-[#FF8C00] text-white font-bold text-xs">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                ) : (
                  <User size={22} />
                )}
              </Link>
            </div>
          </div>
        </header>
      </div>

      {/* ═══ MOBILE DRAWER ═══ */}
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-[60] lg:hidden animate-fade-in"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 left-0 bottom-0 w-[300px] bg-white z-[70] lg:hidden transform transition-transform duration-300 ease-out shadow-2xl ${open ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-orange-100 bg-gradient-to-r from-[#FFF8F0] to-white">
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-[#FF8C00] to-[#E67E00] text-white font-bold text-sm shadow-md">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
            ) : (
              <div className="flex size-10 items-center justify-center rounded-full bg-orange-100 text-[#FF8C00]">
                <User size={20} />
              </div>
            )}
            <div>
              {user ? (
                <>
                  <p className="text-sm font-bold text-gray-900">
                    {user.name || "User"}
                  </p>
                  <p className="text-[11px] text-gray-500">{user.phone || user.email || ""}</p>
                </>
              ) : (
                <Link
                  href="/user/login"
                  onClick={() => setOpen(false)}
                  className="text-sm font-bold text-[#FF8C00]"
                >
                  Login / Sign Up →
                </Link>
              )}
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="flex size-8 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="overflow-y-auto h-[calc(100%-80px)] pb-20">
          {/* Main Links */}
          <div className="py-3">
            {MENU_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3.5 px-5 py-3 text-sm font-medium transition-colors ${isActive
                      ? "text-[#FF8C00] bg-orange-50"
                      : "text-gray-700 hover:bg-orange-50/50 hover:text-[#FF8C00]"
                    }`}
                >
                  <Icon size={18} className={isActive ? "text-[#FF8C00]" : "text-gray-400"} />
                  {link.label}
                  <ChevronRight size={14} className="ml-auto text-gray-300" />
                </Link>
              );
            })}
          </div>

          {/* Categories Section */}
          <div className="border-t border-orange-100 py-3">
            <p className="px-5 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Shop by Category
            </p>
            {CATEGORY_LINKS.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3.5 px-5 py-2.5 text-sm text-gray-600 hover:text-[#FF8C00] hover:bg-orange-50/50 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF8C00]/40" />
                {cat.label}
              </Link>
            ))}
          </div>

          {/* Account / Settings / Logout */}
          <div className="border-t border-orange-100 py-3">
            {user && (
              <>
                <Link
                  href="/user/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3.5 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50/50 hover:text-[#FF8C00] transition-colors"
                >
                  <User size={18} className="text-gray-400" />
                  My Profile
                  <ChevronRight size={14} className="ml-auto text-gray-300" />
                </Link>
                <Link
                  href="/user/settings"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3.5 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50/50 hover:text-[#FF8C00] transition-colors"
                >
                  <Settings size={18} className="text-gray-400" />
                  Settings
                  <ChevronRight size={14} className="ml-auto text-gray-300" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3.5 px-5 py-3 w-full text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
