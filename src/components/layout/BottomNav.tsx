"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Package, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home, activeEmoji: "🏠" },
  { label: "Store", href: "/store", icon: ShoppingBag, activeEmoji: "🛍️" },
  { label: "Orders", href: "/user/orders", icon: Package, activeEmoji: "📦" },
  { label: "Profile", href: "/user/profile", icon: User, activeEmoji: "🙏" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-100 md:hidden">
      {/* 3D Depth Layer — creates the 3D "raised" effect */}
      <div className="absolute inset-x-0 -top-3 h-6 bg-linear-to-t from-black/3 to-transparent pointer-events-none" />

      {/* Main Bar with Premium Glassmorphism + 3D shadow */}
      <div className="relative mx-3 mb-2 overflow-hidden rounded-2xl border border-saffron-200/30 shadow-[0_-2px_20px_-4px_rgba(245,158,11,0.15),0_4px_12px_-2px_rgba(0,0,0,0.08)]">
        {/* Layered glass background */}
        <div className="absolute inset-0 bg-white/90 backdrop-blur-2xl" />
        {/* Golden shimmer gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-saffron-50/40 via-transparent to-gold-50/40 pointer-events-none" />
        {/* Top golden line */}
        <div className="absolute top-0 inset-x-4 h-px bg-linear-to-r from-transparent via-saffron-300/60 to-transparent" />

        <div className="relative flex items-stretch justify-around px-1 pb-safe">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname?.startsWith(item.href.split("?")[0]));

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "relative flex flex-1 flex-col items-center justify-center gap-1 min-h-[60px] py-2 transition-all duration-400 ease-out group",
                  isActive
                    ? "text-saffron-600"
                    : "text-neutral-400 active:scale-90"
                )}
              >
                {/* Active glow behind icon */}
                {isActive && (
                  <span className="absolute top-1.5 size-10 rounded-full bg-saffron-400/15 blur-lg animate-pulse pointer-events-none" />
                )}

                {/* 3D Floating Icon Container */}
                <span
                  className={cn(
                    "relative flex size-10 items-center justify-center rounded-2xl transition-all duration-400 ease-out",
                    isActive
                      ? "bg-linear-to-br from-saffron-400 to-saffron-600 text-white shadow-[0_4px_12px_-2px_rgba(245,158,11,0.4)] -translate-y-1 scale-110"
                      : "bg-transparent text-neutral-400 group-hover:bg-warm-100/60 group-hover:text-warm-600"
                  )}
                >
                  {/* Inner light reflection for 3D depth */}
                  {isActive && (
                    <span className="absolute inset-x-1 top-0.5 h-[40%] rounded-t-xl bg-white/25 pointer-events-none" />
                  )}
                  <item.icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    className="relative z-10 transition-all duration-300"
                  />
                </span>

                {/* Label */}
                <span
                  className={cn(
                    "text-[10px] leading-tight tracking-wide transition-all duration-300",
                    isActive
                      ? "font-bold text-saffron-700"
                      : "font-medium text-neutral-400 group-hover:text-warm-600"
                  )}
                >
                  {item.label}
                </span>

                {/* Active bottom dot indicator */}
                <span
                  className={cn(
                    "absolute bottom-1 size-1 rounded-full bg-saffron-500 transition-all duration-300",
                    isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"
                  )}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
