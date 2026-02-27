"use client";

import { usePathname } from "next/navigation";
import { UserProvider } from "@/contexts/UserContext";
import { CartProvider } from "@/contexts/CartContext";
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

  // Pages where we don't want to show the BottomNav on mobile
  const isProductPage = pathname?.startsWith("/store/");
  const isCart = pathname === "/cart";
  const isCheckout = pathname === "/checkout";
  const isOrderSuccess = pathname?.startsWith("/order-success");
  const isAddressPage = pathname?.startsWith("/user/addresses");
  const isSettingsPage = pathname?.startsWith("/user/settings");

  const hideBottomNavOnMobile = isProductPage || isCart || isCheckout || isOrderSuccess || isAddressPage || isSettingsPage;

  return (
    <UserProvider>
      <CartProvider>
        <div className="flex min-h-dvh flex-col">
          <Header />
          <main className={`flex-1 ${!hideBottomNavOnMobile ? "pb-24 md:pb-0" : ""}`}>
            {children}
          </main>
          {/* Footer: hidden on mobile, shown on desktop */}
          <div className="hidden md:block">
            <Footer />
          </div>
          {!hideBottomNavOnMobile && <BottomNav />}
          <WhatsAppButton />
        </div>
      </CartProvider>
    </UserProvider>
  );
}
