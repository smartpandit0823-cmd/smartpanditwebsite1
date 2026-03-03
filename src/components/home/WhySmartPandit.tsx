"use client";

import { CheckCircle2, QrCode, Truck, HeartHandshake, ShieldCheck } from "lucide-react";

export function WhySmartPandit() {
  const features = [
    {
      icon: <ShieldCheck size={28} className="text-warm-900" />,
      title: "Lab Certified",
      desc: "ISO lab certification",
      bg: "bg-orange-100",
    },
    {
      icon: <QrCode size={28} className="text-warm-900" />,
      title: "Authenticity QR",
      desc: "Scan to verify origin",
      bg: "bg-blue-100",
    },
    {
      icon: <Truck size={28} className="text-warm-900" />,
      title: "Fast Shipping",
      desc: "Secure doorstep delivery",
      bg: "bg-emerald-100",
    },
    {
      icon: <HeartHandshake size={28} className="text-warm-900" />,
      title: "Dedicated Support",
      desc: "Astrologers & care team",
      bg: "bg-rose-100",
    },
    {
      icon: <CheckCircle2 size={28} className="text-warm-900" />,
      title: "Private Label Quality",
      desc: "Strict quality checks",
      bg: "bg-purple-100",
    },
  ];

  return (
    <section className="section-shell">
      <div className="section-wrap">
        <div className="bg-gradient-to-br from-warm-100 to-white rounded-[2rem] p-6 md:p-10 border border-warm-200">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-heading text-2xl md:text-4xl font-bold text-warm-900 mb-2">
              Why SanatanSetu?
            </h2>
            <p className="text-sm md:text-base text-warm-600">
              India&apos;s most trusted spiritual destination.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {features.map((item, index) => (
              <div
                key={index}
                className={`flex flex-col items-center text-center ${index === 4 ? "col-span-2 md:col-span-1" : ""}`}
              >
                <div className={`size-16 rounded-full ${item.bg} flex items-center justify-center mb-4 text-warm-900 shadow-sm border border-warm-200`}>
                  {item.icon}
                </div>
                <h3 className="font-semibold text-warm-900 text-sm mb-1">{item.title}</h3>
                <p className="text-[11px] text-warm-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
