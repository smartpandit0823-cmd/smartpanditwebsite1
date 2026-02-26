"use client";

import { usePathname } from "next/navigation";
import { UserProvider } from "@/contexts/UserContext";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { BottomNav } from "./BottomNav";
import { WhatsAppButton } from "./WhatsAppButton";

export function ConditionalSiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isAuthPage = pathname?.startsWith("/user/login") || pathname?.startsWith("/(auth)");

  // Admin pages — no shell
  if (isAdmin) {
    return <div className="min-h-dvh">{children}</div>;
  }

  // Login page — no header/footer/nav
  if (isAuthPage) {
    return (
      <UserProvider>
        <div className="min-h-dvh">{children}</div>
      </UserProvider>
    );
  }

  return (
    <UserProvider>
      <div className="flex min-h-dvh flex-col">
        <Header />
        <main className="flex-1 pb-[72px] md:pb-0">{children}</main>
        {/* Footer: hidden on mobile, shown on desktop */}
        <div className="hidden md:block">
          <Footer />
        </div>
        <BottomNav />
        <WhatsAppButton />
      </div>
    </UserProvider>
  );
}
