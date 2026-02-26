import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata = {
  title: "Contact Us",
  description: "Get in touch with SmartPandit. We're here to help with your booking.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-12 pt-8 md:pt-12">
      <SectionHeader
        title="Contact SmartPandit"
        subtitle="Need booking support? Talk to our team for puja, astrology, temple, store, and Kumbh services."
        centered={false}
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_1fr]">
        <section className="space-y-4">
          <a
            href="mailto:support@smartpandit.in"
            className="card-surface flex items-center gap-3 rounded-2xl border border-saffron-200/70 bg-white/85 p-4"
          >
            <div className="flex size-11 items-center justify-center rounded-full bg-saffron-100 text-saffron-700">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-warm-600">Email</p>
              <p className="font-semibold text-warm-900">support@smartpandit.in</p>
            </div>
          </a>
          <a
            href="tel:+919876543210"
            className="card-surface flex items-center gap-3 rounded-2xl border border-saffron-200/70 bg-white/85 p-4"
          >
            <div className="flex size-11 items-center justify-center rounded-full bg-saffron-100 text-saffron-700">
              <Phone size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-warm-600">Phone</p>
              <p className="font-semibold text-warm-900">+91 98765 43210</p>
            </div>
          </a>
          <div className="card-surface flex items-center gap-3 rounded-2xl border border-saffron-200/70 bg-white/85 p-4">
            <div className="flex size-11 items-center justify-center rounded-full bg-saffron-100 text-saffron-700">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-warm-600">Service Region</p>
              <p className="font-semibold text-warm-900">Pan India (50+ cities)</p>
            </div>
          </div>
          <div className="rounded-2xl border border-gold-200/70 bg-gradient-to-r from-gold-50 to-saffron-50 p-4">
            <p className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-amber-800">
              <ShieldCheck size={13} />
              Trust Center
            </p>
            <p className="mt-2 text-sm text-warm-700">
              Verified pandits, secure transactions, and transparent package support.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-saffron-200/70 bg-white/85 p-5">
          <h2 className="font-heading text-xl font-semibold text-warm-900">Quick Enquiry Form</h2>
          <p className="mt-1 text-sm text-warm-600">
            Fill your details and our team contacts you shortly.
          </p>
          <form className="mt-4 space-y-3">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full rounded-xl border border-saffron-200 px-4 py-3 text-sm outline-none focus:border-saffron-400"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full rounded-xl border border-saffron-200 px-4 py-3 text-sm outline-none focus:border-saffron-400"
            />
            <select className="w-full rounded-xl border border-saffron-200 px-4 py-3 text-sm outline-none focus:border-saffron-400">
              <option>Service Interested In</option>
              <option>Puja Booking</option>
              <option>Astrology Consultation</option>
              <option>Temple Darshan</option>
              <option>Store Product</option>
              <option>Kumbh Package</option>
            </select>
            <textarea
              rows={4}
              placeholder="Message"
              className="w-full rounded-xl border border-saffron-200 px-4 py-3 text-sm outline-none focus:border-saffron-400"
            />
            <button
              type="button"
              className="gradient-saffron w-full rounded-xl px-5 py-3 text-sm font-semibold text-white"
            >
              Submit Enquiry
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
