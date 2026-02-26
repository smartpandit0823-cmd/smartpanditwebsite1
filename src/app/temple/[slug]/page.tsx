import Link from "next/link";
import { Clock3, MapPin, ShieldCheck } from "lucide-react";
import { StickyBookingBar } from "@/components/ui/StickyBookingBar";

const TEMPLE_INFO: Record<
  string,
  {
    name: string;
    location: string;
    description: string;
    options: Array<{ title: string; duration: string; price: string }>;
  }
> = {
  tirupati: {
    name: "Tirupati Balaji Temple",
    location: "Tirupati, Andhra Pradesh",
    description:
      "Book seva options, special darshan, and spiritual assistance for Tirupati visits.",
    options: [
      { title: "Archana Seva", duration: "Same day", price: "From ₹1,499" },
      { title: "VIP Darshan Support", duration: "2-4 hrs", price: "From ₹2,999" },
      { title: "Prasad Delivery", duration: "3-5 days", price: "From ₹899" },
    ],
  },
  somnath: {
    name: "Somnath Temple",
    location: "Prabhas Patan, Gujarat",
    description: "Jyotirlinga darshan and Rudrabhishek booking with local ritual support.",
    options: [
      { title: "Rudrabhishek", duration: "2 hrs", price: "From ₹1,799" },
      { title: "Special Darshan", duration: "1-2 hrs", price: "From ₹2,499" },
      { title: "Temple Prasad", duration: "3-5 days", price: "From ₹699" },
    ],
  },
  kedarnath: {
    name: "Kedarnath Temple",
    location: "Rudraprayag, Uttarakhand",
    description: "Seasonal pilgrimage support, puja booking, and darshan guidance.",
    options: [
      { title: "Abhishek Puja", duration: "2 hrs", price: "From ₹1,999" },
      { title: "Priority Darshan", duration: "2-3 hrs", price: "From ₹3,499" },
      { title: "Pilgrim Assistance", duration: "Trip based", price: "From ₹4,999" },
    ],
  },
};

export default async function TempleDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const temple =
    TEMPLE_INFO[slug] ??
    ({
      name: `${slug.charAt(0).toUpperCase()}${slug.slice(1)} Temple`,
      location: "India",
      description: "Book puja and special darshan services with SmartPandit assistance.",
      options: [
        { title: "Temple Puja", duration: "2 hrs", price: "From ₹1,499" },
        { title: "Darshan Support", duration: "Flexible", price: "From ₹2,499" },
        { title: "Prasad Service", duration: "3-5 days", price: "From ₹799" },
      ],
    } as const);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-8 md:pb-12 md:pt-12">
      <section className="rounded-3xl border border-gold-200/70 bg-gradient-to-br from-saffron-100 to-gold-100 p-6 md:p-8">
        <h1 className="font-heading text-3xl font-bold text-warm-900">{temple.name}</h1>
        <p className="mt-2 flex items-center gap-1 text-sm text-warm-700">
          <MapPin size={14} />
          {temple.location}
        </p>
        <p className="mt-4 max-w-3xl text-sm text-warm-700">{temple.description}</p>
        <p className="mt-4 inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-saffron-700">
          <ShieldCheck size={14} />
          Verified ritual partners
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-heading text-xl font-semibold text-warm-900">Puja Options</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {temple.options.map((option) => (
            <article
              key={option.title}
              className="rounded-2xl border border-saffron-200/70 bg-white/85 p-4"
            >
              <h3 className="font-semibold text-warm-900">{option.title}</h3>
              <p className="mt-2 flex items-center gap-1 text-xs text-warm-600">
                <Clock3 size={13} />
                {option.duration}
              </p>
              <p className="mt-2 text-sm font-semibold text-saffron-700">{option.price}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-maroon-300/60 bg-maroon-50/70 p-5">
        <h2 className="font-heading text-xl font-semibold text-maroon-800">Booking CTA</h2>
        <p className="mt-2 text-sm text-maroon-700">
          Share your preferred temple date and service. SmartPandit support confirms availability
          and final ritual slot.
        </p>
        <Link
          href={`/contact?temple=${slug}`}
          className="gradient-saffron mt-4 inline-flex rounded-xl px-6 py-3 text-sm font-semibold text-white"
        >
          Book Temple Service
        </Link>
      </section>

      <StickyBookingBar
        startingPrice={1499}
        href={`/contact?temple=${slug}`}
        ctaText="Book Temple Puja"
      />
    </div>
  );
}
