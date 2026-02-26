import { Hero } from "@/components/home/Hero";
import { QuickActionBar } from "@/components/home/QuickActionBar";
import { LiveBookingStats } from "@/components/home/LiveBookingStats";
import { CategoriesGrid } from "@/components/home/CategoriesGrid";
import { OffersSlider } from "@/components/home/OffersSlider";
import { PopularPujas } from "@/components/home/PopularPujas";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { BookAstrology } from "@/components/home/BookAstrology";
import { HowItWorks } from "@/components/home/HowItWorks";
import { WhySmartPandit } from "@/components/home/WhySmartPandit";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CTASection } from "@/components/home/CTASection";
import { OurPandits } from "@/components/home/OurPandits";
import { StickyBookingBar } from "@/components/ui/StickyBookingBar";
import { OfferPopup } from "@/components/home/OfferPopup";

export default function Home() {
  return (
    <>
      <OfferPopup />
      <Hero />
      <QuickActionBar />
      <LiveBookingStats />
      <CategoriesGrid />
      <OffersSlider />
      <PopularPujas />
      <FeaturedProducts />
      <BookAstrology />
      <HowItWorks />
      <WhySmartPandit />
      <TestimonialsSection />
      <OurPandits />
      <CTASection />
      <StickyBookingBar startingPrice={499} href="/puja" ctaText="Book Puja" />
    </>
  );
}
