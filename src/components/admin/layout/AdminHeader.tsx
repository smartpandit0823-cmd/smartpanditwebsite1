"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bell,
  ChevronDown,
  LogOut,
  User,
  Search,
  Settings,
  Menu,
  Sun,
  Moon,
  ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils/index";

interface AdminHeaderProps {
  user?: { name?: string | null; email?: string | null; image?: string | null };
}

// Generate breadcrumbs from pathname
function getBreadcrumbs(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [];
  let current = "";
  for (const part of parts) {
    current += `/${part}`;
    crumbs.push({
      label: part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, " "),
      href: current,
    });
  }
  return crumbs;
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [isDark, setIsDark] = useState(false);
  const breadcrumbs = getBreadcrumbs(pathname);

  function handleGlobalSearch(e: React.KeyboardEvent) {
    if (e.key === "Enter" && search.trim()) {
      router.push(`/admin/orders?q=${encodeURIComponent(search.trim())}`);
    }
  }

  function toggleTheme() {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  }

  return (
    <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left: Breadcrumbs */}
        <div className="flex items-center gap-2 min-w-0">
          <nav className="hidden md:flex items-center gap-1 text-sm">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.href} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-gray-300" />}
                {i === breadcrumbs.length - 1 ? (
                  <span className="font-semibold text-gray-900">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="text-gray-400 hover:text-gray-600 transition-colors">
                    {crumb.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Center: Search */}
        <div className="relative hidden sm:block w-full max-w-sm mx-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search orders, products, customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleGlobalSearch}
            className="w-full pl-10 pr-4 h-10 bg-gray-50/80 border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:bg-white focus:shadow-sm focus:border-saffron-300 transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
            ⌘K
          </kbd>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" asChild className="h-9 w-9 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 relative">
            <Link href="/admin/notifications">
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </Link>
          </Button>

          {/* Divider */}
          <div className="h-8 w-px bg-gray-200 mx-1.5" />

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2.5 h-10 px-2 rounded-xl hover:bg-gray-50">
                <Avatar className="h-8 w-8 rounded-xl">
                  <AvatarFallback className="rounded-xl bg-gradient-to-br from-saffron-500 to-amber-600 text-xs font-bold text-white">
                    {user?.name ? getInitials(user.name) : "AD"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-gray-900 leading-none">{user?.name || "Admin"}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Administrator</p>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400 hidden sm:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60 rounded-xl shadow-lg border-gray-100">
              <DropdownMenuLabel className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 rounded-xl">
                    <AvatarFallback className="rounded-xl bg-gradient-to-br from-saffron-500 to-amber-600 text-sm font-bold text-white">
                      {user?.name ? getInitials(user.name) : "AD"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="px-4 py-2.5 cursor-pointer">
                <Link href="/admin/settings" className="flex items-center gap-3">
                  <Settings className="h-4 w-4 text-gray-500" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="px-4 py-2.5 cursor-pointer">
                <Link href="/admin/profile" className="flex items-center gap-3">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="px-4 py-2.5 cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-50"
              >
                <LogOut className="mr-3 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
