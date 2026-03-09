"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Ticket,
  Image,
  Settings,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Star,
  Gift,
  ScrollText,
  Layers,
  Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavSection {
  title: string;
  items: { href: string; label: string; icon: React.ElementType; badge?: string }[];
}

const navSections: NavSection[] = [
  {
    title: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    title: "Storefront",
    items: [
      { href: "/admin/banners", label: "Banners", icon: Image },
      { href: "/admin/categories", label: "Categories", icon: Layers },
    ],
  },
  {
    title: "Inventory",
    items: [
      { href: "/admin/products", label: "Products", icon: Package },
      { href: "/admin/combos", label: "Combos", icon: Gift },
    ],
  },
  {
    title: "Sales & Services",
    items: [
      { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
      { href: "/admin/customers", label: "Customers", icon: Users },
      { href: "/admin/astrology-requests", label: "Astro Requests", icon: Star },
    ],
  },
  {
    title: "Marketing",
    items: [
      { href: "/admin/coupons", label: "Coupons", icon: Ticket },
      { href: "/admin/reviews", label: "Reviews", icon: Star },
      { href: "/admin/blogs", label: "Blogs", icon: ScrollText },
    ],
  },
  {
    title: "System",
    items: [
      { href: "/admin/shipping", label: "Shipping", icon: Truck },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen flex flex-col transition-all duration-300 ease-in-out",
        "bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a]",
        "border-r border-white/[0.06]",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.06] px-4">
        <Link href="/admin" className="flex items-center gap-2.5 overflow-hidden">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-saffron-500 to-amber-600 text-white text-lg font-bold shadow-lg shadow-saffron-500/20">
            ॐ
          </span>
          {!collapsed && (
            <span className="font-heading text-[15px] font-bold text-white whitespace-nowrap">
              SmartPandit
            </span>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors",
            collapsed && "mx-auto mt-2"
          )}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5 no-scrollbar">
        {navSections.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-500">
                {section.title}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200",
                      collapsed && "justify-center px-0",
                      isActive
                        ? "bg-gradient-to-r from-saffron-500/20 to-amber-500/10 text-saffron-400 shadow-sm shadow-saffron-500/5"
                        : "text-gray-400 hover:bg-white/[0.06] hover:text-gray-200"
                    )}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-saffron-500" />
                    )}
                    <Icon className={cn("h-[18px] w-[18px] shrink-0", isActive && "text-saffron-400")} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {!collapsed && item.badge && (
                      <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-saffron-500/20 px-1.5 text-[10px] font-bold text-saffron-400">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="shrink-0 border-t border-white/[0.06] p-3">
        {!collapsed ? (
          <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] px-3 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-xs font-bold text-white">
              SP
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-300 truncate">SmartPandit Pro</p>
              <p className="text-[10px] text-gray-500">v3.0 Enterprise</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-xs font-bold text-white">
              SP
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
