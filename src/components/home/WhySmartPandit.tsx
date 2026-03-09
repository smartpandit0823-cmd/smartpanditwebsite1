import { ShieldCheck, QrCode, Truck, HeartHandshake, Award } from "lucide-react";

const USPS = [
  {
    icon: <ShieldCheck size={28} />,
    title: "Lab Certified",
    subtitle: "ISO lab certification",
    color: "text-[#00CEC9]",
    bg: "bg-[#e5fbf9]"
  },
  {
    icon: <QrCode size={28} />,
    title: "Authenticity QR",
    subtitle: "Scan to verify origin",
    color: "text-[#FF8C00]",
    bg: "bg-orange-50"
  },
  {
    icon: <Truck size={28} />,
    title: "Fast Shipping",
    subtitle: "Secure doorstep delivery",
    color: "text-[#6366F1]",
    bg: "bg-indigo-50"
  },
  {
    icon: <HeartHandshake size={28} />,
    title: "Dedicated Support",
    subtitle: "Astrologers & care team",
    color: "text-[#FF6B8A]",
    bg: "bg-rose-50"
  },
  {
    icon: <Award size={28} />,
    title: "Private Label Quality",
    subtitle: "Strict quality checks",
    color: "text-[#00B894]",
    bg: "bg-emerald-50"
  }
];

export function WhySmartPandit() {
  return (
    <section className="py-8 md:py-10 bg-white px-4">
      <div className="max-w-7xl mx-auto flex flex-col items-center">

        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#1A1A1A] leading-tight mb-2">
            Why SanatanSetu?
          </h2>
          <p className="text-[#888888] text-sm md:text-base font-medium">
            India's most trusted spiritual destination
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4 w-full justify-items-center">
          {USPS.map((usp, idx) => (
            <div key={idx} className={`flex flex-col items-center text-center ${idx === 4 ? "col-span-2 md:col-span-1" : ""}`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${usp.bg} ${usp.color} border border-white shadow-[0_4px_16px_rgba(0,0,0,0.04)]`}>
                {usp.icon}
              </div>
              <h3 className="font-bold text-[#1A1A1A] text-[15px] mb-1 leading-tight">
                {usp.title}
              </h3>
              <p className="text-[12px] text-[#888888] max-w-[140px]">
                {usp.subtitle}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
