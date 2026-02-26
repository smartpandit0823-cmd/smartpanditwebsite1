import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { SectionHeader } from "@/components/ui/SectionHeader";

const FAQ_ITEMS = [
  { id: "1", question: "How do I book a puja?", answer: "Choose your puja, select a package, pick date & time, and pay online. You'll receive confirmation and pandit details within minutes." },
  { id: "2", question: "Are your pandits verified?", answer: "Yes. Every pandit is background-checked and trained on authentic rituals. We also collect feedback from every booking." },
  { id: "3", question: "What if I need to cancel?", answer: "Free cancellation up to 24 hours before booking. After that, please check our Cancellation Policy." },
  { id: "4", question: "Is samagri included?", answer: "Depends on the package. Basic packages require you to arrange samagri. Gold & Platinum packages include full samagri." },
  { id: "5", question: "Do you serve my city?", answer: "We're present in 50+ cities across India. Check availability when you book." },
];

export const metadata = {
  title: "FAQ",
  description: "Frequently asked questions about SmartPandit puja booking.",
};

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
      <SectionHeader
        title="Frequently Asked Questions"
        subtitle="Everything you need before booking with SmartPandit."
        centered={false}
      />
      <div className="mt-10">
        <FAQAccordion items={FAQ_ITEMS} />
      </div>
    </div>
  );
}
