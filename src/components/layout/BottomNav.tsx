"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Search, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export function BottomNav() {
  const pathname = usePathname();
  const { count: cartCount } = useCart();

  const TABS = [
    { label: "Home", href: "/", icon: Home },
    { label: "Shop", href: "/shop", icon: ShoppingBag },
    { label: "Search", href: "/search", icon: Search },
    { label: "Cart", href: "/cart", icon: ShoppingCart },
    { label: "Account", href: "/user/profile", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden h-[60px] bg-white border-t border-orange-100 pb-safe shadow-[0_-4px_24px_rgba(255,140,0,0.06)]">
      <nav className="flex items-stretch justify-around h-full px-2">
        {TABS.map((tab) => {
          const isActive = tab.href === "/" ? pathname === "/" : pathname?.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative flex flex-col items-center justify-center flex-1 h-full gap-1 pt-1 transition-all ${isActive ? "text-[#FF8C00]" : "text-[#888888] hover:text-[#FF8C00]"
                }`}
            >
              {/* Active Top Border */}
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-[#FF8C00] rounded-b-full"></div>
              )}

              {/* Icon Section (with cart badge support) */}
              <div className="relative">
                <Icon size={22} className={isActive ? "fill-orange-50" : ""} strokeWidth={isActive ? 2.5 : 2} />

                {tab.label === "Cart" && cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 flex size-[16px] items-center justify-center rounded-full bg-[#FF8C00] text-[9px] font-bold text-white shadow ring-2 ring-white">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </div>

              {/* Label */}
              <span className={`text-[10px] font-bold ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"} transition-all duration-300 absolute bottom-1.5`}>
                {tab.label}
              </span>

              {/* Invisible spacer for label height when active */}
              <span className="text-[10px] opacity-0 font-bold block h-3"></span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
