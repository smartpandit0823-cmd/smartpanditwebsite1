"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { Bell, ChevronDown, LogOut, User, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils/index";

interface AdminHeaderProps {
  user?: { name?: string | null; email?: string | null; image?: string | null };
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  function handleGlobalSearch(e: React.KeyboardEvent) {
    if (e.key === "Enter" && search.trim()) {
      // Navigate to bookings search (most common use case)
      router.push(`/admin/bookings?q=${encodeURIComponent(search.trim())}`);
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gold-200 bg-white/95 backdrop-blur-sm px-6">
      {/* Global Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search bookings, users, orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleGlobalSearch}
          className="w-full pl-9 bg-warm-50/50 border-gold-200 focus:bg-white"
        />
      </div>

      <div className="flex items-center gap-3 ml-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/notifications">
            <Bell className="h-5 w-5" />
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Avatar className="h-8 w-8 rounded-full bg-saffron-200">
                <AvatarFallback className="bg-saffron-200 text-sm font-medium text-saffron-800">
                  {user?.name ? getInitials(user.name) : "AD"}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline text-sm font-medium">{user?.name || "Admin"}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/settings">
                <User className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
