import Link from "next/link";
import { CheckCircle, Flame, MessageCircle } from "lucide-react";

export const metadata = {
  title: "Booking Success",
  description: "Your puja booking has been confirmed.",
};

export default function BookingSuccessPage() {
  return (
    <div className="mx-auto flex min-h-[65vh] max-w-lg flex-col items-center justify-center px-4 py-12">
      <div className="flex size-20 items-center justify-center rounded-full bg-emerald-100">
        <CheckCircle size={48} className="text-emerald-600" />
      </div>
      <h1 className="font-heading mt-6 text-2xl font-bold text-warm-900">
        Booking Confirmed!
      </h1>
      <p className="mt-2 text-center text-warm-600">
        Your puja is successfully booked. Confirmation details are sent on WhatsApp and email.
      </p>
      <div className="mt-8 grid w-full gap-3 sm:grid-cols-2">
        <Link
          href="/booking/my-bookings"
          className="gradient-saffron inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white"
        >
          <Flame size={16} />
          View My Bookings
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-maroon-300 px-5 py-3 text-sm font-semibold text-maroon-700"
        >
          <MessageCircle size={16} />
          Need Help?
        </Link>
      </div>
    </div>
  );
}
