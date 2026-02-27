"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  UserCog,
  CreditCard,
  Ticket,
  Image,
  SlidersHorizontal,
  ScrollText,
  Settings,
  Bell,
  MessageSquare,
  BookOpen,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavSection {
  title: string;
  items: { href: string; label: string; icon: React.ElementType }[];
}

const navSections: NavSection[] = [
  {
    title: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Store Management",
    items: [
      { href: "/admin/products", label: "Products", icon: Package },
      { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
    ],
  },
  {
    title: "CMS & Marketing",
    items: [
      { href: "/admin/offers", label: "Coupons & Offers", icon: Ticket },
      { href: "/admin/banners", label: "Shop Banners", icon: Image },
      { href: "/admin/sliders", label: "Home Sliders", icon: SlidersHorizontal },
      { href: "/admin/blogs", label: "Blogs", icon: BookOpen },
    ],
  },
  {
    title: "Customers & Insights",
    items: [
      { href: "/admin/users", label: "Users", icon: Users },
      { href: "/admin/reviews", label: "Product Reviews", icon: MessageSquare },
      { href: "/admin/testimonials", label: "Testimonials", icon: Video },
      { href: "/admin/transactions", label: "Transactions", icon: CreditCard },
    ],
  },
  {
    title: "System & Settings",
    items: [
      { href: "/admin/team", label: "Admin Team", icon: UserCog },
      { href: "/admin/notifications", label: "Notifications", icon: Bell },
      { href: "/admin/audit-logs", label: "Audit Logs", icon: ScrollText },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gold-200 bg-white flex flex-col">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center border-b border-gold-200 px-6">
        <Link
          href="/admin"
          className="flex items-center gap-2 font-heading text-xl font-bold text-warm-900"
        >
          <span className="gradient-saffron flex h-8 w-8 items-center justify-center rounded-lg text-white text-sm">
            ॐ
          </span>
          SmartPandit Store
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {navSections.map((section) => (
          <div key={section.title}>
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              {section.title}
            </p>
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
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                      isActive
                        ? "bg-saffron-100 text-saffron-700 shadow-sm"
                        : "text-warm-700 hover:bg-saffron-50 hover:text-warm-900"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="shrink-0 border-t border-gold-200 p-4">
        <p className="text-center text-xs text-gray-400">Store Admin v2.0</p>
      </div>
    </aside>
  );
}
