"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Flame, ShoppingBag, Sparkles, Landmark, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Puja", href: "/puja", icon: Flame },
  { label: "Store", href: "/store", icon: ShoppingBag },
  { label: "Astro", href: "/astrology", icon: Sparkles },
  { label: "Temple", href: "/temple", icon: Landmark },
  { label: "Bookings", href: "/user/bookings", icon: CalendarCheck },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="border-t border-saffron-200/40 bg-[#fffdf7]/90 backdrop-blur-xl supports-[backdrop-filter]:bg-[#fffdf7]/75">
        <div className="mx-auto flex max-w-lg items-stretch justify-around pb-safe">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex flex-1 flex-col items-center gap-0.5 py-2 transition-all duration-200",
                  isActive ? "text-saffron-600" : "text-warm-500 active:scale-90"
                )}
              >
                {isActive && (
                  <span className="absolute -top-0.5 left-1/2 h-[3px] w-5 -translate-x-1/2 rounded-full bg-gradient-to-r from-saffron-400 to-saffron-600" />
                )}
                <item.icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className={cn("transition-transform duration-200", isActive && "scale-110")}
                />
                <span className={cn("text-[9px] font-medium leading-tight", isActive && "font-semibold")}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
