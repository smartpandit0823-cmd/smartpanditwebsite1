import Link from "next/link";
import { Calendar, Flame } from "lucide-react";

export const metadata = {
  title: "My Bookings",
  description: "View and manage your SmartPandit bookings.",
};

export default function MyBookingsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <h1 className="font-heading text-2xl font-bold text-warm-900">My Bookings</h1>
      <p className="mt-2 text-warm-600">View and manage your puja bookings</p>
      <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-saffron-200 bg-saffron-50/30 py-16">
        <div className="flex size-16 items-center justify-center rounded-full bg-saffron-100">
          <Calendar size={32} className="text-saffron-600" />
        </div>
        <p className="mt-4 font-medium text-warm-800">No bookings yet</p>
        <p className="mt-1 text-sm text-warm-600">
          Book your first puja and it will appear here
        </p>
        <Link
          href="/puja"
          className="gradient-saffron mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white"
        >
          <Flame size={18} />
          Book Puja
        </Link>
      </div>
    </div>
  );
}
