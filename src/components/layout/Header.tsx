"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { useCart } from "@/contexts/CartContext";
import {
  Menu,
  X,
  Home,
  ShoppingBag,
  Sparkles,
  Heart,
  ChevronRight,
  User,
  MapPin,
  Settings,
  LogOut,
  LogIn,
  Bell,
  Search,
  ShoppingCart,
  Package,
  Crown,
  Gem,
  BookOpen,
  Phone,
  Info,
  Truck,
  Shield,
  Star,
  RotateCcw,
} from "lucide-react";
import { useState, useEffect } from "react";

const MENU_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Store", href: "/store", icon: ShoppingBag, highlight: true },
  { label: "Rudraksha", href: "/store?category=rudraksha", icon: Gem },
  { label: "Puja Kits", href: "/store?category=puja-kits", icon: Package },
  { label: "Calculators", href: "/calculators", icon: Sparkles },
];

const PROFILE_ITEMS = [
  { label: "My Profile", href: "/user/profile", icon: User },
  { label: "My Orders", href: "/user/orders", icon: Package },
  { label: "Wishlist", href: "/user/wishlist", icon: Heart },
  { label: "Saved Addresses", href: "/user/addresses", icon: MapPin },
  { label: "Notifications", href: "/user/notifications", icon: Bell },
  { label: "Settings", href: "/user/settings", icon: Settings },
];

const OFFER_MESSAGES = [
  { icon: Shield, text: "100% Natural & Lab Certified" },
  { icon: Sparkles, text: "Energised by Experts" },
  { icon: Truck, text: "COD Available" },
  { icon: Shield, text: "7 Day Easy Return" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { user, loading, logout } = useUser();
  const { count: cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  async function handleLogout() {
    await logout();
    setOpen(false);
    window.location.href = "/";
  }

  const isHome = pathname === "/";

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${isScrolled
          ? "bg-white/95 backdrop-blur-xl shadow-[0_2px_20px_rgba(0,0,0,0.06)]"
          : "bg-white"
          }`}
      >
        {/* ═══ Top Bar: Logo centered, Search + Cart + Profile ═══ */}
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          {/* Left: Hamburger (Mobile) */}
          <button
            type="button"
            aria-label="Open menu"
            className="flex size-10 shrink-0 items-center justify-center rounded-xl text-warm-800 hover:bg-saffron-50 active:bg-saffron-100 transition-colors md:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu size={22} strokeWidth={2} />
          </button>

          {/* Desktop left nav */}
          <nav className="hidden items-center gap-6 md:flex">
            {[
              { label: "Home", href: "/" },
              { label: "Store", href: "/store" },
              { label: "Rudraksha", href: "/store?category=rudraksha" },
              { label: "Puja Kits", href: "/store?category=puja-kits" },
              { label: "About", href: "/about" },
            ].map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm tracking-wide font-medium transition-all ${isActive
                    ? "text-saffron-600 font-bold"
                    : "text-warm-800 hover:text-saffron-600"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Center: Logo */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0"
          >
            <span className="flex items-center gap-1.5 font-heading text-xl font-bold text-saffron-600 md:text-2xl">
              <span className="text-2xl drop-shadow-sm">🙏</span>
              <span className="hidden xs:inline">SanatanSetu</span>
              <span className="xs:hidden">SS</span>
            </span>
          </Link>

          {/* Right: Icons */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Search */}
            <Link
              href="/search"
              className="flex size-9 items-center justify-center rounded-full text-warm-700 hover:bg-saffron-50 transition-colors icon-glow"
              aria-label="Search"
            >
              <Search size={19} strokeWidth={1.8} />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex size-9 items-center justify-center rounded-full text-warm-700 hover:bg-saffron-50 transition-colors icon-glow"
              aria-label="Cart"
            >
              <ShoppingCart size={19} strokeWidth={1.8} />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-[18px] items-center justify-center rounded-full bg-gradient-to-br from-saffron-500 to-saffron-600 text-[9px] font-bold text-white shadow-md animate-badge-bounce">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {/* Profile (Mobile) */}
            <Link
              href={user ? "/user/profile" : "/user/login"}
              className="flex size-9 items-center justify-center rounded-full text-warm-700 hover:bg-saffron-50 transition-colors md:hidden icon-glow"
              aria-label="Account"
            >
              <User size={19} strokeWidth={1.8} />
            </Link>

            {/* Desktop User/Login */}
            <div className="hidden md:block ml-1">
              {user ? (
                <Link href="/user/profile" className="flex items-center gap-2 group">
                  <div className="flex size-9 items-center justify-center rounded-full bg-saffron-100 text-saffron-700 group-hover:bg-saffron-200 transition-colors">
                    <User size={16} />
                  </div>
                  <span className="text-sm font-semibold text-warm-900">
                    {user.name?.split(" ")[0] || "Profile"}
                  </span>
                </Link>
              ) : (
                <Link
                  href="/user/login"
                  className="text-sm font-semibold text-warm-900 hover:text-saffron-600 transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* ═══ Scrolling Offer Bar ═══ */}
        <div className="border-t border-saffron-100 bg-gradient-to-r from-saffron-50 to-gold-50 overflow-hidden">
          <div className="flex animate-offer-scroll whitespace-nowrap py-1.5">
            {[...OFFER_MESSAGES, ...OFFER_MESSAGES].map((offer, i) => {
              const Icon = offer.icon;
              return (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-6 text-[11px] font-medium text-saffron-700"
                >
                  <Icon size={12} className="text-gold-600 shrink-0" />
                  {offer.text}
                  <span className="text-gold-400 ml-4">✦</span>
                </span>
              );
            })}
          </div>
        </div>
      </header>

      {/* ═══════ FULLSCREEN MENU DRAWER (Mobile) ═══════ */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-60 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        onClick={() => setOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed left-0 top-0 z-70 flex h-dvh w-[85%] max-w-[320px] flex-col bg-warm-50 shadow-2xl shadow-warm-900/20 transition-transform duration-300 ease-out md:hidden ${open ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Drawer Header */}
        <div className="border-b border-saffron-200/50 px-5 py-4">
          <div className="flex items-center justify-between">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-full bg-linear-to-br from-saffron-400 to-saffron-600 text-lg font-bold text-white shadow">
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="size-11 rounded-full object-cover" />
                  ) : (
                    user.name?.[0]?.toUpperCase() || "U"
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-warm-900">{user.name || "User"}</p>
                  <p className="text-xs text-warm-500">
                    +91 {user.phone?.replace("google_", "")}
                  </p>
                </div>
              </div>
            ) : (
              <Link
                href="/user/login"
                className="flex items-center gap-3 rounded-xl bg-saffron-50 px-4 py-2.5"
                onClick={() => setOpen(false)}
              >
                <LogIn size={18} className="text-saffron-600" />
                <span className="text-sm font-semibold text-saffron-700">
                  Login / Sign Up
                </span>
              </Link>
            )}
            <button
              type="button"
              aria-label="Close menu"
              className="flex size-9 items-center justify-center rounded-full bg-saffron-50 text-saffron-600 transition active:scale-90"
              onClick={() => setOpen(false)}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          <p className="mb-2 px-4 text-[10px] font-semibold uppercase tracking-wider text-warm-400">
            Shop
          </p>
          <div className="space-y-1">
            {MENU_ITEMS.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname?.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all active:scale-[0.98] ${isActive
                    ? "bg-saffron-100 text-saffron-700 shadow-sm"
                    : item.highlight
                      ? "bg-linear-to-r from-saffron-50 to-gold-50 text-saffron-700"
                      : "text-warm-800 hover:bg-warm-100/50"
                    }`}
                  onClick={() => setOpen(false)}
                >
                  <div
                    className={`flex size-8 items-center justify-center rounded-lg ${isActive
                      ? "bg-saffron-500 text-white shadow-sm"
                      : "bg-gold-50 text-gold-600"
                      }`}
                  >
                    <Icon size={16} />
                  </div>
                  <span className="flex-1">{item.label}</span>
                  <ChevronRight
                    size={14}
                    className={isActive ? "text-saffron-500" : "text-warm-300"}
                  />
                </Link>
              );
            })}
          </div>

          {/* Profile Section */}
          {user && (
            <>
              <div className="my-3 h-px bg-warm-200/50" />
              <p className="mb-2 px-4 text-[10px] font-semibold uppercase tracking-wider text-warm-400">
                My Account
              </p>
              <div className="space-y-1">
                {PROFILE_ITEMS.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all active:scale-[0.98] ${isActive
                        ? "bg-saffron-100 text-saffron-700"
                        : "text-warm-700 hover:bg-warm-100/50"
                        }`}
                      onClick={() => setOpen(false)}
                    >
                      <div
                        className={`flex size-8 items-center justify-center rounded-lg ${isActive
                          ? "bg-saffron-500 text-white"
                          : "bg-gray-100 text-warm-500"
                          }`}
                      >
                        <Icon size={16} />
                      </div>
                      <span className="flex-1">{item.label}</span>
                      <ChevronRight size={14} className="text-warm-300" />
                    </Link>
                  );
                })}
              </div>
            </>
          )}

          {/* About & Contact */}
          <div className="my-3 h-px bg-warm-200/50" />
          <div className="space-y-1">
            <Link
              href="/about"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-warm-700 hover:bg-warm-100/50"
              onClick={() => setOpen(false)}
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-gray-100 text-warm-500">
                <Info size={16} />
              </div>
              <span className="flex-1">About Us</span>
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-warm-700 hover:bg-warm-100/50"
              onClick={() => setOpen(false)}
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-gray-100 text-warm-500">
                <Phone size={16} />
              </div>
              <span className="flex-1">Contact</span>
            </Link>
          </div>
        </nav>

        {/* Drawer Footer */}
        <div className="border-t border-saffron-200/50 px-5 py-4 space-y-3">
          {user ? (
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 transition active:scale-95"
            >
              <LogOut size={16} />
              Logout
            </button>
          ) : (
            <Link
              href="/user/login"
              className="gradient-saffron flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-bold text-white shadow-lg btn-glow"
              onClick={() => setOpen(false)}
            >
              <LogIn size={16} />
              Login / Sign Up
            </Link>
          )}
          <p className="text-center text-[10px] text-warm-400">
            © 2026 SanatanSetu · All rights reserved
          </p>
        </div>
      </div>
    </>
  );
}
