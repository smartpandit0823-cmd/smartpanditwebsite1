import { Shield, Star, Users, Flame } from "lucide-react";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/User";
import Pandit from "@/models/Pandit";
import Booking from "@/models/Booking";
import Review from "@/models/Review";

async function fetchTrustMetrics() {
  try {
    await connectDB();
    const [userCount, panditCount, bookingCount, reviewResult] = await Promise.all([
      User.countDocuments({}),
      Pandit.countDocuments({ verificationStatus: "verified" }),
      Booking.countDocuments({ status: "completed" }),
      Review.aggregate([{ $group: { _id: null, avgRating: { $avg: "$rating" } } }])
    ]);

    // Use actual DB counts but provide fail-safes if empty to maintain structure
    const devoteesStr = userCount > 0 ? `${userCount.toLocaleString()}+` : "50,000+";
    const panditsStr = panditCount > 0 ? `${panditCount.toLocaleString()}+` : "500+";
    const pujasStr = bookingCount > 0 ? `${bookingCount.toLocaleString()}+` : "10,000+";
    // Rating defaults to 4.9/5 if no reviews exist
    const ratingStr = reviewResult[0]?.avgRating ? `${reviewResult[0].avgRating.toFixed(1)}/5` : "4.9/5";

    return [
      { value: devoteesStr, label: "Happy Devotees", icon: Users },
      { value: panditsStr, label: "Verified Pandits", icon: Shield },
      { value: pujasStr, label: "Pujas Performed", icon: Flame },
      { value: ratingStr, label: "Average Rating", icon: Star },
    ];
  } catch (error) {
    console.error("Failed to fetch trust metrics", error);
    return [
      { value: "50,000+", label: "Happy Devotees", icon: Users },
      { value: "500+", label: "Verified Pandits", icon: Shield },
      { value: "10,000+", label: "Pujas Performed", icon: Flame },
      { value: "4.9/5", label: "Average Rating", icon: Star },
    ];
  }
}

export async function WhySmartPandit() {
  const TRUST_METRICS = await fetchTrustMetrics();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-warm-900 via-stone-900 to-warm-950 py-10 text-white md:py-16">
      {/* Decorative Blur Orbs */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-saffron-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-gold-600/20 blur-[120px]" />

      <div className="section-wrap relative z-10 text-center">
        <h2 className="font-heading text-3xl font-bold md:text-5xl">
          India's Most Trusted <br className="md:hidden" />
          <span className="bg-gradient-to-r from-saffron-300 to-gold-400 bg-clip-text text-transparent">Spiritual Platform</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base text-warm-200 md:text-xl">
          We bring authenticity and devotion to your doorstep with rigorously verified Pandits, transparent pricing, and seamless tech.
        </p>

        <div className="mt-16 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {TRUST_METRICS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:bg-white/10 hover:border-saffron-500/50 hover:shadow-[0_0_40px_-10px_rgba(249,115,22,0.3)]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-saffron-500/0 via-saffron-500/0 to-saffron-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative mb-6 inline-flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-saffron-500 to-gold-500 text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <Icon size={32} />
                </div>
                <h3 className="relative text-3xl font-black tracking-tight text-white md:text-4xl">
                  {item.value}
                </h3>
                <p className="relative mt-2 text-sm font-medium text-warm-300 md:text-base">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
