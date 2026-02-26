import { Search, Calendar, CheckCircle } from "lucide-react";
import { HOW_IT_WORKS } from "@/lib/constants";
import { SectionHeader } from "@/components/ui/SectionHeader";

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Search,
  Calendar,
  CheckCircle,
};

const STEP_IMAGES = [
  "/images/how-it-works/step-one.png",
  "/images/how-it-works/step-two.png",
  "/images/how-it-works/step-three.png",
];

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-white py-10 md:py-16">
      <div className="section-wrap relative z-10">
        <SectionHeader
          title="Your Spiritual Journey"
          subtitle="Experience seamless booking and divine connection in three simple steps."
          centered={true}
        />

        <div className="mt-16 mx-auto max-w-5xl">
          <div className="relative">
            {/* Desktop Timeline Line */}
            <div className="absolute left-1/2 top-4 bottom-4 hidden w-1 -translate-x-1/2 bg-gradient-to-b from-saffron-100 via-saffron-300 to-saffron-100 md:block" />

            <div className="space-y-16 md:space-y-24">
              {HOW_IT_WORKS.map((item, i) => {
                const Icon = ICONS[item.icon];
                const isEven = i % 2 === 1;
                const stepImg = STEP_IMAGES[i] || "/images/how-it-works/placeholder.jpg";

                return (
                  <div key={item.step} className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 ${isEven ? 'md:flex-row-reverse' : ''}`}>

                    {/* Center Node (Desktop) */}
                    <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:flex size-14 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-saffron-500 to-saffron-600 shadow-xl z-10 transition-transform duration-300 hover:scale-110">
                      <span className="text-xl font-black text-white">{item.step}</span>
                    </div>

                    {/* Image / Illustration Side */}
                    <div className="w-full md:w-1/2">
                      <div className={`relative overflow-hidden rounded-3xl shadow-2xl transition-transform duration-500 hover:scale-[1.02] ${isEven ? 'md:ml-auto' : 'md:mr-auto'} aspect-[4/3] w-full max-w-md bg-warm-50`}>
                        <img src={stepImg} alt={item.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-saffron-500/20 to-transparent" />
                      </div>
                    </div>

                    {/* Content Side */}
                    <div className="w-full md:w-1/2 text-center md:text-left">
                      <div className={`max-w-md ${isEven ? 'md:ml-auto md:text-right' : 'md:mr-auto'}`}>
                        <div className={`mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-saffron-100 text-saffron-600 shadow-sm md:hidden`}>
                          {Icon && <Icon size={24} />}
                        </div>
                        <div className={`inline-flex items-center gap-2 rounded-full bg-saffron-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-saffron-700 mb-3 ${isEven ? 'md:ml-auto md:justify-end' : ''}`}>
                          Step {item.step}
                        </div>
                        <h3 className="mb-3 text-2xl font-bold md:text-3xl text-warm-900 group-hover:text-saffron-700">
                          {item.title}
                        </h3>
                        <p className="text-base text-warm-600 md:text-lg leading-relaxed mix-blend-multiply">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
